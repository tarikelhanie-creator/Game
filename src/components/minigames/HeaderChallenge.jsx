import { useEffect, useState, useRef } from "react";

const GRID_SIZE = 9;
const REQUIRED_STREAK = 4;
const SPAWN_INTERVAL = 2000; // 2s cooldown
const TOTAL_TIME = 100; // 100 seconds total

function getRandomIndex() {
  return Math.floor(Math.random() * GRID_SIZE);
}

function ReflexGridGame({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isOver, setIsOver] = useState(false);

  const spawnIntervalRef = useRef(null);
  const timerRef = useRef(null);

  // --- Countdown timer ---
  useEffect(() => {
    if (isOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnIntervalRef.current);
          if (!isOver) {
            setIsOver(true);
            onFinish(false); // lose if time runs out
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isOver, onFinish]);

  // --- Spawn button every 2s ---
  useEffect(() => {
    if (isOver) return;

    const spawnButton = () => {
      setActiveIndex(getRandomIndex());
    };

    spawnButton(); // spawn immediately
    spawnIntervalRef.current = setInterval(spawnButton, SPAWN_INTERVAL);

    return () => clearInterval(spawnIntervalRef.current);
  }, [isOver]);

  // --- Handle click ---
  const handleClick = (index) => {
    if (isOver || index !== activeIndex) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    setActiveIndex(null);

    if (newStreak >= REQUIRED_STREAK) {
      // ✅ WIN
      setIsOver(true);
      clearInterval(spawnIntervalRef.current);
      clearInterval(timerRef.current);
      onFinish(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">Reflex Grid</h2>

      <p className="mb-2 font-semibold">
        Streak: <span className="text-green-600">{streak}</span> / {REQUIRED_STREAK}
      </p>

      <p className="mb-4 text-gray-600">
        Time left: <span className="font-bold">{timeLeft}s</span>
      </p>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <div
            key={index}
            className={`h-20 flex items-center justify-center rounded-lg border-2 ${
              activeIndex === index
                ? "border-green-700 bg-green-200 animate-pulse"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            {activeIndex === index && !isOver && (
              <button
                onClick={() => handleClick(index)}
                className="px-4 py-2 bg-yellow-400 text-purple-800 font-bold rounded-full border-4 border-purple-900 shadow-[0_6px_0_#6b21a8] hover:bg-yellow-300 active:translate-y-1 active:shadow-none animate-bounce"
              >
                CLICK
              </button>
            )}
          </div>
        ))}
      </div>

      {isOver && (
        <p className="text-lg font-bold">
          {streak >= REQUIRED_STREAK ? "🏆 You Win!" : "💀 Time's Up!"}
        </p>
      )}
    </div>
  );
}

export default ReflexGridGame;
