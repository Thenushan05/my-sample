import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";
import {
  Terminal as TerminalIcon,
  BookOpen,
  Quote,
  Cpu,
  Send,
} from "lucide-react";

type ConsoleTab = "terminal" | "history" | "quotes" | "blueprints";

interface SuitBlueprint {
  id: string;
  name: string;
  designation: string;
  img: string;
  cadNumber: string;
  specs: {
    core: string;
    ui: string;
    architecture: string;
    performance: string;
  };
  notes: string[];
}

const SUIT_BLUEPRINTS: SuitBlueprint[] = [
  {
    id: "frontend",
    name: "Frontend Engineering Stack",
    designation: "REACT-TS MARK V",
    img: arcReactorLogo,
    cadNumber: "CAD-FRONTEND-001",
    specs: {
      core: "React, TypeScript, Next.js, HTML5",
      ui: "Tailwind CSS & Framer Motion",
      architecture: "State Management (Redux/Zustand)",
      performance: "SEO & High-Performance Core Optimization",
    },
    notes: [
      "Constructs immersive, interactive user interfaces with rich animations.",
      "Optimizes client-side performance, core web vitals, and responsiveness.",
      "Ensures clean component structures and robust typing definitions.",
    ],
  },
  {
    id: "backend",
    name: "Backend & Database Stack",
    designation: "NODE-POSTGRES MARK II",
    img: arcReactorLogo,
    cadNumber: "CAD-BACKEND-309",
    specs: {
      core: "Node.js, Express, FastAPI, Python",
      ui: "API Documentation (Swagger, Postman)",
      architecture: "RESTful APIs & GraphQL Endpoints",
      performance: "Server-side Security & Auth (JWT/OAuth)",
    },
    notes: [
      "Architects scalable APIs and microservices with high concurrent capacity.",
      "Designs robust database schemas, normalization, and caching strategies.",
      "Implements secure middleware pipelines and error handling frameworks.",
    ],
  },
  {
    id: "ai",
    name: "AI & Automation Stack",
    designation: "OPENAI-LANGCHAIN MARK I",
    img: arcReactorLogo,
    cadNumber: "CAD-AI-882",
    specs: {
      core: "OpenAI API, Claude, Llama Models",
      ui: "Prompt Engineering & LLM Tuning",
      architecture: "LangChain & Vector DBs (Chroma/Pinecone)",
      performance: "Retrieval-Augmented Generation (RAG)",
    },
    notes: [
      "Integrates large language models for intelligent automation & agents.",
      "Implements prompt templates and chains for reliable outputs.",
      "Minimizes AI hallucination and optimizes response token efficiency.",
    ],
  },
];

const HISTORY_EVENTS = [
  {
    year: "2024 (Oct-Feb)",
    title: "Intern Frontend Developer",
    desc: "Joined Codelantic Pvt Ltd as Intern Frontend Developer, building dynamic web features and responsive UI components using Angular.",
  },
  {
    year: "2025 (Mar-Dec)",
    title: "Associate Software Engineer - Frontend",
    desc: "Served as Associate Software Engineer Frontend at Codelantic Pvt Ltd, engineering scalable web applications and high-performance UI components.",
  },
  {
    year: "2026 (Jun-Pres)",
    title: "Associate Product Developer - AI Fullstack",
    desc: "Joined MagickTech Pvt Ltd as Associate Product Developer (AI Fullstack), building end-to-end fullstack applications powered by AI capabilities.",
  },
];

const QUOTES_LIST = [
  {
    quote: "Sometimes you gotta run before you can walk.",
    author: "Tony Stark",
    tag: "Innovation",
  },
  {
    quote: "My armor's maneuverable, fast, and lots of fun at parties.",
    author: "Tony Stark",
    tag: "Design",
  },
  {
    quote: "I am Iron Man.",
    author: "Tony Stark",
    tag: "Identity",
  },
  {
    quote: "Part of the journey is the end.",
    author: "Tony Stark",
    tag: "Philosophy",
  },
  {
    quote: "It's an imperfect world, but it's the only one we've got.",
    author: "Tony Stark",
    tag: "Reality",
  },
];

