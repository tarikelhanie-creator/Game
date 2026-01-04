import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link ,Routes} from 'react-router-dom';

export default function Homepage() {
  return(
     <div className="flex justify-center items-center flex-col gap-2 pt-12">
      <h1 data-testid="app-title" className="text-3xl font-bold">World cup mini-game!</h1>
      <p className="pt-0 mt-0">Welcome to our mini-game!</p>
      <Link to="/teams"><button className="px-12 py-6 text-4xl font-extrabold uppercase text-white bg-green-500 rounded-full border-4 border-green-800 shadow-[0_10px_0_#166534] hover:bg-green-400 active:translate-y-2 active:shadow-none transition-all duration-150">START THE GAME</button>
</Link>
     </div>
  );
}


