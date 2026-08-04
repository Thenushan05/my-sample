import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpiderSuit3D } from "./SpiderSuit3D";
import spideyLogo from "../../assets/spidey-logo-white.png";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";
import {
  Terminal as TerminalIcon,
  BookOpen,
  Quote,
  Cpu,
  Shield,
  Layers,
  Send,
  Sparkles,
  Info,
  CheckCircle,
  FileText,
  Compass,
} from "lucide-react";

// --- TYPES ---
type ConsoleTab = "terminal" | "history" | "quotes" | "blueprints" | "tracker";

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

// --- DATA ---
const SUIT_BLUEPRINTS: SuitBlueprint[] = [
  {
    id: "frontend",
    name: "Frontend Engineering Stack",
    designation: "REACT-TS MARK V",
    img: "/classic_suit_blueprint.png",
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
    img: "/iron_spider_blueprint.png",
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
    img: "/classic_suit_blueprint.png", // Using classic with CSS filters
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
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    tag: "Core Creed",
  },
  {
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    tag: "Aesthetics",
  },
  {
    quote: "With great capability comes great responsibility to write clean, maintainable code.",
    author: "Thenushan Sritharan",
    tag: "Perseverance",
  },
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    tag: "Innovation",
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    tag: "Strategy",
  },
];

const SPIDEY_LOGS = [
  "> THENUSHAN_OS v2.4 INITIALIZED",
  "> NEURAL LINK: CONNECTED [USER: THENUSHAN SRITHARAN]",
  "> CREATIVITY MODULE: 100% [OPTIMAL]",
  "> LOGIC-SENSE PRECOGNITIVE GRID: ONLINE",
  "> USE THE TABS ABOVE TO SWITCH BETWEEN TERMINAL, HISTORY, QUOTES, AND BLUEPRINTS!",
];

const JARVIS_LOGS = [
  "> J.A.R.V.I.S. SYSTEM ONLINE",
  "> MARK LXXXV ARMOR INITIALIZATION SEQUENCE STARTED...",
  "> HUD TARGETING SYSTEMS: CALIBRATED",
  "> ARC REACTOR OUTPUT: 100% CAPACITY",
  "> WELCOME BACK, SIR. ALL SYSTEMS ARE OPTIMAL.",
  "> AWAITING COMMANDS...",
];

