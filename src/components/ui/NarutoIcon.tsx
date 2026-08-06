import React from "react";

interface IconProps {
  className?: string;
  muted?: boolean;
}

export const NarutoIcon: React.FC<IconProps> = ({ className, muted = false }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ opacity: muted ? 0.5 : 1 }}
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
};
