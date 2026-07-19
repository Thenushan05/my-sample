export interface IntegrationNode {
  name: string;
  icon: string; // Icon identifier (e.g. logo, database, etc.)
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  gradient: string;
  images: string[];
  integrations: IntegrationNode[];
}

export const projects: Project[] = [
  {
    id: "ai-education",
    title: "AI-Integrated Education Management System",
    description:
      "A comprehensive platform that leverages AI to personalize learning paths, automate administrative tasks, and enhance student engagement.",
    longDescription:
      "Built a full-stack education management system with AI-powered features including automated grading, personalized learning recommendations, and intelligent scheduling. The system serves thousands of students and educators.",
    technologies: ["React", "FastAPI", "PostgreSQL", "OpenAI", "LangChain", "Docker"],
    category: "AI & Education",
    githubUrl: "https://github.com/thenushan-sritharan/ai-education",
    liveUrl: "https://ai-education.example.com",
    caseStudyUrl: "#",
    featured: true,
    gradient: "from-blue-600 to-violet-600",
    images: ["/project-education.png", "/project-education-2.png"],
    integrations: [
      { name: "React", icon: "react", color: "#61dafb" },
      { name: "FastAPI", icon: "api", color: "#009688" },
      { name: "PostgreSQL", icon: "database", color: "#336791" },
      { name: "OpenAI", icon: "openai", color: "#10a37f" },
      { name: "LangChain", icon: "chain", color: "#ff8a00" },
      { name: "Docker", icon: "docker", color: "#2496ed" },
    ],
  },
  {
    id: "smart-tourism",
    title: "Smart Tourism Assistant",
    description:
      "An intelligent travel companion powered by AI that provides personalized tour recommendations, real-time navigation, and cultural insights.",
    longDescription:
      "Developed a smart tourism platform that uses machine learning to analyze user preferences and provide tailored travel itineraries, local recommendations, and real-time information about attractions.",
    technologies: ["Next.js", "Python", "MongoDB", "ML Models", "Maps API", "Redis"],
    category: "AI & Travel",
    githubUrl: "https://github.com/thenushan-sritharan/smart-tourism",
    liveUrl: "https://smart-tourism.example.com",
    caseStudyUrl: "#",
    featured: true,
    gradient: "from-cyan-500 to-blue-600",
    images: ["/project-tourism.png", "/project-tourism-2.png"],
    integrations: [
      { name: "Next.js", icon: "react", color: "#000000" },
      { name: "Python", icon: "code", color: "#3776ab" },
      { name: "MongoDB", icon: "database", color: "#47a248" },
      { name: "OpenAI", icon: "openai", color: "#10a37f" },
      { name: "Maps API", icon: "map", color: "#4285f4" },
      { name: "Redis", icon: "bolt", color: "#dc382d" },
    ],
  },
  {
    id: "seafood-export",
    title: "Seafood Export Management Platform",
    description:
      "A robust enterprise platform streamlining seafood export operations including inventory tracking, compliance management, and shipping logistics.",
    longDescription:
      "Built an end-to-end export management system for a seafood company, integrating real-time inventory management, compliance reporting, automated documentation, and shipping logistics.",
    technologies: ["React", "Node.js", "PostgreSQL", "REST APIs", "Docker", "AWS"],
    category: "Enterprise & Logistics",
    githubUrl: "https://github.com/thenushan-sritharan/seafood-export",
    liveUrl: "https://seafood-export.example.com",
    caseStudyUrl: "#",
    featured: true,
    gradient: "from-teal-500 to-cyan-600",
    images: ["/project-seafood.png", "/project-seafood-2.png"],
    integrations: [
      { name: "React", icon: "react", color: "#61dafb" },
      { name: "Node.js", icon: "code", color: "#339933" },
      { name: "PostgreSQL", icon: "database", color: "#336791" },
      { name: "AWS S3", icon: "cloud", color: "#ff9900" },
      { name: "Docker", icon: "docker", color: "#2496ed" },
      { name: "Nginx", icon: "server", color: "#009639" },
    ],
  },
  {
    id: "plant-disease",
    title: "Deep Learning Plant Disease Detection",
    description:
      "A computer vision system that accurately identifies plant diseases from images using deep learning, helping farmers make timely interventions.",
    longDescription:
      "Created a deep learning model using CNN architecture to detect and classify plant diseases from photos taken on mobile devices. Achieved 94% accuracy across 38 disease categories.",
    technologies: ["Python", "TensorFlow", "OpenCV", "FastAPI", "React Native", "GCP"],
    category: "AI & Agriculture",
    githubUrl: "https://github.com/thenushan-sritharan/plant-disease",
    liveUrl: "https://plant-disease.example.com",
    caseStudyUrl: "#",
    featured: true,
    gradient: "from-green-500 to-emerald-600",
    images: ["/project-plant.png", "/project-plant-2.png"],
    integrations: [
      { name: "Python", icon: "code", color: "#3776ab" },
      { name: "TensorFlow", icon: "brain", color: "#ff6f00" },
      { name: "OpenCV", icon: "eye", color: "#00ff00" },
      { name: "FastAPI", icon: "api", color: "#009688" },
      { name: "React Native", icon: "react", color: "#61dafb" },
      { name: "GCP", icon: "cloud", color: "#4285f4" },
    ],
  },
];
