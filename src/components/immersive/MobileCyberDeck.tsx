import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Skull, Terminal, Layers, Gamepad2, Play } from "lucide-react";
import { PORTFOLIO_APPS } from "../../data/apps";
import { ActiveAppPanel } from "./ActiveAppPanel";
import { TerminalSnake } from "./TerminalSnake";

// Re-using the HackerLoading component for the lock screen
const HackerLoading: React.FC<{ isError: boolean }> = ({ isError }) => {
  const [logs, setLogs] = React.useState<string[]>([]);
  React.useEffect(() => {
    const sequence = isError
      ? ["> INITIATING...", "> BYPASSING...", "> ERROR: MISMATCH", "> TERMINATED"]
      : ["> INITIATING...", "> BYPASSING...", "> PAYLOAD ACCEPTED", "> GRANTED"];
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, sequence[i]]);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, [isError]);

  return (
    <div className="w-full bg-black/80 border border-white/10 rounded-md p-3 font-mono text-[10px] text-emerald-400 shadow-inner flex flex-col gap-1 text-left mb-4">
      {logs.map((log, idx) => (
        <div key={idx} className={isError && idx >= 2 ? "text-red-500 font-bold" : "text-emerald-400"}>
          {log}
        </div>
      ))}
      <motion.div className={`h-1 w-full mt-2 rounded-full ${isError ? 'bg-red-500/20' : 'bg-emerald-500/20'} overflow-hidden`}>
        <motion.div
          className={`h-full ${isError ? 'bg-red-500' : 'bg-emerald-500'}`}
          initial={{ width: "0%" }}
          animate={{ width: isError ? "60%" : "100%" }}
          transition={{ duration: 1.2, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

interface MobileCyberDeckProps {
  isInteractive: boolean;
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  getCodeRepresentation: (appId: string) => string;
}

export const MobileCyberDeck: React.FC<MobileCyberDeckProps> = ({
  isInteractive,
  selectedAppId,
  setSelectedAppId,
  getCodeRepresentation,
}) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Lock Screen State for Code Console
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockError, setLockError] = useState(false);
  const [attemptWasError, setAttemptWasError] = useState(false);

  // Render Story Mode (Stacked Cards)
  if (isInteractive) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center pt-24 pb-32 px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" /> System Modules
          </h2>
          <p className="text-white/40 text-xs">Tap a module card to expand</p>
        </div>

        <div className="w-full max-w-sm relative flex flex-col items-center justify-center space-y-4">
          <AnimatePresence>
            {PORTFOLIO_APPS.map((app, index) => {
              const isExpanded = expandedCardId === app.id;
              
              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`w-full overflow-hidden ${isExpanded ? 'z-50' : 'z-10 cursor-pointer'}`}
                  onClick={() => !isExpanded && setExpandedCardId(app.id)}
                >
                  {/* Card Header */}
                  <div className={`p-4 rounded-t-2xl border-t border-x border-white/10 flex items-center justify-between transition-colors shadow-lg ${isExpanded ? 'bg-slate-800' : 'bg-slate-900/80 backdrop-blur hover:bg-slate-800/90 rounded-b-2xl border-b'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner bg-black/50 border border-white/5">
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">{app.title}</h3>
                        <p className="text-white/40 text-[10px] uppercase font-mono">{app.id}.module</p>
                      </div>
                    </div>
                    {isExpanded && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setExpandedCardId(null); }}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Card Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/90 border-b border-x border-white/10 rounded-b-2xl overflow-hidden shadow-2xl"
                      >
                        <div className="p-5">
                          <ActiveAppPanel appId={app.id} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Render Code Console / Cyber-Deck Mode
  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center pt-20 pb-10 px-4 relative z-10">
      <div className="w-full max-w-md h-[70vh] min-h-[500px] bg-black rounded-[2.5rem] border-[8px] border-[#141414] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col">
        {/* Dynamic Island / Camera Hole */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-[#141414] rounded-b-xl z-[60] flex items-center justify-center">
           <div className="w-1.5 h-1.5 rounded-full bg-black/80 shadow-inner" />
        </div>

        <AnimatePresence>
          {!isUnlocked && (
            <motion.div
              key="mobile-lock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-6 pointer-events-auto"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] ${lockError ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                {lockError ? <Skull className="w-8 h-8 text-white animate-bounce" /> : <Lock className="w-8 h-8 text-white" />}
              </div>
              <h3 className={`font-bold text-lg mb-2 tracking-tight ${lockError ? 'text-red-500' : 'text-white'}`}>
                {lockError ? 'ACCESS DENIED' : 'System Locked'}
              </h3>
              <p className="text-emerald-300/70 text-xs mb-8 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-center">
                Query: What is 2^10?
              </p>
              
              {isUnlocking ? (
                <HackerLoading isError={attemptWasError} />
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isUnlocking) return;
                    const val = (e.target as HTMLFormElement).pin.value;
                    const isWrong = val !== "1024";
                    setAttemptWasError(isWrong);
                    setIsUnlocking(true);
                    setLockError(false);

                    setTimeout(() => {
                      if (!isWrong) {
                        setTimeout(() => { setIsUnlocked(true); setIsUnlocking(false); }, 500);
                      } else {
                        setLockError(true);
                        setIsUnlocking(false);
                        (e.target as HTMLFormElement).pin.value = "";
                        setTimeout(() => setLockError(false), 2000);
                      }
                    }, 1500);
                  }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="relative w-full max-w-[200px]">
                    <input 
                      name="pin"
                      type="password"
                      inputMode="numeric"
                      disabled={isUnlocking}
                      className={`w-full bg-black/50 border rounded-xl px-4 py-3.5 text-center text-white font-mono tracking-[0.7em] focus:outline-none transition-colors text-base placeholder:tracking-normal shadow-inner disabled:opacity-50 ${lockError ? 'border-red-500 text-red-500 placeholder:text-red-500/30' : 'border-white/20 focus:border-emerald-500 placeholder:text-white/20'}`}
                      placeholder="PIN"
                      maxLength={4}
                      autoComplete="off"
                    />
                    <button 
                      type="submit" 
                      disabled={isUnlocking}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 ${lockError ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cyber-Deck Header */}
        <div className="pt-8 pb-3 px-4 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="text-[10px] text-white/50 font-mono flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-emerald-400" />
            antigravity@mobile:~
          </div>
          <button onClick={() => setIsUnlocked(false)} className="text-[9px] px-2 py-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 rounded transition-colors uppercase font-bold tracking-wider border border-white/5">
            Lock
          </button>
        </div>

        {/* Horizontal File Explorer Tabs */}
        <div className="bg-[#252526] border-b border-white/5 shrink-0">
          <div className="flex items-center overflow-x-auto no-scrollbar px-2 py-2 gap-1.5 snap-x">
            <button
              onClick={() => setSelectedAppId("snake_game")}
              className={`shrink-0 snap-start px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${selectedAppId === "snake_game" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-white/50 border-transparent hover:bg-white/10"}`}
            >
              🐍 snake.py
            </button>
            {PORTFOLIO_APPS.map(app => {
               const ext = app.id === "ux" ? ".fig" : app.id === "frontend" ? ".tsx" : app.id === "aiml" ? ".py" : app.id === "backend" ? ".go" : ".yml";
               return (
                 <button
                   key={app.id}
                   onClick={() => setSelectedAppId(app.id)}
                   className={`shrink-0 snap-start px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${selectedAppId === app.id ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "bg-white/5 text-white/50 border-transparent hover:bg-white/10"}`}
                 >
                   {app.id === "ux" ? "🎨 " : app.id === "frontend" ? "💻 " : app.id === "aiml" ? "🧠 " : app.id === "backend" ? "🗄️ " : "🐋 "}
                   {app.id}{ext}
                 </button>
               );
            })}
          </div>
        </div>

        {/* Terminal Content Area */}
        <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col">
          {selectedAppId === "snake_game" ? (
             <TerminalSnake isSpideyMode={false} />
          ) : selectedAppId ? (
            <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
              <div className="text-[10px] text-white/30 border-b border-white/[0.04] pb-2 mb-3 flex items-center justify-between">
                <span className="font-mono truncate">~/{selectedAppId}</span>
              </div>
              <pre className="text-[10px] text-emerald-400 leading-relaxed font-mono whitespace-pre-wrap break-words">
                <TypewriterText key={selectedAppId} text={getCodeRepresentation(selectedAppId)} />
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              <Terminal className="w-10 h-10 text-white/20" />
              <div className="text-xs text-white/40 leading-relaxed">
                Swipe tabs above to explore modules, or launch the terminal game.
              </div>
              <button onClick={() => setSelectedAppId("snake_game")} className="mt-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-2">
                 <Play className="w-3 h-3" /> Play Snake
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
