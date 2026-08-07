import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Users, Swords, Terminal, Send } from "lucide-react";
import { KatanaIcon } from "../ui/KatanaIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "oath" | "dojo" | "blade" | "log";

const LOG_LINES = [
  "◈ THREE SWORD STYLE — READY",
  "◈ DIRECTION.......... UNKNOWN",
  "◈ HONOUR............. INTACT",
  "◈ NAP................ OVERDUE",
  "",
  "State your business. I don't have all day to find my way back.",
  "Type 'help' if you're as lost as I usually am.",
];

/** Dojo framing for each real role. The facts stay the facts. */
const DOJO_FLAVOUR: Record<string, { title: string; state: string }> = {
  "associate-product-developer-magicktech": { title: "CURRENT DOJO", state: "TRAINING" },
  "associate-software-engineer-codelantic": { title: "PRIOR DOJO", state: "GRADUATED" },
  "intern-frontend-developer-codelantic": { title: "FIRST DOJO", state: "GRADUATED" },
  "software-projects": { title: "SOLO TRAINING", state: "ONGOING" },
};

const BLADE_FLAVOUR: Record<string, string> = {
  frontend: "The stance the opponent sees first. Doesn't win the fight by itself.",
  backend: "The footwork nobody watches. Lose it and everything else falls over.",
  database: "Memory that doesn't fade. Every cut, every lesson, kept.",
  ai: "A second blade in the other hand. Different style, same fight.",
  devops: "Getting the sword to the fight in one piece. Harder than it sounds.",
  uiux: "Reading the opponent before they move.",
};

const OATHS = [
  "I'll become the world's greatest swordsman. That's a promise I intend to keep.",
  "Nothing happened. I just got lost on the way here.",
  "If I have to choose between my life and my crew, I won't hesitate. Not even once.",
  "Losing is not an option I carry with me.",
  "I'm not afraid of dying. I'm afraid of dying without becoming what I promised I'd be.",
];

const VITALS = [
  { label: "Resolve", value: 100, note: "Unshaken" },
  { label: "Direction", value: 12, note: "Concerning" },
  { label: "Blade Edge", value: 97, note: "Sharpened" },
];

const TABS = [
  { id: "oath", label: "Oath", icon: Compass },
  { id: "dojo", label: "Dojo", icon: Users },
  { id: "blade", label: "Blade", icon: Swords },
  { id: "log", label: "Log", icon: Terminal },
] as const;

/** Shared entry transition — every pane moves the same way or it reads as noise. */
const PANE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

/**
 * Zoro mode's main surface: a hanging scroll, not a panel.
 *
 * `.zk-scroll` is the whole container — paper grain and lacquered dowels
 * top and bottom rather than a border, because a scroll doesn't have edges
 * the way a card does. The Santoryu cut (`.zk-cut`) stands in for every
 * divider Deadpool's caption box or Luffy's flag would otherwise use.
 */
