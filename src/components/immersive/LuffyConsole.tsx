import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Users, Zap, Send } from "lucide-react";
import { StrawHatIcon } from "../ui/StrawHatIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "bounty" | "crew" | "powers" | "log";

/** Berry sign. The currency mark is the fastest read in the whole poster. */
const BERRY = "Ƀ";

const LOG_LINES = [
  "◆ LOG POSE LOCKED — GRAND LINE, NEW WORLD",
  "◆ SHIP.......... SEAWORTHY",
  "◆ CREW.......... FED",
  "◆ NEXT ISLAND... UNCHARTED",
  "",
  "The log pose points wherever the work is.",
  "Ask me something. Type 'help' if you get lost.",
];

/** Pirate framing for each real role. The facts stay the facts. */
const CREW_FLAVOUR: Record<string, { title: string; state: string }> = {
  "associate-product-developer-magicktech": { title: "CURRENT SHIP", state: "ABOARD" },
  "associate-software-engineer-codelantic": { title: "PREVIOUS SHIP", state: "SAILED ON" },
  "intern-frontend-developer-codelantic": { title: "FIRST VOYAGE", state: "SAILED ON" },
  "software-projects": { title: "SIDE VOYAGES", state: "ONGOING" },
};

const POWER_FLAVOUR: Record<string, string> = {
  frontend: "What the crowd sees when we pull into port.",
  backend: "The engine room. Nobody visits. Nothing sails without it.",
  database: "The ship's log. It remembers every island.",
  ai: "A second navigator. Argues with the first one.",
  devops: "How we cross the Calm Belt without sinking.",
  uiux: "Deciding what the crew looks at first.",
};

const SHOUTS = [
  "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King.",
  "If you don't take risks, you can't create a future.",
  "Being alone is more painful than getting hurt.",
  "I'm going to be King of the Pirates.",
];

const VITALS = [
  { label: "Reach", value: 96, note: "Gum-Gum" },
  { label: "Crew", value: 88, note: "Loyal" },
  { label: "Appetite", value: 100, note: "Unmanaged" },
];

const TABS = [
  { id: "bounty", label: "Bounty", icon: Scroll },
  { id: "crew", label: "Crew", icon: Users },
  { id: "powers", label: "Powers", icon: Zap },
  { id: "log", label: "Log", icon: Send },
] as const;

/** Shared entry transition — every pane moves the same way or it reads as noise. */
const PANE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

/**
 * Luffy mode's main surface: a bounty notice nailed to a tavern board.
 *
 * The poster is the container, not a card with a poster skin. Its masthead,
 * double rule, screentone and Marine seal are the theme's four devices, and
 * the tabs are scraps of paper pinned across the top of it.
 *
 * The bounty pane is the "photo" half of a real poster — name, figure, seal.
 * Everything long lives in the panes below it, because a printed notice has
 * one loud line and a lot of small print, and that maps cleanly onto one
 * headline surface plus scrollable detail.
 */
