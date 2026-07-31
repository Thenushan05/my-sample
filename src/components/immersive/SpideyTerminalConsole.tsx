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
    id: "classic",
    name: "Classic Red & Blue Web-Suit",
    designation: "STARK-TECH MARK I",
    img: "/classic_suit_blueprint.png",
    cadNumber: "CAD-SPIDEY-001",
    specs: {
      armor: "Tri-Weave Kevlar & Micro-Spandex",
      tensile: "350 PSI (Synthetic Webbing)",
      webbing: "Liquid Poly-Compound #4",
      tech: "Expressive HUD Shutters",
      kinetic: "88.4% Impact Dampening",
      dispenser: "Wrist Solenoid Triggers",
    },
    notes: [
      "Lightweight breathable elastane base with heat-bonded red webbing.",
      "Dual wrist-mounted mechanical web dispensers with safety cutoffs.",
      "Conveyance lens shutters synchronized with user ocular movement.",
    ],
  },
  {
    id: "ironspider",
    name: "Iron Spider Nanotech Suit",
    designation: "NANOTECH MARK III",
    img: "/iron_spider_blueprint.png",
    cadNumber: "CAD-STARK-309",
    specs: {
      armor: "Liquid Gold-Titanium Nanotech",
      tensile: "950 PSI (Reinforced Filament)",
      webbing: "Micro-Solenoid Weave",
      tech: "4 Mechanical Waldo Spider-Arms",
      kinetic: "99.2% Sub-Orbital Dampening",
      dispenser: "Pressurized Electro-Web",
    },
    notes: [
      "Stark Nanotech deployment via chest emblem housing.",
      "4 extendable robotic spider-arms for climbing, defense, and maneuvering.",
      "Integrated parachute, life support, and neural link interface.",
    ],
  },
  {
    id: "stealth",
    name: "Stealth Big Time Suit",
    designation: "OSCORP MATRIX V4",
    img: "/classic_suit_blueprint.png", // Using classic with CSS filters for stealth variant
    cadNumber: "CAD-OSCORP-882",
    specs: {
      armor: "Light-Bending Mesh & Carbon Fiber",
      tensile: "480 PSI",
      webbing: "Sound-Dampening Filament",
      tech: "Sonic Frequency Disruptor",
      kinetic: "92.0% Noise & Thermal Absorption",
      dispenser: "Silent Solenoid Valves",
    },
    notes: [
      "Bends light and sound waves to achieve complete active invisibility.",
      "Built-in sonic damping fields cancel high-frequency acoustic attacks.",
      "Variable color neon piping (Neon Green / Red alert modes).",
    ],
  },
];

const HISTORY_EVENTS = [
  {
    year: "1962",
    title: "Midtown Science Exhibit Bite",
    desc: "Peter Parker attends a public demonstration of nuclear physics and is bitten by an irradiated spider, absorbing 15x superhuman strength, agility, wall-crawling, and precognitive Spider-Sense.",
  },
  {
    year: "1962",
    title: "The Foundational Oath",
    desc: "\"With great power comes great responsibility.\" After the tragic loss of Uncle Ben, Peter vows to use his intelligence and gifts to protect the innocent.",
  },
  {
    year: "1964",
    title: "Arch-Nemeses & Sinister Six",
    desc: "Battles Green Goblin, Doctor Octopus, Electro, Sandman, Mysterio, and Kraven the Hunter. Develops specialized web formulas and tactical counters.",
  },
  {
    year: "1984",
    title: "Secret Wars & Alien Symbiote",
    desc: "Recovers the alien black suit on Battleworld, enhancing web fluid capacity and strength before discovering its parasitic nature.",
  },
  {
    year: "2018",
    title: "Into the Spider-Verse",
    desc: "\"Anyone can wear the mask.\" The multiversal Web of Life and Destiny expands across Miles Morales, Gwen Stacy, Spider-Man 2099, and parallel realities.",
  },
];

const QUOTES_LIST = [
  {
    quote: "With great power comes great responsibility.",
    author: "Uncle Ben / Peter Parker",
    tag: "Core Creed",
  },
  {
    quote: "Whatever comes our way, whatever battle we have raging inside us, we always have a choice.",
    author: "Peter Parker",
    tag: "Resilience",
  },
  {
    quote: "You can't think about saving the world. You have to think about saving one person.",
    author: "Peter Parker",
    tag: "Heroism",
  },
  {
    quote: "Anyone can wear the mask. You could wear the mask. If you didn't know that before, I hope you do now.",
    author: "Miles Morales",
    tag: "Spider-Verse",
  },
  {
    quote: "No matter how many times I get hit, I always find a way to get back up.",
    author: "Peter Parker",
    tag: "Perseverance",
  },
  {
    quote: "My Spider-Sense is tingling!",
    author: "Peter Parker",
    tag: "Precognition",
  },
  {
    quote: "It's pizza time!",
    author: "Peter Parker",
    tag: "Iconic",
  },
];

const INITIAL_LOGS = [
  "> STARK-TECH SPIDER-SUIT HUD OS v2.4 INITIALIZED",
  "> NEURAL LINK: CONNECTED [USER: PETER PARKER]",
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
                <span>SPIDER-MAN ORIGIN & HISTORICAL CHRONICLES</span>
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
                <span>SPIDER-VERSE FAMOUS QUOTES & ARCHIVES</span>
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
                  <span>STARK INDUSTRIES // ARCHITECTURAL CAD SUIT SCHEMATICS</span>
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
                      <div><span className="text-cyan-400 font-bold">PROJECT:</span> SPIDER-SUIT BLUEPRINT</div>
                      <div><span className="text-cyan-400 font-bold">DESIGNERS:</span> P. PARKER / T. STARK</div>
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
