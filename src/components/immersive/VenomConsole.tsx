import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Biohazard, ScrollText, Dna, MessagesSquare, Send } from "lucide-react";
import { VenomSpiderIcon } from "../ui/VenomSpiderIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

type ConsoleTab = "bond" | "hosts" | "traits" | "voices";

const BOND_LOG = [
  "◈ SYMBIOTE LINK ESTABLISHED — KLYNTAR STRAIN V-01",
  "◈ HOST......... COMPATIBLE. UNUSUALLY SO.",
  "◈ BOND DEPTH... 98%",
  "◈ APPETITE..... MANAGED",
  "",
  "We are inside the terminal now. We can read what he reads.",
  "Ask us something. Type 'help' and we will be patient.",
];

/** Symbiote framing for each real role. The facts stay the facts. */
const HOST_FLAVOUR: Record<string, { title: string; state: string }> = {
  "associate-product-developer-magicktech": { title: "CURRENT BOND", state: "ACTIVE" },
  "associate-software-engineer-codelantic": { title: "PRIOR BOND", state: "RELEASED" },
  "intern-frontend-developer-codelantic": { title: "FIRST CONTACT", state: "RELEASED" },
  "software-projects": { title: "THINGS WE DID AT NIGHT", state: "ONGOING" },
};

const TRAIT_FLAVOUR: Record<string, string> = {
  frontend: "The skin we wear in public. It has to look right.",
  backend: "The organs. Nobody sees them. Everything dies without them.",
  database: "Our memory. We forget nothing. Ever.",
  ai: "Another mind in here. Crowded, but useful.",
  devops: "How we move between hosts without dying in transit.",
  uiux: "How we decide what the prey sees first.",
};

const VOICES = [
  { line: "We do not ask permission. We ask for scope.", tag: "On Ownership" },
  { line: "Everything we consume, we keep. That is what a codebase is.", tag: "On Memory" },
  { line: "Two minds reviewing one pull request. We rarely agree. It ships better.", tag: "On Review" },
  { line: "We could eat the legacy service. We choose to refactor it. Slowly.", tag: "On Restraint" },
  { line: "There is no lone genius. There is only WE.", tag: "On Teams" },
];

const VITALS = [
  { label: "Bond Depth", value: 98, note: "Fused" },
  { label: "Host Control", value: 61, note: "Negotiated" },
  { label: "Appetite", value: 84, note: "Managed" },
];

const TABS = [
  { id: "bond", label: "The Bond", icon: Biohazard },
  { id: "hosts", label: "Hosts", icon: ScrollText },
  { id: "traits", label: "Traits", icon: Dna },
  { id: "voices", label: "Voices", icon: MessagesSquare },
] as const;

/** Shared entry transition — every pane moves the same way or it reads as noise. */
const PANE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

