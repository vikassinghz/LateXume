import { ResumeData } from "../types";

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Mercer",
    title: "Senior Full-Stack Engineer",
    email: "alex.mercer@gmail.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "alexmercer.dev",
    github: "alexmercer",
    linkedin: "alex-mercer",
    summary: "Senior Full-Stack Engineer with 6+ years of expertise in architecting high-scale distributed microservices, building pixel-perfect responsive web applications, and deploying real-time data streaming pipelines. Proven track record of optimizing systems to reduce API latency by 40%+ and leading engineering squads to launch AI-integrated software products.",
    jobDescription: ""
  },
  experience: [
    {
      id: "exp-1",
      company: "Quantum Tech Corp",
      position: "Senior Full-Stack Engineer",
      startDate: "2023-09",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "",
      highlights: [
        "Led cross-functional migration of enterprise monolith to serverless AWS Node.js microservices, reducing operational server costs by 32% and boosting scalability.",
        "Architected real-time WebSocket messaging pipeline processing 12M+ daily active events with zero downtime, using Redis and Node.js.",
        "Pioneered implementation of client-side caching strategies in React/Next.js, reducing Core Web Vitals LCP by 1.2s and improving SEO rank."
      ]
    },
    {
      id: "exp-2",
      company: "Aether Laboratories",
      position: "Software Engineer II",
      startDate: "2021-06",
      endDate: "2023-08",
      location: "Seattle, WA",
      description: "",
      highlights: [
        "Developed and maintained high-fidelity data visualizers using React and D3.js, increasing daily active dashboard engagement by 25%.",
        "Collaborated with product designers to build a reusable Tailwind CSS design system, saving the frontend team 40+ engineering hours per sprint.",
        "Optimized complex PostgreSQL database queries and index schemas, accelerating dashboard load speeds by 45%."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Apollo Compiler Engine",
      role: "Lead Developer",
      startDate: "2024-01",
      endDate: "Present",
      technologies: ["Rust", "WebAssembly", "TypeScript", "React"],
      description: "",
      highlights: [
        "Authored high-performance WebAssembly compiler in Rust for reactive state serialization, enabling 8x faster local browser performance.",
        "Published project open-source, scaling to 2,400+ stars on GitHub and managing pull requests from 35+ global contributors."
      ],
      url: "github.com/alexmercer/apollo-engine"
    },
    {
      id: "proj-2",
      name: "Helix AI Document Agent",
      role: "Creator",
      startDate: "2023-03",
      endDate: "2023-07",
      technologies: ["Next.js", "FastAPI", "Python", "Google Gemini API"],
      description: "",
      highlights: [
        "Built a serverless AI document parser that extracts semantic actions and synthesizes key takeaways from 200+ page PDFs in under 5 seconds.",
        "Scaled architecture to support 15,000+ monthly active users with structured caching and query throttling."
      ],
      url: "helix-ai-agent.io"
    },
    {
      id: "proj-3",
      name: "Velo Distributed Store",
      role: "Creator",
      startDate: "2022-09",
      endDate: "2022-12",
      technologies: ["Go", "Redis", "gRPC", "Docker"],
      description: "",
      highlights: [
        "Built a custom in-memory key-value cache in Go that handles 50k+ write requests per second with sub-millisecond retrieval latency.",
        "Created an automated consistent-hashing ring to shard keys across cluster nodes, reducing network rebalancing overhead by 35%."
      ],
      url: "github.com/alexmercer/velo-store"
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science (Distributed Systems)",
      startDate: "2019-09",
      endDate: "2021-05",
      location: "Stanford, CA",
      description: "Graduate Coursework: Advanced Algorithms, Cloud Infrastructure, Deep Learning, Human-Computer Interaction."
    },
    {
      id: "edu-2",
      institution: "UC Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Electrical Engineering & Computer Sciences",
      startDate: "2015-09",
      endDate: "2019-05",
      location: "Berkeley, CA",
      description: "Graduated with Honors. Regnier Entrepreneurship scholar."
    }
  ],
  skills: [
    {
      id: "sk-1",
      category: "Languages",
      skills: ["JavaScript", "TypeScript", "Python", "Rust", "SQL", "Go", "HTML/CSS"]
    },
    {
      id: "sk-2",
      category: "Frameworks & Libraries",
      skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "FastAPI", "GraphQL"]
    },
    {
      id: "sk-3",
      category: "DevOps & Tools",
      skills: ["Docker", "Kubernetes", "AWS", "Git", "CI/CD Pipelines", "Redis", "PostgreSQL"]
    }
  ],
  languages: ["English (Native)", "Spanish (Conversational)"],
  interests: ["Open-source contributing", "Generative Art", "Marathon running", "Backcountry skiing"],
  customSections: []
};

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
    jobDescription: ""
  },
  experience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  customSections: []
};

