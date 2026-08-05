import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Swords, Hammer, Sparkles, Send } from "lucide-react";
import { MjolnirIcon } from "../ui/MjolnirIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "bifrost" | "sagas" | "arsenal" | "prophecy";

const BIFROST_LOG = [
  "◆ BIFRÖST BRIDGE — OBSERVATORY LINK ESTABLISHED",
  "◆ REALM.......... MIDGARD (SECTOR: WEB)",
  "◆ STORMBREAKER... SHEATHED",
  "◆ MJÖLNIR........ WORTHY BEARER CONFIRMED",
  "",
  "Speak, traveller. The archives of Asgard are open to you.",
  "Type 'help' to see what may be summoned.",
];

/** Norse framing for each real role. The facts stay the facts. */
const SAGA_FLAVOUR: Record<string, { title: string; realm: string }> = {
  "associate-product-developer-magicktech": { title: "THE SAGA OF THE THINKING FORGE", realm: "ONGOING" },
  "associate-software-engineer-codelantic": { title: "THE SAGA OF THE THOUSAND COMPONENTS", realm: "COMPLETE" },
  "intern-frontend-developer-codelantic": { title: "THE FIRST TRIAL", realm: "COMPLETE" },
  "software-projects": { title: "TALES OF THE LONG NIGHTS", realm: "ETERNAL" },
};

const WEAPON_FLAVOUR: Record<string, string> = {
  frontend: "Mjölnir. Precise, answers only to the worthy, always returns.",
  backend: "Stormbreaker. Cleaves through anything and opens the bridge.",
  database: "The Vault of Asgard. Everything is kept, everything is found.",
  ai: "The Odinforce. Immense, and best handled with respect.",
  devops: "The Bifröst. Moves what you build between realms.",
  uiux: "Gungnir. Never misses the mark it was aimed at.",
};

const PROPHECIES = [
  { text: "A hammer is only a tool. The storm was always his.", tag: "On Craft" },
  { text: "Build as though the bridge must carry armies, not messengers.", tag: "On Scale" },
  { text: "The worthy ship it. The wise ship it twice, having tested once.", tag: "On Rigour" },
  { text: "Even Asgard was refactored. Twice.", tag: "On Change" },
  { text: "Thunder is the sound arriving late. Ship the lightning.", tag: "On Speed" },
];

