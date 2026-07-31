import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpiderSuit3D } from "./SpiderSuit3D";
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
type ConsoleTab = "terminal" | "history" | "quotes" | "blueprints";

interface SuitBlueprint {
  id: string;
  name: string;
  designation: string;
  img: string;
  cadNumber: string;
  specs: {
    armor: string;
    tensile: string;
    webbing: string;
    tech: string;
    kinetic: string;
    dispenser: string;
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
      armor: "React, TypeScript, Next.js, HTML5",
      tensile: "Tailwind CSS & Framer Motion",
      webbing: "State Management (Redux/Zustand)",
      tech: "Vite, Webpack, Responsive HUD Design",
      kinetic: "SEO & High-Performance Core Optimization",
      dispenser: "Package Managers (npm, yarn)",
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
      armor: "Node.js, Express, FastAPI, Python",
      tensile: "PostgreSQL, MySQL, Redis, MongoDB",
      webbing: "RESTful APIs & GraphQL Endpoints",
      tech: "Prisma ORM & SQL Query Optimization",
      kinetic: "Server-side Security & Auth (JWT/OAuth)",
      dispenser: "API Documentation (Swagger, Postman)",
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
      armor: "OpenAI API, Claude, Llama Models",
      tensile: "LangChain & Vector DBs (Chroma/Pinecone)",
      webbing: "Structured Prompt Engineering & LLM Tuning",
      tech: "Retrieval-Augmented Generation (RAG)",
      kinetic: "Machine Learning & Automation Workflows",
      dispenser: "Python scripting & data analysis",
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
    year: "2020",
    title: "Foundational Projects & Academic Start",
    desc: "Began developing full-stack applications and AI systems, building software solutions for education management and plant disease detection using deep learning.",
  },
  {
    year: "2021",
    title: "Web Developer Core",
    desc: "Joined Creative Agency Co. to deliver high-performance web applications using React, TypeScript, and Node.js, improving page load speeds by 45%.",
  },
  {
    year: "2022",
    title: "QA Automation & Reliability",
    desc: "Optimized application reliability at Digital Innovations Inc. by designing Cypress/Jest test suites and building automated CI/CD pipelines.",
  },
  {
    year: "2023",
    title: "Prompt Engineering Specialist",
    desc: "Engineered 100+ production-grade prompts and agent chains using LangChain, Claude, and GPT models to reduce hallucination and automate tasks.",
  },
  {
    year: "2023 - Pres.",
    title: "Business Requirements & Client Delivery",
    desc: "Led digital transformation projects at Tech Solutions Ltd., authoring comprehensive BRDs, facilitating 25+ client workshops, and bridging business needs with tech implementation.",
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

const INITIAL_LOGS = [
  "> STARK-TECH SPIDER-SUIT HUD OS v2.4 INITIALIZED",
  "> NEURAL LINK: CONNECTED [USER: THENUSHAN SRITHARAN]",
  "> WEBSHOOTER PRESSURE: 350 PSI [OPTIMAL]",
  "> SPIDER-SENSE PRECOGNITIVE GRID: ONLINE",
  "> USE THE TABS ABOVE TO SWITCH BETWEEN TERMINAL, HISTORY, QUOTES, AND BLUEPRINTS!",
];

export const SpideyTerminalConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("terminal");
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
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
    setLogs((prev) => [...prev, `spidey@hud:~$ ${cmd}`]);

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
    <div className="w-full h-full flex flex-col font-mono text-xs text-white selection:bg-red-500 selection:text-black">
      {/* Tab Navigation Header Bar */}
      <div className="bg-[#140608] border border-red-500/40 rounded-xl p-2 mb-3 shadow-[0_0_20px_rgba(220,38,38,0.25)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: "terminal", label: "Terminal Stream", icon: TerminalIcon },
            { id: "history", label: "Origin & History", icon: BookOpen },
            { id: "quotes", label: "Quotes & Lore", icon: Quote },
            { id: "blueprints", label: "CAD Suit Blueprints", icon: Cpu },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ConsoleTab)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-blue-600 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-red-500/30"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-red-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-white/50 pr-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>STARK HUD v2.4</span>
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
              <div className="hidden sm:flex w-1/3 bg-black/60 border border-red-500/20 rounded-xl p-4 flex-col items-center justify-center shadow-inner relative overflow-hidden group">
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
                <div ref={terminalScrollRef} className="flex-1 overflow-y-auto bg-black/70 border border-red-500/20 rounded-xl p-4 space-y-1.5 font-mono text-[11px] sm:text-xs shadow-inner">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        log.startsWith("spidey@hud:")
                          ? "text-blue-400 font-bold"
                          : log.includes("===") || log.includes("STARK-TECH")
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
                  className="mt-3 flex items-center gap-2 bg-[#120507] border border-red-500/30 rounded-xl p-2 shadow-md"
                >
                  <span className="text-red-400 font-bold text-xs pl-2 shrink-0">spidey@hud:~$</span>
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
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 rounded-lg text-white font-bold flex items-center gap-1 text-xs transition-colors shadow"
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
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-black/60 border border-red-500/20 rounded-xl p-4 shadow-inner"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider border-b border-red-500/20 pb-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                <span>THENUSHAN'S JOURNEY & HISTORICAL CHRONICLES</span>
              </div>