export const ZoroConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("oath");
  const [logs, setLogs] = useState<string[]>(LOG_LINES);
  const [inputVal, setInputVal] = useState("");
  const [activeBlade, setActiveBlade] = useState(skillCategories[0]);
  const [oathIdx, setOathIdx] = useState(0);
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
    setLogs((prev) => [...prev, `zoro@dojo:~◈ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "Try one of these. I make no promises about the rest:",
          "  dojo     — every dojo I've trained in",
          "  blade    — what I've sharpened",
          "  oath     — the promise itself",
          "  reach    — how to find me (good luck)",
          "  nap      — no",
          "  clear    — forget this happened"
        );
        return;
      case "dojo":
      case "work":
      case "history":
        setActiveTab("dojo");
        say("◈ Opening the dojo record. Don't ask how long that took to find.");
        return;
      case "blade":
      case "skills":
        setActiveTab("blade");
        say("◈ Here's what's sharp.");
        return;
      case "oath":
        setActiveTab("oath");
        say("◈ Still standing.");
        return;
      case "reach":
      case "contact":
        say(`◈ Send word to: ${personal.email}`, "◈ I'll get there. Eventually. Possibly via the wrong door.");
        return;
      case "nap":
        say("◈ No.", "◈ ...five minutes.");
        return;
      default:
        say(`◈ '${cmd}' isn't a technique I know. Try 'help'.`);
    }
  };

  return (
    <div className="zk-scroll relative w-full overflow-hidden">
      <div className="zk-scroll-rod" />

      <div className="relative px-4 py-5 sm:px-8 sm:py-7">
        {/* ── Masthead ────────────────────────────────────────── */}
        <header className="relative z-[2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <KatanaIcon className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="text-2xl leading-none sm:text-3xl">Santoryu</h3>
              <div className="zk-label mt-0.5">Three Sword Style</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--z-haramaki)]"
            />
            <span className="font-mono text-[10px] tracking-[0.18em] zk-muted">
              WOKOU HELD
            </span>
          </div>
        </header>

        <div className="zk-cut relative z-[2] mt-3" />

        {/* ── Tabs ────────────────────────────────────────────── */}
        <nav className="relative z-[2] mt-4 flex flex-wrap items-center gap-1.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-active={isActive}
                aria-pressed={isActive}
                className="zk-tag zk-press flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] sm:text-xs"
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-[2] mt-4 min-h-[340px] sm:min-h-[360px]">
          <AnimatePresence mode="wait">
            {/* ── OATH ────────────────────────────────────────── */}
            {activeTab === "oath" && (
              <motion.div key="tab-oath" {...PANE} className="flex flex-col">
                <div className="grid grid-cols-3 gap-3 sm:gap-5">
                  {VITALS.map((stat) => (
                    <div key={stat.label} className="zk-sunken px-2.5 py-2.5 sm:px-3">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="zk-label truncate text-[8px] sm:text-[9px]">
                          {stat.label}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] zk-ink">
                          {stat.value}%
                        </span>
                      </div>
                      <div className="zk-meter mt-1.5 h-[3px]">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="mt-1 truncate font-mono text-[9px] zk-muted">
                        {stat.note}
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={oathIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 max-w-lg border-l-2 border-[var(--z-haramaki)] pl-3"
                  >
                    <p className="text-base leading-snug zk-ink sm:text-lg">
                      “{OATHS[oathIdx]}”
                    </p>
                  </motion.blockquote>
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-2">
                  {OATHS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setOathIdx(i)}
                      aria-label={`Oath ${i + 1}`}
                      aria-pressed={i === oathIdx}
                      className={`h-[3px] rounded-full transition-all ${
                        i === oathIdx
                          ? "w-6 bg-[var(--z-ink)]"
                          : "w-[3px] bg-[var(--z-line-2)] hover:bg-[var(--z-muted)]"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── DOJO: real experience ───────────────────────── */}
            {activeTab === "dojo" && (
              <motion.div
                key="tab-dojo"
                {...PANE}
                className="scrollbar-thin h-full overflow-y-auto pr-1"
                style={{ maxHeight: 360 }}
              >
                <div className="flex flex-col gap-3">
                  {experiences.map((exp) => {
                    const flavour = DOJO_FLAVOUR[exp.id];
                    const training = flavour?.state === "TRAINING";
                    return (
                      <div key={exp.id} className="zk-sunken relative p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--z-line)] pb-1.5">
                          <span className="zk-label text-[9px]">
                            {flavour?.title ?? "UNRECORDED"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                              training
                                ? "bg-[var(--z-haramaki)] text-[var(--z-ink)]"
                                : "border border-[var(--z-line-2)] zk-muted"
                            }`}
                          >
                            {flavour?.state ?? "UNKNOWN"}
                          </span>
                        </div>

                        <h4 className="text-base zk-ink sm:text-lg">{exp.role}</h4>
                        <div className="mb-2 font-mono text-[10px] zk-muted">
                          {exp.company} • {exp.period}
                        </div>
                        <p className="mb-2 text-[11px] leading-relaxed zk-body">
                          {exp.description}
                        </p>

                        <ul className="mb-2.5 flex flex-col gap-1">
                          {exp.highlights.map((h) => (
                            <li key={h} className="flex gap-2 text-[11px] leading-relaxed zk-body">
                              <span className="shrink-0 zk-steel">◈</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-sm border border-[var(--z-line)] bg-black/30 px-2 py-0.5 font-mono text-[9px] zk-muted"
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

            {/* ── BLADE: real skills ──────────────────────────── */}
            {activeTab === "blade" && (
              <motion.div key="tab-blade" {...PANE} className="flex flex-col gap-3">
                <div className="scrollbar-thin flex shrink-0 flex-wrap gap-1.5 pb-1">
                  {skillCategories.map((cat) => {
                    const isActive = activeBlade.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveBlade(cat)}
                        data-active={isActive}
                        aria-pressed={isActive}
                        className="zk-tag zk-press shrink-0 rounded-sm px-2.5 py-1.5 text-[11px]"
                      >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="zk-sunken relative flex-1 p-4">
                  <h4 className="text-lg zk-ink sm:text-xl">{activeBlade.label}</h4>
                  <p className="mb-4 mt-1.5 border-l-2 border-[var(--z-steel)] pl-2.5 text-[11px] italic leading-relaxed zk-muted">
                    {BLADE_FLAVOUR[activeBlade.id] ?? "Picked this one up somewhere. Don't ask where."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {activeBlade.skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-sm border border-[var(--z-line)] bg-black/30 px-2 py-1.5 font-mono text-[11px] zk-body"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── LOG: the terminal ───────────────────────────── */}
            {activeTab === "log" && (
              <motion.div key="tab-log" {...PANE} className="flex h-[340px] flex-col sm:h-[360px]">
                <div
                  ref={scrollRef}
                  className="zk-sunken scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed zk-body"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("zoro@")
                          ? "zk-ink"
                          : line.startsWith("◈")
                            ? "zk-muted"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="mt-2 flex shrink-0 items-center gap-2 border-t border-[var(--z-line)] pt-2"
                >
                  <span className="shrink-0 font-mono text-[11px] zk-haramaki">
                    zoro@dojo:~◈
                  </span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="speak plainly."
                    className="min-w-0 flex-1 bg-transparent font-mono text-[11px] zk-ink placeholder:text-[var(--z-muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="zk-muted shrink-0 transition-colors hover:text-[var(--z-haramaki)]"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="zk-scroll-rod" />
    </div>
  );
};

export default ZoroConsole;
