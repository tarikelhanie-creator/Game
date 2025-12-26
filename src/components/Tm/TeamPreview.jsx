import React from "react";

function TeamPreview({ team }) {
  if (!team.name) return null;

  return (
    <div
  className="
    bg-white
    rounded-3xl
    border-4 border-green-900
    shadow-[0_10px_0_#14532d]
    p-8
    w-full max-w-md mx-auto mt-8
  "
>
  <h2 className="text-2xl font-extrabold mb-6 text-center uppercase text-green-900">
    Team Preview
  </h2>

  <p className="mb-2 text-lg font-bold text-green-800">
    Name: <span className="font-normal text-black">{team.name}</span>
  </p>
  <p className="mb-2 text-lg font-bold text-green-800">
    Flag:{" "}
    <span className="font-normal text-black">
      {team.flag ? team.flag : "No flag selected"}
    </span>
  </p>
  <p className="mb-2 text-lg font-bold text-green-800">
    Skill Level: <span className="font-normal text-black">{team.skill}</span>
  </p>
</div>
  );
}

export default TeamPreview;
