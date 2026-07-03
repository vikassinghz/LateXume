export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  jobDescription?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string; // Markdown or bullet points
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  description: string;
  highlights: string[];
  url: string;
}

export interface Skill {
  id: string;
  category: string; // e.g. "Languages", "Frameworks"
  skills: string[]; // e.g. ["JavaScript", "Python"]
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  languages: string[];
  interests: string[];
  customSections?: CustomSection[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type TemplateId = "classic-latex" | "swiss-modern" | "jakes-tech" | "deedy-two-col";

export interface PageSettings {
  template: TemplateId;
  fontFamily: "calibri" | "arial" | "helvetica" | "garamond" | "times-new-roman";
  fontSize: "sm" | "md" | "lg";
  marginSize: "compact" | "normal" | "wide";
  accentColor: string;
  lineSpacing: "tight" | "normal" | "loose";
}
