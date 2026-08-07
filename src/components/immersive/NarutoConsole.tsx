import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, MapPinned, Flame, Terminal, Send } from "lucide-react";
import { NarutoIcon } from "../ui/NarutoIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "profile" | "village" | "jutsu" | "log";

const LOG_LINES = [
  "◈ SAGE MODE — READY",
  "◈ CHAKRA.............. STABLE",
  "◈ NINE-TAILS.......... SEALED",
  "◈ RAMEN CRAVING........ CRITICAL",
  "",
  "State your business, or I'm ordering a fourth bowl.",
  "Type 'help' — believe it.",
];

/** Village framing for each real role. The facts stay the facts. */
const VILLAGE_FLAVOUR: Record<string, { title: string; state: string }> = {
  "associate-product-developer-magicktech": { title: "CURRENT ASSIGNMENT", state: "ACTIVE" },
  "associate-software-engineer-codelantic": { title: "PRIOR ASSIGNMENT", state: "COMPLETE" },
  "intern-frontend-developer-codelantic": { title: "GENIN MISSION", state: "COMPLETE" },
  "software-projects": { title: "SOLO TRAINING", state: "ONGOING" },
};

const JUTSU_FLAVOUR: Record<string, string> = {
  frontend: "The Transformation Jutsu — what the client actually sees first.",
  backend: "The unseen chakra network. Cut it and the whole technique fails.",
  database: "A sealing scroll for memory. Nothing written here is ever lost.",
  ai: "A shadow clone that thinks on its own. Different jutsu, same nindo.",
  devops: "Getting the technique from the scroll to the battlefield in one piece.",
  uiux: "Reading the opponent's next move before they've made it.",
};

const NINDO = [
  "I'm not gonna run away. I never go back on my word — that's my ninja way.",
  "A person grows up when they're able to overcome hardships. Believe it!",
  "Hard work is worth more than natural talent, in the long run.",
  "I'll take a thousand hits if it means landing the one that counts.",
  "The pain of losing someone is what makes you strong enough to protect the rest.",
];

const VITALS = [
  { label: "Chakra", value: 96, note: "Steady" },
  { label: "Ramen Reserve", value: 8, note: "Refuel soon" },
  { label: "Resolve", value: 100, note: "Unbreakable" },
];

const TABS = [
  { id: "profile", label: "Profile", icon: ScrollText },
  { id: "village", label: "Village", icon: MapPinned },
  { id: "jutsu", label: "Jutsu", icon: Flame },
  { id: "log", label: "Log", icon: Terminal },
] as const;

/** Shared entry transition — every pane cuts in like a scroll unrolling
    open, left edge first, rather than a plain cross-fade. */
const PANE = {
  initial: { opacity: 0, clipPath: "inset(0 0 0 100%)" },
  animate: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
  exit: { opacity: 0, clipPath: "inset(0 100% 0 0)", transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] } },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
};

/**
 * Naruto mode's main surface: a Bingo Book page, not a scroll or a HUD.
 *
 * `.nt-book` is the whole container — a stitched spine and a dog-eared
 * corner rather than a plain border, because a case file has been
 * handled, not printed fresh. The fuinjutsu seal (`.nt-seal`) stands in
 * for every divider Zoro's cut-mark or Luffy's flag would otherwise use.
 */
