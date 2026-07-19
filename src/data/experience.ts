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
    id: "business-analyst",
    role: "Business Analyst",
    company: "Tech Solutions Ltd.",
    period: "2023 – Present",
    description:
      "Led requirements gathering and analysis for digital transformation projects, creating detailed BRDs and working closely with cross-functional teams.",
    highlights: [
      "Authored 5+ comprehensive Business Requirement Documents",
      "Facilitated 25+ client meetings and workshops",
      "Reduced requirement ambiguity by 40% through structured analysis",
      "Bridged communication between technical and business stakeholders",
    ],
    type: "work",
    technologies: ["Jira", "Confluence", "Figma", "Excel", "PowerBI"],
  },
  {
    id: "qa-engineer",
    role: "QA Engineer",
    company: "Digital Innovations Inc.",
    period: "2022 – 2023",
    description:
      "Designed and executed comprehensive test strategies for web and mobile applications, ensuring product quality and reliability.",
    highlights: [
      "Built automated test suites reducing manual testing by 60%",
      "Implemented CI/CD-integrated testing pipelines",
      "Identified and resolved 200+ critical bugs before production",
      "Mentored junior QA team members",
    ],
    type: "work",
    technologies: ["Selenium", "Cypress", "Postman", "Jest", "GitHub Actions"],
  },
  {
    id: "web-developer",
    role: "Web Developer",
    company: "Creative Agency Co.",
    period: "2021 – 2022",
    description:
      "Developed responsive, high-performance web applications for diverse clients across e-commerce, healthcare, and education sectors.",
    highlights: [
      "Delivered 10+ client web projects on time and within budget",
      "Improved page load speeds by 45% through performance optimization",
      "Implemented modern UI/UX designs with Figma collaboration",
      "Integrated third-party APIs and payment gateways",
    ],
    type: "work",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "prompt-engineer",
    role: "Prompt Engineer",
    company: "AI Lab Studio",
    period: "2023 – 2024",
    description:
      "Specialized in designing, testing, and optimizing prompts for large language models to achieve precise and reliable AI outputs.",
    highlights: [
      "Engineered 100+ production-grade prompts for various LLMs",
      "Reduced AI hallucination rates by 35% through structured prompting",
      "Built prompt libraries for customer support automation",
      "Collaborated with ML engineers on model fine-tuning",
    ],
    type: "work",
    technologies: ["OpenAI GPT", "LangChain", "Python", "Anthropic Claude", "Llama"],
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
