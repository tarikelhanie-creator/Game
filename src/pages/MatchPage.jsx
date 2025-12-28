import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { aiTeams } from "../data/teams";
import PenaltyGame from "../components/minigames/PenaltyGame";

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

  const [result, setResult] = useState(null); // "win" | "lose" | null
  const [showGame, setShowGame] = useState(false);

  if (!playerTeam || !opponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No match data. Go back.</p>
      </div>
    );
  }

  const roundNames = ["Quarter Final", "Semi Final", "Final"];

  const handleContinue = () => {
    if (result === "lose") {
      navigate("/");
      return;
    }

    if (currentRound === 2) {
      setIsChampion(true);
      navigate("/win");
      return;
    }

    // Go to next round
    setCurrentRound((prev) => prev + 1);

    // Pick new opponent
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

        {/* START MATCH */}
        {!showGame && result === null && (
          <button
            onClick={() => setShowGame(true)}
            className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800"
          >
            Start Penalty Shootout
          </button>
        )}

        {/* MINI GAME */}
        {showGame && result === null && (
          <PenaltyGame
            playerTeam={playerTeam}
            opponent={opponent}
            onFinish={(playerScore, aiScore) => {
              setResult(playerScore > aiScore ? "win" : "lose");
              setShowGame(false);
            }}
          />
        )}

        {/* WIN */}
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

        {/* LOSE */}
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
