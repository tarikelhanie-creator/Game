import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function WinPage() {
  const navigate = useNavigate();
  const { isChampion } = useGame();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🏆 Congratulations! 🏆
        </h1>
        <p className="text-xl font-semibold mb-6">
          You are the World Cup Champion!
        </p>
        {isChampion && (
          <p className="text-lg text-gray-700 mb-6">
            You've won the tournament!
          </p>
        )}
        <button
          onClick={() => navigate("/")}
          className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default WinPage;

