import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, RefreshCw, Trophy, Play, Gamepad2, Skull, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface TerminalSnakeProps {
  onCommandInput?: string;
  onNavigateFile?: (fileId: string) => void;
  isSpideyMode?: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 14 },
  { x: 10, y: 15 },
  { x: 10, y: 16 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // moving up
const SPEED = 120; // ms per tick

type Point = { x: number; y: number };

const generateFood = (snake: Point[]) => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
    if (!isOnSnake) break;
  }
  return newFood;
};

export const TerminalSnake: React.FC<TerminalSnakeProps> = ({
  onCommandInput,
  isSpideyMode = false,
}) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);

  // Initialize food on mount
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  // Handle external commands from terminal (like "reset", "start")
  useEffect(() => {
    if (!onCommandInput) return;
    const cmd = onCommandInput.trim().toLowerCase();
    if (cmd === "start" || cmd === "play") {
      startGame();
    } else if (cmd === "reset" || cmd === "restart") {
      resetGame();
    }
  }, [onCommandInput]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [isPlaying, isGameOver]
  );

  const handleDpadClick = useCallback((dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (!isPlaying || isGameOver) return;
    const currentDir = directionRef.current;
    switch (dir) {
      case "UP":
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case "DOWN":
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case "LEFT":
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case "RIGHT":
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update ref whenever direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collisions
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, food, highScore]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  return (
    <div className={`w-full h-full flex flex-col font-mono text-xs text-white selection:text-black focus:outline-none min-h-0 ${isSpideyMode ? "selection:bg-red-500" : "selection:bg-emerald-500"}`}>
      {/* Top Header */}
      <div className={`bg-[#18181b] border rounded-xl p-3 mb-2 sm:mb-4 flex flex-wrap items-center justify-between gap-3 shrink-0 ${isSpideyMode ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${isSpideyMode ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[11px] font-bold tracking-wider flex items-center gap-1.5 uppercase ${isSpideyMode ? "text-red-400" : "text-emerald-400"}`}>
              <span>{isSpideyMode ? "SPIDER-SNAKE v1.0" : "TERMINAL SNAKE v1.0"}</span>
            </div>
            <div className="text-[10px] text-white/50 flex items-center gap-2 mt-0.5">
              <span>Status: {isGameOver ? "CRASHED" : isPlaying ? "ACTIVE" : "READY"}</span>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex flex-col items-end">
            <span className="text-white/40">SCORE</span>
            <span className={`font-bold text-sm ${isSpideyMode ? "text-red-400" : "text-emerald-400"}`}>{score}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-white/40 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> BEST
            </span>
            <span className="text-amber-400 font-bold text-sm">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden bg-black/40 border border-white/5 rounded-xl p-2 sm:p-4">
        
        {/* The Grid */}
        <div 
          className="relative bg-[#0e0e11] border border-white/10 rounded-sm shadow-inner aspect-square mx-auto"
          style={{
            height: '100%',
            maxHeight: '400px',
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Render snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <motion.div
                key={`snake-${index}`}
                className={`${isHead 
                  ? (isSpideyMode ? "bg-red-500 z-10 rounded-sm" : "bg-emerald-400 z-10 rounded-sm") 
                  : (isSpideyMode ? "bg-blue-600/80 rounded-sm" : "bg-emerald-600/80 rounded-sm")}`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  margin: '1px'
                }}
              />
            );
          })}

          {/* Render food */}
          <motion.div
            className={`rounded-full z-0 flex items-center justify-center ${isSpideyMode ? "bg-white" : "bg-red-500"}`}
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              margin: '2px',
              boxShadow: isSpideyMode ? '0 0 10px rgba(255,255,255,0.8)' : '0 0 10px rgba(239,68,68,0.6)'
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>

        {/* Mobile On-Screen D-Pad (Visible on small screens when playing) */}
        {isPlaying && !isGameOver && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:hidden grid grid-cols-3 grid-rows-2 gap-1.5 opacity-60 z-30 pointer-events-auto">
            <div />
            <button onClick={() => handleDpadClick("UP")} className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform ${isSpideyMode ? 'bg-red-500/20 border border-red-500/50 text-white' : 'bg-emerald-500/20 border border-emerald-500/50 text-white'}`}>
              <ChevronUp className="w-6 h-6" />
            </button>
            <div />
            <button onClick={() => handleDpadClick("LEFT")} className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform ${isSpideyMode ? 'bg-red-500/20 border border-red-500/50 text-white' : 'bg-emerald-500/20 border border-emerald-500/50 text-white'}`}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => handleDpadClick("DOWN")} className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform ${isSpideyMode ? 'bg-red-500/20 border border-red-500/50 text-white' : 'bg-emerald-500/20 border border-emerald-500/50 text-white'}`}>
              <ChevronDown className="w-6 h-6" />
            </button>
            <button onClick={() => handleDpadClick("RIGHT")} className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform ${isSpideyMode ? 'bg-red-500/20 border border-red-500/50 text-white' : 'bg-emerald-500/20 border border-emerald-500/50 text-white'}`}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Overlays */}
        <AnimatePresence>
          {!isPlaying && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <div className="bg-[#18181b] border border-white/10 p-6 rounded-xl text-center space-y-4 max-w-[240px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isSpideyMode ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className={`font-bold text-sm ${isSpideyMode ? "text-red-400" : "text-emerald-400"}`}>
                  {isSpideyMode ? "SPIDER-SNAKE" : "TERMINAL SNAKE"}
                </h3>
                <p className="text-[10px] text-white/60">
                  Use Arrow Keys or WASD to move. Eat the {isSpideyMode ? "glowing webs" : "red bugs"} to increase your score!
                </p>
                <button
                  onClick={startGame}
                  className={`w-full py-2.5 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs ${isSpideyMode ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Game</span>
                </button>
              </div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex items-center justify-center z-20"
            >
              <div className="bg-[#18181b] border-2 border-red-500/50 p-6 rounded-xl text-center space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] max-w-[240px]">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Skull className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-red-400 font-bold text-lg">SYSTEM CRASH</h3>
                  <p className="text-[10px] text-white/60 mt-1">
                    Collision detected. Process terminated.
                  </p>
                </div>
                
                <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                  <div className="text-[10px] text-white/40 mb-1">FINAL SCORE</div>
                  <div className="text-xl font-bold text-white">{score}</div>
                </div>

                <button
                  onClick={resetGame}
                  className="w-full py-2.5 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restart System</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TerminalSnake;