export const NarutoConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("profile");
  const [logs, setLogs] = useState<string[]>(LOG_LINES);
  const [inputVal, setInputVal] = useState("");
  const [activeJutsu, setActiveJutsu] = useState(skillCategories[0]);
  const [nindoIdx, setNindoIdx] = useState(0);
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
    setLogs((prev) => [...prev, `naruto@konoha:~◈ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "Try one of these. Believe it:",
          "  village  — every assignment on record",
          "  jutsu    — what I've sharpened",
          "  nindo    — the way itself",
          "  reach    — how to find me",
          "  ramen    — no substitutes",
          "  clear    — forget this happened"
        );
        return;
      case "village":
      case "work":
      case "history":
        setActiveTab("village");
        say("◈ Pulling the mission record. Give it a second.");
        return;
      case "jutsu":
      case "skills":
        setActiveTab("jutsu");
        say("◈ Here's what's sharp.");
        return;
      case "nindo":
      case "oath":
        setActiveTab("profile");
        say("◈ Still standing. Still loud about it.");
        return;
      case "reach":
      case "contact":
        say(`◈ Send word to: ${personal.email}`, "◈ I'll answer between bowls.");
        return;
      case "ramen":
        say("◈ Ichiraku's open.", "◈ ...one bowl won't hurt the schedule.");
        return;
      default:
        say(`◈ '${cmd}' isn't a technique I know. Try 'help'.`);
    }
  };

  return (
    <div className="nt-book relative w-full overflow-hidden">
      <div className="relative px-4 py-5 sm:px-8 sm:py-7">
        {/* ── Masthead ────────────────────────────────────────── */}
        <header className="relative z-[2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <NarutoIcon className="h-7 w-7 shrink-0" />
            <div>
              <h3 className="text-2xl leading-none sm:text-3xl">Bingo Book</h3>
              <div className="nt-label mt-0.5">S-Rank Entry</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--n-paper-orange)] shadow-[0_0_8px_rgba(160,61,12,0.6)]"
            />
            <span className="font-mono text-[10px] tracking-[0.18em] nt-muted">
              CHAKRA FLOWING
            </span>
          </div>
        </header>

        <div className="nt-seal relative z-[2] mt-3" />

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
                className="nt-tag nt-press flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] sm:text-xs"
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-[2] mt-4 min-h-[340px] sm:min-h-[360px]">
          <AnimatePresence mode="wait">
            {/* ── PROFILE ─────────────────────────────────────── */}
            {activeTab === "profile" && (
              <motion.div key="tab-profile" {...PANE} className="flex flex-col">
                <div className="grid grid-cols-3 gap-3 sm:gap-5">
                  {VITALS.map((stat) => (
                    <div key={stat.label} className="nt-sunken px-2.5 py-2.5 sm:px-3">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="nt-label truncate text-[8px] sm:text-[9px]">
                          {stat.label}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] nt-ink">
                          {stat.value}%
                        </span>
                      </div>
                      <div className="nt-meter mt-1.5 h-[3px]">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="mt-1 truncate font-mono text-[9px] nt-muted">
                        {stat.note}
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={nindoIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 max-w-lg border-l-2 border-[var(--n-paper-orange)] pl-3"
                  >
                    <p className="text-base leading-snug nt-ink sm:text-lg">
                      "{NINDO[nindoIdx]}"
                    </p>
                  </motion.blockquote>
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-2">
                  {NINDO.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setNindoIdx(i)}
                      aria-label={`Nindo ${i + 1}`}
                      aria-pressed={i === nindoIdx}
                      className={`h-[3px] rounded-full transition-all ${
                        i === nindoIdx
                          ? "w-6 bg-[var(--n-paper-orange)]"
                          : "w-[3px] bg-[#2b1607]/25 hover:bg-[#2b1607]/45"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── VILLAGE: real experience ────────────────────── */}
            {activeTab === "village" && (
              <motion.div
                key="tab-village"
                {...PANE}
                className="scrollbar-thin h-full overflow-y-auto pr-1"
                style={{ maxHeight: 360 }}
              >
                <div className="flex flex-col gap-3">
                  {experiences.map((exp) => {
                    const flavour = VILLAGE_FLAVOUR[exp.id];
                    const active = flavour?.state === "ACTIVE";
                    return (
                      <div key={exp.id} className="nt-sunken relative p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--n-line)] pb-1.5">
                          <span className="nt-label text-[9px]">
                            {flavour?.title ?? "UNRECORDED"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                              active
                                ? "bg-[var(--n-orange)] text-[#1a0f04] shadow-[0_0_10px_rgba(255,151,54,0.6)]"
                                : "border border-[var(--n-line-2)] nt-muted"
                            }`}
                          >
                            {flavour?.state ?? "UNKNOWN"}
                          </span>
                        </div>

                        <h4 className="text-base nt-ink sm:text-lg">{exp.role}</h4>
                        <div className="mb-2 font-mono text-[10px] nt-muted">
                          {exp.company} • {exp.period}
                        </div>
                        <p className="mb-2 text-[11px] leading-relaxed nt-body">
                          {exp.description}
                        </p>

                        <ul className="mb-2.5 flex flex-col gap-1">
                          {exp.highlights.map((h) => (
                            <li key={h} className="flex gap-2 text-[11px] leading-relaxed nt-body">
                              <span className="shrink-0 nt-blue">◈</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-sm border border-[var(--n-line)] bg-black/30 px-2 py-0.5 font-mono text-[9px] nt-muted"
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

            {/* ── JUTSU: real skills ──────────────────────────── */}
            {activeTab === "jutsu" && (
              <motion.div key="tab-jutsu" {...PANE} className="flex flex-col gap-3">
                <div className="scrollbar-thin flex shrink-0 flex-wrap gap-1.5 pb-1">
                  {skillCategories.map((cat) => {
                    const isActive = activeJutsu.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveJutsu(cat)}
                        data-active={isActive}
                        aria-pressed={isActive}
                        className="nt-tag nt-press shrink-0 rounded-sm px-2.5 py-1.5 text-[11px]"
                      >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="nt-sunken relative flex-1 p-4">
                  <h4 className="text-lg nt-ink sm:text-xl">{activeJutsu.label}</h4>
                  <p className="mb-4 mt-1.5 border-l-2 border-[var(--n-blue)] pl-2.5 text-[11px] italic leading-relaxed nt-muted">
                    {JUTSU_FLAVOUR[activeJutsu.id] ?? "Picked this one up somewhere between missions."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {activeJutsu.skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-sm border border-[var(--n-line)] bg-black/30 px-2 py-1.5 font-mono text-[11px] nt-body"
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
                  className="nt-sunken scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed nt-body"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("naruto@")
                          ? "nt-ink"
                          : line.startsWith("◈")
                            ? "nt-muted"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="mt-2 flex shrink-0 items-center gap-2 border-t border-[#2b1607]/25 pt-2"
                >
                  <span className="shrink-0 font-mono text-[11px] nt-orange">
                    naruto@konoha:~◈
                  </span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="speak plainly."
                    className="min-w-0 flex-1 bg-transparent font-mono text-[11px] nt-ink placeholder:text-[var(--n-paper-muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="nt-muted shrink-0 transition-colors hover:text-[var(--n-paper-orange)]"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NarutoConsole;
