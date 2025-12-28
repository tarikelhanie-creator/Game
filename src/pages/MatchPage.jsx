import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { aiTeams } from "../data/teams";

// Convert skill string to numeric value
function getSkillValue(skill) {
  const skillMap = {
    easy: 70,
    normal: 80,
    hard: 90,
  };
  return skillMap[skill] || 80;
}

// TEMP mini-game result (we replace later)
function playMiniGame(playerSkill, aiSkill) {
  const playerScore = playerSkill + Math.random() * 20;
  const aiScore = aiSkill + Math.random() * 20;
  return playerScore > aiScore;
}

function MatchPage() {
  const {
    playerTeam,
    opponent,
    currentRound,
    setCurrentRound,
    setOpponent,
    setIsChampion,
  } = useGame();

  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  if (!playerTeam || !opponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No match data. Go back.</p>
      </div>
    );
  }

  const roundNames = ["Quarter Final", "Semi Final", "Final"];

  const handlePlayMatch = () => {
    const playerSkillValue = getSkillValue(playerTeam.skill);
    const win = playMiniGame(playerSkillValue, opponent.skill);
    setResult(win ? "win" : "lose");
  };

  const handleContinue = () => {
    if (result === "lose") {
      navigate("/"); // game over → home
      return;
    }

    if (currentRound === 2) {
      setIsChampion(true);
      navigate("/win");
      return;
    }

    // Next round
    setCurrentRound((prev) => prev + 1);

    // Pick new opponent (simple random for now)
    const nextOpponent =
      aiTeams[Math.floor(Math.random() * aiTeams.length)];

    setOpponent(nextOpponent);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">
        {roundNames[currentRound]}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <p className="text-lg font-semibold mb-4">
          {playerTeam.name} vs {opponent.name}
        </p>

        {result === null && (
          <button
            onClick={handlePlayMatch}
            className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800"
          >
            Play Match
          </button>
        )}

        {result === "win" && (
          <>
            <p className="text-green-600 font-bold mt-4">
              You won the match! 🎉
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800"
            >
              Continue
            </button>
          </>
        )}

        {result === "lose" && (
          <>
            <p className="text-red-600 font-bold mt-4">
              You lost the match 💔
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MatchPage;