export const LuffyConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("bounty");
  const [logs, setLogs] = useState<string[]>(LOG_LINES);
  const [inputVal, setInputVal] = useState("");
  const [activePower, setActivePower] = useState(skillCategories[0]);
  const [shoutIdx, setShoutIdx] = useState(0);
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
    setLogs((prev) => [...prev, `luffy@sunny:~◆ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "I answer to these:",
          "  crew     — every ship I have sailed on",
          "  powers   — what I can do",
          "  bounty   — the poster itself",
          "  reach    — how to reach me",
          "  meat     — yes",
          "  clear    — forget it"
        );
        return;
      case "crew":
      case "work":
      case "history":
        setActiveTab("crew");
        say("◆ Opening the crew register.");
        return;
      case "powers":
      case "skills":
        setActiveTab("powers");
        say("◆ Here is what I am made of.");
        return;
      case "bounty":
        setActiveTab("bounty");
        say("◆ Careful. It went up again.");
        return;
      case "reach":
      case "contact":
        say(`◆ Send word to: ${personal.email}`, "◆ A gull will carry it.");
        return;
      case "meat":
        say("◆ YES.", "◆ ...all of it.");
        return;
      default:
        say(`◆ '${cmd}'? Never heard of it. Try 'help'.`);
    }
  };

  return (
    <div className="op-plank relative w-full overflow-hidden rounded-sm px-3 py-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] sm:px-8 sm:py-9">
      {/* Nails holding the board to the wall */}
      {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} z-[3] h-2 w-2 rounded-full bg-[#2b1d12] shadow-[inset_-1px_-1px_0_rgba(255,255,255,0.35)]`}
        />
      ))}

      <div className="op-poster op-pinned relative z-[2] mx-auto w-full max-w-3xl px-4 py-5 sm:px-8 sm:py-7">
        <div className="op-screentone" />

        {/* ── Masthead ────────────────────────────────────────
            The three fixed lines every one of these notices carries. */}
        <header className="relative z-[2] text-center">
          <div className="op-masthead text-4xl sm:text-6xl">Wanted</div>
          <div className="op-label mt-1 text-[10px] sm:text-xs">Dead or Alive</div>
          <div className="mx-auto mt-2 h-[3px] w-full max-w-md bg-[var(--l-ink)]" />
        </header>

        {/* ── Tabs, pinned across the notice ──────────────── */}
        <nav className="relative z-[2] mt-4 flex flex-wrap items-center justify-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-active={isActive}
                aria-pressed={isActive}
                className="op-scrap op-gum flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[11px]"
              >
                <tab.icon className="h-3 w-3 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-[2] mt-4 min-h-[330px] sm:min-h-[350px]">
          <AnimatePresence mode="wait">
            {/* ── BOUNTY: the poster's own face ───────────── */}
            {activeTab === "bounty" && (
              <motion.div key="tab-bounty" {...PANE} className="flex flex-col items-center">
                {/* The "photo" frame. A halftone sunburst behind the hat does
                    the job the character portrait would, without pretending
                    to be artwork this project does not have — and without
                    leaving the panel a flat, unstyled box the way a plain
                    tint did. */}
                <div className="op-burst relative flex h-[136px] w-full max-w-[300px] items-center justify-center overflow-hidden border-2 border-[var(--l-ink)] sm:h-[156px]">
                  <div className="op-speed" />
                  <div className="op-linetone" />
                  <StrawHatIcon className="relative z-[2] w-24 drop-shadow-[3px_3px_0_rgba(36,26,16,0.3)] sm:w-28" />
                </div>

                <h3 className="op-masthead mt-3 text-center text-2xl sm:text-4xl">
                  {personal.name ?? "Thenushan Sritharan"}
                </h3>

                <div className="op-field mt-2 flex w-full max-w-md items-center justify-center gap-2 px-3 py-1.5">
                  <span className="op-bounty text-xl sm:text-3xl">
                    {BERRY}1,500,000,000
                  </span>
                  <span className="op-label text-[9px]">Berries</span>
                </div>

                <div className="mt-4 grid w-full max-w-md grid-cols-3 gap-3">
                  {VITALS.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="op-label truncate text-[8px] sm:text-[9px]">
                          {stat.label}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] op-ink">
                          {stat.value}
                        </span>
                      </div>
                      {/* Inked bar on paper — a printed meter, not a glowing one */}
                      <div className="mt-1 h-[5px] border border-[var(--l-line-2)] bg-[rgba(36,26,16,0.06)]">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="block h-full bg-[var(--l-ink)]"
                        />
                      </div>
                      <div className="mt-0.5 truncate font-mono text-[8px] op-faint">
                        {stat.note}
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={shoutIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-5 max-w-md border-l-[3px] border-[var(--l-red)] pl-3 text-center"
                  >
                    <p className="text-[11px] italic leading-relaxed op-body">
                      “{SHOUTS[shoutIdx]}”
                    </p>
                  </motion.blockquote>
                </AnimatePresence>

                <div className="mt-3 flex items-center gap-2">
                  {SHOUTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setShoutIdx(i)}
                      aria-label={`Shout ${i + 1}`}
                      aria-pressed={i === shoutIdx}
                      className={`h-[7px] border border-[var(--l-ink)] transition-all ${
                        i === shoutIdx
                          ? "w-6 bg-[var(--l-ink)]"
                          : "w-[7px] bg-transparent hover:bg-[rgba(36,26,16,0.25)]"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── CREW: real experience ──────────────────── */}
            {activeTab === "crew" && (
              <motion.div
                key="tab-crew"
                {...PANE}
                className="scrollbar-thin max-h-[350px] overflow-y-auto pr-1"
              >
                <div className="flex flex-col gap-3">
                  {experiences.map((exp) => {
                    const flavour = CREW_FLAVOUR[exp.id];
                    const aboard = flavour?.state === "ABOARD";
                    return (
                      <div
                        key={exp.id}
                        className="relative border border-[var(--l-line-2)] bg-[rgba(36,26,16,0.04)] p-3"
                      >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[var(--l-line-2)] pb-1.5">
                          <span className="op-label text-[9px]">
                            {flavour?.title ?? "UNRECORDED"}
                          </span>
                          <span
                            className={`px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                              aboard
                                ? "bg-[var(--l-red)] text-[#fff6e2]"
                                : "border border-[var(--l-line-2)] op-muted"
                            }`}
                          >
                            {flavour?.state ?? "UNKNOWN"}
                          </span>
                        </div>

                        <h4 className="text-base op-ink sm:text-lg">{exp.role}</h4>
                        <div className="mb-2 font-mono text-[10px] op-faint">
                          {exp.company} • {exp.period}
                        </div>
                        <p className="mb-2 text-[11px] leading-relaxed op-body">
                          {exp.description}
                        </p>

                        <ul className="mb-2.5 flex flex-col gap-1">
                          {exp.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex gap-2 text-[11px] leading-relaxed op-body"
                            >
                              <span className="shrink-0 op-red">◆</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="border border-[var(--l-line)] bg-[rgba(36,26,16,0.05)] px-2 py-0.5 font-mono text-[9px] op-muted"
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

            {/* ── POWERS: real skills ────────────────────── */}
            {activeTab === "powers" && (
              <motion.div key="tab-powers" {...PANE} className="flex flex-col gap-3">
                <div className="scrollbar-thin flex shrink-0 flex-wrap gap-1.5 pb-1">
                  {skillCategories.map((cat) => {
                    const isActive = activePower.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActivePower(cat)}
                        data-active={isActive}
                        aria-pressed={isActive}
                        className="op-scrap op-gum shrink-0 px-2.5 py-1 text-[10px]"
                      >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative border border-[var(--l-line-2)] bg-[rgba(36,26,16,0.04)] p-4">
                  <div className="op-linetone" />
                  <h4 className="relative z-[2] text-xl op-ink sm:text-2xl">
                    {activePower.label}
                  </h4>
                  <p className="relative z-[2] mb-4 mt-1.5 border-l-[3px] border-[var(--l-red)] pl-2.5 text-[11px] italic leading-relaxed op-muted">
                    {POWER_FLAVOUR[activePower.id] ?? "Picked this one up somewhere."}
                  </p>

                  <div className="relative z-[2] grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {activePower.skills.map((skill) => (
                      <div
                        key={skill}
                        className="border border-[var(--l-line)] bg-[var(--l-paper)] px-2 py-1.5 font-mono text-[11px] op-body"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── LOG: the terminal ──────────────────────── */}
            {activeTab === "log" && (
              <motion.div key="tab-log" {...PANE} className="flex h-[350px] flex-col">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin min-h-0 flex-1 overflow-y-auto border border-[var(--l-line-2)] bg-[rgba(36,26,16,0.04)] p-3 font-mono text-[11px] leading-relaxed op-body"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("luffy@")
                          ? "op-ink"
                          : line.startsWith("◆")
                            ? "op-muted"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="mt-2 flex shrink-0 items-center gap-2 border-t border-dashed border-[var(--l-line-2)] pt-2"
                >
                  <span className="shrink-0 font-mono text-[11px] op-red">luffy@sunny:~◆</span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="say something."
                    className="min-w-0 flex-1 bg-transparent font-mono text-[11px] op-ink placeholder:text-[var(--l-faint)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="op-muted shrink-0 transition-colors hover:text-[var(--l-red)]"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer: the government's small print + the seal ── */}
        <footer className="relative z-[2] mt-5 flex items-end justify-between gap-3 border-t-[3px] border-[var(--l-ink)] pt-2.5">
          <div className="op-label text-[8px] leading-relaxed sm:text-[9px]">
            Marine HQ
            <br />
            World Government
          </div>

          <div className="op-stamp flex h-16 w-16 shrink-0 flex-col items-center justify-center text-center text-[7px] leading-[1.15] sm:h-20 sm:w-20 sm:text-[8px]">
            <span>Marine</span>
            <span className="text-[9px] sm:text-[11px]">認可</span>
            <span>Issued</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LuffyConsole;