              <div className="space-y-3 pt-1">
                {HISTORY_EVENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#160709]/80 border border-red-500/20 rounded-lg p-3.5 space-y-1 shadow-sm hover:border-red-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
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
              className="flex-1 overflow-y-auto pr-1 space-y-3 bg-black/60 border border-red-500/20 rounded-xl p-4 shadow-inner"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider border-b border-red-500/20 pb-2">
                <Quote className="w-4 h-4 text-red-500" />
                <span>ENGINEERING PHILOSOPHIES & FAMOUS ARCHIVES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {QUOTES_LIST.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[#18080a]/90 border border-red-500/30 rounded-lg p-3.5 space-y-2 flex flex-col justify-between shadow-sm hover:border-red-500/50 transition-colors"
                  >
                    <p className="text-[11px] text-red-100 font-serif italic leading-relaxed">
                      &quot;{q.quote}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                      <span className="text-white/60 font-semibold">— {q.author}</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
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
              className="flex-1 overflow-y-auto bg-[#071322] border-2 border-cyan-500/40 rounded-xl p-4 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative text-cyan-200 bg-[linear-gradient(to_right,#0f243a_1px,transparent_1px),linear-gradient(to_bottom,#0f243a_1px,transparent_1px)] bg-[size:18px_18px]"
            >
              {/* CAD Top Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-widest">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>THENUSHAN'S LABS // ARCHITECTURAL TECH STACK BLUEPRINTS</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  SCALE 1:1 FULL BLUEPRINT
                </span>
              </div>

              {/* Suit Blueprint Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SUIT_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => setActiveBlueprint(bp)}
                    className={`px-3 py-1.5 rounded-md border text-[10px] font-bold transition-all shrink-0 ${
                      activeBlueprint.id === bp.id
                        ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        : "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50"
                    }`}
                  >
                    {bp.name}
                  </button>
                ))}
              </div>

              {/* Blueprint Graphic & Engineering Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-[#050e18]/90 p-4 rounded-lg border border-cyan-500/30 relative">
                {/* Crosshair Corner Details */}
                <span className="absolute top-1 left-2 text-[10px] text-cyan-500/50">+ 00.00</span>
                <span className="absolute top-1 right-2 text-[10px] text-cyan-500/50">+ 90.00</span>

                {/* Left Column: Blueprint CAD Image Render */}
                <div className="md:col-span-5 relative aspect-square rounded-lg border border-cyan-500/40 bg-[#040c14] flex flex-col items-center justify-center p-3 overflow-hidden shadow-inner">
                  {/* Grid Crosshairs */}
                  <div className="absolute inset-0 border border-cyan-500/20 pointer-events-none" />
                  <div className="absolute top-1/2 w-full h-[1px] bg-cyan-500/20" />
                  <div className="absolute left-1/2 h-full w-[1px] bg-cyan-500/20" />

                  {/* Suit Image with Cyan Blueprint Filter */}
                  <img
                    src={activeBlueprint.img}
                    alt={activeBlueprint.name}
                    className={`max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] ${
                      activeBlueprint.id === "stealth" ? "hue-rotate-90 brightness-75 contrast-125 saturate-50" : ""
                    }`}
                  />

                  {/* CAD Overlay Label */}
                  <div className="absolute bottom-2 left-2 text-[8px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    FIG 1.1 — {activeBlueprint.designation}
                  </div>
                </div>

                {/* Right Column: Engineering Specifications & CAD Stamp */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3 text-[10px]">
                  <div className="space-y-2">
                    <div className="text-cyan-300 font-bold text-sm border-b border-cyan-500/30 pb-1">
                      {activeBlueprint.name}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-[#081829] p-2 rounded border border-cyan-500/20">
                        <span className="text-cyan-400/70 block text-[9px] uppercase font-bold">
                          Armor Composition
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.armor}</span>
                      </div>

                      <div className="bg-[#081829] p-2 rounded border border-cyan-500/20">
                        <span className="text-cyan-400/70 block text-[9px] uppercase font-bold">
                          Tensile Capacity
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.tensile}</span>
                      </div>

                      <div className="bg-[#081829] p-2 rounded border border-cyan-500/20">
                        <span className="text-cyan-400/70 block text-[9px] uppercase font-bold">
                          Webbing Compound
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.webbing}</span>
                      </div>

                      <div className="bg-[#081829] p-2 rounded border border-cyan-500/20">
                        <span className="text-cyan-400/70 block text-[9px] uppercase font-bold">
                          Impact Dampening
                        </span>
                        <span className="text-cyan-100 font-semibold">{activeBlueprint.specs.kinetic}</span>
                      </div>
                    </div>

                    {/* Engineering Notes */}
                    <div className="bg-[#081829]/70 p-2.5 rounded border border-cyan-500/20 space-y-1">
                      <span className="text-cyan-400 font-bold block text-[9px] uppercase">
                        ENGINEERING SCHEMATIC NOTES:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-cyan-200/90">
                        {activeBlueprint.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CAD Title Block Stamp */}
                  <div className="bg-cyan-950/60 border border-cyan-500/50 rounded p-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-cyan-300 font-mono">
                    <div>
                      <div><span className="text-cyan-400 font-bold">PROJECT:</span> TECH STACK SCHEMATICS</div>
                      <div><span className="text-cyan-400 font-bold">DESIGNERS:</span> T. SRITHARAN / T. STARK</div>
                    </div>
                    <div className="text-right">
                      <div><span className="text-cyan-400 font-bold">DRAWING NO:</span> {activeBlueprint.cadNumber}</div>
                      <div><span className="text-cyan-400 font-bold">STATUS:</span> APPROVED • SCALE 1:1</div>
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

export default SpideyTerminalConsole;
