export interface AppData {
  id: string;
  title: string;
  icon: string; // Used to determine visual style/icon
  description: string;
  color: string;
}

export const PORTFOLIO_APPS: AppData[] = [
  {
    id: "aiml",
    title: "1. AI & ML Specialist",
    icon: "Brain",
    description: "Training deep learning models, processing computer vision frames, and building predictive engines.",
    color: "#FF6F00",
  },
  {
    id: "backend",
    title: "2. Backend Architect",
    icon: "Database",
    description: "Crafting secure event-driven APIs, structuring SQL relations, and managing Redis cache stores.",
    color: "#339933",
  },
  {
    id: "frontend",
    title: "3. Frontend Craftsman",
    icon: "Code2",
    description: "Creating fluid micro-animations, optimizing rendering frames, and styling modular UI layouts.",
    color: "#61DAFB",
  },
  {
    id: "devops",
    title: "4. DevOps Specialist",
    icon: "Layers",
    description: "Setting up isolated virtual containers, configuring automated actions, and host releases.",
    color: "#2496ED",
  },
  {
    id: "ux",
    title: "5. UX Strategist",
    icon: "Figma",
    description: "Translating layout specifications into high-fidelity UI wireframes and user journey maps.",
    color: "#F24E1E",
  },
];
export default PORTFOLIO_APPS;