const JARVIS_LOGS = [
  "> J.A.R.V.I.S. SYSTEM ONLINE",
  "> MARK LXXXV ARMOR INITIALIZATION SEQUENCE STARTED...",
  "> HUD TARGETING SYSTEMS: CALIBRATED",
  "> ARC REACTOR OUTPUT: 100% CAPACITY",
  "> WELCOME BACK, SIR. ALL SYSTEMS ARE OPTIMAL.",
  "> AWAITING COMMANDS...",
];

export const IronManConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("terminal");
  const [logs, setLogs] = useState<string[]>(JARVIS_LOGS);
  const [inputVal, setInputVal] = useState("");
  const [activeBlueprint, setActiveBlueprint] = useState<SuitBlueprint>(SUIT_BLUEPRINTS[0]);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTo({
        top: terminalScrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    setInputVal("");
    setLogs((prev) => [...prev, `jarvis@stark:~$ ${cmd}`]);

    if (cmd === "clear") {
      setLogs([]);
      return;
    }

    if (cmd === "history" || cmd === "origin") {
      setActiveTab("history");
      setLogs((prev) => [...prev, "> SWITCHED TO STARK ARCHIVE"]);
    } else if (cmd === "quotes" || cmd === "quote") {
      setActiveTab("quotes");
      setLogs((prev) => [...prev, "> SWITCHED TO STARK PHILOSOPHY"]);
    } else if (cmd === "suits" || cmd === "suit" || cmd === "blueprint" || cmd === "blueprints") {
      setActiveTab("blueprints");
      setLogs((prev) => [...prev, "> SWITCHED TO ARMOR SCHEMATICS"]);
    } else if (cmd === "help") {
      setLogs((prev) => [
        ...prev,
        "> AVAILABLE COMMANDS:",
        ">  - history   : Access Stark Archives",
        ">  - quotes    : Access Stark Philosophy",
        ">  - suits     : Open Armor Schematics",
        ">  - clear     : Clear terminal logs",
        ">  - help      : Print help menu",
      ]);
    } else {
      setLogs((prev) => [
        ...prev,
        `> UNKNOWN COMMAND: '${cmd}'. Type 'help' or click the tabs above.`,
      ]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs text-white selection:bg-cyan-400 selection:text-black relative bg-[#031b29]/40 stark-hud-panel p-4 overflow-hidden border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="crt-scanlines pointer-events-none mix-blend-overlay opacity-30"></div>
      
      {/* Tab Navigation Header Bar */}
      <div className="bg-[#031b29]/80 backdrop-blur-md border border-cyan-500/30 p-2 mb-3 flex flex-wrap items-center justify-between gap-2 z-10 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: "terminal", label: "J.A.R.V.I.S. STREAM", icon: TerminalIcon },
            { id: "history", label: "STARK ARCHIVES", icon: BookOpen },
            { id: "quotes", label: "STARK PHILOSOPHY", icon: Quote },
            { id: "blueprints", label: "ARMOR SCHEMATICS", icon: Cpu },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ConsoleTab)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 italic uppercase tracking-wider rounded-lg border ${
                  isActive
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                    : "bg-black/30 border-cyan-500/20 text-cyan-500/70 hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/40"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-300" : "text-cyan-600"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-cyan-400 font-bold italic tracking-widest uppercase bg-black/90 border border-cyan-400/50 px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.4)]">
          <img src={arcReactorLogo} alt="Arc Reactor" className="w-4 h-4 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse" />
          <span className="text-cyan-400 font-extrabold">J.A.R.V.I.S. HUD v8.5</span>
        </div>
      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {/* TAB 1: TERMINAL STREAM */}
          {activeTab === "terminal" && (
            <motion.div
              key="tab-terminal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden"
            >
              {/* Arc Reactor Display (Left side) */}
              <div className="hidden sm:flex w-1/3 bg-[#031b29]/40 backdrop-blur-xl border border-cyan-500/30 p-4 flex-col items-center justify-center relative overflow-hidden group rounded-2xl shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 w-32 h-32 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <img src={arcReactorLogo} alt="Arc Reactor" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-cyan-500/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                <div className="mt-12 text-center z-10 w-full">
                  <div className="text-amber-500 font-bold text-[10px] uppercase tracking-widest border-b border-amber-500/30 pb-1 mb-2">
                    MARK LXXXV DIAGNOSTIC
                  </div>
                  <div className="text-[9px] text-cyan-100/60 flex flex-col gap-1 font-mono">
                    <div className="flex justify-between"><span>ARMOR:</span> <span className="text-cyan-400">100%</span></div>
                    <div className="flex justify-between"><span>NEURAL:</span> <span className="text-cyan-400">SYNCED</span></div>
                    <div className="flex justify-between"><span>POWER:</span> <span className="text-cyan-400">OPTIMAL</span></div>
                  </div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/80" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/80" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-500/80" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/80" />
              </div>

              {/* Terminal Log Area & Input Form (Right side) */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div ref={terminalScrollRef} className="flex-1 overflow-y-auto bg-[#031b29]/40 backdrop-blur-xl border border-cyan-500/30 p-4 space-y-1.5 font-mono text-[11px] sm:text-xs shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] rounded-2xl">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        log.startsWith("jarvis@stark:") 
                          ? "text-cyan-400 font-bold"
                          : log.includes("===") || log.includes("STARK-TECH") || log.includes("J.A.R.V.I.S.")
                          ? "text-amber-500 font-extrabold uppercase py-1 border-b border-amber-500/20 text-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                          : "text-cyan-100/90"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="mt-3 flex items-center gap-2 bg-[#031b29]/80 backdrop-blur-md border border-cyan-500/40 p-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-2xl"
                >
                  <span className="text-cyan-400 font-bold text-xs pl-2 shrink-0">jarvis@stark:~$</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type command (history, quotes, suits, clear)..."
                    className="flex-1 bg-transparent border-none text-xs text-cyan-100 placeholder:text-cyan-500/50 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-extrabold flex items-center gap-1 text-xs transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)] italic uppercase rounded-xl"
                  >
                    <span>Run</span>
                    <Send className="w-3 h-3 text-black" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ORIGIN & HISTORY TIMELINE */}
          {activeTab === "history" && (
            <motion.div
              key="tab-history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-[#031b29]/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest italic border-b border-cyan-500/30 pb-2">
                <BookOpen className="w-4 h-4" />
                <span>THENUSHAN'S STARK ARCHIVES</span>
              </div>

              <div className="space-y-3 pt-1">
                {HISTORY_EVENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#010e17]/60 border border-cyan-500/20 rounded-xl p-3.5 space-y-1 hover:border-cyan-400/60 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-100 uppercase tracking-wide italic">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold italic">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-100/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: QUOTES & LORE VAULT */}
          {activeTab === "quotes" && (
            <motion.div
              key="tab-quotes"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-[#031b29]/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest italic border-b border-cyan-500/30 pb-2">
                <Quote className="w-4 h-4" />
                <span>STARK PHILOSOPHY & IDEALS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {QUOTES_LIST.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[#010e17]/60 border border-cyan-500/20 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-cyan-400/60 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  >
                    <p className="text-[11px] text-cyan-100 font-bold italic tracking-wide leading-relaxed">
                      &quot;{q.quote}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[10px]">
                      <span className="text-cyan-500/70 font-semibold">— {q.author}</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase italic tracking-widest">
                        {q.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: AUTHENTIC CAD SUIT BLUEPRINTS */}
          {activeTab === "blueprints" && (
            <motion.div
              key="tab-blueprints"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto bg-[#031b29]/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 space-y-4 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] relative"
            >
              {/* CAD Top Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest italic">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  <span>STARK INDUSTRIES // ARMOR SCHEMATICS</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold italic">
                  AUTHORIZATION: STARK
                </span>
              </div>

              {/* Suit Blueprint Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SUIT_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => setActiveBlueprint(bp)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider italic transition-all shrink-0 ${
                      activeBlueprint.id === bp.id
                        ? "bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        : "bg-black/30 border-cyan-500/20 text-cyan-500/70 hover:bg-cyan-500/10 hover:text-cyan-300"
                    }`}
                  >
                    {bp.name}
                  </button>
                ))}
              </div>

              {/* Blueprint Graphic & Engineering Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-black/60 p-4 rounded-xl border border-cyan-500/30 relative">
                {/* Left Column: Blueprint CAD Image Render */}
                <div className="md:col-span-5 relative aspect-square rounded-lg border border-cyan-500/20 bg-[#010e17] flex flex-col items-center justify-center p-3 overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="absolute inset-0 border border-cyan-500/10 pointer-events-none" />
                  <div className="absolute top-1/2 w-full h-[1px] bg-cyan-500/20" />
                  <div className="absolute left-1/2 h-full w-[1px] bg-cyan-500/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-cyan-500/40 rounded-full animate-[spin_15s_linear_infinite]" />

                  {/* Suit Image with Glow Filter */}
                  <img
                    src={activeBlueprint.img}
                    alt={activeBlueprint.name}
                    className="w-24 h-24 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] relative z-10"
                  />

                  {/* CAD Overlay Label */}
                  <div className="absolute bottom-2 left-2 text-[8px] bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 italic tracking-widest backdrop-blur-sm z-20">
                    FIG 1.1 — {activeBlueprint.designation}
                  </div>
                </div>

                {/* Right Column: Engineering Specifications & CAD Stamp */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3 text-[10px]">
                  <div className="space-y-2">
                    <div className="text-cyan-300 font-bold text-sm border-b border-cyan-500/30 pb-1 italic uppercase tracking-wider">
                      {activeBlueprint.name}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-500/70 block text-[9px] uppercase font-bold italic tracking-widest">
                          Core Technologies
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.core}</span>
                      </div>

                      <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-500/70 block text-[9px] uppercase font-bold italic tracking-widest">
                          UI & Tools
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.ui}</span>
                      </div>

                      <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-500/70 block text-[9px] uppercase font-bold italic tracking-widest">
                          Architecture
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.architecture}</span>
                      </div>

                      <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-500/70 block text-[9px] uppercase font-bold italic tracking-widest">
                          Performance
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.performance}</span>
                      </div>
                    </div>

                    {/* Engineering Notes */}
                    <div className="bg-cyan-900/10 p-2.5 rounded-lg border border-cyan-500/20 space-y-1">
                      <span className="text-amber-500 font-bold block text-[9px] uppercase italic tracking-widest">
                        JARVIS ANALYSIS NOTES:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-cyan-100/80">
                        {activeBlueprint.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CAD Title Block Stamp */}
                  <div className="bg-black/50 border border-cyan-500/40 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-cyan-300 font-mono uppercase italic tracking-widest">
                    <div>
                      <div><span className="text-cyan-500 font-bold">PROJECT:</span> MARK LXXXV CORE</div>
                      <div><span className="text-cyan-500 font-bold">DESIGNERS:</span> TONY STARK</div>
                    </div>
                    <div className="text-right">
                      <div><span className="text-cyan-500 font-bold">DRAWING NO:</span> {activeBlueprint.cadNumber}</div>
                      <div><span className="text-amber-400 font-bold">STATUS:</span> AUTHORIZED</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IronManConsole;
