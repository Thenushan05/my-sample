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

  const TABS = [
    { id: "bond", label: "The Bond", icon: Biohazard },
    { id: "hosts", label: "Hosts", icon: ScrollText },
    { id: "traits", label: "Traits", icon: Dna },
    { id: "voices", label: "Voices", icon: MessagesSquare },
  ] as const;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px_10px_24px_12px/12px_22px_10px_20px] border border-black/20 bg-white/80 p-3 text-black selection:bg-zinc-300 sm:p-4">
      {/* Wet highlight along the top of the mass */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-black to-transparent shadow-[0_0_12px_rgba(0,0,0,0.4)]" />

      {/* Tabs as tendril-drawn chips */}
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-black/20 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`venom-chip flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-[11px] transition-all sm:text-xs font-bold ${
                  isActive
                    ? "!border-black !text-black shadow-[0_0_18px_rgba(0,0,0,0.15),inset_0_0_14px_rgba(0,0,0,0.05)] bg-black/5"
                    : "opacity-65 hover:opacity-100 hover:!border-black/50 text-black/70 hover:text-black"
                }`}
              >
                <tab.icon className={`h-3.5 w-3.5 ${isActive ? "text-black" : "text-black/70"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="venom-chip hidden items-center gap-2 px-2.5 py-1 text-[10px] md:flex text-black border-black/20 bg-black/5">
          <VenomSpiderIcon className="h-4 w-4" />
          <span className="font-bold">We Are Venom</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── THE BOND (terminal) ──────────────────────────── */}
          {activeTab === "bond" && (
            <motion.div
              key="tab-bond"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              {/* Bond vitals */}
              <div className="hidden w-1/3 flex-col rounded-[18px_8px_20px_10px/10px_18px_8px_16px] border border-black/20 bg-white/60 p-3 sm:flex">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-24"
                >
                  <VenomSpiderIcon className="w-full drop-shadow-[0_0_18px_rgba(0,0,0,0.5)] text-black" />
                </motion.div>

                <div
                  className="mt-4 border-b border-black/20 pb-1 text-center text-[10px] tracking-[0.2em] text-black font-bold"
                  style={{ fontFamily: "'Creepster', cursive" }}
                >
                  Bond Vitals
                </div>

                <div className="mt-3 flex flex-col gap-2.5 text-[10px] font-bold">
                  {[
                    { label: "Bond Depth", value: 98, note: "Fused" },
                    { label: "Host Control", value: 61, note: "Negotiated" },
                    { label: "Appetite", value: 84, note: "Managed" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="mb-1 flex justify-between text-black/70">
                        <span className="uppercase tracking-wider">{stat.label}</span>
                        <span className="text-black">{stat.note}</span>
                      </div>
                      <div className="h-2 rounded-full border border-black/20 bg-black/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-black/80 via-black to-black shadow-[0_0_10px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="venom-chip mt-auto px-2 py-1.5 text-[10px] leading-snug text-black border-black/20 bg-black/5 font-bold">
                  We share the credit. Mostly.
                </div>
              </div>

              {/* Terminal */}
              <div className="flex flex-1 flex-col rounded-[18px_8px_20px_10px/10px_18px_8px_16px] border border-black/20 bg-white/50">
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-black/90 font-medium"
                >
                  {logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("we@")
                          ? "text-black font-bold"
                          : line.startsWith("◈")
                            ? "text-black/80 font-semibold"
                            : ""
                      }
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCommand}
                  className="flex items-center gap-2 border-t border-black/20 bg-white/70 px-3 py-2"
                >
                  <span className="font-mono text-[11px] text-black font-bold">we@symbiote:~◈</span>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="speak. we are listening."
                    className="flex-1 bg-transparent font-mono text-[11px] text-black placeholder:text-black/40 focus:outline-none font-bold"
                  />
                  <button type="submit" aria-label="Send" className="text-black/60 hover:text-black">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── HOSTS (real experience) ──────────────────────── */}
          {activeTab === "hosts" && (
            <motion.div
              key="tab-hosts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="scrollbar-thin h-full overflow-y-auto pr-1"
            >
              <div className="flex flex-col gap-3">
                {experiences.map((exp) => {
                  const flavour = HOST_FLAVOUR[exp.id];
                  return (
                    <div
                      key={exp.id}
                      className="relative rounded-[18px_8px_20px_10px/10px_18px_8px_16px] border border-black/20 bg-white/60 p-3 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-1.5">
                        <span
                          className="text-[10px] tracking-[0.18em] text-black font-bold"
                          style={{ fontFamily: "'Creepster', cursive" }}
                        >
                          {flavour?.title ?? "UNRECORDED"}
                        </span>
                        <span className="rounded-full border border-black/30 bg-black/5 px-2 py-0.5 text-[9px] tracking-widest text-black font-bold">
                          {flavour?.state ?? "UNKNOWN"}
                        </span>
                      </div>

                      <h4 className="text-sm text-black font-extrabold">{exp.role}</h4>
                      <div className="mb-2 font-mono text-[10px] text-black/60 font-bold">
                        {exp.company} • {exp.period}
                      </div>
                      <p className="mb-2 text-[11px] leading-relaxed text-black/80 font-medium">{exp.description}</p>

                      <ul className="mb-2 flex flex-col gap-1">
                        {exp.highlights.map((h) => (
                          <li key={h} className="flex gap-2 text-[11px] text-black/80 font-medium">
                            <span className="text-black font-bold">◈</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-black/20 bg-black/5 px-2 py-0.5 font-mono text-[9px] text-black font-bold"
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

          {/* ── TRAITS (real skills) ─────────────────────────── */}
          {activeTab === "traits" && (
            <motion.div
              key="tab-traits"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col gap-3 sm:flex-row"
            >
              <div className="scrollbar-thin flex gap-2 overflow-x-auto sm:w-1/3 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
                {skillCategories.map((cat) => {
                  const isActive = activeTrait.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTrait(cat)}
                      className={`venom-chip shrink-0 px-3 py-2 text-left text-[11px] transition-all font-bold ${
                        isActive
                          ? "!border-black !text-black shadow-[0_0_18px_rgba(0,0,0,0.15)] bg-black/5"
                          : "opacity-65 hover:opacity-100 text-black/70 hover:text-black border-black/10"
                      }`}
                    >
                      <span className="mr-1.5">{cat.icon}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 rounded-[18px_8px_20px_10px/10px_18px_8px_16px] border border-black/20 bg-white/60 p-4">
                <div
                  className="mb-1 text-[10px] tracking-[0.2em] text-black font-bold"
                  style={{ fontFamily: "'Creepster', cursive" }}
                >
                  What We Are Made Of
                </div>
                <h4 className="mb-2 text-base text-black font-extrabold">{activeTrait.label}</h4>
                <p className="mb-4 border-l-2 border-black/40 pl-2.5 text-[11px] italic text-black/70 font-semibold">
                  {TRAIT_FLAVOUR[activeTrait.id] ?? "We grew this one ourselves."}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {activeTrait.skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-lg border border-black/10 bg-black/5 px-2 py-1.5 font-mono text-[11px] text-black/85 font-bold"
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 opacity-10 text-black">
                  <VenomSpiderIcon className="h-full w-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VOICES ───────────────────────────────────────── */}
          {activeTab === "voices" && (
            <motion.div
              key="tab-voices"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-5 px-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={voiceIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="venom-flesh max-w-lg px-6 py-6 text-center"
                >
                  <p className="text-lg leading-snug text-black font-bold" style={{ fontFamily: "'Creepster', cursive" }}>
                    “{VOICES[voiceIdx].line}”
                  </p>
                  <div className="mt-3 font-mono text-[10px] tracking-[0.25em] text-black/70 font-bold">
                    — {VOICES[voiceIdx].tag.toUpperCase()}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2.5">
                {VOICES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setVoiceIdx(i)}
                    aria-label={`Voice ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full border transition-all ${
                      i === voiceIdx
                        ? "border-black bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        : "border-black/30 bg-transparent hover:border-black"
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

export default VenomConsole;
