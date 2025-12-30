import { useState, useEffect, useRef } from "react";
import { skillMap } from "../../utils/skillMap";

const DIRECTIONS = ["left", "center", "right"];
const MAX_ROUNDS = 5;
const MESSAGE_DISPLAY_TIME = 4000; // 4 seconds - much longer

function randomChoice() {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

function PenaltyGame({ playerTeam, opponent, onFinish }) {
  const [round, setRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [message, setMessage] = useState("Choose a direction to shoot");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("player"); // "player" or "ai"
  const [shotHistory, setShotHistory] = useState([]); // Array of shot results
  const [lastResult, setLastResult] = useState(null);

  const playerSkill = skillMap[playerTeam.skill] || skillMap.normal;

  // Calculate save chance based on skill
  const calculateSaveChance = (keeperSkill, shooterSkill) => {
    const skillDiff = keeperSkill - shooterSkill;
    // Base save chance: 25% for equal skills
    // Increases by 0.5% per skill point difference
    const baseChance = 0.25;
    const adjustedChance = baseChance + (skillDiff * 0.005);
    return Math.min(0.65, Math.max(0.15, adjustedChance)); // Clamp between 15% and 65%
  };

  // Calculate goal chance based on skill
  const calculateGoalChance = (shooterSkill, keeperSkill) => {
    const saveChance = calculateSaveChance(keeperSkill, shooterSkill);
    return 1 - saveChance;
  };

  const handlePlayerShot = (direction) => {
    if (round >= MAX_ROUNDS || isProcessing || currentTurn !== "player") return;

    setIsProcessing(true);

    // AI goalkeeper chooses direction (skill affects accuracy)
    // Higher skill = more likely to guess correctly
    const aiGuessAccuracy = opponent.skill / 100; // 0.77 to 0.85 for typical opponents
    const aiDive = Math.random() < aiGuessAccuracy 
      ? direction // AI guesses correctly based on skill
      : randomChoice(); // Random guess if skill isn't high enough

    // Calculate if goal is scored
    // If keeper dives wrong way, goal is scored
    // If keeper dives right way, use save chance
    const saveChance = calculateSaveChance(opponent.skill, playerSkill);
    const playerGoal = aiDive !== direction || Math.random() > saveChance;

    // Update score
    const newPlayerScore = playerScore + (playerGoal ? 1 : 0);
    setPlayerScore(newPlayerScore);
    playerScoreRef.current = newPlayerScore;

    // Create detailed message
    const resultMsg = playerGoal 
      ? `⚽ GOAL! You shot ${direction} and scored!`
      : `🧤 SAVED! You shot ${direction}, but ${opponent.name}'s keeper dove ${aiDive} and saved it!`;
    
    setMessage(resultMsg);
    setLastResult({ 
      type: "player", 
      goal: playerGoal, 
      direction, 
      keeperDive: aiDive,
      round: round + 1
    });

    // Add to history
    setShotHistory(prev => [...prev, {
      round: round + 1,
      player: { goal: playerGoal, direction },
      ai: null
    }]);

    // Switch to AI turn after a shorter delay (2 seconds to read message, then AI shoots)
    setTimeout(() => {
      setCurrentTurn("ai");
      setIsProcessing(false);
      // AI shoots automatically after a brief moment
      setTimeout(() => handleAiShot(), 500);
    }, 2000); // Reduced from 4000ms to 2000ms
  };

  // Use refs to track latest values for setTimeout callbacks
  const roundRef = useRef(round);
  const playerScoreRef = useRef(playerScore);
  const aiScoreRef = useRef(aiScore);
  const currentTurnRef = useRef(currentTurn);

  // Update refs when state changes
  useEffect(() => {
    roundRef.current = round;
    playerScoreRef.current = playerScore;
    aiScoreRef.current = aiScore;
    currentTurnRef.current = currentTurn;
  }, [round, playerScore, aiScore, currentTurn]);

  const handleAiShot = () => {
    // Use refs to get latest values
    const currentRound = roundRef.current;
    const currentPlayerScore = playerScoreRef.current;
    const currentAiScore = aiScoreRef.current;
    const currentTurnValue = currentTurnRef.current;

    if (currentRound >= MAX_ROUNDS || currentTurnValue !== "ai") return;

    setIsProcessing(true);

    // AI chooses direction
    const aiShotDirection = randomChoice();

    // Player goalkeeper chooses (random for now)
    const keeperDive = randomChoice();

    // Calculate if AI scores
    const goalChance = calculateGoalChance(opponent.skill, playerSkill);
    const aiGoal = keeperDive !== aiShotDirection && Math.random() < goalChance;

    // Update score
    const newAiScore = currentAiScore + (aiGoal ? 1 : 0);
    setAiScore(newAiScore);
    aiScoreRef.current = newAiScore;

    // Create detailed message
    const resultMsg = aiGoal
      ? `⚽ ${opponent.name} scored! They shot ${aiShotDirection} and you dove ${keeperDive}.`
      : `🧤 You saved it! ${opponent.name} shot ${aiShotDirection} and you dove ${keeperDive}!`;

    setMessage(resultMsg);
    setLastResult({ 
      type: "ai", 
      goal: aiGoal, 
      direction: aiShotDirection, 
      keeperDive,
      round: currentRound + 1
    });

    // Update history
    setShotHistory(prev => {
      const updated = [...prev];
      const lastShot = updated[updated.length - 1];
      if (lastShot && lastShot.round === currentRound + 1) {
        lastShot.ai = { goal: aiGoal, direction: aiShotDirection };
      }
      return updated;
    });

    const nextRound = currentRound + 1;
    setRound(nextRound);
    roundRef.current = nextRound;

    // Check for early termination
    const remainingRounds = MAX_ROUNDS - nextRound;
    const scoreDiff = currentPlayerScore - newAiScore;
    
    if (Math.abs(scoreDiff) > remainingRounds && remainingRounds > 0) {
      // Game is over - one team can't be caught
      setTimeout(() => {
        onFinish(currentPlayerScore, newAiScore);
      }, 2500);
      return;
    }

    // Check if game is over
    if (nextRound >= MAX_ROUNDS) {
      setTimeout(() => {
        onFinish(currentPlayerScore, newAiScore);
      }, 2500);
    } else {
      // Reset for next round after showing AI result
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentTurn("player");
        currentTurnRef.current = "player";
        setMessage(`Round ${nextRound + 1}: Choose a direction to shoot`);
        setLastResult(null);
      }, 2500);
    }
  };

  const isGameOver = round >= MAX_ROUNDS;
  const currentRoundNumber = Math.floor(round) + 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3">Penalty Shootout</h2>
      
      {/* Score Display */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-4xl font-bold mb-2">
          <span className={playerScore > aiScore ? "text-green-600" : playerScore < aiScore ? "text-red-600" : "text-gray-700"}>
            {playerScore}
          </span>
          <span className="text-gray-400 mx-2">-</span>
          <span className={aiScore > playerScore ? "text-green-600" : aiScore < playerScore ? "text-red-600" : "text-gray-700"}>
            {aiScore}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Round {currentRoundNumber} / {MAX_ROUNDS}
        </p>
      </div>

      {/* Turn Indicator */}
      {!isGameOver && (
        <div className="mb-3">
          <p className={`text-sm font-semibold ${currentTurn === "player" ? "text-blue-600" : "text-orange-600"}`}>
            {currentTurn === "player" ? "🎯 Your turn to shoot" : `⏳ ${opponent.name} is shooting...`}
          </p>
        </div>
      )}

      {/* Message - Stays visible longer */}
      <div className="mb-4 min-h-20 p-3 bg-gray-50 rounded-lg">
        <p className={`text-base font-semibold ${
          lastResult?.goal 
            ? "text-green-600" 
            : lastResult && !lastResult.goal 
            ? "text-red-600" 
            : "text-gray-700"
        }`}>
          {message}
        </p>
        {lastResult && (
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            {lastResult.type === "player" && (
              <p>
                You: Shot {lastResult.direction} → Keeper dove {lastResult.keeperDive}
                {lastResult.goal ? " ✅ GOAL" : " ❌ SAVED"}
              </p>
            )}
            {lastResult.type === "ai" && (
              <p>
                {opponent.name}: Shot {lastResult.direction} → You dove {lastResult.keeperDive}
                {lastResult.goal ? " ❌ GOAL" : " ✅ SAVED"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Shot History */}
      {shotHistory.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-left max-h-32 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 mb-2">History:</p>
          <div className="space-y-1 text-xs">
            {shotHistory.slice(-3).map((shot, idx) => (
              <div key={idx} className="text-gray-600">
                Round {shot.round}: 
                <span className={shot.player.goal ? "text-green-600" : "text-red-600"}>
                  {" "}You {shot.player.goal ? "⚽" : "❌"} ({shot.player.direction})
                </span>
                {shot.ai && (
                  <span className={shot.ai.goal ? "text-red-600" : "text-green-600"}>
                    {" | "}{opponent.name} {shot.ai.goal ? "⚽" : "❌"} ({shot.ai.direction})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons - Only show on player's turn */}
      {!isGameOver && currentTurn === "player" && (
        <div className="flex justify-center gap-4">
          {DIRECTIONS.map((direction) => (
            <button
              key={direction}
              onClick={() => handlePlayerShot(direction)}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "px-6 py-3 bg-green-400 text-white font-extrabold uppercase rounded-full  border-4 border-green-900  shadow-[0_6px_0_#14532d] hover:bg-green-300  active:translate-y-1 active:shadow-none  transition-all"
              }`}
            >
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Processing indicator for AI turn */}
      {!isGameOver && currentTurn === "ai" && isProcessing && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse text-gray-500">
            {opponent.name} is taking their shot...
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xl font-bold text-gray-700 mb-2">
            Final Score: {playerScore} - {aiScore}
          </p>
          <p className={`text-lg font-semibold ${
            playerScore > aiScore ? "text-green-600" : playerScore < aiScore ? "text-red-600" : "text-gray-600"
          }`}>
            {playerScore > aiScore ? "You Win! 🏆" : playerScore < aiScore ? "You Lost 💔" : "It's a Draw! 🤝"}
          </p>
        </div>
      )}
    </div>
  );
}

export default PenaltyGame;
