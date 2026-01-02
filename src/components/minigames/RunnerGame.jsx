import { useState, useEffect, useRef } from "react";
import { skillMap } from "../../utils/skillMap";

function SpeedPass({ playerTeam, opponent, onFinish }) {
  const [zonePos, setZonePos] = useState(0); // 0-100%
  const [passes, setPasses] = useState(0);
  const [gameState, setGameState] = useState("playing"); // "playing", "win", "lose"
  const [message, setMessage] = useState("Tap PASS in green zone!");
  const playerSkill = skillMap[playerTeam.skill] || skillMap.normal;
  
  const intervalRef = useRef(null);
  const speed = 1.5 - (playerSkill / 1000); // Faster = harder

  useEffect(() => {
    if (gameState !== "playing") return;

    intervalRef.current = setInterval(() => {
      setZonePos((pos) => {
        const newPos = (pos + speed) % 100;
        
        // Check if pass window passed (near 50% = player position)
        if (newPos < speed && passes < 8) {
          setMessage("Too slow! Pass window missed.");
          setGameState("lose");
          onFinish(0, opponent.skill);
          return newPos;
        }
        
        return newPos;
      });
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [gameState, speed, passes, opponent.skill, onFinish]);

  const handlePass = () => {
    if (gameState !== "playing") return;
    
    const tolerance = 8 + (playerSkill / 20);
    const inZone = Math.abs(zonePos - 50) < tolerance;
    
    if (inZone && passes < 8) {
      setPasses(p => p + 1);
      setMessage(`Perfect! ${passes + 1}/8`);
      
      if (passes + 1 >= 8) {
        setGameState("win");
        onFinish(10, 0);
        return;
      }
    } else {
      setMessage("Missed! Try again.");
    }
  };

  if (gameState !== "playing") {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">{gameState === "win" ? "🏆 PERFECT PASSING!" : "Missed Pass 😤"}</h3>
        <p className="text-lg mb-6">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-6 py-2 rounded font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-xl font-bold mb-4">Speed Pass Challenge</div>
      <div className="text-2xl mb-6">Passes: {passes}/8</div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-12 mb-8 overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-all duration-75 ${Math.abs(zonePos - 50) < 8 ? 'ring-4 ring-yellow-400' : ''}`}
          style={{ width: '12px', left: `${zonePos}%`, transform: 'translateX(-50%)', position: 'relative' }}
        />
        
      </div>

      <button
        onClick={handlePass}
        className="px-12 py-6 bg-green-500 text-white font-extrabold uppercase rounded-full border-4 border-green-900 shadow-[0_6px_0_#14532d] hover:bg-green-400 active:translate-y-1 active:shadow-none transition-all duration-200 min-w-[80px]"
      >
        PASS ⚽
      </button>
      
      <p className="mt-4 text-sm text-gray-600">Tap when green hits player!</p>
    </div>
  );
}

export default SpeedPass;
