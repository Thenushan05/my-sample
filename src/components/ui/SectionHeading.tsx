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
    <div className={`space-y-2 mb-12 ${align === "center" ? "text-center" : "text-left"} transition-transform duration-500 [.spiderman_&]:-skew-x-6`}>
      {subtitle && (
        <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 [.spiderman_&]:text-white uppercase block transition-colors">
          {subtitle}
        </span>
      )}
      <h2 className="section-heading-text text-3xl md:text-4xl font-extrabold tracking-tight text-white [.spiderman_&]:italic [.spiderman_&]:uppercase [.spiderman_&]:tracking-wider transition-all">
        {title}
      </h2>
      <div
        className={`h-[2px] w-12 bg-gradient-to-r from-blue-500 to-violet-500 [.spiderman_&]:from-red-600 [.spiderman_&]:to-white rounded-full [.spiderman_&]:rounded-none transition-all duration-500 ${align === "center" ? "mx-auto" : "mr-auto"
          }`}
      />
    </div>
  );
};
export default SectionHeading;