export const VenomConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("bond");
  const [logs, setLogs] = useState<string[]>(BOND_LOG);
  const [inputVal, setInputVal] = useState("");
  const [activeTrait, setActiveTrait] = useState(skillCategories[0]);
  const [voiceIdx, setVoiceIdx] = useState(0);
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
    setLogs((prev) => [...prev, `we@symbiote:~◈ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "We answer to these:",
          "  hosts    — every bond he has formed",
          "  traits   — what we can do together",
          "  voices   — the two of us, talking",
          "  bond     — how to reach the host",
          "  eat      — do not",
          "  clear    — forget this conversation"
        );
        return;
      case "hosts":
      case "history":
      case "work":
        setActiveTab("hosts");
        say("◈ Opening the bond record.");
        return;
      case "traits":
      case "skills":
        setActiveTab("traits");
        say("◈ Showing you what we are made of.");
        return;
      case "voices":
      case "quotes":
        setActiveTab("voices");
        say("◈ Both of us, then.");
        return;
      case "bond":
      case "contact":
        say(`◈ Reach the host at: ${personal.email}`, "◈ We will make sure he sees it.");
        return;
      case "eat":
        say("◈ We said do not.", "◈ ...we are considering it.");
        return;
      default:
        say(`◈ '${cmd}' means nothing to us. Try 'help'.`);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px_10px_24px_12px/12px_22px_10px_20px] border border-[var(--v-line-2)] bg-white/90 text-[var(--v-body)]">
      {/* Wet highlight along the top of the mass */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--v-line-3)] to-transparent" />

      {/* ── Brand bar ─────────────────────────────────────────
          Identity on the left, live bond readout on the right. The tabs
          used to live up here too, which left the header doing three jobs
          in one row; they have their own rail now. */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--v-line)] px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="shrink-0"
          >
            <VenomSpiderIcon className="h-5 w-5 text-[var(--v-ink)]" />
          </motion.div>
          <span
            className="truncate text-sm tracking-[0.14em] text-[var(--v-ink)] sm:text-base"
            style={{ fontFamily: "'Creepster', cursive" }}
          >
            We Are Venom
          </span>
          <span className="hidden shrink-0 font-mono text-[10px] tracking-widest text-[var(--v-faint)] md:inline">
            KLYNTAR // V-01
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--v-accent)]"
          />
          <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--v-muted)]">
            BOND 98%
          </span>
        </div>
      </header>

      {/* ── Rail + pane ───────────────────────────────────────
          Horizontal scroller on mobile, vertical rail from sm up. */}
      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <nav className="scrollbar-thin flex shrink-0 gap-1.5 overflow-x-auto border-b border-[var(--v-line)] px-3 py-2 sm:w-[8.5rem] sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:border-b-0 sm:border-r sm:px-2 sm:py-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-active={isActive}
                aria-pressed={isActive}
                className="venom-chip venom-tab flex shrink-0 items-center gap-2 px-3 py-2 text-[11px] sm:w-full sm:text-xs"
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}

          <div className="venom-label mt-auto hidden px-1 pt-4 text-[9px] leading-relaxed sm:block">
            Two minds.
            <br />
            One console.
          </div>
        </nav>

        <div className="relative min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
          <AnimatePresence mode="wait">
            {/* ── THE BOND (vitals + terminal) ───────────────── */}
            {activeTab === "bond" && (
              <motion.div key="tab-bond" {...PANE} className="flex h-full flex-col gap-3">
                {/* Vitals read across the top now — three equal cards instead
                    of a sidebar, which the tab rail already occupies. */}
                <div className="grid shrink-0 grid-cols-3 gap-2">
                  {VITALS.map((stat) => (
                    <div key={stat.label} className="venom-sunken px-2.5 py-2">
                      <div className="venom-label text-[8px] sm:text-[9px]">{stat.label}</div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span
                          className="text-base leading-none text-[var(--v-ink)] sm:text-lg"
                          style={{ fontFamily: "'Creepster', cursive" }}
                        >
                          {stat.value}%
                        </span>
                        <span className="truncate font-mono text-[9px] text-[var(--v-faint)]">
                          {stat.note}
                        </span>
                      </div>
                      <div className="venom-meter mt-1.5 h-1.5">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terminal */}
                <div className="venom-sunken flex min-h-0 flex-1 flex-col bg-white/70">
                  <div
                    ref={scrollRef}
                    className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-[var(--v-body)]"
                  >
                    {logs.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.startsWith("we@")
                            ? "text-[var(--v-ink)] font-semibold"
                            : line.startsWith("◈")
                              ? "text-[var(--v-muted)]"
                              : ""
                        }
                      >
                        {line || " "}
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleCommand}
                    className="flex shrink-0 items-center gap-2 border-t border-[var(--v-line)] px-3 py-2"
                  >
                    <span className="shrink-0 font-mono text-[11px] text-[var(--v-accent)]">
                      we@symbiote:~◈
                    </span>
                    <input
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="speak. we are listening."
                      className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[var(--v-ink)] placeholder:text-[var(--v-faint)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Send"
                      className="venom-muted shrink-0 transition-colors hover:text-[var(--v-accent)]"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── HOSTS (real experience) ────────────────────── */}
            {activeTab === "hosts" && (
              <motion.div
                key="tab-hosts"
                {...PANE}
                className="scrollbar-thin h-full overflow-y-auto pr-1"
              >
                {/* A spine runs down the left with a node per bond, so the
                    roles read as a sequence rather than four loose cards. */}
                <div className="relative flex flex-col gap-3 pl-5">
                  <span className="absolute bottom-2 left-[3px] top-2 w-px bg-[var(--v-line-2)]" />

                  {experiences.map((exp) => {
                    const flavour = HOST_FLAVOUR[exp.id];
                    const isActive = flavour?.state === "ACTIVE";
                    return (
                      <div key={exp.id} className="relative">
                        <span
                          className={`absolute -left-5 top-3 h-[7px] w-[7px] rounded-full ${
                            isActive
                              ? "bg-[var(--v-accent)] ring-4 ring-[rgba(180,18,26,0.14)]"
                              : "bg-[var(--v-line-3)]"
                          }`}
                        />

                        <div className="venom-sunken bg-white/60 p-3">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="venom-label text-[9px]">
                              {flavour?.title ?? "UNRECORDED"}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                                isActive
                                  ? "bg-[var(--v-ink)] text-white"
                                  : "border border-[var(--v-line-2)] text-[var(--v-muted)]"
                              }`}
                            >
                              {flavour?.state ?? "UNKNOWN"}
                            </span>
                          </div>

                          <h4 className="text-sm text-[var(--v-ink)]">{exp.role}</h4>
                          <div className="mb-2 font-mono text-[10px] text-[var(--v-faint)]">
                            {exp.company} • {exp.period}
                          </div>
                          <p className="mb-2 text-[11px] leading-relaxed text-[var(--v-body)]">
                            {exp.description}
                          </p>

                          <ul className="mb-2.5 flex flex-col gap-1">
                            {exp.highlights.map((h) => (
                              <li
                                key={h}
                                className="flex gap-2 text-[11px] leading-relaxed text-[var(--v-body)]"
                              >
                                <span className="shrink-0 text-[var(--v-accent)]">◈</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border border-[var(--v-line)] bg-white px-2 py-0.5 font-mono text-[9px] text-[var(--v-muted)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── TRAITS (real skills) ───────────────────────── */}
            {activeTab === "traits" && (
              <motion.div key="tab-traits" {...PANE} className="flex h-full flex-col gap-3">
                <div className="scrollbar-thin flex shrink-0 gap-1.5 overflow-x-auto pb-1">
                  {skillCategories.map((cat) => {
                    const isActive = activeTrait.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveTrait(cat)}
                        data-active={isActive}
                        aria-pressed={isActive}
                        className="venom-chip venom-tab shrink-0 px-3 py-1.5 text-[11px]"
                      >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="venom-sunken relative min-h-0 flex-1 overflow-y-auto bg-white/60 p-4">
                  <h4
                    className="text-lg leading-none text-[var(--v-ink)]"
                    style={{ fontFamily: "'Creepster', cursive" }}
                  >
                    {activeTrait.label}
                  </h4>
                  <p className="mb-4 mt-2 border-l-2 border-[var(--v-accent)] pl-2.5 text-[11px] italic leading-relaxed text-[var(--v-muted)]">
                    {TRAIT_FLAVOUR[activeTrait.id] ?? "We grew this one ourselves."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {activeTrait.skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-lg border border-[var(--v-line)] bg-white px-2 py-1.5 font-mono text-[11px] text-[var(--v-body)]"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>

                  <div className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 text-[var(--v-ink)] opacity-[0.07]">
                    <VenomSpiderIcon className="h-full w-full" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VOICES ─────────────────────────────────────── */}
            {activeTab === "voices" && (
              <motion.div
                key="tab-voices"
                {...PANE}
                className="flex h-full flex-col items-center justify-center gap-6 px-2"
              >
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={voiceIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="relative max-w-lg px-6 text-center"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-6 left-0 text-6xl leading-none text-[var(--v-line-2)]"
                      style={{ fontFamily: "'Creepster', cursive" }}
                    >
                      “
                    </span>
                    <p
                      className="text-xl leading-snug text-[var(--v-ink)] sm:text-2xl"
                      style={{ fontFamily: "'Creepster', cursive" }}
                    >
                      {VOICES[voiceIdx].line}
                    </p>
                    <footer className="venom-label mt-4 text-[10px]">
                      — {VOICES[voiceIdx].tag}
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>

                <div className="flex items-center gap-2.5">
                  {VOICES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVoiceIdx(i)}
                      aria-label={`Voice ${i + 1}`}
                      aria-pressed={i === voiceIdx}
                      className={`h-1.5 rounded-full transition-all ${
                        i === voiceIdx
                          ? "w-6 bg-[var(--v-ink)]"
                          : "w-1.5 bg-[var(--v-line-2)] hover:bg-[var(--v-muted)]"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VenomConsole;
