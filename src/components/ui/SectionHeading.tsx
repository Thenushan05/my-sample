import React from "react";
const spideyLogo = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077342/portfolio/spidey-logo-white.png";
const arcReactorLogo = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077325/portfolio/arc-reactor-logo.png";
import { DeadpoolMaskIcon } from "./DeadpoolMaskIcon";
import { MjolnirIcon } from "./MjolnirIcon";
import { CrescentIcon } from "./CrescentIcon";
import { VenomSpiderIcon } from "./VenomSpiderIcon";
import { StrawHatIcon } from "./StrawHatIcon";
import { KatanaIcon } from "./KatanaIcon";
import { NarutoIcon } from "./NarutoIcon";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = "center",
}) => {
  return (
    <div className={`space-y-2 mb-12 ${align === "center" ? "text-center" : "text-center md:text-left"} transition-transform duration-500 [.spiderman_&]:-skew-x-6`}>
      {subtitle && (
        <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : "justify-center md:justify-start"}`}>
          <img
            src={spideyLogo}
            alt=""
            className="w-4 h-4 object-contain hidden [.spiderman_&]:block animate-pulse"
          />
          <img
            src={arcReactorLogo}
            alt=""
            className="w-4 h-4 object-contain hidden [.ironman_&]:block animate-pulse"
          />
          <DeadpoolMaskIcon className="w-4 h-4 hidden [.deadpool_&]:block animate-pulse" />
          <MjolnirIcon className="w-4 h-4 hidden [.thor_&]:block animate-pulse" />
          <CrescentIcon className="w-4 h-4 hidden [.moonknight_&]:block animate-pulse" />
          <VenomSpiderIcon className="w-4 h-4 hidden [.venom_&]:block animate-pulse" />
          <StrawHatIcon className="w-4 h-4 hidden [.luffy_&]:block" />
          <KatanaIcon className="w-4 h-4 hidden [.zoro_&]:block" />
          <NarutoIcon className="w-4 h-4 hidden [.naruto_&]:block" />
          {/* text-blue-400 already lands on each theme's own accent via the
              generic [class*="text-blue-"] remap in index.css (zoro's now
              repaints it flash-green, naruto's chakra-blue), so this
              explicit entry is only a belt-and-braces glow — the remap
              alone doesn't add text-shadow. */}
          <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 [.spiderman_&]:text-red-400 [.ironman_&]:text-cyan-400 [.deadpool_&]:text-yellow-300 [.thor_&]:text-sky-300 [.venom_&]:text-zinc-300 [.moonknight_&]:text-[#c9a227] [.zoro_&]:text-[var(--z-flash)] [.zoro_&]:drop-shadow-[0_0_8px_rgba(61,220,114,0.5)] [.naruto_&]:text-[var(--n-paper-orange)] [.naruto_&]:drop-shadow-none uppercase block transition-colors">
            {subtitle}
          </span>
        </div>
      )}
      <h2 className={`section-heading-text text-3xl md:text-4xl font-extrabold tracking-tight text-white italic uppercase tracking-wider transition-all [.naruto_&]:inline-flex [.naruto_&]:items-center [.naruto_&]:gap-3 ${align === "center" ? "[.naruto_&]:justify-center" : "[.naruto_&]:justify-center [.naruto_&]:md:justify-start"}`}>
        {/* The fuinjutsu seal, the same spiral device the console uses as
            a divider — flanking the title so the theme's own symbol
            (not just its colour) shows up on every section, not only
            the hero. Hidden for every other theme via [.naruto_&]. */}
        <svg viewBox="0 0 32 32" className="hidden h-6 w-6 shrink-0 [.naruto_&]:block" aria-hidden>
          <g fill="none" stroke="var(--n-paper-orange)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M16 4C22 4 26 9 26 15C26 19.5 22.5 23 18.5 23C15.5 23 13 20.8 13 18C13 15.8 14.7 14.2 16.7 14.2C18.2 14.2 19.3 15.3 19.3 16.6" />
          </g>
          <circle cx="19.6" cy="17" r="1.3" fill="var(--n-paper-orange)" />
        </svg>
        {title}
        <svg viewBox="0 0 32 32" className="hidden h-6 w-6 shrink-0 scale-x-[-1] [.naruto_&]:block" aria-hidden>
          <g fill="none" stroke="var(--n-paper-orange)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M16 4C22 4 26 9 26 15C26 19.5 22.5 23 18.5 23C15.5 23 13 20.8 13 18C13 15.8 14.7 14.2 16.7 14.2C18.2 14.2 19.3 15.3 19.3 16.6" />
          </g>
          <circle cx="19.6" cy="17" r="1.3" fill="var(--n-paper-orange)" />
        </svg>
      </h2>
      <div
        className={`h-[2px] w-12 bg-gradient-to-r from-blue-500 to-violet-500 [.spiderman_&]:from-red-600 [.spiderman_&]:to-white [.ironman_&]:from-cyan-400 [.ironman_&]:to-amber-400 [.deadpool_&]:h-[5px] [.deadpool_&]:w-20 [.deadpool_&]:from-[#dc143c] [.deadpool_&]:to-[#450a0a] [.deadpool_&]:shadow-[3px_3px_0_rgba(0,0,0,0.85)] [.thor_&]:w-24 [.thor_&]:from-sky-300 [.thor_&]:to-[#b08d57] [.thor_&]:shadow-[0_0_14px_rgba(125,211,252,0.9)] [.venom_&]:h-[6px] [.venom_&]:w-24 [.venom_&]:from-[#e9edf2] [.venom_&]:to-[#141517] [.venom_&]:shadow-[0_0_16px_rgba(185,194,205,0.9)] [.moonknight_&]:w-20 [.moonknight_&]:from-[#f2efe6] [.moonknight_&]:to-[#c9a227] [.moonknight_&]:shadow-[0_0_14px_rgba(242,239,230,0.8)] [.luffy_&]:h-[3px] [.luffy_&]:w-20 [.luffy_&]:from-[#241a10] [.luffy_&]:to-[#c3352a] [.luffy_&]:shadow-none [.zoro_&]:h-[3px] [.zoro_&]:w-20 [.zoro_&]:from-[#3ddc72] [.zoro_&]:to-[var(--z-haramaki)] [.zoro_&]:shadow-[0_0_14px_rgba(61,220,114,0.8)] [.naruto_&]:h-[3px] [.naruto_&]:w-20 [.naruto_&]:from-[var(--n-paper-orange)] [.naruto_&]:to-[#e6a300] [.naruto_&]:shadow-none rounded-full [.spiderman_&]:rounded-none [.deadpool_&]:rounded-none [.luffy_&]:rounded-none [.zoro_&]:rounded-none [.naruto_&]:rounded-none transition-all duration-500 ${align === "center" ? "mx-auto" : "mx-auto md:mr-auto"
          }`}
      />
    </div>
  );
};
export default SectionHeading;
