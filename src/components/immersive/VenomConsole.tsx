import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Biohazard, ScrollText, Dna, MessagesSquare, Send } from "lucide-react";
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
  { label: "Bond", value: 98, note: "Fused" },
  { label: "Control", value: 61, note: "Shared" },
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

/**
 * The eye silhouette: one almond with a sharp point at each tip, in
 * objectBoundingBox units so it fits any eye size. Both eyes share it — the
 * shape is symmetric, so the left/right difference is purely the rotation
 * applied in CSS, and there is no mirrored copy to keep in sync.
 */
const EyeClip: React.FC = () => (
  <svg aria-hidden width="0" height="0" className="absolute">
    <defs>
      <clipPath id="venom-eye" clipPathUnits="objectBoundingBox">
        <path d="M0 0.5C0.08 0.16 0.30 0 0.52 0C0.76 0 0.94 0.18 1 0.5C0.94 0.82 0.76 1 0.52 1C0.30 1 0.08 0.84 0 0.5Z" />
      </clipPath>
    </defs>
  </svg>
);

/**
 * Venom mode's main surface: his face.
 *
 * The skull is the container. The two eyes are the content windows and the
 * mouth beneath them holds whatever needs reading. Content is assigned by
 * SHAPE rather than by importance — the eyes are tapered, so they get short
 * punchy content (identity, vitals, navigation) and every long-form pane
 * lives in the mouth, which is rectangular and can actually hold prose.
 */
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
    /* Generous horizontal padding is the cheeks. Trim it and the mouth runs
       edge to edge, at which point the head stops reading as a head and goes
       back to being a frame around a rectangle. */
    <div className="venom-head venom-alive relative w-full overflow-hidden px-5 pb-8 pt-10 sm:px-16 sm:pb-10 sm:pt-14">
      <EyeClip />
      <div className="venom-veins" />

      {/* ── The eyes ──────────────────────────────────────────
          Set close and canted steeply inward. The negative gap is
          deliberate: the almonds taper to nothing at their tips, so the
          boxes have to overlap for the shapes to sit as close as they do
          on the mask. Content stays short — a tapered shape has a small
          inscribed box, and anything longer gets clipped. */}
      <div className="relative z-[2] flex items-center justify-center gap-2 sm:gap-5">
        {/* His right eye: who we are. The emblem is not in here — its SVG
            hardcodes a near-white fill, so on bone it disappears. */}
        <div className="venom-eye venom-eye--l h-[156px] w-1/2 max-w-[350px] sm:h-[186px]">
          <div className="venom-eye-inner flex flex-col items-center justify-center text-center">
            <div
              className="text-2xl leading-[0.9] text-[#05050a] sm:text-4xl"
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              We Are
              <br />
              Venom
            </div>
          </div>
        </div>

        {/* His left eye: where to go */}
        <div className="venom-eye venom-eye--r h-[156px] w-1/2 max-w-[350px] sm:h-[186px]">
          <div className="venom-eye-inner flex flex-col items-center justify-center">
            <div className="flex w-full max-w-[132px] flex-col gap-[3px]">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    /* Inverted states: on bone, "selected" means filled with
                       ink. The venom- prefix opts this out of the global
                       button remap, which would otherwise force bone type. */
                    className={`venom-eyetab flex items-center gap-1.5 rounded-[8px_3px_9px_4px/4px_8px_3px_7px] px-2 py-[3px] text-left text-[11px] transition-colors sm:text-xs ${
                      isActive
                        ? "bg-[#05050a] text-[#f6f5f1]"
                        : "text-[rgba(5,5,10,0.62)] hover:bg-[rgba(5,5,10,0.1)] hover:text-[#05050a]"
                    }`}
                    style={{ fontFamily: "'Creepster', cursive", letterSpacing: "0.06em" }}
                  >
                    <tab.icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── The mouth ─────────────────────────────────────────
          Everything that needs reading, plus the vitals — they moved out of
          the eye because a meter needs a straight run of width and an
          almond does not have one. Padded clear of both rows of fangs. */}
      <div className="venom-mouth relative z-[2] mt-4 h-[380px] sm:mt-6 sm:h-[400px]">
        <div className="relative z-[2] flex h-full flex-col px-3 py-6 sm:px-6">
          <div className="mb-3 flex shrink-0 items-center gap-3 border-b border-[var(--v-line)] pb-2.5 sm:gap-5">
            {VITALS.map((stat) => (
              <div key={stat.label} className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="venom-label truncate text-[8px] sm:text-[9px]">
                    {stat.label}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] text-[var(--v-ink)]">
                    {stat.value}%
                  </span>
                </div>
                <div className="venom-meter mt-1 h-[3px]">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── THE BOND (terminal) ─────────────────────── */}
            {activeTab === "bond" && (
              <motion.div key="tab-bond" {...PANE} className="flex h-full min-h-0 flex-col">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin min-h-0 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-[var(--v-body)]"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("we@")
                          ? "text-[var(--v-ink)]"
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
                  className="mt-2 flex shrink-0 items-center gap-2 border-t border-[var(--v-line)] pt-2"
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
              </motion.div>
            )}

            {/* ── HOSTS ───────────────────────────────────── */}
            {activeTab === "hosts" && (
              <motion.div
                key="tab-hosts"
                {...PANE}
                className="scrollbar-thin h-full overflow-y-auto pr-1"
              >
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
                              ? "bg-[var(--v-accent)] ring-4 ring-[rgba(244,63,78,0.16)]"
                              : "bg-[var(--v-line-3)]"
                          }`}
                        />

                        <div className="venom-sunken p-3">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="venom-label text-[9px]">
                              {flavour?.title ?? "UNRECORDED"}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                                isActive
                                  ? "bg-[var(--v-ink)] text-[var(--v-paper)]"
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
                                className="rounded-full border border-[var(--v-line)] bg-[var(--v-surface)] px-2 py-0.5 font-mono text-[9px] text-[var(--v-muted)]"
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

            {/* ── TRAITS ──────────────────────────────────── */}
            {activeTab === "traits" && (
              <motion.div key="tab-traits" {...PANE} className="flex h-full min-h-0 flex-col gap-3">
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

                <div className="venom-sunken relative min-h-0 flex-1 overflow-y-auto p-4">
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
                        className="rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-2 py-1.5 font-mono text-[11px] text-[var(--v-body)]"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VOICES ──────────────────────────────────── */}
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
                    className="max-w-lg text-center"
                  >
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
