import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Briefcase, BookOpen, Car, Send } from "lucide-react";
import { CrescentIcon } from "../ui/CrescentIcon";
import { experiences } from "../../data/experience";
import { skillCategories } from "../../data/skills";
import { personal } from "../../data/personal";

/**
 * The four voices in the suit.
 *
 * This is the mode's whole reason for existing: no other hero here has more
 * than one narrator. Moon Knight's console isn't organised by topic like the
 * others — it's organised by WHO IS FRONTING. Marc gives you the résumé,
 * Steven explains the craft, Jake just gets it delivered, and Khonshu passes
 * judgement.
 */
type Identity = "marc" | "steven" | "jake" | "khonshu";

const IDENTITIES: Record<
  Identity,
  { name: string; role: string; accent: string; voice: string }
> = {
  marc: {
    name: "Marc Spector",
    role: "The Mercenary",
    accent: "#f2efe6",
    voice: "Direct. Gives you the record and lets it stand.",
  },
  steven: {
    name: "Steven Grant",
    role: "The Scholar",
    accent: "#c9d1dc",
    voice: "Explains the craft, at length, whether you asked or not.",
  },
  jake: {
    name: "Jake Lockley",
    role: "The Driver",
    accent: "#c9a227",
    voice: "Does not explain. Delivers.",
  },
  khonshu: {
    name: "Khonshu",
    role: "The God",
    accent: "#e0bc4f",
    voice: "Passes judgement. Was not asked to.",
  },
};

const BOOT_LOG = [
  "◗ SYSTEM OF SYSTEMS — FOUR OCCUPANTS DETECTED",
  "◗ FRONTING....... MARC SPECTOR",
  "◗ MOON PHASE..... WAXING",
  "◗ BLACKOUTS...... 0 THIS SESSION",
  "",
  "Marc: You're in. Ask for what you need.",
  "Steven: Or type 'help', that's — that's usually how these work.",
];

/** Marc's framing of each real role. The facts stay the facts. */
const RECORD_FLAVOUR: Record<string, { title: string; state: string }> = {
  "associate-product-developer-magicktech": { title: "CURRENT CONTRACT", state: "ACTIVE" },
  "associate-software-engineer-codelantic": { title: "PRIOR CONTRACT", state: "CLOSED" },
  "intern-frontend-developer-codelantic": { title: "FIRST CONTRACT", state: "CLOSED" },
  "software-projects": { title: "OFF THE BOOKS", state: "ONGOING" },
};

/** Steven, explaining each discipline the way a museum guide would. */
const CRAFT_FLAVOUR: Record<string, string> = {
  frontend: "The face of the thing. It's the bit people actually touch, so it has to be right.",
  backend: "Everything underneath. Nobody thanks you for it until it stops.",
  database: "Records. Properly kept, properly indexed. I'm rather good at records.",
  ai: "Another voice in the process. We're — well. We're used to that.",
  devops: "Getting it from here to there without losing anything on the way.",
  uiux: "Deciding what someone sees first. That's not decoration, that's the argument.",
};

const JUDGEMENTS = [
  { line: "He works while the city sleeps. This pleases me.", by: "Khonshu" },
  { line: "Three of us reviewed it. It shipped anyway.", by: "Marc" },
  { line: "Measure twice. Then measure again, because I will ask.", by: "Steven" },
  { line: "You want it done, or you want it discussed?", by: "Jake" },
  { line: "The suit is armour. The work is the weapon.", by: "Khonshu" },
];

