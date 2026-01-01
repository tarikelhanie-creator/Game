import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { aiTeams } from "../data/teams";
import PenaltyGame from "../components/minigames/PenaltyGame";
import SpeedPass from "../components/minigames/RunnerGame";
import ReflexGridGame from "../components/minigames/HeaderChallenge";

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

  // ------------------------------
  const handleContinue = () => {
    if (result === "lose") {
      navigate("/"); // game over → home
      return;
    }

    if (currentRound === 2) { // Final win → Champion
      setIsChampion(true);
      navigate("/win");
      return;
    }

    // Next round
    setCurrentRound((prev) => prev + 1);

    // Pick new opponent (avoid same)
    let nextOpponent;
    do {
      nextOpponent = aiTeams[Math.floor(Math.random() * aiTeams.length)];
    } while (nextOpponent.name === opponent.name && aiTeams.length > 1);

    setOpponent(nextOpponent);
    setResult(null);
    setShowGame(false);
  };

  // ------------------------------
  const renderGameButton = () => {
    switch (currentRound) {
      case 0: return "Start Dribble Challenge";   // Quarter Final
      case 1: return "Start Penalty Shootout";   // Semi Final
      case 2: return "Start Final Challenge";    // Final
      default: return "Start Match";
    }
  };

  const renderCurrentGame = () => {
    switch (currentRound) {
      case 0: // Quarter Final → ReflexGridGame
        return (
          <ReflexGridGame
            onFinish={(win) => {
              setResult(win ? "win" : "lose");
              setShowGame(false);
            }}
          />
        );
      case 1: // Semi Final → PenaltyGame
        return (
          <PenaltyGame
            playerTeam={playerTeam}
            opponent={opponent}
            onFinish={(playerScore, aiScore) => {
              setResult(playerScore > aiScore ? "win" : "lose");
              setShowGame(false);
            }}
          />
        );
      case 2: // Final → SpeedPass (or another mini-game)
        return (
          <SpeedPass
            playerTeam={playerTeam}
            opponent={opponent}
            onFinish={(playerScore, aiScore) => {
              setResult(playerScore > aiScore ? "win" : "lose");
              setShowGame(false);
            }}
          />
        );
      default:
        return <p>No game for this round</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">{roundNames[currentRound]}</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <p className="text-lg font-semibold mb-4">
          {playerTeam.name} vs {opponent.name}
        </p>

        {/* START MATCH BUTTON */}
        {!showGame && result === null && (
          <button
            onClick={() => setShowGame(true)}
            className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800 active:translate-y-1 active:shadow-none transition-all"
          >
            {renderGameButton()}
          </button>
        )}

        {/* MINI GAME */}
        {showGame && result === null && renderCurrentGame()}

        {/* WIN */}
        {result === "win" && (
          <>
            <p className="text-green-600 font-bold mt-4 text-xl">
              You won the match! 🎉
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800 active:translate-y-1 active:shadow-none transition-all"
            >
              Continue
            </button>
          </>
        )}

        {/* LOSE */}
        {result === "lose" && (
          <>
            <p className="text-red-600 font-bold mt-4 text-xl">
              You lost the match 💔
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 active:translate-y-1 active:shadow-none transition-all"
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
