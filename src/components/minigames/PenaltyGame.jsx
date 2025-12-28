import { useState } from "react";
import { skillMap } from "../../utils/skillMap";

function randomChoice() {
  const choices = ["left", "center", "right"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function PenaltyGame({ playerTeam, opponent, onFinish }) {
  const [round, setRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [message, setMessage] = useState("Choose a direction");

  const maxRounds = 5;

  const handleShot = (direction) => {
    if (round >= maxRounds) return;

    const playerSkill = skillMap[playerTeam.skill] || skillMap.normal;
    const aiSaveChance = opponent.skill > playerSkill ? 0.4 : 0.25;

    // PLAYER SHOT
    const aiDive = randomChoice();
    let playerGoal = direction !== aiDive || Math.random() > aiSaveChance;

    // AI SHOT
    const keeperDive = randomChoice();
    let aiGoal = Math.random() < opponent.skill / 100 && keeperDive !== randomChoice();

    if (playerGoal) setPlayerScore((s) => s + 1);
    if (aiGoal) setAiScore((s) => s + 1);

    setRound((r) => r + 1);
    setMessage(
      `You shot ${direction}. AI dove ${aiDive}.`
    );

    // END GAME
    if (round + 1 === maxRounds) {
      setTimeout(() => {
        onFinish(playerScore + (playerGoal ? 1 : 0), aiScore + (aiGoal ? 1 : 0));
      }, 800);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">Penalty Shootout</h2>
      <p className="mb-4">{message}</p>

      <p className="mb-2">
        Score: {playerScore} - {aiScore}
      </p>
      <p className="mb-4">
        Shot {round + 1} / {maxRounds}
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleShot("left")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Left
        </button>
        <button
          onClick={() => handleShot("center")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Center
        </button>
        <button
          onClick={() => handleShot("right")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Right
        </button>
      </div>
    </div>
  );
}

export default PenaltyGame;
