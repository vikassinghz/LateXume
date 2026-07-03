import React, { useState } from "react";
import { ResumeData, Experience, Project, Education, Skill, PageSettings } from "../types";
import { Plus, Trash, Sparkles, Wand2, Loader2, ArrowRight, Check, X, ChevronRight, HelpCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  darkMode: boolean;
  settings: PageSettings;
  scrollHeight: number;
}

export default function ResumeForm({ data, onChange, darkMode, settings, scrollHeight }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "projects" | "education" | "skills" | "others">("personal");
  const [showGuidelines, setShowGuidelines] = useState(true); // Open by default to highlight the instructions
  
  // State for AI helpers
  const [enhancingId, setEnhancingId] = useState<string | null>(null); // For experience/project bullets
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  
  // AI enhancement recommendation modal/overlay
  const [aiProposal, setAiProposal] = useState<{
    original: string;
    enhanced: string;
    applyCallback: (val: string) => void;
  } | null>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  // --- Experience Handlers ---
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "New Company Inc",
      position: "Software Engineer",
      startDate: "2024-01",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "",
      highlights: ["Designed and implemented a high-performance scalable API service.", "Optimized query execution times by 35% through custom index schemas."]
    };
    onChange({
      ...data,
      experience: [...data.experience, newExp]
    });
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const handleDeleteExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const handleAddExpHighlight = (expId: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: [...exp.highlights, "Led the design and delivery of microservices boosting app latency by 20%."]
          };
        }
        return exp;
      })
    });
  };

  const handleUpdateExpHighlight = (expId: string, hIndex: number, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => {
        if (exp.id === expId) {
          const updated = [...exp.highlights];
          updated[hIndex] = value;
          return { ...exp, highlights: updated };
        }
        return exp;
      })
    });
  };

  const handleDeleteExpHighlight = (expId: string, hIndex: number) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: exp.highlights.filter((_, idx) => idx !== hIndex)
          };
        }
        return exp;
      })
    });
  };

  // --- Projects Handlers ---
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: "New AI Project",
      role: "Creator",
      startDate: "2024-01",
      endDate: "Present",
      technologies: ["React", "TypeScript", "Node.js"],
      description: "",
      highlights: ["Built a real-time web interface using React and Tailwind CSS, increasing user session duration by 15%.", "Optimized asset rendering pipeline to achieve a perfect 100/100 Lighthouse performance score."],
      url: "github.com/username/project"
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    });
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  const handleAddProjHighlight = (projId: string) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => {
        if (proj.id === projId) {
          return {
            ...proj,
            highlights: [...proj.highlights, "Designed and deployed background workers in Go, processing 2k+ events/sec."]
          };
        }
        return proj;
      })
    });
  };

  const handleUpdateProjHighlight = (projId: string, hIndex: number, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => {
        if (proj.id === projId) {
          const updated = [...proj.highlights];
          updated[hIndex] = value;
          return { ...proj, highlights: updated };
        }
        return proj;
      })
    });
  };

  const handleDeleteProjHighlight = (projId: string, hIndex: number) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => {
        if (proj.id === projId) {
          return {
            ...proj,
            highlights: proj.highlights.filter((_, idx) => idx !== hIndex)
          };
        }
        return proj;
      })
    });
  };

  // --- Education Handlers ---
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "State University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2020-09",
      endDate: "2024-05",
      location: "City, ST",
      description: ""
    };
    onChange({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const handleDeleteEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  // --- Skills Handlers ---
  const handleAddSkillCategory = () => {
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      category: "New Skill Category",
      skills: ["Skill 1", "Skill 2"]
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill]
    });
  };

  const handleUpdateSkillCategoryName = (id: string, category: string) => {
    onChange({
      ...data,
      skills: data.skills.map(sk => sk.id === id ? { ...sk, category } : sk)
    });
  };

  const handleUpdateSkillTags = (id: string, tagString: string) => {
    const tags = tagString.split(",").map(s => s.trim()).filter(s => s.length > 0);
    onChange({
      ...data,
      skills: data.skills.map(sk => sk.id === id ? { ...sk, skills: tags } : sk)
    });
  };

  const handleDeleteSkillCategory = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter(sk => sk.id !== id)
    });
  };

  // --- Custom Sections Handlers ---
  const handleAddCustomSection = () => {
    const newSec = {
      id: `cust-${Date.now()}`,
      title: "Certifications",
      items: [
        {
          id: `item-${Date.now()}`,
          title: "AWS Certified Solutions Architect",
          subtitle: "Amazon Web Services",
          startDate: "2024",
          endDate: "",
          location: "",
          description: ""
        }
      ]
    };
    onChange({
      ...data,
      customSections: [...(data.customSections || []), newSec]
    });
  };

  const handleDeleteCustomSection = (sectionId: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).filter(sec => sec.id !== sectionId)
    });
  };

  const handleUpdateCustomSectionTitle = (sectionId: string, newTitle: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => 
        sec.id === sectionId ? { ...sec, title: newTitle } : sec
      )
    });
  };

  const handleAddCustomSectionItem = (sectionId: string) => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: "New Item",
      subtitle: "",
      startDate: "",
      endDate: "",
      location: "",
      description: ""
    };
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => 
        sec.id === sectionId ? { ...sec, items: [...sec.items, newItem] } : sec
      )
    });
  };

  const handleDeleteCustomSectionItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => 
        sec.id === sectionId ? { ...sec, items: sec.items.filter(item => item.id !== itemId) } : sec
      )
    });
  };

  const handleUpdateCustomSectionItem = (sectionId: string, itemId: string, field: string, value: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => 
        sec.id === sectionId 
          ? { 
              ...sec, 
              items: sec.items.map(item => 
                item.id === itemId ? { ...item, [field]: value } : item
              ) 
            } 
          : sec
      )
    });
  };

  // --- AI API CALLS ---
  const handleEnhanceBullet = async (originalText: string, jobTitle: string, company: string, applyCallback: (val: string) => void) => {
    const uniqueId = originalText + Date.now().toString();
    setEnhancingId(uniqueId);
    try {
      const res = await fetch("/api/gemini/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftText: originalText,
          jobTitle,
          companyName: company,
          jobDescription: data.personalInfo.jobDescription
        })
      });
      const resData = await res.json();
      if (res.ok && resData.enhanced) {
        setAiProposal({
          original: originalText,
          enhanced: resData.enhanced,
          applyCallback
        });
      } else {
        alert("Unable to enhance at this time: " + (resData.error || "Server issue"));
      }
    } catch (e: any) {
      alert("Error enhancing bullet point: " + e.message);
    } finally {
      setEnhancingId(null);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch("/api/gemini/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          experience: data.experience,
          skills: data.skills,
          jobDescription: data.personalInfo.jobDescription
        })
      });
      const resData = await res.json();
      if (res.ok && resData.summary) {
        setAiProposal({
          original: data.personalInfo.summary,
          enhanced: resData.summary,
          applyCallback: (val) => updatePersonalInfo("summary", val)
        });
      } else {
        alert("Summary generation failed: " + (resData.error || "Server error"));
      }
    } catch (e: any) {
      alert("Error generating summary: " + e.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const res = await fetch("/api/gemini/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.personalInfo.title,
          experienceList: data.experience
        })
      });
      const resData = await res.json();
      if (res.ok && resData.skills && resData.skills.length > 0) {
        // Suggest adding as a new category
        const newCategory: Skill = {
          id: `sk-ai-${Date.now()}`,
          category: "AI Recommended Skills",
          skills: resData.skills
        };
        onChange({
          ...data,
          skills: [...data.skills, newCategory]
        });
        alert("AI recommended skills have been added as a new skill category at the bottom!");
      } else {
        alert("Could not suggest skills: " + (resData.error || "Verify your experience and job title are entered."));
      }
    } catch (e: any) {
      alert("Error suggesting skills: " + e.message);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  return (
    <div id="resume-form-container" className="flex flex-col h-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] overflow-hidden">
      
      {/* Tab Selectors - Brutalist style tabs */}
      <div id="tabs-grid" className="grid grid-cols-3 md:grid-cols-6 border-b-2 border-black dark:border-zinc-700 font-mono text-[10px] md:text-xs uppercase tracking-wider text-center">
        {(["personal", "experience", "projects", "education", "skills", "others"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-btn-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`py-3 font-semibold transition-all duration-150 border-r md:last:border-r-0 border-b md:border-b-0 border-black dark:border-zinc-700 cursor-pointer
              ${activeTab === tab 
                ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900" 
                : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Fields Section */}
      <div id="form-scrollable-body" className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* --- PERSONAL PROFILE TAB --- */}
        {activeTab === "personal" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 font-sans"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span>[?]</span> Personal Metadata
              </h2>
              <p className="font-mono text-xs text-zinc-500">Contact & Info</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-750"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Target Job Title</label>
                <input
                  type="text"
                  value={data.personalInfo.title}
                  onChange={(e) => updatePersonalInfo("title", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-750"
                  placeholder="Lead Architect"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Email Address</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="john.doe@email.com"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Location (City, ST)</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Portfolio Website (no https://)</label>
                <input
                  type="text"
                  value={data.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="portfolio.io"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">GitHub Username</label>
                <input
                  type="text"
                  value={data.personalInfo.github}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="github-profile"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">LinkedIn Username</label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-sm focus:outline-none"
                  placeholder="linkedin-profile"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1 mt-4">
              <label className="font-mono text-xs uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                Target Job Description / Keywords (Optional)
              </label>
              <textarea
                value={data.personalInfo.jobDescription || ""}
                onChange={(e) => updatePersonalInfo("jobDescription", e.target.value)}
                rows={3}
                className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Paste target job description or core keywords here (e.g. 'Kubernetes, Go, AWS, high throughput'). AI helpers will match these naturally when enhancing/generating summary."
              />
            </div>

            <div className="flex flex-col space-y-1 mt-4">
              <div className="flex justify-between items-center">
                <label className="font-mono text-xs uppercase text-zinc-500 dark:text-zinc-400">Professional Summary</label>
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="flex items-center gap-1 font-mono text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {isGeneratingSummary ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                rows={4}
                className="p-2 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Write a summary or click generate to draft one using your added experience items..."
              />
            </div>
          </motion.div>
        )}

        {/* --- EXPERIENCE TAB --- */}
        {activeTab === "experience" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span>[+]</span> Work Experience
              </h2>
              <button
                onClick={handleAddExperience}
                className="flex items-center gap-1 font-mono text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-1.5 px-3 border-2 border-black font-semibold cursor-pointer"
              >
                <Plus size={14} /> ADD JOB
              </button>
            </div>

            <div className="space-y-6">
              {data.experience.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-mono text-zinc-400">
                  No experience items added. Click ADD JOB to start.
                </div>
              ) : (
                data.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 space-y-4 relative"
                  >
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash size={16} />
                    </button>

                    <span className="font-mono text-xs text-zinc-400">JOB RECORD #{idx + 1}</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Role / Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleUpdateExperience(exp.id, "position", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Time Period (e.g. 2021-06 - Present)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                            placeholder="Start"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                            placeholder="End"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Location (City, State)</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Job Highlights */}
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-700 pt-3">
                        <span className="font-mono text-xs uppercase text-zinc-500 font-semibold">Job Achievements (Bullet Points) — <span className="text-emerald-600 dark:text-emerald-400 font-bold">Recommend 3–5 bullets per role</span></span>
                        <button
                          onClick={() => handleAddExpHighlight(exp.id)}
                          className="flex items-center gap-1 font-mono text-xs text-black hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300 cursor-pointer"
                        >
                          <Plus size={12} /> ADD BULLET
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {exp.highlights.map((highlight, hIndex) => {
                          const isEnhancing = enhancingId === (highlight + exp.id);
                          return (
                            <div key={hIndex} className="flex gap-2 items-start group">
                              <span className="font-mono text-xs text-zinc-400 mt-2.5">[{hIndex + 1}]</span>
                              <div className="flex-1 flex flex-col space-y-1">
                                <textarea
                                  value={highlight}
                                  onChange={(e) => handleUpdateExpHighlight(exp.id, hIndex, e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none focus:border-black"
                                />
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleEnhanceBullet(highlight, exp.position, exp.company, (val) => handleUpdateExpHighlight(exp.id, hIndex, val))}
                                    disabled={isEnhancing}
                                    className="flex items-center gap-1 font-mono text-[10px] text-purple-600 dark:text-purple-400 hover:underline transition-all cursor-pointer mt-0.5"
                                  >
                                    {isEnhancing ? (
                                      <>
                                        <Loader2 size={10} className="animate-spin" />
                                        <span>Analyzing metric...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 size={10} />
                                        <span>Quantify & Improve with AI</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteExpHighlight(exp.id, hIndex)}
                                className="p-1.5 text-zinc-400 hover:text-red-500 mt-1 cursor-pointer"
                                title="Remove Bullet"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span>[//]</span> Engineering Projects
              </h2>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1 font-mono text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-1.5 px-3 border-2 border-black font-semibold cursor-pointer"
              >
                <Plus size={14} /> ADD PROJECT
              </button>
            </div>

            <div className="space-y-6">
              {data.projects.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-mono text-zinc-400">
                  No project records found. Click ADD PROJECT.
                </div>
              ) : (
                data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 space-y-4 relative"
                  >
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash size={16} />
                    </button>

                    <span className="font-mono text-xs text-zinc-400">PROJECT RECORD #{idx + 1}</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => handleUpdateProject(proj.id, "name", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Role (e.g. Creator / Team Lead)</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => handleUpdateProject(proj.id, "role", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Technologies (Comma Separated)</label>
                        <input
                          type="text"
                          value={proj.technologies.join(", ")}
                          onChange={(e) => handleUpdateProject(proj.id, "technologies", e.target.value.split(",").map(t => t.trim()))}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Project URL / GitHub</label>
                        <input
                          type="text"
                          value={proj.url}
                          onChange={(e) => handleUpdateProject(proj.id, "url", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          placeholder="github.com/..."
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Timeframe</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proj.startDate}
                            onChange={(e) => handleUpdateProject(proj.id, "startDate", e.target.value)}
                            placeholder="Start"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                          <input
                            type="text"
                            value={proj.endDate}
                            onChange={(e) => handleUpdateProject(proj.id, "endDate", e.target.value)}
                            placeholder="End"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-700 pt-3">
                        <span className="font-mono text-xs uppercase text-zinc-500 font-semibold">Project Highlights — <span className="text-emerald-600 dark:text-emerald-400 font-bold">Recommend 3–5 bullets per project</span></span>
                        <button
                          onClick={() => handleAddProjHighlight(proj.id)}
                          className="flex items-center gap-1 font-mono text-xs text-black hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300 cursor-pointer"
                        >
                          <Plus size={12} /> ADD HIGHLIGHT
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {proj.highlights.map((highlight, hIndex) => {
                          const isEnhancing = enhancingId === (highlight + proj.id);
                          return (
                            <div key={hIndex} className="flex gap-2 items-start">
                              <span className="font-mono text-xs text-zinc-400 mt-2.5">[{hIndex + 1}]</span>
                              <div className="flex-1 flex flex-col space-y-1">
                                <textarea
                                  value={highlight}
                                  onChange={(e) => handleUpdateProjHighlight(proj.id, hIndex, e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none focus:border-black"
                                />
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleEnhanceBullet(highlight, "Lead Developer", proj.name, (val) => handleUpdateProjHighlight(proj.id, hIndex, val))}
                                    disabled={isEnhancing}
                                    className="flex items-center gap-1 font-mono text-[10px] text-purple-600 dark:text-purple-400 hover:underline transition-all cursor-pointer mt-0.5"
                                  >
                                    {isEnhancing ? (
                                      <>
                                        <Loader2 size={10} className="animate-spin" />
                                        <span>Analyzing metric...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 size={10} />
                                        <span>Quantify & Improve with AI</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteProjHighlight(proj.id, hIndex)}
                                className="p-1.5 text-zinc-400 hover:text-red-500 mt-1 cursor-pointer"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- EDUCATION TAB --- */}
        {activeTab === "education" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span>[A]</span> Academic Education
              </h2>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-1 font-mono text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-1.5 px-3 border-2 border-black font-semibold cursor-pointer"
              >
                <Plus size={14} /> ADD SCHOOL
              </button>
            </div>

            <div className="space-y-6">
              {data.education.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-mono text-zinc-400">
                  No academic history added. Click ADD SCHOOL.
                </div>
              ) : (
                data.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 space-y-4 relative"
                  >
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete School"
                    >
                      <Trash size={16} />
                    </button>

                    <span className="font-mono text-xs text-zinc-400">EDUCATION RECORD #{idx + 1}</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">School / Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Degree (e.g. Master of Science)</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Field of Study / Major</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleUpdateEducation(edu.id, "fieldOfStudy", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Location (City, ST)</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => handleUpdateEducation(edu.id, "location", e.target.value)}
                          className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-mono text-xs uppercase text-zinc-400">Timeline (e.g. 2017-09 - 2021-05)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "startDate", e.target.value)}
                            placeholder="Start"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                            placeholder="End"
                            className="w-1/2 p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-mono text-xs uppercase text-zinc-400">Academic Details (Awards / Courses / Thesis)</label>
                      <textarea
                        value={edu.description}
                        onChange={(e) => handleUpdateEducation(edu.id, "description", e.target.value)}
                        rows={2}
                        className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none focus:border-black"
                        placeholder="GPA, Honors, key modules, research specialties..."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- SKILLS TAB --- */}
        {activeTab === "skills" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-display font-bold text-xl uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>[S]</span> Capabilities & Skills
                </h2>
                <span className="font-mono text-[10px] text-zinc-400 mt-0.5">Comma separated list of keywords</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSuggestSkills}
                  disabled={isSuggestingSkills}
                  className="flex items-center gap-1 font-mono text-xs bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-300 py-1.5 px-3 font-semibold cursor-pointer transition-colors"
                >
                  {isSuggestingSkills ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Suggest Skills</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleAddSkillCategory}
                  className="flex items-center gap-1 font-mono text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-1.5 px-3 border-2 border-black font-semibold cursor-pointer"
                >
                  <Plus size={14} /> ADD CATEGORY
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {data.skills.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-mono text-zinc-400">
                  No skills mapped. Add a capability sector to begin.
                </div>
              ) : (
                data.skills.map((sk, idx) => (
                  <div
                    key={sk.id}
                    className="p-4 border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 relative flex flex-col md:flex-row gap-4 items-start"
                  >
                    <button
                      onClick={() => handleDeleteSkillCategory(sk.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash size={16} />
                    </button>

                    <div className="w-full md:w-1/3 flex flex-col space-y-1">
                      <label className="font-mono text-xs uppercase text-zinc-400">Category Name</label>
                      <input
                        type="text"
                        value={sk.category}
                        onChange={(e) => handleUpdateSkillCategoryName(sk.id, e.target.value)}
                        className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        placeholder="e.g. Frontend, DevOps"
                      />
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col space-y-1">
                      <label className="font-mono text-xs uppercase text-zinc-400">Skills (Separated by Commas)</label>
                      <textarea
                        value={sk.skills.join(", ")}
                        onChange={(e) => handleUpdateSkillTags(sk.id, e.target.value)}
                        rows={2}
                        className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:border-black"
                        placeholder="React, Vue, TypeScript, Tailwind"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- OTHERS / CUSTOM SECTIONS TAB --- */}
        {activeTab === "others" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b-2 border-black dark:border-zinc-700 pb-4">
              <div>
                <h2 className="font-mono font-bold text-sm uppercase flex items-center gap-2 text-zinc-900 dark:text-white">
                  <span>[O]</span> Custom / Others Sections
                </h2>
                <span className="font-mono text-[10px] text-zinc-400 mt-0.5">
                  Add custom sections such as Certifications, Awards, Publications, Volunteering, Languages, or Interests.
                </span>
              </div>
              <button
                onClick={handleAddCustomSection}
                className="flex items-center gap-1 font-mono text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-1.5 px-3 border-2 border-black font-semibold cursor-pointer transition-all active:scale-95"
              >
                <Plus size={14} /> ADD SECTION
              </button>
            </div>

            <div className="space-y-8">
              {(!data.customSections || data.customSections.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-mono text-zinc-400">
                  No custom sections yet. Add your certifications, awards, or others to begin!
                </div>
              ) : (
                data.customSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-6 border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 relative space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(100,100,100,0.5)]"
                  >
                    <button
                      onClick={() => handleDeleteCustomSection(sec.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash size={16} />
                    </button>

                    <div className="w-full md:w-1/2 flex flex-col space-y-1">
                      <label className="font-mono text-xs uppercase text-zinc-400">Section Title (e.g. Certifications, Awards)</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateCustomSectionTitle(sec.id, e.target.value)}
                        className="p-2 border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none"
                        placeholder="e.g. Certifications"
                      />
                    </div>

                    <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs uppercase tracking-wider font-semibold">Items in {sec.title}</span>
                        <button
                          onClick={() => handleAddCustomSectionItem(sec.id)}
                          className="flex items-center gap-1 font-mono text-[10px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-1 px-2 border border-black dark:border-zinc-700 font-semibold cursor-pointer"
                        >
                          <Plus size={12} /> ADD ITEM
                        </button>
                      </div>

                      {sec.items.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-400">
                          No items in this section. Add an item.
                        </div>
                      ) : (
                        sec.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 relative space-y-3"
                          >
                            <button
                              onClick={() => handleDeleteCustomSectionItem(sec.id, item.id)}
                              className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash size={14} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex flex-col space-y-1">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">Item Title (e.g. Award Name, Certificate)</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "title", e.target.value)}
                                  className="p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none"
                                  placeholder="e.g. AWS Certified Solutions Architect"
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">Subtitle / Organization / Issuer</label>
                                <input
                                  type="text"
                                  value={item.subtitle || ""}
                                  onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "subtitle", e.target.value)}
                                  className="p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none"
                                  placeholder="e.g. Amazon Web Services"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="flex flex-col space-y-1">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">Start Date / Date Received</label>
                                <input
                                  type="text"
                                  value={item.startDate || ""}
                                  onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "startDate", e.target.value)}
                                  className="p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none"
                                  placeholder="e.g. 2023 or Jan 2023"
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">End Date / Expiration (Optional)</label>
                                <input
                                  type="text"
                                  value={item.endDate || ""}
                                  onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "endDate", e.target.value)}
                                  className="p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none"
                                  placeholder="e.g. Present or 2026"
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">Location (Optional)</label>
                                <input
                                  type="text"
                                  value={item.location || ""}
                                  onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "location", e.target.value)}
                                  className="p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none"
                                  placeholder="e.g. Remote"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="font-mono text-[10px] uppercase text-zinc-400">Description / Highlights</label>
                                <button
                                  onClick={() => handleEnhanceBullet(item.description || "", item.title, sec.title, (enhancedVal) => {
                                    handleUpdateCustomSectionItem(sec.id, item.id, "description", enhancedVal);
                                  })}
                                  className="flex items-center gap-1 font-mono text-[9px] text-purple-600 hover:text-purple-700 dark:text-purple-400 cursor-pointer"
                                >
                                  <Sparkles size={11} /> AI Enhance Description
                                </button>
                              </div>
                              <textarea
                                value={item.description || ""}
                                onChange={(e) => handleUpdateCustomSectionItem(sec.id, item.id, "description", e.target.value)}
                                rows={2}
                                className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none focus:border-black"
                                placeholder="Describe any relevant credentials, scores, or information."
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

      </div>

      {/* AI SUGGESTION MODAL OVERLAY */}
      <AnimatePresence>
        {aiProposal && (
          <div id="ai-modal-overlay" className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-white dark:bg-zinc-950 border-4 border-black dark:border-zinc-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b-4 border-black dark:border-zinc-700 bg-zinc-900 text-white dark:bg-zinc-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider">
                  <Sparkles size={16} className="text-purple-400" />
                  <span>AI Copyeditor Optimization</span>
                </div>
                <button
                  onClick={() => setAiProposal(null)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Draft Original</span>
                  <div className="p-3 border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 text-xs font-sans italic rounded">
                    "{aiProposal.original}"
                  </div>
                </div>

                <div className="flex justify-center text-purple-500">
                  <ArrowRight size={18} className="rotate-90 md:rotate-0" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block">
                      Google XYZ Standard Recommendation
                    </span>
                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold">
                      Quantified Achievement
                    </span>
                  </div>
                  <div className="p-3 border-2 border-purple-500 bg-purple-50/20 dark:bg-purple-950/10 text-zinc-900 dark:text-white text-xs font-sans font-medium rounded shadow-[2px_2px_0px_0px_rgba(147,51,234,0.15)]">
                    {aiProposal.enhanced}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 flex justify-end gap-3 font-mono text-xs uppercase">
                <button
                  onClick={() => setAiProposal(null)}
                  className="px-4 py-2 border-2 border-black hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Reject Change
                </button>
                <button
                  onClick={() => {
                    aiProposal.applyCallback(aiProposal.enhanced);
                    setAiProposal(null);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border-2 border-black font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Accept Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
