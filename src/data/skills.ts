export interface SkillCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend Engineering",
    icon: "⚡",
    color: "#3B82F6",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend",
    label: "Backend Development",
    icon: "🔧",
    color: "#8B5CF6",
    skills: ["Node.js", "Express", "FastAPI", "REST APIs"],
  },
  {
    id: "database",
    label: "Database",
    icon: "🗄️",
    color: "#06B6D4",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    id: "ai",
    label: "AI & Automation",
    icon: "🧠",
    color: "#10B981",
    skills: ["OpenAI", "LangChain", "Machine Learning", "Python"],
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    icon: "☁️",
    color: "#F59E0B",
    skills: ["Git", "Docker", "AWS", "CI/CD"],
  },
  {
    id: "uiux",
    label: "UI/UX Engineering",
    icon: "🎨",
    color: "#EC4899",
    skills: ["Figma", "Postman", "Swagger", "Design Systems"],
  },
];

export const techStack = {
  frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  backend: ["Node.js", "Express", "FastAPI", "REST APIs"],
  database: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  ai: ["OpenAI", "LangChain", "Machine Learning", "Python"],
  tools: ["Git", "Docker", "Figma", "Postman", "Swagger"],
};