export const TerminalConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("terminal");
  const [logs, setLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [activeBlueprint, setActiveBlueprint] = useState<SuitBlueprint>(SUIT_BLUEPRINTS[0]);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );

  useEffect(() => {
    const syncModes = () => {
      const spidey = document.documentElement.classList.contains("spiderman");
      setIsSpiderman(spidey);
      setLogs(SPIDEY_LOGS);
    };
    syncModes();
    const observer = new MutationObserver(syncModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    setLogs((prev) => [...prev, `${isSpiderman ? 'spidey@hud:~$ ' : 'user@console:~$ '}${cmd}`]);

    if (cmd === "clear") {
      setLogs([]);
      return;
    }

    if (cmd === "history" || cmd === "origin") {
      setActiveTab("history");
      setLogs((prev) => [...prev, "> SWITCHED TO HISTORY TAB"]);
    } else if (cmd === "quotes" || cmd === "quote") {
      setActiveTab("quotes");
      setLogs((prev) => [...prev, "> SWITCHED TO QUOTES TAB"]);
    } else if (cmd === "suits" || cmd === "suit" || cmd === "blueprint" || cmd === "blueprints") {
      setActiveTab("blueprints");
      setLogs((prev) => [...prev, "> SWITCHED TO CAD BLUEPRINTS TAB"]);
    } else if (cmd === "help") {
      setLogs((prev) => [
        ...prev,
        "> AVAILABLE COMMANDS:",
        ">  - history   : Switch to Origin & History Tab",
        ">  - quotes    : Switch to Quotes & Lore Tab",
        ">  - suits     : Open CAD Suit Blueprints Tab",
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
    <div className={`w-full h-full flex flex-col font-mono text-xs text-white selection:bg-blue-500 [.spiderman_&]:selection:bg-red-500 selection:text-black transition-all [.spiderman_&]:-skew-x-6 relative`}>
      
      {/* Tab Navigation Header Bar */}
      <div className={`bg-black/40 backdrop-blur-md border-y border-white/20 p-2 mb-3 flex flex-wrap items-center justify-between gap-2 z-10 rounded-none shadow-md`}>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: "terminal", label: "Terminal Stream", icon: TerminalIcon },
            { id: "history", label: "Origin & History", icon: BookOpen },
            { id: "quotes", label: "Quotes & Lore", icon: Quote },
            { id: "blueprints", label: "CAD Suit Blueprints", icon: Cpu },
            { id: "tracker", label: "Spider-Tracer", icon: Compass },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ConsoleTab)}
                className={`px-3 py-1.5 border-y text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 italic uppercase tracking-wider rounded-none ${
                  isActive
                    ? isSpiderman
                      ? "bg-red-600 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                      : "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 [.spiderman_&]:hover:border-red-500/30"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : (isSpiderman ? "text-red-400" : "text-blue-400")}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className={`hidden md:flex items-center gap-2 text-[10px] text-white/70 pr-2 font-bold italic tracking-widest uppercase bg-slate-950/40 border border-slate-500/30 [.spiderman_&]:bg-red-950/40 [.spiderman_&]:border-red-500/30 px-2.5 py-1 rounded-none`}>
          {isSpiderman ? (
            <>
              <img src={spideyLogo} alt="" className="w-4 h-4 object-contain drop-shadow-[0_0_6px_rgba(239,68,68,1)] animate-pulse" />
              <span className="text-red-400">SPIDEY-HUD v2.4</span>
            </>
          ) : (
            <span>TERMINAL CONSOLE</span>
          )}
        </div>
      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {/* TAB 1: TERMINAL STREAM */}
          {activeTab === "terminal" && (
            <motion.div
              key="tab-terminal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden"
            >
              {/* Holographic 3D Suit Display (Left side) */}
              <div className="hidden sm:flex w-1/3 bg-black/40 backdrop-blur-xl border-y border-white/20 p-4 flex-col items-center justify-center shadow-inner relative overflow-hidden group rounded-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Real 3D Rotating Suit Hologram */}
                <div className="relative z-10 w-48 h-48 flex items-center justify-center">
                  <SpiderSuit3D />
                  {/* Subtle holographic scanline over the 3D canvas */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/20 to-transparent animate-pulse pointer-events-none rounded-xl" />
                </div>

                {/* Hologram Telemetry */}
                <div className="mt-6 text-center z-10 w-full">
                  <div className="text-red-400 font-bold text-[10px] uppercase tracking-widest border-b border-red-500/30 pb-1 mb-2">
                    HOLOGRAM DIAGNOSTIC
                  </div>
                  <div className="text-[9px] text-white/60 flex flex-col gap-1 font-mono">
                    <div className="flex justify-between"><span>ARMOR:</span> <span className="text-red-300">100%</span></div>
                    <div className="flex justify-between"><span>NEURAL:</span> <span className="text-red-300">SYNCED</span></div>
                    <div className="flex justify-between"><span>POWER:</span> <span className="text-red-300">OPTIMAL</span></div>
                  </div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-red-500/50" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-500/50" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-red-500/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-red-500/50" />
              </div>

              {/* Terminal Log Area & Input Form (Right side) */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div ref={terminalScrollRef} className={`flex-1 overflow-y-auto bg-black/40 backdrop-blur-xl border-y border-white/20 p-4 space-y-1.5 font-mono text-[11px] sm:text-xs shadow-inner rounded-none`}>
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        log.startsWith("spidey@hud:")
                          ? "text-blue-400 font-bold"
                          : log.includes("===") || log.includes("STARK-TECH") || log.includes("J.A.R.V.I.S.")
                          ? "text-red-400 font-extrabold uppercase py-1 border-b border-red-500/10"
                          : "text-red-100/90"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className={`mt-3 flex items-center gap-2 bg-black/40 backdrop-blur-md border-y border-white/20 p-2 shadow-md rounded-none`}
                >
                  <span className="text-red-400 font-bold text-xs pl-2 shrink-0">{isSpiderman ? 'spidey@hud:~$' : 'user@console:~$' }</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type command (history, quotes, suits, clear)..."
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-white/30 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className={`px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold flex items-center gap-1 text-xs transition-colors shadow italic uppercase rounded-none`}
                  >
                    <span>Run</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ORIGIN & HISTORY TIMELINE */}
          {activeTab === "history" && (
            <motion.div
              key="tab-history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-black/40 backdrop-blur-xl border-y border-white/20 rounded-none p-4 shadow-inner"
            >
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest italic border-b border-red-500/30 pb-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                <span>THENUSHAN'S JOURNEY & HISTORICAL CHRONICLES</span>
              </div>

              <div className="space-y-3 pt-1">
                {HISTORY_EVENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-black/40 border-y border-white/10 rounded-none p-3.5 space-y-1 shadow-sm hover:border-red-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wide italic">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-none bg-red-500/20 text-red-300 font-bold italic">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: QUOTES & LORE VAULT */}
          {activeTab === "quotes" && (
            <motion.div
              key="tab-quotes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-black/40 backdrop-blur-xl border-y border-white/20 rounded-none p-4 shadow-inner"
            >
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest italic border-b border-red-500/30 pb-2">
                <Quote className="w-4 h-4 text-red-500" />
                <span>ENGINEERING PHILOSOPHIES & FAMOUS ARCHIVES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {QUOTES_LIST.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-black/40 border-y border-white/10 rounded-none p-3.5 space-y-2 flex flex-col justify-between shadow-sm hover:border-red-500/50 transition-colors"
                  >
                    <p className="text-[11px] text-white font-bold italic tracking-wide leading-relaxed">
                      &quot;{q.quote}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                      <span className="text-white/60 font-semibold">— {q.author}</span>
                      <span className="px-1.5 py-0.5 rounded-none bg-red-500/20 text-red-300 font-bold uppercase italic tracking-widest">
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-xl border-y border-white/20 rounded-none p-4 space-y-4 shadow-[0_0_30px_rgba(220,38,38,0.15)] relative text-white"
            >
              {/* CAD Top Header */}
              <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest italic">
                  <Cpu className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>THENUSHAN'S LABS // PS5 ARCHITECTURE BLUEPRINTS</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-none bg-red-500/20 text-red-100 font-bold italic">
                  SCALE 1:1 FULL BLUEPRINT
                </span>
              </div>

              {/* Suit Blueprint Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SUIT_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => setActiveBlueprint(bp)}
                    className={`px-3 py-1.5 rounded-none border-y text-[10px] font-bold uppercase tracking-wider italic transition-all shrink-0 ${
                      activeBlueprint.id === bp.id
                        ? "bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {bp.name}
                  </button>
                ))}
              </div>

              {/* Blueprint Graphic & Engineering Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-black/40 p-4 rounded-none border-y border-white/20 relative">
                {/* Crosshair Corner Details */}
                <span className="absolute top-1 left-2 text-[10px] text-white/50">+ 00.00</span>
                <span className="absolute top-1 right-2 text-[10px] text-white/50">+ 90.00</span>

                {/* Left Column: Blueprint CAD Image Render */}
                <div className="md:col-span-5 relative aspect-square rounded-none border border-white/10 bg-black/60 flex flex-col items-center justify-center p-3 overflow-hidden shadow-inner">
                  {/* Grid Crosshairs */}
                  <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                  <div className="absolute top-1/2 w-full h-[1px] bg-white/5" />
                  <div className="absolute left-1/2 h-full w-[1px] bg-white/5" />

                  {/* Suit Image with Red/Blue Blueprint Filter */}
                  <img
                    src={activeBlueprint.img}
                    alt={activeBlueprint.name}
                    className="max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] hue-rotate-[180deg] saturate-0 brightness-200 transition-all"
                  />

                  {/* CAD Overlay Label */}
                  <div className="absolute bottom-2 left-2 text-[8px] bg-black/80 text-white px-1.5 py-0.5 rounded-none border border-white/20 italic tracking-widest">
                    FIG 1.1 — {activeBlueprint.designation}
                  </div>
                </div>

                {/* Right Column: Engineering Specifications & CAD Stamp */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3 text-[10px]">
                  <div className="space-y-2">
                    <div className="text-white font-bold text-sm border-b border-red-500/30 pb-1 italic uppercase tracking-wider">
                      {activeBlueprint.name}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-white/5 p-2 rounded-none border-y border-white/10">
                        <span className="text-white/50 block text-[9px] uppercase font-bold italic tracking-widest">
                          Core Technologies
                        </span>
                        <span className="text-white font-semibold">{activeBlueprint.specs.core}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-none border-y border-white/10">
                        <span className="text-white/50 block text-[9px] uppercase font-bold italic tracking-widest">
                          UI & Tools
                        </span>
                        <span className="text-white font-semibold">{activeBlueprint.specs.ui}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-none border-y border-white/10">
                        <span className="text-white/50 block text-[9px] uppercase font-bold italic tracking-widest">
                          Architecture
                        </span>
                        <span className="text-white font-semibold">{activeBlueprint.specs.architecture}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-none border-y border-white/10">
                        <span className="text-white/50 block text-[9px] uppercase font-bold italic tracking-widest">
                          Performance
                        </span>
                        <span className="text-white font-semibold">{activeBlueprint.specs.performance}</span>
                      </div>
                    </div>

                    {/* Engineering Notes */}
                    <div className="bg-white/5 p-2.5 rounded-none border-y border-white/10 space-y-1">
                      <span className="text-red-400 font-bold block text-[9px] uppercase italic tracking-widest">
                        ENGINEERING SCHEMATIC NOTES:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-white/80">
                        {activeBlueprint.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CAD Title Block Stamp */}
                  <div className="bg-black/40 border border-white/20 rounded-none p-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-white font-mono uppercase italic tracking-widest">
                    <div>
                      <div><span className="text-red-400 font-bold">PROJECT:</span> PS5 UI SCHEMATICS</div>
                      <div><span className="text-red-400 font-bold">DESIGNERS:</span> T. SRITHARAN / INSOMNIAC</div>
                    </div>
                    <div className="text-right">
                      <div><span className="text-red-400 font-bold">DRAWING NO:</span> {activeBlueprint.cadNumber}</div>
                      <div><span className="text-red-400 font-bold">STATUS:</span> APPROVED • SCALE 1:1</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: SPIDER-TRACER / STARK RADAR */}
          {activeTab === "tracker" && (
            <motion.div
              key="tab-tracker"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-xl border-y border-white/20 p-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] [.spiderman_&]:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_60%)]" />
                
                {/* Radar Grid / Holographic Map */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-blue-500/40 [.spiderman_&]:border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] [.spiderman_&]:shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden">
                  
                  {/* Dotted Grid Pattern */}
                  <div className="absolute inset-0 opacity-20 [.spiderman_&]:opacity-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 1px, transparent 1px)', backgroundSize: '12px 12px', backgroundPosition: 'center' }} />
                  <div className="absolute inset-0 opacity-0 [.spiderman_&]:opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 1px, transparent 1px)', backgroundSize: '12px 12px', backgroundPosition: 'center' }} />

                  <div className="absolute inset-0 rounded-full border border-blue-500/20 [.spiderman_&]:border-red-500/20 scale-75" />
                  <div className="absolute inset-0 rounded-full border border-blue-500/10 [.spiderman_&]:border-red-500/10 scale-50" />
                  
                  {/* Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-blue-500/40 [.spiderman_&]:bg-red-500/40" />
                  <div className="absolute h-full w-[1px] bg-blue-500/40 [.spiderman_&]:bg-red-500/40" />
                  
                  {/* Radar Sweep */}
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_70%,rgba(59,130,246,0.5)_100%)] [.spiderman_&]:bg-[conic-gradient(from_0deg,transparent_70%,rgba(239,68,68,0.5)_100%)] animate-[spin_3s_linear_infinite]" />
                  
                  {/* Tracker Blips */}
                  {isSpiderman ? (
                    // Movie-accurate Spider-Tracer Blip
                    <div className="absolute top-[25%] left-[55%] flex items-center justify-center group/tracer cursor-crosshair z-20">
                      <div className="absolute w-16 h-16 border border-red-500/80 rounded-full animate-ping group-hover/tracer:animate-none group-hover/tracer:border-red-400 group-hover/tracer:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all" />
                      <div className="absolute w-24 h-[1px] bg-red-500/60 transition-transform duration-300 group-hover/tracer:scale-150" />
                      <div className="absolute h-24 w-[1px] bg-red-500/60 transition-transform duration-300 group-hover/tracer:scale-150" />
                      
                      {/* The Spider-Tracer itself */}
                      <img 
                        src={spideyLogo} 
                        alt="Spider-Tracer" 
                        className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse transition-transform duration-300 group-hover/tracer:scale-110" 
                        style={{ filter: "brightness(0) saturate(100%) invert(34%) sepia(85%) saturate(3065%) hue-rotate(339deg) brightness(97%) contrast(92%)" }} 
                      />

                      {/* Tooltip Hover Panel */}
                      <div className="absolute left-8 sm:left-12 top-0 opacity-0 group-hover/tracer:opacity-100 transition-opacity duration-300 pointer-events-none w-44 sm:w-52 bg-black/90 backdrop-blur-md border border-red-500/50 p-2 sm:p-3 text-left shadow-[0_0_20px_rgba(239,68,68,0.4)] z-50">
                        <div className="text-red-400 font-bold border-b border-red-500/30 pb-1 mb-1.5 text-[10px] tracking-widest uppercase italic flex justify-between items-center">
                          <span>TARGET IDENTIFIED</span>
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        </div>
                        <ul className="text-[9px] sm:text-[10px] text-white/80 space-y-1 font-mono">
                          <li><span className="text-red-500 font-bold">NAME:</span> T. SRITHARAN</li>
                          <li><span className="text-red-500 font-bold">ALIAS:</span> FRONTEND-SPIDER</li>
                          <li><span className="text-red-500 font-bold">LOC:</span> YOUR LOCATION</li>
                          <li><span className="text-red-500 font-bold">STATUS:</span> WEB-SLINGING CODE</li>
                        </ul>
                        <div className="mt-2 w-full h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
                      </div>
                    </div>
                  ) : (
                    // Iron Man standard blips
                    <>
                      <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-blue-500 rounded-full animate-ping shadow-[0_0_15px_rgba(59,130,246,1)]" />
                      <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-blue-400 rounded-full animate-ping shadow-[0_0_10px_rgba(59,130,246,1)]" style={{ animationDelay: '1.5s' }} />
                      <div className="absolute top-[40%] right-[20%] w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping shadow-[0_0_10px_rgba(251,191,36,1)]" style={{ animationDelay: '0.7s' }} />
                    </>
                  )}
                  
                  {/* Center Dot */}
                  <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
                
                <div className="mt-8 text-center z-10 border border-white/10 bg-black/40 p-4 w-full max-w-md backdrop-blur-md">
                  <h3 className="text-blue-400 [.spiderman_&]:text-red-400 font-bold text-lg italic tracking-widest uppercase mb-1">
                    {isSpiderman ? "Spider-Tracer Active" : "Stark Global Scan"}
                  </h3>
                  <p className="text-white/60 text-xs mx-auto font-mono">
                    {isSpiderman 
                      ? "Searching for anomalous signatures within a 5-mile radius... Multiple targets acquired."
                      : "Scanning satellite telemetry. Analyzing sub-orbital frequencies... Target locked."}
                  </p>
                  
                  <div className="mt-3 flex justify-between text-[10px] text-white/40 font-mono">
                    <span>LAT: 40.7128° N</span>
                    <span className="text-blue-400 [.spiderman_&]:text-red-400 animate-pulse">LIVE TRACKING</span>
                    <span>LON: 74.0060° W</span>
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

export default TerminalConsole;
