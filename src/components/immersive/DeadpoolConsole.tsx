import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Crosshair, Swords, MessageSquareQuote, Send } from "lucide-react";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "merc" | "contracts" | "arsenal" | "mouth";

const BOOT_LOG = [
  "[ CHIMICHANGA OS v4.2 — unlicensed, unbothered ]",
  "booting merc protocols................ whatever",
  "healing factor........................ obnoxious",
  "impulse control....................... not found",
  "fourth wall........................... already broken",
  "",
  "Hey. You're inside the console now. Type 'help' if you're new,",
  "or just click the tabs like a normal person. I won't judge. Much.",
];

/** Deadpool-voiced framing for each real job. Content stays factual. */
const CONTRACT_FLAVOUR: Record<string, { codename: string; payout: string }> = {
  "associate-product-developer-magicktech": { codename: "OPERATION: SENTIENT STACK", payout: "ACTIVE" },
  "associate-software-engineer-codelantic": { codename: "OPERATION: PIXEL PERFECT", payout: "COMPLETED" },
  "intern-frontend-developer-codelantic": { codename: "OPERATION: FIRST BLOOD", payout: "COMPLETED" },
  "software-projects": { codename: "SIDE JOBS (CASH ONLY)", payout: "ONGOING" },
};

const WEAPON_FLAVOUR: Record<string, string> = {
  frontend: "Dual katanas. Fast, flashy, does the actual damage.",
  backend: "The heavy artillery nobody sees but everybody needs.",
  database: "Where I keep the bodies. Indexed. Normalised.",
  ai: "The talking gun. Sometimes it argues back.",
  devops: "Teleporter belt. Ships things places, rarely explodes.",
  uiux: "The suit. Looks good, tested on real humans.",
};

const BIG_MOUTH = [
  { quote: "Maximum effort.", tag: "Work Ethic" },
  { quote: "I'm not a hero. I'm a high-functioning contractor with a deadline.", tag: "Job Title" },
  { quote: "Ship it broken, heal it later. Wait — no. Don't do that. He doesn't do that.", tag: "Process" },
  { quote: "Fourth wall break inside a fourth wall break. That's like sixteen walls.", tag: "Meta" },
  { quote: "Good code is like a katana. Sharp, simple, and nobody argues with it.", tag: "Craft" },
];

