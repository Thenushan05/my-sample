import React from "react";
import spideyLogo from "../../assets/spidey-logo-white.png";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";
import { DeadpoolMaskIcon } from "./DeadpoolMaskIcon";
import { MjolnirIcon } from "./MjolnirIcon";
import { VenomSpiderIcon } from "./VenomSpiderIcon";

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
          <VenomSpiderIcon className="w-4 h-4 hidden [.venom_&]:block animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 [.spiderman_&]:text-red-400 [.ironman_&]:text-cyan-400 [.deadpool_&]:text-yellow-300 [.thor_&]:text-sky-300 [.venom_&]:text-zinc-300 uppercase block transition-colors">
            {subtitle}
          </span>
        </div>
      )}
      <h2 className="section-heading-text text-3xl md:text-4xl font-extrabold tracking-tight text-white italic uppercase tracking-wider transition-all">
        {title}
      </h2>
      <div
        className={`h-[2px] w-12 bg-gradient-to-r from-blue-500 to-violet-500 [.spiderman_&]:from-red-600 [.spiderman_&]:to-white [.ironman_&]:from-cyan-400 [.ironman_&]:to-amber-400 [.deadpool_&]:h-[5px] [.deadpool_&]:w-20 [.deadpool_&]:from-[#dc143c] [.deadpool_&]:to-[#450a0a] [.deadpool_&]:shadow-[3px_3px_0_rgba(0,0,0,0.85)] [.thor_&]:w-24 [.thor_&]:from-sky-300 [.thor_&]:to-[#b08d57] [.thor_&]:shadow-[0_0_14px_rgba(125,211,252,0.9)] [.venom_&]:h-[6px] [.venom_&]:w-24 [.venom_&]:from-[#e9edf2] [.venom_&]:to-[#141517] [.venom_&]:shadow-[0_0_16px_rgba(185,194,205,0.9)] rounded-full [.spiderman_&]:rounded-none [.deadpool_&]:rounded-none transition-all duration-500 ${align === "center" ? "mx-auto" : "mx-auto md:mr-auto"
          }`}
      />
    </div>
  );
};
export default SectionHeading;
