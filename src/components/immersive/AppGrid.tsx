import React from "react";
import * as LucideIcons from "lucide-react";
import { PORTFOLIO_APPS, type AppData } from "../../data/apps";

interface AppGridProps {
  onAppClick?: (appId: string) => void;
  activeAppId?: string | null;
}

export const AppGrid: React.FC<AppGridProps> = ({
  onAppClick,
  activeAppId,
}) => {
  return (
    <div className="w-full h-full grid grid-cols-3 sm:grid-cols-5 gap-3 items-center justify-center p-2 relative z-10">
      {PORTFOLIO_APPS.map((app) => {
        // Resolve Lucide component dynamically
        const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.HelpCircle;
        const isActive = activeAppId === app.id;

        return (
          <button
            key={app.id}
            onClick={() => onAppClick?.(app.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
              isActive
                ? "bg-white/10 border-white/20 shadow-lg scale-105"
                : "bg-white/[0.01] border-white/5 hover:bg-white/5 hover:border-white/15 hover:scale-102"
            }`}
          >
            {/* App Icon Bezel */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-300 relative"
              style={{
                background: `linear-gradient(135deg, ${app.color}20, ${app.color}40)`,
                boxShadow: `0 4px 12px -2px ${app.color}20`,
              }}
            >
              <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {/* Dynamic status glow */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300"
                style={{ backgroundColor: app.color }}
              />
            </div>
            
            <span className="mt-2 text-[8px] font-bold tracking-wider text-white/80 group-hover:text-white uppercase text-center font-mono">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
export default AppGrid;