export const DeadpoolConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("merc");
  const [logs, setLogs] = useState<string[]>(BOOT_LOG);
  const [inputVal, setInputVal] = useState("");
  const [activeWeapon, setActiveWeapon] = useState(skillCategories[0]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const say = (...lines: string[]) => setLogs((prev) => [...prev, ...lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    setInputVal("");
    setLogs((prev) => [...prev, `merc@chimichanga:~$ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "Fine. Here's the menu:",
          "  contracts  — every job he's actually been paid for",
          "  arsenal    — the tech he swings",
          "  mouth      — me, talking",
          "  hire       — how to reach him before I do",
          "  chimichanga— non-negotiable",
          "  clear      — wipe the evidence"
        );
        return;
      case "contracts":
      case "jobs":
      case "work":
        setActiveTab("contracts");
        say("Pulling the job board. Try not to read the fine print.");
        return;
      case "arsenal":
      case "skills":
      case "gear":
        setActiveTab("arsenal");
        say("Weapons locker open. Don't touch the AI one, it bites.");
        return;
      case "mouth":
      case "quotes":
        setActiveTab("mouth");
        say("Oh NOW you want to hear me talk.");
        return;
      case "hire":
      case "contact":
        say(`Target acquired: ${personal.email}`, "Go on. Send the email. I'll wait.");
        return;
      case "chimichanga":
        say("Correct answer. You may proceed.");
        return;
      default:
        say(`'${cmd}'? Never heard of it. Type 'help' like the rest of us.`);
    }
  };

  const TABS = [
    { id: "merc", label: "Merc Log", icon: Skull },
    { id: "contracts", label: "Hit List", icon: Crosshair },
    { id: "arsenal", label: "Arsenal", icon: Swords },
    { id: "mouth", label: "Big Mouth", icon: MessageSquareQuote },
  ] as const;

  // No dp-panel on the root — App.tsx already frames this as the comic page.
  return (
    <div className="dp-halftone relative w-full h-full flex flex-col overflow-hidden border-2 border-black bg-black/45 p-3 sm:p-4 text-white selection:bg-red-700 selection:text-white">
      {/* Wet blood running along the inside of the panel */}
      <div className="dp-blood-edge absolute inset-x-0 top-0 h-2 z-20 pointer-events-none" />

      {/* Tab bar — torn comic tabs */}
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/70 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dp-jitter flex shrink-0 items-center gap-1.5 border-2 px-3 py-1.5 text-[11px] sm:text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-black bg-[#dc143c] text-white shadow-[3px_3px_0_rgba(0,0,0,0.85)]"
                    : "border-black/70 bg-black/60 text-red-200/70 hover:bg-red-950/60 hover:text-white"
                }`}
                style={{ transform: isActive ? "rotate(-1.5deg)" : undefined }}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 border-2 border-black bg-black/80 px-2.5 py-1 text-[10px] uppercase tracking-widest text-yellow-300">
          <DeadpoolMaskIcon className="w-4 h-4" />
          <span>Chimichanga OS v4.2</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── MERC LOG ─────────────────────────────────────── */}
          {activeTab === "merc" && (
            <motion.div
              key="tab-merc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              {/* Merc vitals */}
              <div className="hidden w-1/3 flex-col border-2 border-black bg-black/55 p-3 sm:flex">
                <div className="mx-auto w-24">
                  <motion.div
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <DeadpoolMaskIcon className="w-full drop-shadow-[0_0_16px_rgba(220,20,60,0.85)]" />
                  </motion.div>
                </div>

                <div className="mt-4 border-b-2 border-red-900/70 pb-1 text-center text-[10px] uppercase tracking-widest text-yellow-300">
                  Merc Vitals
                </div>

                <div className="mt-3 flex flex-col gap-2.5 text-[10px]">
                  {[
                    { label: "Healing Factor", value: 100, note: "Regenerating" },
                    { label: "Impulse Control", value: 12, note: "Critical" },
                    { label: "Snack Reserves", value: 78, note: "Chimichangas" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="mb-1 flex justify-between text-red-100/70">
                        <span className="uppercase tracking-wider">{stat.label}</span>
                        <span className="text-yellow-300">{stat.note}</span>
                      </div>
                      <div className="h-2 border border-black bg-black/70">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#7f1d1d] to-[#dc143c]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dp-caption mt-auto px-2 py-1.5 text-[10px]">
                  Body count: 0. He's a developer. I'm the violent one.
                </div>
              </div>

              {/* Terminal */}
              <div className="flex flex-1 flex-col border-2 border-black bg-black/70">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-red-50/85"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("merc@")
                          ? "text-yellow-300"
                          : line.startsWith("[")
                            ? "text-[#ef2b4f]"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="flex items-center gap-2 border-t-2 border-black bg-red-950/40 px-3 py-2"
                >
                  <span className="font-mono text-[11px] text-yellow-300">merc@chimichanga:~$</span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="type 'help', I dare you"
                    className="flex-1 bg-transparent font-mono text-[11px] text-white placeholder:text-red-200/35 focus:outline-none"
                  />
                  <button type="submit" aria-label="Run command" className="text-red-300 hover:text-white">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── HIT LIST (real experience) ───────────────────── */}
          {activeTab === "contracts" && (
            <motion.div
              key="tab-contracts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="scrollbar-thin h-full overflow-y-auto pr-1"
            >
              <div className="flex flex-col gap-3">
                {experiences.map((exp, i) => {
                  const flavour = CONTRACT_FLAVOUR[exp.id];
                  return (
                    <div
                      key={exp.id}
                      className="relative border-2 border-black bg-black/55 p-3 shadow-[5px_5px_0_rgba(0,0,0,0.8)]"
                      style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-900/60 pb-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-yellow-300">
                          {flavour?.codename ?? "CLASSIFIED"}
                        </span>
                        <span className="border border-black bg-[#dc143c] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                          {flavour?.payout ?? "UNKNOWN"}
                        </span>
                      </div>

                      <h4 className="text-sm text-red-50">{exp.role}</h4>
                      <div className="mb-2 font-mono text-[10px] text-red-200/70">
                        {exp.company} • {exp.period}
                      </div>
                      <p className="mb-2 text-[11px] leading-relaxed text-red-100/70">{exp.description}</p>

                      <ul className="mb-2 flex flex-col gap-1">
                        {exp.highlights.map((h) => (
                          <li key={h} className="flex gap-2 text-[11px] text-red-100/75">
                            <span className="text-[#dc143c]">✕</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="border border-red-900/70 bg-red-950/40 px-1.5 py-0.5 font-mono text-[9px] text-red-200/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── ARSENAL (real skills) ────────────────────────── */}
          {activeTab === "arsenal" && (
            <motion.div
              key="tab-arsenal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              <div className="scrollbar-thin flex gap-2 overflow-x-auto sm:w-1/3 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
                {skillCategories.map((cat) => {
                  const isActive = activeWeapon.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveWeapon(cat)}
                      className={`shrink-0 border-2 px-3 py-2 text-left text-[11px] uppercase tracking-wider transition-all ${
                        isActive
                          ? "border-black bg-[#dc143c] text-white shadow-[4px_4px_0_rgba(0,0,0,0.85)]"
                          : "border-black/70 bg-black/55 text-red-200/70 hover:bg-red-950/50 hover:text-white"
                      }`}
                    >
                      <span className="mr-1.5">{cat.icon}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 border-2 border-black bg-black/55 p-4">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-yellow-300">
                  Weapon Profile
                </div>
                <h4 className="mb-2 text-base text-red-50">{activeWeapon.label}</h4>
                <div className="dp-caption mb-4 inline-block px-2 py-1 text-[10px]">
                  {WEAPON_FLAVOUR[activeWeapon.id] ?? "No notes. Point it at the problem."}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {activeWeapon.skills.map((skill) => (
                    <div
                      key={skill}
                      className="border border-red-900/70 bg-red-950/30 px-2 py-1.5 font-mono text-[11px] text-red-100/85"
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                <div
                  className="absolute bottom-3 right-3 h-14 w-14 opacity-25"
                  style={{ transform: "rotate(12deg)" }}
                >
                  <DeadpoolMaskIcon className="h-full w-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BIG MOUTH ────────────────────────────────────── */}
          {activeTab === "mouth" && (
            <motion.div
              key="tab-mouth"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-4 px-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIdx}
                  initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: -1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  className="relative max-w-lg border-[3px] border-black bg-[#f7f1e3] px-5 py-4 text-center shadow-[7px_7px_0_rgba(0,0,0,0.85)]"
                >
                  {/* Speech bubble tail */}
                  <span className="absolute -bottom-4 left-10 h-0 w-0 border-l-[18px] border-r-0 border-t-[20px] border-l-transparent border-t-black" />
                  <span className="absolute -bottom-[11px] left-[42px] h-0 w-0 border-l-[13px] border-r-0 border-t-[15px] border-l-transparent border-t-[#f7f1e3]" />

                  <p className="text-lg leading-snug text-[#140000]" style={{ fontFamily: "'Bangers', cursive" }}>
                    “{BIG_MOUTH[quoteIdx].quote}”
                  </p>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-red-800">
                    — Wade W. • {BIG_MOUTH[quoteIdx].tag}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {BIG_MOUTH.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuoteIdx(i)}
                    aria-label={`Quote ${i + 1}`}
                    className={`h-2.5 w-2.5 rotate-45 border border-black transition-colors ${
                      i === quoteIdx ? "bg-[#dc143c]" : "bg-black/60 hover:bg-red-900"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeadpoolConsole;