export const ThorConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("bifrost");
  const [logs, setLogs] = useState<string[]>(BIFROST_LOG);
  const [inputVal, setInputVal] = useState("");
  const [activeWeapon, setActiveWeapon] = useState(skillCategories[0]);
  const [prophecyIdx, setProphecyIdx] = useState(0);
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
    setLogs((prev) => [...prev, `bifrost:~⟩ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "The archives answer to these words:",
          "  sagas     — the deeds already done",
          "  arsenal   — the weapons he wields",
          "  prophecy  — what the runes advise",
          "  summon    — how to call upon him",
          "  worthy    — ask the hammer",
          "  clear     — wipe the tablet"
        );
        return;
      case "sagas":
      case "history":
      case "work":
        setActiveTab("sagas");
        say("◆ Opening the sagas.");
        return;
      case "arsenal":
      case "skills":
        setActiveTab("arsenal");
        say("◆ The armoury stands open.");
        return;
      case "prophecy":
      case "quotes":
        setActiveTab("prophecy");
        say("◆ The runes are cast.");
        return;
      case "summon":
      case "contact":
        say(`◆ Send word to: ${personal.email}`, "◆ He answers faster than thunder follows light.");
        return;
      case "worthy":
        say("◆ MJÖLNIR: You may lift it. Mind the ceiling.");
        return;
      default:
        say(`◆ The runes do not know '${cmd}'. Try 'help'.`);
    }
  };

  const TABS = [
    { id: "bifrost", label: "Bifröst", icon: Sparkles },
    { id: "sagas", label: "Sagas", icon: ScrollText },
    { id: "arsenal", label: "Arsenal", icon: Swords },
    { id: "prophecy", label: "Prophecy", icon: Hammer },
  ] as const;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#6c552f] bg-[#080f1c]/70 p-3 text-[#dceaf7] selection:bg-sky-400/50 sm:p-4">
      {/* Live current running along the top edge of the tablet */}
      <div className="thor-live-edge pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_12px_#7dd3fc]" />

      {/* Tabs as bronze plaques */}
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#6c552f]/60 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`thor-plaque flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] transition-all sm:text-xs ${
                  isActive
                    ? "!border-sky-300/80 !text-sky-100 shadow-[0_0_16px_rgba(125,211,252,0.5),inset_0_0_14px_rgba(56,189,248,0.25)]"
                    : "opacity-70 hover:opacity-100 hover:!border-[#d4af6a]/80"
                }`}
              >
                <tab.icon className={`h-3.5 w-3.5 ${isActive ? "text-sky-200" : "text-[#d4af6a]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="thor-plaque hidden items-center gap-2 rounded-md px-2.5 py-1 text-[10px] md:flex">
          <MjolnirIcon className="h-4 w-4" />
          <span>Asgard Archive</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── BIFRÖST (terminal) ───────────────────────────── */}
          {activeTab === "bifrost" && (
            <motion.div
              key="tab-bifrost"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              {/* Hammer readout */}
              <div className="hidden w-1/3 flex-col rounded-lg border border-[#6c552f]/70 bg-[#0b1424]/60 p-3 sm:flex">
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-20"
                >
                  <MjolnirIcon className="w-full drop-shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
                </motion.div>

                <div
                  className="mt-4 border-b border-[#6c552f]/70 pb-1 text-center text-[10px] tracking-[0.2em] text-[#d4af6a]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  STORM READINGS
                </div>

                <div className="mt-3 flex flex-col gap-2.5 text-[10px]">
                  {[
                    { label: "Charge", value: 100, note: "Full" },
                    { label: "Worthiness", value: 100, note: "Confirmed" },
                    { label: "Bifröst Link", value: 86, note: "Stable" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="mb-1 flex justify-between text-[#9dc3dd]">
                        <span className="tracking-wider uppercase">{stat.label}</span>
                        <span className="text-sky-200">{stat.note}</span>
                      </div>
                      <div className="h-1.5 rounded-full border border-[#6c552f]/60 bg-black/60">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#e0f2fe] shadow-[0_0_10px_#7dd3fc]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal */}
              <div className="flex flex-1 flex-col rounded-lg border border-[#6c552f]/70 bg-black/45">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-[#cfe4f5]/85"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("bifrost:")
                          ? "text-[#d4af6a]"
                          : line.startsWith("◆")
                            ? "text-sky-300"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="flex items-center gap-2 border-t border-[#6c552f]/70 bg-[#0b1424]/70 px-3 py-2"
                >
                  <span className="font-mono text-[11px] text-[#d4af6a]">bifrost:~⟩</span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="speak, and the runes will answer"
                    className="flex-1 bg-transparent font-mono text-[11px] text-sky-50 placeholder:text-sky-200/30 focus:outline-none"
                  />
                  <button type="submit" aria-label="Send" className="text-sky-300 hover:text-white">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── SAGAS (real experience) ──────────────────────── */}
          {activeTab === "sagas" && (
            <motion.div
              key="tab-sagas"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="scrollbar-thin h-full overflow-y-auto pr-1"
            >
              <div className="flex flex-col gap-3">
                {experiences.map((exp) => {
                  const flavour = SAGA_FLAVOUR[exp.id];
                  return (
                    <div
                      key={exp.id}
                      className="relative rounded-lg border border-[#6c552f]/70 bg-[#0b1424]/55 p-3 shadow-[inset_0_1px_0_rgba(212,175,106,0.25)]"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#6c552f]/50 pb-1.5">
                        <span
                          className="text-[10px] tracking-[0.18em] text-[#d4af6a]"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {flavour?.title ?? "AN UNRECORDED DEED"}
                        </span>
                        <span className="rounded border border-sky-300/50 bg-sky-400/10 px-2 py-0.5 text-[9px] tracking-widest text-sky-200">
                          {flavour?.realm ?? "UNKNOWN"}
                        </span>
                      </div>

                      <h4 className="text-sm text-sky-50">{exp.role}</h4>
                      <div className="mb-2 font-mono text-[10px] text-[#9dc3dd]">
                        {exp.company} • {exp.period}
                      </div>
                      <p className="mb-2 text-[11px] leading-relaxed text-[#cfe4f5]/70">{exp.description}</p>

                      <ul className="mb-2 flex flex-col gap-1">
                        {exp.highlights.map((h) => (
                          <li key={h} className="flex gap-2 text-[11px] text-[#cfe4f5]/75">
                            <span className="text-sky-300">◆</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-[#6c552f]/70 bg-black/40 px-1.5 py-0.5 font-mono text-[9px] text-[#d4af6a]"
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
                      className={`thor-plaque shrink-0 rounded-md px-3 py-2 text-left text-[11px] transition-all ${
                        isActive
                          ? "!border-sky-300/80 !text-sky-100 shadow-[0_0_16px_rgba(125,211,252,0.45)]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span className="mr-1.5">{cat.icon}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 rounded-lg border border-[#6c552f]/70 bg-[#0b1424]/55 p-4">
                <div
                  className="mb-1 text-[10px] tracking-[0.2em] text-[#d4af6a]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  WEAPON OF RECORD
                </div>
                <h4 className="mb-2 text-base text-sky-50">{activeWeapon.label}</h4>
                <p className="mb-4 border-l-2 border-sky-300/60 pl-2.5 text-[11px] italic text-[#cfe4f5]/75">
                  {WEAPON_FLAVOUR[activeWeapon.id] ?? "Forged for the task. Nothing more is needed."}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {activeWeapon.skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded border border-[#6c552f]/60 bg-black/40 px-2 py-1.5 font-mono text-[11px] text-[#cfe4f5]/85"
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 opacity-20">
                  <MjolnirIcon className="h-full w-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROPHECY ─────────────────────────────────────── */}
          {activeTab === "prophecy" && (
            <motion.div
              key="tab-prophecy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-5 px-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={prophecyIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="thor-tablet max-w-lg px-6 py-6 text-center"
                >
                  <p
                    className="text-lg leading-snug text-sky-50"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    “{PROPHECIES[prophecyIdx].text}”
                  </p>
                  <div className="mt-3 font-mono text-[10px] tracking-[0.25em] text-[#d4af6a]">
                    — {PROPHECIES[prophecyIdx].tag.toUpperCase()}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2.5">
                {PROPHECIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProphecyIdx(i)}
                    aria-label={`Prophecy ${i + 1}`}
                    className={`h-2 w-2 rotate-45 border transition-all ${
                      i === prophecyIdx
                        ? "border-sky-200 bg-sky-300 shadow-[0_0_10px_#7dd3fc]"
                        : "border-[#6c552f] bg-transparent hover:border-[#d4af6a]"
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

export default ThorConsole;
