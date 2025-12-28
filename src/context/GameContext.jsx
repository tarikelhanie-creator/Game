import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [playerTeam, setPlayerTeam] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [opponent, setOpponent] = useState(null);
  const [isChampion, setIsChampion] = useState(false);

  return (
    <GameContext.Provider
      value={{
        playerTeam,
        setPlayerTeam,
        currentRound,
        setCurrentRound,
        opponent,
        setOpponent,
        isChampion,
        setIsChampion,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
