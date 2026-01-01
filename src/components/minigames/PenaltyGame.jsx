import { useState, useEffect, useRef } from "react";
import { skillMap } from "../../utils/skillMap";

const DIRECTIONS = ["left", "center", "right"];
const MAX_ROUNDS = 5;

function randomChoice() {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

function PenaltyGame({ playerTeam, opponent, onFinish }) {
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [message, setMessage] = useState("Round 1: Choose a direction to shoot");
  const [currentTurn, setCurrentTurn] = useState("player");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultIcon, setResultIcon] = useState(null); // "check" or "x"
  const [resultType, setResultType] = useState(null);

  const playerSkill = skillMap[playerTeam.skill] || skillMap.normal;
  const opponentSkill = opponent.skill;

  const roundRef = useRef(round);
  const playerScoreRef = useRef(playerScore);
  const aiScoreRef = useRef(aiScore);

  useEffect(() => {
    roundRef.current = round;
    playerScoreRef.current = playerScore;
    aiScoreRef.current = aiScore;
  }, [round, playerScore, aiScore]);

  const calculateSaveChance = (keeperSkill, shooterSkill) => {
    const skillDiff = (keeperSkill - shooterSkill) / 100;
    return Math.min(0.65, Math.max(0.15, 0.4 + skillDiff * 0.2));
  };

  const showResult = (playerSuccess, type) => {
    setResultIcon(playerSuccess ? "check" : "x");
    setResultType(type);
  };

  const clearResult = () => {
    setResultIcon(null);
    setResultType(null);
  };

  // ================= PLAYER SHOOT =================
  const handlePlayerShot = (dir) => {
    if (isProcessing || currentTurn !== "player") return;
    setIsProcessing(true);
    clearResult();

    const aiAccuracy = opponentSkill / 100;
    const aiDive = Math.random() < aiAccuracy ? dir : randomChoice();
    const saveChance = calculateSaveChance(opponentSkill, playerSkill);
    const playerGoal = (aiDive !== dir) || (Math.random() > saveChance);
    const playerSuccess = playerGoal; // Goal = your success

    setTimeout(() => {
      setPlayerScore((s) => s + (playerGoal ? 1 : 0));
      setMessage(playerGoal ? "⚽ GOAL!" : "🧤 SAVED!");
      showResult(playerSuccess, "player");

      setTimeout(() => {
        clearResult();
        setCurrentTurn("ai");
        setMessage(`Round ${round}: Choose where to DIVE`);
        setIsProcessing(false);
      }, 1500);
    }, 300);
  };

  // ================= PLAYER SAVE =================
  const handlePlayerDive = (diveDir) => {
    if (isProcessing || currentTurn !== "ai") return;
    setIsProcessing(true);
    clearResult();

    const aiShot = randomChoice();
    const saveChance = calculateSaveChance(playerSkill, opponentSkill);
    const aiGoal = (diveDir !== aiShot) && (Math.random() < (1 - saveChance));
    const playerSuccess = !aiGoal; // Save = your success

    setAiScore((s) => {
      const newScore = s + (aiGoal ? 1 : 0);
      aiScoreRef.current = newScore;
      return newScore;
    });

    setTimeout(() => {
      setMessage(aiGoal ? "⚽ AI GOAL!" : "🧤 GREAT SAVE!");
      showResult(playerSuccess, "ai");

      const nextRound = round + 1;
      setRound(nextRound);

      setTimeout(() => {
        clearResult();

        if (nextRound > MAX_ROUNDS) {
          onFinish(playerScoreRef.current, aiScoreRef.current);
        } else {
          setCurrentTurn("player");
          setMessage(`Round ${nextRound}: Choose a direction to shoot`);
          setIsProcessing(false);
        }
      }, 1500);
    }, 300);
  };

  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3">Penalty Shootout</h2>

      <div className="text-4xl font-bold mb-2">
        {playerScore} <span className="mx-2">-</span> {aiScore}
      </div>

      <p className="mb-2 font-semibold">Round {round}/{MAX_ROUNDS}</p>
      <p className="mb-4 font-semibold text-lg">{message}</p>

      {/* GOAL AREA WITH RESULT OVERLAY */}
      <div className="relative w-full h-48 bg-gradient-to-b from-green-400 to-green-600 rounded-lg overflow-hidden mb-4 shadow-lg">
        {/* Result Icon Overlay */}
        {resultIcon && (
          <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm bg-black/20">
            <div className={`text-9xl animate-bounce ${resultIcon === "check" ? "text-green-400 drop-shadow-2xl [text-shadow:0_0_20px_green]" : "text-red-500 drop-shadow-2xl [text-shadow:0_0_20px_red]"}`}>
              {resultIcon === "check" ? "✅" : "❌"}
            </div>
          </div>
        )}

        {/* Static Goal Elements */}
        <div className="absolute inset-0 flex items-end justify-around p-4">
          <div className="w-20 h-20 bg-white/30 rounded-full border-4 border-white/50" />
          <div className="w-20 h-20 bg-white/30 rounded-full border-4 border-white/50" />
          <div className="w-20 h-20 bg-white/30 rounded-full border-4 border-white/50" />
        </div>

        {/* Net pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCAxTDYgMU00IDNINm00IDNMNiA3TTQgNyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-30" />
      </div>

      {/* Controls */}
      {!isProcessing && (
        <div className="flex justify-center gap-4">
          {DIRECTIONS.map((dir) => (
            <button
              key={dir}
              onClick={() =>
                currentTurn === "player"
                  ? handlePlayerShot(dir)
                  : handlePlayerDive(dir)
              }
              className="px-6 py-3 bg-green-500 text-white font-extrabold uppercase rounded-full border-4 border-green-900 shadow-[0_6px_0_#14532d] hover:bg-green-400 active:translate-y-1 active:shadow-none transition-all duration-200 min-w-[80px]"
              disabled={isProcessing}
            >
              {dir.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {isProcessing && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Processing...</span>
        </div>
      )}
    </div>
  );
}

export default PenaltyGame;
