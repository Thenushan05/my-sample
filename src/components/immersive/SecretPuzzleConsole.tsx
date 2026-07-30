import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ShieldCheck,
  Lock,
  Sparkles,
  Cpu,
  Award,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  HelpCircle,
  ArrowRight,
  Code,
} from "lucide-react";

interface SecretPuzzleConsoleProps {
  onCommandInput?: string;
  onNavigateFile?: (fileId: string) => void;
  isSpideyMode?: boolean;
}

const SPIDEY_QUOTES = [
  "\"With great power comes great responsibility.\" — Uncle Ben",
  "\"Whatever comes our way, whatever battle we have raging inside us, we always have a choice.\" — Peter Parker",
  "\"You can't think about saving the world. You have to think about saving one person.\" — Peter Parker",
  "\"Anyone can wear the mask. You could wear the mask. If you didn't know that before, I hope you do now.\" — Miles Morales",
  "\"My Spider-Sense is tingling!\"",
  "\"We're going to pull off a heist? In Oscorp? That's insane. I'm in!\"",
  "\"It's pizza time!\" — Peter Parker",
];

export const SecretPuzzleConsole: React.FC<SecretPuzzleConsoleProps> = ({
  onCommandInput,
  onNavigateFile,
  isSpideyMode,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "hint" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [keyParts, setKeyParts] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    if (!isSpideyMode) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSpideyMode]);

  // Handle external commands from bottom terminal input if provided
  useEffect(() => {
    if (!onCommandInput) return;
    const cmd = onCommandInput.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "hint") {
      setShowHint(true);
      return;
    }
    if (cmd === "reset" || cmd === "restart") {
      resetPuzzle();
      return;
    }

    // Try submitting the command as an answer or solve <answer>
    const answerClean = cmd.startsWith("solve ")
      ? cmd.replace("solve ", "").trim()
      : cmd.startsWith("answer ")
      ? cmd.replace("answer ", "").trim()
      : cmd;

    handleOptionSubmit(answerClean);
  }, [onCommandInput]);

  const handleOptionSubmit = (answer: string) => {
    if (!answer) return;
    setSelectedOption(answer);
    setAttempts((prev) => prev + 1);

    if (level === 1) {
      if (answer === "258" || answer.toLowerCase() === "a") {
        setFeedback({
          type: "success",
          message: "[✓] MEMORY PARITY RESTORED: Offset 258 verified. Key part 'ANTI_' decrypted.",
        });
        setKeyParts((prev) => (prev.includes("ANTI_") ? prev : [...prev, "ANTI_"]));
      } else {
        setFeedback({
          type: "error",
          message: "[x] ERROR: Memory parity check failed. Check the doubling pattern ((prev * 2) - 2).",
        });
      }
    } else if (level === 2) {
      if (
        answer.toLowerCase() === "gravite_x101" ||
        answer.toLowerCase() === "b"
      ) {
        setFeedback({
          type: "success",
          message: "[✓] FIREWALL BYPASSED: Signature 'gravite_x101' validated. Key part 'GRAVITY_' decrypted.",
        });
        setKeyParts((prev) => (prev.includes("GRAVITY_") ? prev : [...prev, "GRAVITY_"]));
      } else {
        setFeedback({
          type: "error",
          message: "[x] FIREWALL REJECTED: Invalid signature token. Remember to reverse 'etivarg' first.",
        });
      }
    } else if (level === 3) {
      const ansLower = answer.toLowerCase();
      const isCorrectSpidey = isSpideyMode && (
        ansLower === "a" ||
        ansLower.includes("web") ||
        ansLower.includes("shooter")
      );
      const isCorrectNormal = !isSpideyMode && (
        ansLower === "c" ||
        ansLower.includes("engineer") ||
        ansLower.includes("programmer") ||
        ansLower.includes("code") ||
        ansLower.includes("developer") ||
        ansLower.includes("software")
      );

      if (isCorrectSpidey || isCorrectNormal) {
        setFeedback({
          type: "success",
          message: "[✓] CORE IDENTITY CONFIRMED: Master clearance verified! Key part 'ROOT' synthesized.",
        });
        setKeyParts((prev) => (prev.includes("ROOT") ? prev : [...prev, "ROOT"]));
      } else {
        setFeedback({
          type: "error",
          message: "[x] ACCESS DENIED: Incorrect riddle answer. Who writes syntax and fixes bugs?",
        });
      }
    }
  };

  const advanceLevel = () => {
    if (level < 3) {
      setLevel((prev) => prev + 1);
      setSelectedOption(null);
      setCustomInput("");
      setFeedback({ type: null, message: "" });
      setShowHint(false);
    } else if (level === 3) {
      setLevel(4); // Victory screen
      setFeedback({ type: null, message: "" });
    }
  };

  const resetPuzzle = () => {
    setLevel(1);
    setSelectedOption(null);
    setCustomInput("");
    setFeedback({ type: null, message: "" });
    setShowHint(false);
    setCopiedKey(false);
    setKeyParts([]);
    setAttempts(0);
  };

  const copyMasterKey = () => {
    navigator.clipboard.writeText("ANTIGRAVITY_ROOT_2026");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const getProgressPercentage = () => {
    if (level === 1) return 33;
    if (level === 2) return 66;
    if (level === 3) return 90;
    return 100;
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs text-white selection:bg-emerald-500 selection:text-black">
      {/* Top Security Status Header */}
      <div className={`border rounded-xl p-3 mb-3 flex flex-wrap items-center justify-between gap-3 ${
        isSpideyMode 
          ? "bg-[#180a0a] border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.25)]" 
          : "bg-[#18181b] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${
            isSpideyMode 
              ? "bg-red-500/10 border-red-500/30 text-red-400" 
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}>
            {level === 4 ? <ShieldCheck className="w-4 h-4 animate-pulse" /> : <Terminal className="w-4 h-4" />}
          </div>
          <div>
            <div className={`text-[11px] font-bold tracking-wider flex items-center gap-1.5 uppercase ${
              isSpideyMode ? "text-red-400" : "text-emerald-400"
            }`}>
              <span>{isSpideyMode ? "OSCORP SECURE MAINFRAME" : "ANTIGRAVITY SECURITY NODE"}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                isSpideyMode ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
              }`}>
                {level === 4 ? "ROOT MASTER" : `LEVEL ${level} OF 3`}
              </span>
            </div>
            <div className="text-[10px] text-white/50 flex items-center gap-2 mt-0.5">
              <span>Clearance: {level === 4 ? (isSpideyMode ? "Peter Parker (@spiderman)" : "Master Engineer (@thenushan)") : (isSpideyMode ? "Friendly Neighborhood Guest" : "Guest Encrypted")}</span>
              <span>•</span>
              <span>Attempts: {attempts}</span>
            </div>
          </div>
        </div>

        {/* Progress bar and reset */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end gap-1 w-32">
            <div className="flex justify-between w-full text-[9px] text-white/40">
              <span>DECRYPTION</span>
              <span className={`font-bold ${isSpideyMode ? "text-red-400" : "text-emerald-400"}`}>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${isSpideyMode ? "from-red-600 to-blue-600" : "from-emerald-500 to-teal-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <button
            onClick={resetPuzzle}
            title="Restart Decryption Protocol"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-[10px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Spider-Man Rotating Quotes Banner */}
      {isSpideyMode && (
        <div className="bg-gradient-to-r from-red-950/60 via-[#1a0808] to-blue-950/60 border border-red-500/30 rounded-xl p-2.5 mb-3 flex items-center gap-2.5 text-xs shadow-[0_0_15px_rgba(220,38,38,0.15)]">
          <span className="text-red-400 font-extrabold shrink-0 flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <span>🕸️</span> SPIDEY QUOTE:
          </span>
          <div className="flex-1 overflow-hidden h-5 relative flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-red-200/90 font-serif italic text-[11px] truncate"
              >
                {SPIDEY_QUOTES[quoteIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Puzzle Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <AnimatePresence mode="wait">
          {/* LEVEL 1: MEMORY PARITY LOCK */}
          {level === 1 && (
            <motion.div
              key="level1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-[#18181b]/80 border border-white/10 rounded-xl p-5 shadow-lg space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>LEVEL 1 // MEMORY PARITY DIAGNOSTIC</span>
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHint ? "Hide Hint" : "Request Hint"}</span>
                </button>
              </div>

              <div className="space-y-3 text-white/80 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
                <p className="text-amber-400/90 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  SYSTEM ALERT: {isSpideyMode ? "Web-fluid density mismatch detected during synthesis." : "Address 0x7F00A check encountered an unverified null index during startup."}
                </p>
                <p>
                  Inspect the numerical doubling offset pattern below and determine the missing integer to restore memory alignment:
                </p>
                <div className="py-3 px-4 bg-[#0e0e11] rounded-lg border border-emerald-500/20 font-mono text-center text-sm sm:text-base tracking-widest text-emerald-300">
                  [ 10, &nbsp;18, &nbsp;34, &nbsp;66, &nbsp;130, &nbsp;<span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">?</span> ]
                </div>
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-300 text-[11px] flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold">DECRYPTION HINT:</span> {isSpideyMode ? "My spider-sense is tingling... " : ""}Look at how each number transforms into the next.
                    <br />
                    10 × 2 = 20 (minus 2 = 18). 18 × 2 = 36 (minus 2 = 34). 34 × 2 = 68 (minus 2 = 66)... What is (130 × 2) - 2?
                  </div>
                </motion.div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: "A", label: "[A] 258", value: "258", correct: true },
                  { id: "B", label: "[B] 260", value: "260", correct: false },
                  { id: "C", label: "[C] 194", value: "194", correct: false },
                  { id: "D", label: "[D] 512", value: "512", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSubmit(opt.value)}
                    disabled={feedback.type === "success"}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      selectedOption === opt.value
                        ? feedback.type === "success"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          : "bg-red-500/20 border-red-500 text-red-300"
                        : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white/80 hover:text-white hover:border-emerald-500/40"
                    }`}
                  >
                    <span className="font-mono">{opt.label}</span>
                    {selectedOption === opt.value && feedback.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Manual Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOptionSubmit(customInput.trim());
                }}
                className="flex gap-2 pt-2"
              >
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={feedback.type === "success"}
                  placeholder="Or type answer directly (e.g. 258)..."
                  className="flex-1 bg-black/50 border border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || feedback.type === "success"}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-lg font-bold text-white transition-all flex items-center gap-1.5 text-xs shadow-md"
                >
                  <span>Verify</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* LEVEL 2: FIREWALL BYPASS */}
          {level === 2 && (
            <motion.div
              key="level2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-[#18181b]/80 border border-white/10 rounded-xl p-5 shadow-lg space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>LEVEL 2 // FIREWALL INTERCEPTOR BYPASS</span>
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[10px] flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHint ? "Hide Hint" : "Request Hint"}</span>
                </button>
              </div>

              <div className="space-y-3 text-white/80 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
                <p className="text-cyan-300 font-semibold">
                  SECURITY GATE: An active firewall routine is validating authentication headers.
                </p>
                <p>
                  Inspect the Python verification function below. What exact string must <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">auth_header</code> equal to return True?
                </p>
                <div className="p-3 bg-[#0e0e11] rounded-lg border border-cyan-500/20 font-mono text-xs text-green-400 space-y-1">
                  <div><span className="text-blue-400">def</span> <span className="text-yellow-300">verify_payload</span>(auth_header: <span className="text-purple-400">str</span>) -&gt; <span className="text-purple-400">bool</span>:</div>
                  <div className="pl-4 text-white/50"># Reverse 'etivarg' and append '_x101'</div>
                  <div className="pl-4">secret_token = <span className="text-amber-300">""</span>.<span className="text-yellow-300">join</span>(<span className="text-blue-400">reversed</span>(<span className="text-amber-300">"etivarg"</span>)) + <span className="text-amber-300">"_x101"</span></div>
                  <div className="pl-4"><span className="text-purple-400">return</span> auth_header == secret_token</div>
                </div>
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-cyan-300 text-[11px] flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                  <div>
                    <span className="font-bold">DECRYPTION HINT:</span> {isSpideyMode ? "With great power comes great... attention to detail! " : ""}Read the string <code className="bg-black/40 px-1 rounded">"etivarg"</code> backwards from right to left: <code className="bg-black/40 px-1 rounded">g-r-a-v-i-t-e</code>. Then append <code className="bg-black/40 px-1 rounded">"_x101"</code>!
                  </div>
                </motion.div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: "A", label: "[A] etivarg_x101", value: "etivarg_x101", correct: false },
                  { id: "B", label: "[B] gravite_x101", value: "gravite_x101", correct: true },
                  { id: "C", label: "[C] gravitex_101", value: "gravitex_101", correct: false },
                  { id: "D", label: "[D] x101_gravite", value: "x101_gravite", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSubmit(opt.value)}
                    disabled={feedback.type === "success"}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      selectedOption === opt.value
                        ? feedback.type === "success"
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-red-500/20 border-red-500 text-red-300"
                        : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white/80 hover:text-white hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="font-mono">{opt.label}</span>
                    {selectedOption === opt.value && feedback.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Manual Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOptionSubmit(customInput.trim());
                }}
                className="flex gap-2 pt-2"
              >
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={feedback.type === "success"}
                  placeholder="Or type auth_header string (e.g. gravite_x101)..."
                  className="flex-1 bg-black/50 border border-white/10 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || feedback.type === "success"}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 rounded-lg font-bold text-white transition-all flex items-center gap-1.5 text-xs shadow-md"
                >
                  <span>Bypass</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* LEVEL 3: DEVELOPER RIDDLE */}
          {level === 3 && (
            <motion.div
              key="level3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-[#18181b]/80 border border-white/10 rounded-xl p-5 shadow-lg space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>LEVEL 3 // CORE ARCHITECTURE VERIFICATION</span>
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[10px] flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHint ? "Hide Hint" : "Request Hint"}</span>
                </button>
              </div>

              <div className="space-y-3 text-white/80 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
                <p className="text-purple-300 font-semibold">
                  FINAL GATE: {isSpideyMode ? "Avenger Level Threat Clearance" : "Master Developer Clearance"} (<code className="text-white">{isSpideyMode ? "root@spiderverse" : "root@thenushan-portfolio"}</code>)
                </p>
                <p>
                  To confirm your developer intuition and synthesize the final root decryption key, answer this system riddle:
                </p>
                <div className="p-4 bg-[#0e0e11] rounded-lg border border-purple-500/30 font-mono text-sm text-purple-200 italic border-l-4 border-l-purple-500">
                  {isSpideyMode 
                    ? "\"I am sticky, strong, and help you swing across the city. Without me, a spider is just a bug. What am I?\""
                    : "\"I have no physical form, yet I architect entire worlds of logic. I speak purely in syntax and thrive in loops. When I catch a bug, I don't get sick—I get fixed. What am I?\""
                  }
                </div>
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-purple-300 text-[11px] flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                  <div>
                    <span className="font-bold">DECRYPTION HINT:</span> {isSpideyMode ? "It's pizza time! Oh wait, no... it's what Spiderman shoots from his wrists!" : "Who writes clean syntax, debugs errors, designs backend architectures, and creates beautiful portfolio applications?"}
                  </div>
                </motion.div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(isSpideyMode ? [
                  { id: "A", label: "[A] A Web Shooter", value: "web shooter", correct: true },
                  { id: "B", label: "[B] A Grappling Hook", value: "grappling hook", correct: false },
                  { id: "C", label: "[C] A Symbiote", value: "symbiote", correct: false },
                  { id: "D", label: "[D] Radioactive Blood", value: "radioactive blood", correct: false },
                ] : [
                  { id: "A", label: "[A] A Database Index", value: "A Database Index", correct: false },
                  { id: "B", label: "[B] A Compiler Engine", value: "A Compiler Engine", correct: false },
                  { id: "C", label: "[C] A Software Engineer / Code", value: "C", correct: true },
                  { id: "D", label: "[D] A Network Router", value: "A Network Router", correct: false },
                ]).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSubmit(opt.value)}
                    disabled={feedback.type === "success"}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      selectedOption === opt.value
                        ? feedback.type === "success"
                          ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                          : "bg-red-500/20 border-red-500 text-red-300"
                        : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white/80 hover:text-white hover:border-purple-500/40"
                    }`}
                  >
                    <span className="font-mono">{opt.label}</span>
                    {selectedOption === opt.value && feedback.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Manual Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOptionSubmit(customInput.trim());
                }}
                className="flex gap-2 pt-2"
              >
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={feedback.type === "success"}
                  placeholder={isSpideyMode ? "Or type answer (e.g. web shooter)..." : "Or type answer (e.g. programmer, engineer, code)..."}
                  className="flex-1 bg-black/50 border border-white/10 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || feedback.type === "success"}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 rounded-lg font-bold text-white transition-all flex items-center gap-1.5 text-xs shadow-md"
                >
                  <span>Synthesize</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* LEVEL 4: VICTORY SCREEN / ROOT ACCESS GRANTED */}
          {level === 4 && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-950/40 via-[#18181b] to-purple-950/40 border-2 border-emerald-500/50 rounded-xl p-6 shadow-[0_0_35px_rgba(16,185,129,0.2)] space-y-6 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSpideyMode ? "SPIDER-SENSE MASTER UNLOCKED" : "ANTIGRAVITY MASTER ENGINEER UNLOCKED"}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {isSpideyMode ? "WITH GREAT POWER... 🕸️" : "ROOT ACCESS GRANTED 🚀"}
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  {isSpideyMode 
                    ? "All 3 security protocols bypassed. Welcome to the Spider-Verse, friendly neighborhood hacker!" 
                    : "All 3 decryption layers cleared. You have unlocked master developer privileges across Thenushan's capability stack."}
                </p>
              </div>

              {/* ASCII Art Box */}
              <div className="bg-black/80 border border-emerald-500/30 rounded-lg p-4 font-mono text-[10px] sm:text-xs text-emerald-400 overflow-x-auto text-center leading-tight">
                {isSpideyMode ? (
                  <pre>{`  ███████╗ P I D E R - M A N   O S C O R P   N O D E
╔═══════════════════════════════════════════════════════╗
║ USER: root@peter-parker  [VERIFIED]                   ║
║ STATUS: WEB-SHOOTERS FULLY CALIBRATED                 ║
╚═══════════════════════════════════════════════════════╝`}</pre>
                ) : (
                  <pre>{`  █████╗ N T I G R A V I T Y   R O O T   N O D E
╔═══════════════════════════════════════════════════════╗
║ USER: root@thenushan-portfolio  [VERIFIED]            ║
║ STATUS: 5/5 CAPABILITY NODES FULLY SYNCHRONIZED       ║
╚═══════════════════════════════════════════════════════╝`}</pre>
                )}
              </div>

              {/* Master Key Card */}
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Master Decryption Token</div>
                  <div className="text-sm font-bold text-amber-300 tracking-wider font-mono">
                    ANTIGRAVITY_ROOT_2026
                  </div>
                </div>
                <button
                  onClick={copyMasterKey}
                  className="w-full sm:w-auto px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white font-semibold flex items-center justify-center gap-2 text-xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? "Copied to Clipboard!" : "Copy Token"}</span>
                </button>
              </div>

              {/* Secret Note */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-2 border-emerald-400 p-3.5 rounded-r-lg text-left space-y-1">
                <div className="text-[11px] font-bold text-emerald-300">💬 {isSpideyMode ? "A NOTE FROM PETER PARKER:" : "A NOTE FROM THENUSHAN:"}</div>
                <div className="text-xs text-white/80 leading-relaxed italic">
                  {isSpideyMode 
                    ? "\"Anyone can wear the mask. You could wear the mask. If you didn't know that before, I hope you do now. Thanks for hacking the mainframe with me!\""
                    : "\"Curiosity is what turns good software engineers into great problem solvers. Thank you for exploring my code, testing my interactive systems, and unlocking the root challenge!\""}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetPuzzle}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replay Challenge</span>
                </button>
                {onNavigateFile && (
                  <button
                    onClick={() => onNavigateFile("aiml")}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <span>Inspect AI &amp; ML Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Alert Bar */}
        {feedback.type && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                : "bg-red-500/10 border-red-500/40 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.type === "success" && level < 4 && (
              <button
                onClick={advanceLevel}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1 shrink-0 transition-all shadow-md"
              >
                <span>Next Level</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default SecretPuzzleConsole;
