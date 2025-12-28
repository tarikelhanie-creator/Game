import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link ,Routes} from 'react-router-dom';
import Nav from '../../components/layout/Nav/Nav';
import Homepage from '../../components/H/Hero/Hero';
import Teams from '../Teams/Teams';
import MatchPage from '../MatchPage';

export default function Home() {
  return(
<Router>
  <div className="flex flex-col justify-center items-center pb-3 mt-9">
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl border border-solid border-gray-300 w-full">
      <Nav />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </div>
  </div>
</Router>
  );
}


