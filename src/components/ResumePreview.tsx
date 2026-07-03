import React, { useId, useState } from "react";
import { ResumeData, PageSettings, TemplateId } from "../types";
import { ZoomIn, ZoomOut, Maximize2, ExternalLink, Github, Linkedin, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface ATSMetric {
  score: number;
  categoryScores: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
    education: number;
    projects: number;
    keywords: number;
  };
  tips: string[];
}

function evaluateATS(data: ResumeData): ATSMetric {
  let contactScore = 0;
  let summaryScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  let educationScore = 0;
  let projectsScore = 0;
  let keywordsScore = 0;
  const tips: string[] = [];

  const p = data.personalInfo;

  // 1. Contact (Max 15)
  if (p.email) contactScore += 4;
  else tips.push("Add a professional email address for recruiter contact.");

  if (p.phone) contactScore += 4;
  else tips.push("Include a phone number for direct outreach.");

  if (p.linkedin) contactScore += 4;
  else tips.push("Add your LinkedIn profile link to verify your professional presence.");

  if (p.github || p.website) contactScore += 3;
  else tips.push("Include a GitHub or personal portfolio website to demonstrate active work.");

  // 2. Summary (Max 10)
  if (p.summary) {
    summaryScore += 5;
    const len = p.summary.length;
    if (len >= 80 && len <= 350) {
      summaryScore += 5;
    } else if (len < 80) {
      tips.push("Your summary is too brief. Expand it to 100-300 characters to effectively frame your expertise.");
    } else {
      tips.push("Your summary is quite long. Keep it concise (under 3 lines / ~300 characters) to optimize ATS scan readability.");
    }
  } else {
    tips.push("Write a compelling professional summary highlighting key skills and career goals.");
  }

  // 3. Experience (Max 25)
  const expCount = data.experience?.length || 0;
  if (expCount > 0) {
    experienceScore += 10;
    if (expCount >= 2) {
      experienceScore += 5;
    } else {
      tips.push("Add at least 2 distinct professional experiences to show a progressive career trajectory.");
    }

    // Check highlights quality
    let hasBullets = true;
    let usesActionVerbs = false;
    const actionVerbs = ["built", "developed", "led", "managed", "scaled", "created", "designed", "implemented", "optimized", "spearheaded", "engineered", "archit", "accelerated", "reduced", "increased", "boosted"];
    
    data.experience.forEach(exp => {
      if (!exp.highlights || exp.highlights.length === 0) {
        hasBullets = false;
      } else {
        exp.highlights.forEach(bullet => {
          const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
          if (actionVerbs.some(verb => firstWord?.startsWith(verb))) {
            usesActionVerbs = true;
          }
        });
      }
    });

    if (hasBullets) {
      experienceScore += 5;
    } else {
      tips.push("Ensure all experience roles contain specific bullet highlights detailing your achievements.");
    }

    if (usesActionVerbs) {
      experienceScore += 5;
    } else {
      tips.push("Enhance bullet points with strong industry action verbs (e.g., 'Engineered', 'Optimized', 'Spearheaded').");
    }
  } else {
    tips.push("Add your work history/experience; this is highly crucial for matching job role keywords.");
  }

  // 4. Skills (Max 20)
  const skillCats = data.skills?.length || 0;
  let totalSkillsCount = 0;
  if (data.skills) {
    data.skills.forEach(s => {
      totalSkillsCount += s.skills?.length || 0;
    });
  }

  if (skillCats > 0) {
    skillsScore += 8;
    if (skillCats >= 2) {
      skillsScore += 4;
    } else {
      tips.push("Categorize skills into groups (e.g. 'Languages', 'Libraries') for cleaner ATS parsing.");
    }

    if (totalSkillsCount >= 8) {
      skillsScore += 8;
    } else if (totalSkillsCount >= 4) {
      skillsScore += 4;
      tips.push("List more specific technical skills to match ATS scanning keywords.");
    } else {
      tips.push("Increase the number of listed technical skills (aim for at least 8 tools/frameworks).");
    }
  } else {
    tips.push("Include a structured Skills section; this is a high-weight keyword parsing zone.");
  }

  // 5. Education (Max 10)
  const eduCount = data.education?.length || 0;
  if (eduCount > 0) {
    educationScore += 10;
  } else {
    tips.push("Add your educational background (degree or certifications) to clear baseline requirements.");
  }

  // 6. Projects (Max 10)
  const projCount = data.projects?.length || 0;
  if (projCount > 0) {
    projectsScore += 5;
    if (projCount >= 3) {
      projectsScore += 5;
    } else {
      tips.push("Include at least 3 detailed portfolio projects to prove hands-on application of your stack.");
    }
  } else {
    tips.push("Add a Projects section to showcase code repositories, custom products, or academic achievements.");
  }

  // 7. Keyword Match (Max 10)
  if (p.jobDescription && p.jobDescription.trim().length > 0) {
    const commonKeywords = [
      "react", "vue", "angular", "nextjs", "typescript", "javascript", "python", "node", "express", 
      "java", "spring", "docker", "kubernetes", "aws", "gcp", "azure", "sql", "postgresql", "mongodb",
      "redis", "graphql", "rest", "api", "git", "ci/cd", "agile", "scrum", "machine learning", "ai",
      "testing", "jest", "cypress", "tailwindcss", "css", "html", "security", "linux"
    ];
    
    const jdText = p.jobDescription.toLowerCase();
    const jdKeywords = commonKeywords.filter(kw => jdText.includes(kw));
    
    if (jdKeywords.length > 0) {
      const resumeText = JSON.stringify(data).toLowerCase();
      const matched = jdKeywords.filter(kw => resumeText.includes(kw));
      const unmatched = jdKeywords.filter(kw => !resumeText.includes(kw));
      
      const matchRatio = matched.length / jdKeywords.length;
      keywordsScore = Math.round(matchRatio * 10);
      
      if (unmatched.length > 0) {
        const listToDisplay = unmatched.slice(0, 3).map(k => k.toUpperCase());
        tips.push(`Include target keywords from the job description to pass ATS filters: ${listToDisplay.join(", ")}`);
      }
    } else {
      keywordsScore = 10;
    }
  } else {
    keywordsScore = 10;
  }

  const score = contactScore + summaryScore + experienceScore + skillsScore + educationScore + projectsScore + keywordsScore;

  return {
    score: Math.min(100, Math.max(0, score)),
    categoryScores: {
      contact: contactScore,
      summary: summaryScore,
      experience: experienceScore,
      skills: skillsScore,
      education: educationScore,
      projects: projectsScore,
      keywords: keywordsScore
    },
    tips: tips.length > 0 ? tips : ["Your resume matches top ATS scanning standards! Ready for high-impact application."]
  };
}