export const MoonKnightConsole: React.FC = () => {
  const [fronting, setFronting] = useState<Identity>("marc");
  const [logs, setLogs] = useState<string[]>(BOOT_LOG);
  const [inputVal, setInputVal] = useState("");
  const [activeCraft, setActiveCraft] = useState(skillCategories[0]);
  const [judgementIdx, setJudgementIdx] = useState(0);
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
    setLogs((prev) => [...prev, `moon:~◗ ${cmd}`]);

    switch (cmd) {
      case "clear":
        setLogs([]);
        return;
      case "help":
        say(
          "Marc: These work.",
          "  record    — the contracts he's closed",
          "  craft     — what he actually knows",
          "  judgement — the four of us, disagreeing",
          "  reach     — how to contact him",
          "  who       — who is fronting right now",
          "  clear     — wipe the log"
        );
        return;
      case "record":
      case "history":
      case "work":
        setFronting("marc");
        say("Marc: The record, then. No embellishment.");
        return;
      case "craft":
      case "skills":
        setFronting("steven");
        say("Steven: Right! Yes. Let me walk you through it properly.");
        return;
      case "judgement":
      case "quotes":
        setFronting("khonshu");
        say("Khonshu: You will hear us.");
        return;
      case "reach":
      case "contact":
        setFronting("jake");
        say(`Jake: ${personal.email}. Done. Next.`);
        return;
      case "who":
        say(
          `◗ FRONTING: ${IDENTITIES[fronting].name.toUpperCase()} — ${IDENTITIES[fronting].role}`,
          `◗ ${IDENTITIES[fronting].voice}`
        );
        return;
      default:
        say(`◗ None of us recognise '${cmd}'. Try 'help'.`);
    }
  };

  const TABS = [
    { id: "marc", label: "Marc", icon: Briefcase },
    { id: "steven", label: "Steven", icon: BookOpen },
    { id: "jake", label: "Jake", icon: Car },
    { id: "khonshu", label: "Khonshu", icon: Moon },
  ] as const;

  const current = IDENTITIES[fronting];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-sm border border-[#f2efe6]/25 bg-[#080b12]/70 p-3 text-[#e9e6dc] sm:p-4">
      {/* Moonlight along the top of the linen */}
      <div className="mk-moon-edge pointer-events-none absolute inset-x-0 top-0 h-[2px]" />

      {/* Which of them is fronting */}
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#c9a227]/25 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {TABS.map((tab) => {
            const isActive = fronting === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFronting(tab.id)}
                className={`mk-cartouche flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-[11px] transition-all sm:text-xs ${
                  isActive
                    ? "!border-[#f2efe6] shadow-[0_0_18px_rgba(242,239,230,0.45)]"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={isActive ? { color: IDENTITIES[tab.id].accent } : undefined}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mk-cartouche hidden items-center gap-2 px-2.5 py-1 text-[10px] md:flex">
          <CrescentIcon className="h-4 w-4" />
          <span>Fronting: {current.name}</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── MARC: the record + the terminal ──────────────── */}
          {fronting === "marc" && (
            <motion.div
              key="id-marc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              <div className="scrollbar-thin hidden w-1/2 overflow-y-auto pr-1 sm:block">
                <div className="flex flex-col gap-2.5">
                  {experiences.map((exp) => {
                    const flavour = RECORD_FLAVOUR[exp.id];
                    return (
                      <div
                        key={exp.id}
                        className="rounded-sm border border-[#f2efe6]/18 bg-[#0d111a]/70 p-2.5"
                      >
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#c9a227]/20 pb-1">
                          <span className="text-[9px] tracking-[0.18em] text-[#c9a227]">
                            {flavour?.title ?? "UNRECORDED"}
                          </span>
                          <span className="border border-[#f2efe6]/30 px-1.5 text-[9px] tracking-widest text-[#f2efe6]/80">
                            {flavour?.state ?? "—"}
                          </span>
                        </div>
                        <h4 className="text-[13px] text-[#f5f2ea]">{exp.role}</h4>
                        <div className="font-mono text-[10px] text-[#c9d1dc]/70">
                          {exp.company} • {exp.period}
                        </div>
                        <ul className="mt-1.5 flex flex-col gap-0.5">
                          {exp.highlights.map((h) => (
                            <li key={h} className="flex gap-1.5 text-[10.5px] text-[#e9e6dc]/70">
                              <span className="text-[#c9a227]">◗</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terminal */}
              <div className="flex flex-1 flex-col rounded-sm border border-[#f2efe6]/18 bg-black/45">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-[#e9e6dc]/85"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("moon:")
                          ? "text-[#c9a227]"
                          : line.startsWith("◗")
                            ? "text-[#f2efe6]"
                            : line.startsWith("Steven")
                              ? "text-[#c9d1dc]"
                              : line.startsWith("Khonshu")
                                ? "text-[#e0bc4f]"
                                : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="flex items-center gap-2 border-t border-[#c9a227]/25 bg-[#0d111a]/70 px-3 py-2"
                >
                  <span className="font-mono text-[11px] text-[#c9a227]">moon:~◗</span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="ask any of us"
                    className="flex-1 bg-transparent font-mono text-[11px] text-[#f5f2ea] placeholder:text-[#c9d1dc]/30 focus:outline-none"
                  />
                  <button type="submit" aria-label="Send" className="text-[#f2efe6] hover:text-white">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── STEVEN: the craft, explained ─────────────────── */}
          {fronting === "steven" && (
            <motion.div
              key="id-steven"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              <div className="scrollbar-thin flex gap-2 overflow-x-auto sm:w-1/3 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
                {skillCategories.map((cat) => {
                  const isActive = activeCraft.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCraft(cat)}
                      className={`mk-cartouche shrink-0 px-3 py-2 text-left text-[11px] transition-all ${
                        isActive
                          ? "!border-[#f2efe6] shadow-[0_0_16px_rgba(242,239,230,0.4)]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="mr-1.5">{cat.icon}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 rounded-sm border border-[#f2efe6]/18 bg-[#0d111a]/60 p-4">
                <div className="mb-1 text-[10px] tracking-[0.2em] text-[#c9a227]">
                  Steven Grant explains
                </div>
                <h4 className="mb-2 text-base text-[#f5f2ea]">{activeCraft.label}</h4>
                <p className="mb-4 border-l border-[#c9d1dc]/50 pl-2.5 text-[11px] italic leading-relaxed text-[#e9e6dc]/75">
                  {CRAFT_FLAVOUR[activeCraft.id] ?? "It does what it says. Reliably."}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {activeCraft.skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-sm border border-[#f2efe6]/15 bg-black/40 px-2 py-1.5 font-mono text-[11px] text-[#e9e6dc]/85"
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 opacity-15">
                  <CrescentIcon className="h-full w-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── JAKE: no explanation, just contact ───────────── */}
          {fronting === "jake" && (
            <motion.div
              key="id-jake"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center"
            >
              <div className="text-[10px] tracking-[0.3em] text-[#c9a227]">JAKE LOCKLEY</div>
              <p
                className="max-w-md text-xl leading-snug text-[#f5f2ea]"
                style={{ fontFamily: "'Marcellus SC', serif" }}
              >
                You've read enough. Here's how you reach him.
              </p>
              <a
                href={`mailto:${personal.email}`}
                className="mk-cartouche px-5 py-2.5 text-sm tracking-[0.14em] transition-all hover:!border-[#f2efe6] hover:shadow-[0_0_22px_rgba(242,239,230,0.5)]"
              >
                {personal.email}
              </a>
              <div className="max-w-sm text-[11px] italic text-[#e9e6dc]/55">
                Marc would have given you three paragraphs of context first.
                Steven would still be talking.
              </div>
            </motion.div>
          )}

          {/* ── KHONSHU: judgement ───────────────────────────── */}
          {fronting === "khonshu" && (
            <motion.div
              key="id-khonshu"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-5 px-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={judgementIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mk-linen max-w-lg px-7 py-6 text-center"
                >
                  <p
                    className="text-lg leading-snug text-[#f5f2ea]"
                    style={{ fontFamily: "'Marcellus SC', serif" }}
                  >
                    “{JUDGEMENTS[judgementIdx].line}”
                  </p>
                  <div className="mt-3 font-mono text-[10px] tracking-[0.25em] text-[#c9a227]">
                    — {JUDGEMENTS[judgementIdx].by.toUpperCase()}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2.5">
                {JUDGEMENTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setJudgementIdx(i)}
                    aria-label={`Judgement ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full border transition-all ${
                      i === judgementIdx
                        ? "border-[#f2efe6] bg-[#f2efe6] shadow-[0_0_10px_rgba(242,239,230,0.9)]"
                        : "border-[#c9a227]/60 bg-transparent hover:border-[#f2efe6]"
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

export default MoonKnightConsole;
