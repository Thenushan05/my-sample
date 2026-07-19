import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Mail, X } from "lucide-react";
import { personal } from "../../data/personal";

// Custom SVGs since Lucide removed brand icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <motion.div
      layout
      className="relative flex items-center rounded-full font-medium bg-white/[0.03] text-white border border-white/[0.08] shadow-lg backdrop-blur-md overflow-hidden h-11 px-1.5"
      style={{ borderRadius: 50 }}
    >
      <button
        onClick={toggleOpen}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Toggle share options"
      >
        <motion.div layout transition={{ duration: 0.2 }}>
          {isOpen ? (
            <X className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
          ) : (
            <Share2 className="w-4 h-4 text-white/70 hover:text-blue-400 transition-colors" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
            className="flex items-center overflow-hidden whitespace-nowrap"
          >
            <div className="flex items-center gap-3 pl-2 pr-4 ml-1 border-l border-white/10">
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors p-1"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#0A66C2] transition-colors p-1"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personal.email}`}
                className="text-white/60 hover:text-red-400 transition-colors p-1"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
