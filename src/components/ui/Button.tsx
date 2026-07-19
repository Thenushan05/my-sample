import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glow";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium uppercase tracking-wider transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-[10px]",
    md: "px-6 py-2.5 text-xs",
    lg: "px-8 py-3.5 text-sm",
  };

  const variantStyles = {
    primary:
      "bg-white text-black hover:bg-white/90 border border-transparent shadow-lg",
    secondary:
      "border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white",
    glow:
      "bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:scale-[1.02]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
