import React, { useState } from "react";
import TeamForm from "../../components/Tm/TeamForm";
import TeamPreview from "../../components/Tm/TeamPreview";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { aiTeams } from "../../data/teams";

function TeamPage() {
  const [team, setTeam] = useState({
    name: "",
    flag: "",
    skill: "normal",
  });

  const navigate = useNavigate();
  const { setPlayerTeam, setOpponent } = useGame();

  const startTournament = () => {
    setPlayerTeam(team);

    const randomOpponent =
      aiTeams[Math.floor(Math.random() * aiTeams.length)];

    setOpponent(randomOpponent);
    navigate("/tournament");
  };

  return (
<div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
  <div
    className="
      bg-white
      rounded-3xl
      border-4 border-green-900
      shadow-[0_10px_0_#14532d]
      px-10 py-8
      w-full max-w-2xl
      flex flex-col items-center
    "
  >
    {/* Form */}
    <TeamForm team={team} setTeam={setTeam} />

    {/* Preview */}
    <TeamPreview team={team} />

    {/* Start button */}
    <button
      onClick={startTournament}
      disabled={!team.name}
      className={`mt-6 px-8 py-4 rounded-full font-extrabold uppercase text-white border-4 border-green-900 shadow-[0_6px_0_#14532d] transition-all ${
        team.name
          ? "bg-green-500 hover:bg-green-400 active:translate-y-1 active:shadow-none"
          : "bg-gray-400 cursor-not-allowed border-gray-600 shadow-none"
      }`}
    >
      Start Tournament
    </button>
  </div>
</div>
  );
}

export default TeamPage;