export function getExperienceYears(data: ResumeData): number {
  if (!data.experience || data.experience.length === 0) return 0;
  let totalYears = 0;
  data.experience.forEach(exp => {
    const start = exp.startDate || "";
    const end = exp.endDate || "";
    
    const startYearMatch = start.match(/(\d{4})/);
    const endYearMatch = end.match(/(\d{4})/);
    
    const sy = startYearMatch ? parseInt(startYearMatch[1]) : 2020;
    const ey = endYearMatch ? parseInt(endYearMatch[1]) : (end.toLowerCase().includes("present") ? new Date().getFullYear() : 2024);
    
    totalYears += Math.max(1, ey - sy);
  });
  return totalYears;
}

interface ResumePreviewProps {
  data: ResumeData;
  settings: PageSettings;
  zoom: number;
  onZoomChange: (val: number) => void;
  onDataChange?: (val: ResumeData) => void;
  scrollHeight: number;
  onScrollHeightChange: (val: number) => void;
}

export default function ResumePreview({
  data,
  settings,
  zoom,
  onZoomChange,
  onDataChange,
  scrollHeight,
  onScrollHeightChange
}: ResumePreviewProps) {
  const p = data.personalInfo;
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);
  const ats = evaluateATS(data);
  const isSenior = getExperienceYears(data) >= 8;

  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [isFittingPage, setIsFittingPage] = useState(false);
  const [fitError, setFitError] = useState<string | null>(null);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      onScrollHeightChange(el.scrollHeight);
    });
    observer.observe(el);
    onScrollHeightChange(el.scrollHeight);
    return () => {
      observer.disconnect();
    };
  }, [data, settings, onScrollHeightChange]);

  const isOverflown = scrollHeight > 1130;
  const isUnderflown = scrollHeight < 950;

  const handleFitToPage = async () => {
    if (!onDataChange) return;
    setIsFittingPage(true);
    setFitError(null);
    try {
      const response = await fetch("/api/gemini/fit-to-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: data,
          targetDirection: isOverflown ? "compress" : "expand",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize resume pages.");
      }

      const resData = await response.json();
      if (resData.updatedData && Object.keys(resData.updatedData).length > 0) {
        onDataChange(resData.updatedData);
      } else {
        throw new Error("No updated data received.");
      }
    } catch (err: any) {
      console.error("Fit-to-page failure:", err);
      setFitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsFittingPage(false);
    }
  };

  // Robust date formatting to enforce single format "Jan 2023 – Present"
  const formatResumeDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    if (trimmed.toLowerCase() === "present") return "Present";

    // Check if it matches YYYY-MM or YYYY-MM-DD
    const yyyyMmRegex = /^(\d{4})-(\d{1,2})(-\d{1,2})?$/;
    const match = trimmed.match(yyyyMmRegex);
    if (match) {
      const year = match[1];
      const monthIndex = parseInt(match[2], 10) - 1;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${months[monthIndex]} ${year}`;
      }
      return year;
    }

    // Check if it's just a year
    if (/^\d{4}$/.test(trimmed)) {
      return trimmed;
    }

    // MM/YYYY
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const monthIndex = parseInt(slashMatch[1], 10) - 1;
      const year = slashMatch[2];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${months[monthIndex]} ${year}`;
      }
    }

    // Fallback: Clean string
    return trimmed
      .split(/\s+/)
      .map(word => {
        if (word.toLowerCase() === "present") return "Present";
        const lower = word.toLowerCase();
        if (lower.startsWith("jan")) return "Jan";
        if (lower.startsWith("feb")) return "Feb";
        if (lower.startsWith("mar")) return "Mar";
        if (lower.startsWith("apr")) return "Apr";
        if (lower.startsWith("may")) return "May";
        if (lower.startsWith("jun")) return "Jun";
        if (lower.startsWith("jul")) return "Jul";
        if (lower.startsWith("aug")) return "Aug";
        if (lower.startsWith("sep")) return "Sep";
        if (lower.startsWith("oct")) return "Oct";
        if (lower.startsWith("nov")) return "Nov";
        if (lower.startsWith("dec")) return "Dec";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const formatResumeDateRange = (start: string, end: string): string => {
    const formattedStart = formatResumeDate(start) || "Jan 2023";
    const formattedEnd = formatResumeDate(end) || "Present";
    return `${formattedStart} – ${formattedEnd}`;
  };

  // Font family mapping
  const getFontClass = () => {
    switch (settings.fontFamily) {
      case "calibri":
        return "font-calibri";
      case "arial":
        return "font-arial";
      case "helvetica":
        return "font-helvetica";
      case "garamond":
        return "font-garamond";
      case "times-new-roman":
        return "font-times-new-roman";
      default:
        return "font-calibri";
    }
  };

  // Point-based typography scale, exact margin size calculations, and line spacing multipliers
  const getDocStyles = () => {
    let bodyPt = 11;
    if (settings.fontSize === "sm") bodyPt = 10;
    if (settings.fontSize === "lg") bodyPt = 12;

    // Fixed / default mappings based on body text sizing selection
    const namePt = settings.fontSize === "sm" ? 18 : settings.fontSize === "lg" ? 24 : 21;
    const headingPt = settings.fontSize === "sm" ? 11.5 : settings.fontSize === "lg" ? 13 : 12.5; // section headings: 12-13pt
    const titlePt = settings.fontSize === "sm" ? 10.5 : settings.fontSize === "lg" ? 12 : 11.5; // job titles / company names: 11.5pt
    
    const bodySize = `${bodyPt}pt`;
    const nameSize = `${namePt}pt`;
    const headingSize = `${headingPt}pt`;
    const titleSize = `${titlePt}pt`;

    // Margins (Top/Bottom default 0.5", Left/Right default 0.6")
    let paddingStyle = {};
    if (settings.marginSize === "compact") {
      // 0.4in = 38px
      paddingStyle = { paddingTop: "0.4in", paddingBottom: "0.4in", paddingLeft: "0.4in", paddingRight: "0.4in" };
    } else if (settings.marginSize === "wide") {
      // Top/Bottom 0.75in = 72px, Left/Right 0.75in = 72px
      paddingStyle = { paddingTop: "0.75in", paddingBottom: "0.75in", paddingLeft: "0.75in", paddingRight: "0.75in" };
    } else {
      // normal (default) -> Top/Bottom: 0.5", Left/Right: 0.6"
      paddingStyle = { paddingTop: "0.5in", paddingBottom: "0.5in", paddingLeft: "0.6in", paddingRight: "0.6in" };
    }

    // Line spacing: 1.0 - 1.15 for body/bullet text
    let lineSpacingVal = 1.1; // normal
    if (settings.lineSpacing === "tight") lineSpacingVal = 1.0;
    if (settings.lineSpacing === "loose") lineSpacingVal = 1.15;

    // Spacing after bullets / entries: 6-8pt (let's map it cleanly to settings.lineSpacing)
    let bulletSpacing = "4pt";
    let entrySpacing = "7pt";
    let sectionSpacing = "12pt";

    if (settings.lineSpacing === "tight") {
      bulletSpacing = "3pt";
      entrySpacing = "6pt";
      sectionSpacing = "10pt";
    } else if (settings.lineSpacing === "loose") {
      bulletSpacing = "5pt";
      entrySpacing = "8pt";
      sectionSpacing = "14pt";
    }

    return {
      bodySize,
      nameSize,
      headingSize,
      titleSize,
      paddingStyle,
      lineSpacingVal,
      bulletSpacing,
      entrySpacing,
      sectionSpacing,
    };
  };

  const docStyles = getDocStyles();

  // Dynamic style parameters
  const accentStyle = { color: settings.accentColor };
  const borderAccentStyle = { borderColor: settings.accentColor };
  const bgAccentStyle = { backgroundColor: settings.accentColor };

  return (
    <div id="resume-preview-panel" className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] overflow-hidden">
      
      {/* Zoom and Preview Header */}
      <div id="preview-toolbar" className="no-print p-3 bg-zinc-900 text-white dark:bg-zinc-950 border-b-2 border-black flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase text-white">Letter Preview</span>
          <span className="bg-emerald-900/80 text-emerald-100 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase">
            A4/Letter Scaled
          </span>
        </div>
        
        {/* Zoom adjustment */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 5))}
            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-12 text-center text-white font-bold">{zoom}%</span>
          <button
            onClick={() => onZoomChange(Math.min(150, zoom + 5))}
            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => onZoomChange(100)}
            className="p-1.5 ml-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* ATS Match Score Indicator (no-print) */}
      <div className="no-print p-4 bg-zinc-900 text-white dark:bg-zinc-950 border-b-2 border-black flex flex-col gap-3 font-sans select-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Side: Score Display */}
          <div className="flex items-center gap-3">
            <div className={`flex flex-col items-center justify-center h-12 w-12 rounded-full border-2 border-black font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] ${
              ats.score >= 80 
                ? "bg-emerald-950 text-emerald-200 border-emerald-500" 
                : ats.score >= 55 
                  ? "bg-amber-950 text-amber-200 border-amber-500" 
                  : "bg-rose-950 text-rose-200 border-rose-500"
            }`}>
              <span className="text-lg font-black leading-none">{ats.score}</span>
              <span className="text-[7.5px] font-bold uppercase tracking-wider opacity-80">Score</span>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider text-white">ATS Keyword Fit</span>
                {ats.score >= 80 ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <Sparkles size={11} className="animate-pulse" /> Strong Match
                  </span>
                ) : ats.score >= 55 ? (
                  <span className="text-[10px] text-amber-400 font-bold">Average Match</span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-bold">Needs Work</span>
                )}
              </div>
              <p className="text-[10.5px] text-zinc-300 font-medium">
                Draft evaluated against standard industry resume parsers.
              </p>
            </div>
          </div>

          {/* Center Side: Specific Keyword/Section Checkboxes */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded border ${
              ats.categoryScores.experience > 0 
                ? "bg-emerald-950/60 text-emerald-200 border-emerald-800" 
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700"
            }`}>
              {ats.categoryScores.experience > 0 ? <CheckCircle2 size={11} className="text-emerald-400" /> : <AlertCircle size={11} />}
              <span className="font-semibold">Experience</span>
            </div>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded border ${
              ats.categoryScores.skills > 0 
                ? "bg-emerald-950/60 text-emerald-200 border-emerald-800" 
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700"
            }`}>
              {ats.categoryScores.skills > 0 ? <CheckCircle2 size={11} className="text-emerald-400" /> : <AlertCircle size={11} />}
              <span className="font-semibold">Skills</span>
            </div>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded border ${
              ats.categoryScores.education > 0 
                ? "bg-emerald-950/60 text-emerald-200 border-emerald-800" 
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700"
            }`}>
              {ats.categoryScores.education > 0 ? <CheckCircle2 size={11} className="text-emerald-400" /> : <AlertCircle size={11} />}
              <span className="font-semibold">Education</span>
            </div>
          </div>

          {/* Right Side: Tips Toggle Button */}
          <button
            onClick={() => setIsTipsExpanded(!isTipsExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black bg-zinc-800 text-white hover:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded cursor-pointer"
          >
            <span>{ats.tips.length === 1 && ats.score === 100 ? "Perfect Score" : `${ats.tips.length} Improvements`}</span>
            {isTipsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expanded Suggestions List */}
        {isTipsExpanded && (
          <div className="mt-1 p-3 bg-zinc-950/40 border-2 border-dashed border-zinc-700 rounded space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1 border-b border-zinc-800 pb-1.5">
              <Sparkles size={12} className="text-amber-500" /> Actionable Improvement Checklist
            </h4>
            <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
              {ats.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-200 py-0.5 font-medium">
                  <span className="text-zinc-400 font-mono text-[10px] mt-0.5">[{idx + 1}]</span>
                  <span className="leading-normal">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sheet Frame wrapper to centering */}
      <div id="canvas-scroll-container" className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-zinc-200/50 dark:bg-zinc-900/60 no-print">
        <div
          style={{
            maxHeight: !isSenior ? `${1122 * (zoom / 100)}px` : "none",
            overflow: !isSenior ? "hidden" : "visible",
            position: "relative"
          }}
          className="relative shadow-xl"
        >
          <div
            id="resume-printable-canvas"
            ref={canvasRef}
            style={{ ...docStyles.paddingStyle, transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className={`relative w-[794px] min-h-[1096px] bg-white text-zinc-900 border border-zinc-300/60 dark:border-zinc-700/60 transition-transform print-container
              ${getFontClass()} flex flex-col justify-between`}
          >
          {/* RENDER CHOSEN TEMPLATE */}
          <div className="flex-1">
            {settings.template === "classic-latex" && (
              <ClassicLatexTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "swiss-modern" && (
              <SwissModernTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "jakes-tech" && (
              <JakesTechTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "deedy-two-col" && (
              <DeedyTwoColTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
          </div>

          {/* Watermark-free, blank footer as requested */}
          </div>
        </div>
      </div>

      {/* --- DUPLICATED CANVAS PURELY FOR BROWSER PRINT ENGINE (PIXEL PERFECT 100% SCALE) --- */}
      <div className="print-only hidden">
        <div
          style={{ ...docStyles.paddingStyle }}
          className={`w-[794px] min-h-[1110px] bg-white text-zinc-900 print-container ${getFontClass()} flex flex-col justify-between`}
        >
          <div className="flex-1">
            {settings.template === "classic-latex" && (
              <ClassicLatexTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "swiss-modern" && (
              <SwissModernTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "jakes-tech" && (
              <JakesTechTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
            {settings.template === "deedy-two-col" && (
              <DeedyTwoColTemplate data={data} settings={settings} accentStyle={accentStyle} borderAccentStyle={borderAccentStyle} bgAccentStyle={bgAccentStyle} docStyles={docStyles} formatResumeDateRange={formatResumeDateRange} formatResumeDate={formatResumeDate} />
            )}
          {/* Watermark-free, blank print footer as requested */}
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 1. CLASSIC ACADEMIC LATEX TEMPLATE
// ==========================================
function ClassicLatexTemplate({ data, accentStyle, docStyles, formatResumeDateRange }: any) {
  const p = data.personalInfo;
  return (
    <div className="text-black text-left font-normal" style={{ fontSize: docStyles.bodySize, lineHeight: docStyles.lineSpacingVal }}>
      {/* Centered Name / Title Header */}
      <div className="text-center" style={{ marginBottom: docStyles.sectionSpacing }}>
        <h1 className="font-bold tracking-tight text-black" style={{ fontSize: docStyles.nameSize, ...accentStyle, marginBottom: "4px" }}>{p.fullName}</h1>
        <p className="tracking-widest uppercase font-semibold text-black" style={{ fontSize: docStyles.titleSize }}>{p.title}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-black mt-1" style={{ fontSize: docStyles.bodySize }}>
          {p.phone && <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:underline text-black"><Phone size={11} /> {p.phone}</a>}
          {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:underline text-black"><Mail size={11} /> {p.email}</a>}
          {p.website && <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-black"><ExternalLink size={11} /> {p.website}</a>}
          {p.github && <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-black"><Github size={11} /> github.com/{p.github}</a>}
          {p.linkedin && <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-black"><Linkedin size={11} /> linkedin.com/in/{p.linkedin}</a>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            Professional Summary
          </h2>
          <p className="text-black text-justify text-pretty font-normal" style={{ textWrap: "pretty" as any }}>{p.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            Professional Experience
          </h2>
          <div>
            {data.experience.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: docStyles.entrySpacing }}>
                <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                  <span>{exp.company}</span>
                  <span className="font-normal" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(exp.startDate, exp.endDate)}</span>
                </div>
                <div className="flex justify-between items-baseline text-black italic font-medium" style={{ fontSize: docStyles.bodySize, marginBottom: "4px" }}>
                  <span>{exp.position}</span>
                  <span className="not-italic">{exp.location}</span>
                </div>
                <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal">
                  {exp.highlights.map((high: string, idx: number) => (
                    <li key={idx} style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            Selected Projects
          </h2>
          <div>
            {data.projects.map((proj: any) => (
              <div key={proj.id} style={{ marginBottom: docStyles.entrySpacing }}>
                <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                  <span>{proj.name} <span className="font-normal italic" style={{ fontSize: docStyles.bodySize }}>| {proj.technologies.join(", ")}</span></span>
                  <span className="font-normal" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(proj.startDate, proj.endDate)}</span>
                </div>
                <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal mt-1">
                  {proj.highlights.map((high: string, idx: number) => (
                    <li key={idx} style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            Education
          </h2>
          <div>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-start" style={{ marginBottom: docStyles.entrySpacing }}>
                <div style={{ fontSize: docStyles.bodySize }}>
                  <span className="font-bold text-black block" style={{ fontSize: docStyles.titleSize }}>{edu.institution}</span>
                  <span className="text-black block text-pretty" style={{ textWrap: "pretty" as any }}>{edu.degree} in {edu.fieldOfStudy} ({edu.location})</span>
                  {edu.description && <p className="italic text-pretty font-normal mt-0.5" style={{ textWrap: "pretty" as any }}>{edu.description}</p>}
                </div>
                <span className="font-normal shrink-0" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(edu.startDate, edu.endDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            Technical Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 gap-1 text-black font-normal">
            {data.skills.map((sk: any) => (
              <p key={sk.id} className="text-pretty" style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>
                <strong className="font-bold">{sk.category}: </strong>
                {sk.skills.join(", ")}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Custom/Other Sections */}
      {data.customSections && data.customSections.length > 0 && data.customSections.map((sec: any) => (
        <div key={sec.id} style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="uppercase tracking-wider font-bold border-b-2 border-black pb-0.5" style={{ fontSize: docStyles.headingSize, ...accentStyle, marginBottom: docStyles.entrySpacing }}>
            {sec.title}
          </h2>
          <div>
            {sec.items.map((item: any) => (
              <div key={item.id} style={{ marginBottom: docStyles.entrySpacing }}>
                <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                  <span>{item.title} {item.subtitle && <span className="font-normal italic" style={{ fontSize: docStyles.bodySize }}>| {item.subtitle}</span>}</span>
                  <span className="font-normal" style={{ fontSize: docStyles.bodySize }}>
                    {(item.startDate || item.endDate) && formatResumeDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-black text-justify text-pretty leading-normal font-normal mt-1" style={{ textWrap: "pretty" as any }}>{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. SWISS MODERN BRUTALIST TEMPLATE (PORTFOLIO REFERENCE)
// ==========================================
function SwissModernTemplate({ data, docStyles, formatResumeDateRange }: any) {
  const p = data.personalInfo;
  return (
    <div className="text-black text-left font-normal" style={{ fontSize: docStyles.bodySize, lineHeight: docStyles.lineSpacingVal }}>
      
      {/* Thick Grid Header with Space Grotesk / Heavy styling */}
      <div className="border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-zinc-50" style={{ marginBottom: docStyles.sectionSpacing }}>
        <div>
          <h1 className="font-extrabold tracking-tight uppercase leading-none text-black" style={{ fontSize: docStyles.nameSize, marginBottom: "6px" }}>
            {p.fullName}
          </h1>
          <p className="uppercase tracking-widest text-black font-bold mt-1" style={{ fontSize: docStyles.titleSize }}>
            {p.title}
          </p>
        </div>
        
        {/* Contact links row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-black uppercase tracking-wider text-black" style={{ fontSize: docStyles.bodySize, marginTop: "8px" }}>
          {p.phone && <a href={`tel:${p.phone}`} className="font-semibold hover:underline text-black">{p.phone}</a>}
          {p.email && <a href={`mailto:${p.email}`} className="underline font-semibold hover:opacity-80 text-black">{p.email}</a>}
          {p.website && <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">{p.website}</a>}
          {p.github && <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-black">github.com/{p.github}</a>}
          {p.linkedin && <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-black">linkedin.com/in/{p.linkedin}</a>}
        </div>
      </div>

      {/* Profile summary statement */}
      {p.summary && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <div className="flex items-center gap-1.5" style={{ marginBottom: docStyles.entrySpacing }}>
            <span className="font-bold text-black">[?]</span>
            <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
              Profile Summary
            </h2>
          </div>
          <p className="text-black text-justify border-l-2 border-black pl-3 italic text-pretty font-normal" style={{ textWrap: "pretty" as any }}>
            {p.summary}
          </p>
        </div>
      )}

      {/* Grid partitions */}
      <div className="grid grid-cols-1 border-t-2 border-black" style={{ paddingTop: docStyles.sectionSpacing, gap: docStyles.sectionSpacing }}>
        
        {/* Experience Section */}
        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 border-b-2 border-black pb-1" style={{ marginBottom: docStyles.entrySpacing }}>
              <span className="font-bold text-black">[+]</span>
              <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
                Professional Experience
              </h2>
            </div>
            
            <div>
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="border-b border-dashed border-black/30 pb-3 last:border-0 last:pb-0" style={{ marginBottom: docStyles.entrySpacing }}>
                  <div className="flex justify-between items-baseline flex-wrap" style={{ fontSize: docStyles.titleSize }}>
                    <span className="font-bold text-black uppercase tracking-tight">
                      {exp.position} <span className="font-bold">@ {exp.company.toUpperCase()}</span>
                    </span>
                    <span className="text-black bg-zinc-100 border border-black/20 px-1 py-0.5 font-semibold" style={{ fontSize: docStyles.bodySize }}>
                      {formatResumeDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <p className="uppercase tracking-wider text-black font-semibold" style={{ fontSize: docStyles.bodySize, marginBottom: "4px" }}>{exp.location}</p>
                  
                  <ul className="space-y-0.5">
                    {exp.highlights.map((high: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-black text-pretty font-normal" style={{ marginBottom: docStyles.bulletSpacing }}>
                        <span className="shrink-0 mt-0.5">+</span>
                        <span className="text-justify" style={{ textWrap: "pretty" as any }}>{high}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Projects */}
        {data.projects.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 border-b-2 border-black pb-1" style={{ marginBottom: docStyles.entrySpacing }}>
              <span className="font-bold text-black">[//]</span>
              <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
                Selected Projects
              </h2>
            </div>

            <div>
              {data.projects.map((proj: any) => (
                <div key={proj.id} style={{ marginBottom: docStyles.entrySpacing }}>
                  <div className="flex justify-between items-baseline flex-wrap" style={{ fontSize: docStyles.titleSize }}>
                    <span className="font-bold uppercase tracking-tight text-black">
                      {proj.name}
                    </span>
                    <span className="text-black bg-zinc-100 border border-black/20 px-1 py-0.5 font-semibold" style={{ fontSize: docStyles.bodySize }}>
                      {formatResumeDateRange(proj.startDate, proj.endDate)}
                    </span>
                  </div>
                  <p className="uppercase text-black font-bold" style={{ fontSize: docStyles.bodySize, marginBottom: "4px" }}>
                    Role: {proj.role} / Stack: {proj.technologies.join(" • ")}
                  </p>
                  
                  <ul className="space-y-0.5">
                    {proj.highlights.map((high: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-black text-pretty font-normal" style={{ marginBottom: docStyles.bulletSpacing }}>
                        <span className="shrink-0 mt-0.5">+</span>
                        <span className="text-justify" style={{ textWrap: "pretty" as any }}>{high}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column partition for Education and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-black" style={{ paddingTop: docStyles.sectionSpacing, gap: docStyles.sectionSpacing }}>
          {/* Education */}
          {data.education.length > 0 && (
            <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
              <div className="flex items-center gap-1.5 border-b border-black pb-1" style={{ marginBottom: docStyles.entrySpacing }}>
                <span className="font-bold text-black">[A]</span>
                <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
                  Education
                </h2>
              </div>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.education.map((edu: any) => (
                  <div key={edu.id} className="space-y-0.5">
                    <span className="font-bold uppercase text-black block text-pretty" style={{ fontSize: docStyles.titleSize }}>{edu.institution}</span>
                    <span className="text-black block font-medium text-pretty" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-black block uppercase font-semibold" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capabilities/Skills */}
          {data.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b border-black pb-1" style={{ marginBottom: docStyles.entrySpacing }}>
                <span className="font-bold text-black">[S]</span>
                <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
                  Capabilities
                </h2>
              </div>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.skills.map((sk: any) => (
                  <div key={sk.id} style={{ fontSize: docStyles.bodySize }}>
                    <strong className="uppercase text-black block text-pretty" style={{ fontSize: docStyles.bodySize }}>{sk.category}</strong>
                    <span className="text-black font-medium text-pretty block" style={{ textWrap: "pretty" as any }}>{sk.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && data.customSections.map((sec: any) => (
            <div key={sec.id} style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
              <div className="flex items-center gap-1.5 border-b border-black pb-1" style={{ marginBottom: docStyles.entrySpacing }}>
                <span className="font-bold text-black">[*]</span>
                <h2 className="font-bold uppercase tracking-widest text-black" style={{ fontSize: docStyles.headingSize }}>
                  {sec.title}
                </h2>
              </div>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {sec.items.map((item: any) => (
                  <div key={item.id} style={{ marginBottom: docStyles.entrySpacing }}>
                    <div className="flex justify-between items-baseline flex-wrap" style={{ fontSize: docStyles.titleSize }}>
                      <span className="font-bold uppercase text-black block text-pretty">
                        {item.title} {item.subtitle && <span className="font-normal italic" style={{ fontSize: docStyles.bodySize }}>| {item.subtitle}</span>}
                      </span>
                      {(item.startDate || item.endDate) && (
                        <span className="text-black bg-zinc-100 border border-black/20 px-1 py-0.5 font-semibold" style={{ fontSize: docStyles.bodySize }}>
                          {formatResumeDateRange(item.startDate, item.endDate)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-black text-justify text-pretty border-l border-zinc-300 pl-2" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

// ==========================================
// 3. JAKE'S TECH LAYOUT (SOFTWARE ENGINEERING)
// ==========================================
function JakesTechTemplate({ data, docStyles, formatResumeDateRange }: any) {
  const p = data.personalInfo;
  return (
    <div className="text-black text-left font-normal" style={{ fontSize: docStyles.bodySize, lineHeight: docStyles.lineSpacingVal }}>
      {/* Centered simple clean header */}
      <div className="text-center pb-3 border-b border-zinc-200" style={{ marginBottom: docStyles.sectionSpacing }}>
        <h1 className="font-bold tracking-tight text-black" style={{ fontSize: docStyles.nameSize, marginBottom: "4px" }}>{p.fullName}</h1>
        <p className="tracking-wide font-semibold text-black" style={{ fontSize: docStyles.titleSize, marginBottom: "6px" }}>{p.title}</p>
        <div className="flex flex-wrap justify-center gap-x-3 text-black">
          {p.email && <a href={`mailto:${p.email}`} className="hover:underline text-black">{p.email}</a>}
          {p.phone && <a href={`tel:${p.phone}`} className="hover:underline text-black">{p.phone}</a>}
          {p.website && <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 text-black">{p.website}</a>}
          {p.github && <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:opacity-80 text-black">github.com/{p.github}</a>}
          {p.linkedin && <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:opacity-80 text-black">linkedin.com/in/{p.linkedin}</a>}
        </div>
      </div>

      {/* Profile description */}
      {p.summary && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            Summary
          </h2>
          <p className="text-black text-justify text-pretty font-normal" style={{ textWrap: "pretty" as any }}>{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            Experience
          </h2>
          <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="space-y-0.5" style={{ marginBottom: docStyles.bulletSpacing }}>
                <div className="flex justify-between font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                  <span>{exp.company} — <span className="font-normal italic text-black">{exp.position}</span></span>
                  <span className="font-semibold text-black">{formatResumeDateRange(exp.startDate, exp.endDate)}</span>
                </div>
                <div className="flex justify-between uppercase tracking-wider font-semibold" style={{ fontSize: docStyles.bodySize }}>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal">
                  {exp.highlights.map((high: string, idx: number) => (
                    <li key={idx} style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            Selected Projects
          </h2>
          <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="space-y-0.5" style={{ marginBottom: docStyles.bulletSpacing }}>
                <div className="flex justify-between font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                  <span>{proj.name} <span className="font-normal text-black italic">| {proj.technologies.join(", ")}</span></span>
                  <span className="font-semibold text-black">{formatResumeDateRange(proj.startDate, proj.endDate)}</span>
                </div>
                <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal">
                  {proj.highlights.map((high: string, idx: number) => (
                    <li key={idx} style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            Education
          </h2>
          <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-start" style={{ marginBottom: docStyles.bulletSpacing }}>
                <div style={{ fontSize: docStyles.titleSize }}>
                  <span className="font-bold text-black block text-pretty">{edu.institution}</span>
                  <span className="text-black font-medium text-pretty block" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>{edu.degree} in {edu.fieldOfStudy}</span>
                </div>
                <span className="font-semibold text-black shrink-0" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(edu.startDate, edu.endDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            Technical Skills
          </h2>
          <div style={{ gap: "4px", display: "flex", flexDirection: "column" }}>
            {data.skills.map((sk: any) => (
              <p key={sk.id} className="text-pretty font-normal" style={{ textWrap: "pretty" as any }}>
                <strong className="text-black">{sk.category}:</strong> {sk.skills.join(", ")}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && data.customSections.map((sec: any) => (
        <div key={sec.id} style={{ marginBottom: docStyles.sectionSpacing }}>
          <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
            {sec.title}
          </h2>
          <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
            {sec.items.map((item: any) => (
              <div key={item.id} className="space-y-1" style={{ marginBottom: docStyles.bulletSpacing }}>
                <div className="flex justify-between items-baseline" style={{ fontSize: docStyles.titleSize }}>
                  <span className="font-bold text-black">{item.title} {item.subtitle && <span className="font-normal italic" style={{ fontSize: docStyles.bodySize }}>| {item.subtitle}</span>}</span>
                  {(item.startDate || item.endDate) && (
                    <span className="font-semibold text-black shrink-0" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(item.startDate, item.endDate)}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-black text-justify text-pretty font-normal" style={{ textWrap: "pretty" as any }}>{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 4. DEEDY TWO COLUMN STYLE
// ==========================================
function DeedyTwoColTemplate({ data, docStyles, formatResumeDateRange }: any) {
  const p = data.personalInfo;
  return (
    <div className="text-black text-left font-normal" style={{ fontSize: docStyles.bodySize, lineHeight: docStyles.lineSpacingVal }}>
      
      {/* Centered Large Headname */}
      <div className="text-center pb-1 border-b border-zinc-200" style={{ marginBottom: docStyles.sectionSpacing }}>
        <h1 className="font-bold uppercase tracking-wide text-black" style={{ fontSize: docStyles.nameSize, marginBottom: "4px" }}>{p.fullName}</h1>
        <p className="tracking-wider italic font-semibold text-black" style={{ fontSize: docStyles.titleSize, marginBottom: "6px" }}>{p.title}</p>
        <div className="flex flex-wrap justify-center gap-x-2 text-black" style={{ fontSize: docStyles.bodySize }}>
          {p.email && (
            <a href={`mailto:${p.email}`} className="font-semibold hover:underline text-black">{p.email}</a>
          )}
          {p.email && (p.phone || p.website || p.github || p.linkedin) && <span className="font-semibold text-zinc-300">|</span>}
          
          {p.phone && (
            <a href={`tel:${p.phone}`} className="font-semibold hover:underline text-black">{p.phone}</a>
          )}
          {p.phone && (p.website || p.github || p.linkedin) && <span className="font-semibold text-zinc-300">|</span>}
          
          {p.website && (
            <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-black">{p.website}</a>
          )}
          {p.website && (p.github || p.linkedin) && <span className="font-semibold text-zinc-300">|</span>}
          
          {p.github && (
            <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-black">github.com/{p.github}</a>
          )}
          {p.github && p.linkedin && <span className="font-semibold text-zinc-300">|</span>}
          
          {p.linkedin && (
            <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-black">linkedin.com/in/{p.linkedin}</a>
          )}
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        
        {/* LEFT COLUMN: Sidebar (width: 4/12) */}
        <div className="md:col-span-4 pr-2 md:border-r border-zinc-200" style={{ gap: docStyles.sectionSpacing, display: "flex", flexDirection: "column" }}>
          
          {/* Summary / About */}
          {p.summary && (
            <div style={{ marginBottom: docStyles.entrySpacing }}>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                Overview
              </h2>
              <p className="text-black text-justify font-normal text-pretty" style={{ textWrap: "pretty" as any }}>{p.summary}</p>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div style={{ marginBottom: docStyles.entrySpacing }}>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                Education
              </h2>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.education.map((edu: any) => (
                  <div key={edu.id} className="space-y-0.5">
                    <strong className="text-black block leading-tight text-pretty" style={{ fontSize: docStyles.titleSize }}>{edu.institution}</strong>
                    <span className="text-black block leading-none font-medium text-pretty" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>{edu.degree}</span>
                    <span className="text-black block uppercase font-bold" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div style={{ marginBottom: docStyles.entrySpacing }}>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                Core Skills
              </h2>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.skills.map((sk: any) => (
                  <div key={sk.id} className="space-y-0.5">
                    <strong className="text-black block uppercase text-pretty" style={{ fontSize: docStyles.bodySize }}>{sk.category}</strong>
                    <span className="text-black block leading-relaxed font-medium text-pretty" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>{sk.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Core experience & projects (width: 8/12) */}
        <div className="md:col-span-8 pl-0 md:pl-2" style={{ gap: docStyles.sectionSpacing, display: "flex", flexDirection: "column" }}>
          
          {/* Work Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                Experience
              </h2>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.experience.map((exp: any) => (
                  <div key={exp.id} className="space-y-1" style={{ marginBottom: docStyles.bulletSpacing }}>
                    <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                      <span className="text-pretty">{exp.position}</span>
                      <span className="font-semibold text-black">{formatResumeDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic font-semibold" style={{ fontSize: docStyles.bodySize }}>
                      <span className="text-pretty">{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                    <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal">
                      {exp.highlights.map((high: string, idx: number) => (
                        <li key={idx} className="font-normal" style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                Key Projects
              </h2>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {data.projects.map((proj: any) => (
                  <div key={proj.id} className="space-y-1" style={{ marginBottom: docStyles.bulletSpacing }}>
                    <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                      <span className="text-pretty">{proj.name}</span>
                      <span className="font-semibold text-black">{formatResumeDateRange(proj.startDate, proj.endDate)}</span>
                    </div>
                    <p className="uppercase tracking-wider font-bold text-pretty" style={{ fontSize: docStyles.bodySize }}>Tech Stack: {proj.technologies.join(", ")}</p>
                    <ul className="list-disc pl-4 text-black text-justify text-pretty font-normal">
                      {proj.highlights.map((high: string, idx: number) => (
                        <li key={idx} className="font-normal" style={{ textWrap: "pretty" as any, marginBottom: docStyles.bulletSpacing }}>{high}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && data.customSections.map((sec: any) => (
            <div key={sec.id}>
              <h2 className="font-bold uppercase tracking-widest text-black border-b border-zinc-300 pb-0.5" style={{ fontSize: docStyles.headingSize, marginBottom: docStyles.entrySpacing }}>
                {sec.title}
              </h2>
              <div style={{ gap: docStyles.entrySpacing, display: "flex", flexDirection: "column" }}>
                {sec.items.map((item: any) => (
                  <div key={item.id} className="space-y-1" style={{ marginBottom: docStyles.bulletSpacing }}>
                    <div className="flex justify-between items-baseline font-bold text-black" style={{ fontSize: docStyles.titleSize }}>
                      <span className="text-pretty">{item.title}</span>
                      {(item.startDate || item.endDate) && (
                        <span className="font-semibold text-black shrink-0" style={{ fontSize: docStyles.bodySize }}>{formatResumeDateRange(item.startDate, item.endDate)}</span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="uppercase tracking-wider font-bold text-pretty" style={{ fontSize: docStyles.bodySize }}>{item.subtitle} {item.location ? `(${item.location})` : ""}</p>
                    )}
                    {item.description && (
                      <p className="leading-relaxed text-justify text-pretty font-normal" style={{ textWrap: "pretty" as any, fontSize: docStyles.bodySize }}>{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
