import React from "react";

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
    <div className={`space-y-2 mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
      {subtitle && (
        <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 uppercase block">
          {subtitle}
        </span>
      )}
      <h2 className="section-heading-text text-3xl md:text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h2>
      <div
        className={`h-[2px] w-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full ${align === "center" ? "mx-auto" : "mr-auto"
          }`}
      />
    </div>
  );
};
export default SectionHeading;
