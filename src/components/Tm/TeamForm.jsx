import React from "react";

function TeamForm({ team, setTeam }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Your Team</h2>

      {/* Team Name */}
      <label className="block mb-2 font-medium">Team Name</label>
      <input
        type="text"
        value={team.name}
        onChange={(e) => setTeam({ ...team, name: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter team name"
      />

      {/* Flag selection */}
      <label className="block mb-2 font-medium">Select Flag</label>
      <select
        value={team.flag}
        onChange={(e) => setTeam({ ...team, flag: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">-- Choose a flag --</option>
        <option value="morocco">Morocco 🇲🇦</option>
        <option value="brazil">Brazil 🇧🇷</option>
        <option value="france">France 🇫🇷</option>
        <option value="germany">Germany 🇩🇪</option>
      </select>

      {/* Skill level */}
      <label className="block mb-2 font-medium">Skill Level</label>
      <select
        value={team.skill}
        onChange={(e) => setTeam({ ...team, skill: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}

export default TeamForm;
