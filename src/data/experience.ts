export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  type: "work" | "project";
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: "associate-product-developer-magicktech",
    role: "Associate Product Developer - AI Fullstack",
    company: "MagickTech Pvt Ltd",
    period: "Jun 2026 – Present",
    description:
      "Engineered intelligent fullstack applications and AI-driven features, bridging modern frontend UI with powerful AI integrations.",
    highlights: [
      "Building end-to-end fullstack applications powered by AI capabilities",
      "Designing responsive, interactive user interfaces and robust APIs",
      "Collaborating on product design, architecture, and feature rollouts",
    ],
    type: "work",
    technologies: ["React", "TypeScript", "Node.js", "Python", "AI / LLM APIs", "Tailwind CSS"],
  },
  {
    id: "associate-software-engineer-codelantic",
    role: "Associate Software Engineer - Frontend",
    company: "Codelantic Pvt Ltd",
    period: "Mar 2025 – Dec 2025",
    description:
      "Developed scalable and high-performance web interfaces while driving frontend feature implementation.",
    highlights: [
      "Engineered modular, reusable UI components for web platforms",
      "Improved frontend performance, accessibility, and code quality",
      "Partnered with cross-functional teams to ship production features",
    ],
    type: "work",
    technologies: ["TypeScript", "React", "Angular", "Tailwind CSS", "REST APIs"],
  },
  {
    id: "intern-frontend-developer-codelantic",
    role: "Intern Frontend Developer",
    company: "Codelantic Pvt Ltd",
    period: "Oct 2024 – Feb 2025",
    description:
      "Gained hands-on experience developing responsive frontend user interfaces using Angular.",
    highlights: [
      "Built dynamic web features and UI components using Angular",
      "Participated in agile ceremonies, sprint planning, and code reviews",
      "Fixed UI bugs and optimized client-side interactions",
    ],
    type: "work",
    technologies: ["Angular", "TypeScript", "HTML5", "CSS3", "Git"],
  },
  {
    id: "software-projects",
    role: "Software Engineering Projects",
    company: "Academic & Personal",
    period: "2020 – Present",
    description:
      "Developed multiple full-stack applications and AI-powered systems as academic projects and personal endeavors.",
    highlights: [
      "Built AI-integrated education management system",
      "Developed smart tourism assistant with ML recommendations",
      "Created seafood export management enterprise platform",
      "Implemented deep learning plant disease detection system",
    ],
    type: "project",
    technologies: ["React", "Python", "TensorFlow", "FastAPI", "PostgreSQL", "Docker"],
  },
];
