import React, { useState, useEffect } from "react";
import { ResumeData, PageSettings } from "./types";
import { defaultResumeData, emptyResumeData } from "./utils/defaultData";
import Header from "./components/Header";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import LatexExporter from "./components/LatexExporter";
import LandingPage from "./components/LandingPage";
import AtsChecker from "./components/AtsChecker";
import Footer from "./components/Footer";
import { generateDocx } from "./utils/docxGenerator";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Terminal as TerminalIcon, 
  FileCheck, 
  RefreshCw, 
  HelpCircle, 
  Heart, 
  Upload, 
  ArrowRight, 
  Plus, 
  ChevronRight, 
  FileText, 
  Info, 
  CheckCircle,
  Cpu,
  Flame,
  X,
  Languages,
  Award,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Twitter
} from "lucide-react";

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("latex_resume_data");
    return saved ? JSON.parse(saved) : defaultResumeData;
  });

  const [settings, setSettings] = useState<PageSettings>(() => {
    const saved = localStorage.getItem("latex_resume_settings");
    return saved ? JSON.parse(saved) : {
      template: "jakes-tech", // Jake's tech is incredibly clean and standard
      fontFamily: "calibri",
      fontSize: "md",
      marginSize: "normal",
      accentColor: "#18181b",
      lineSpacing: "normal"
    };
  });

  const [currentView, setCurrentView] = useState<"home" | "editor" | "ats">("home");
  const [footerHover, setFooterHover] = useState(false);
  const [footerMousePos, setFooterMousePos] = useState({ x: 0, y: 0 });
  const [showCodeView, setShowCodeView] = useState(false);

  // LateXume Techy Machine States
  const [machineName, setMachineName] = useState("Vikas Singh Baghel");
  const [machineRole, setMachineRole] = useState("Software Engineer");
  const [machineTemplate, setMachineTemplate] = useState<"modern" | "cyber" | "minimalist">("modern");
  const [machineKeywords, setMachineKeywords] = useState<string[]>(["React", "TypeScript", "Node.js", "AI Agent"]);
  const [machineStatus, setMachineStatus] = useState<"IDLE" | "COMPILING" | "SUCCESS">("SUCCESS");
  const [machineProgress, setMachineProgress] = useState(100);
  const [machineAtsScore, setMachineAtsScore] = useState(94);
  const [machineRecruiterGrade, setMachineRecruiterGrade] = useState("A+");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("latex_resume_dark_mode");
    return saved === "true";
  });
  const [zoom, setZoom] = useState(85); // 85% default fits beautifully in split screens
  const [scrollHeight, setScrollHeight] = useState(1122);

  // AI ATS Upload/Refactor Workspace State
  const [resumeText, setResumeText] = useState("");
  const [uploadJobDescription, setUploadJobDescription] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);

  // AI model config status state
  const [configStatus, setConfigStatus] = useState<{
    hasGroq: boolean;
    hasGemini: boolean;
    primaryProvider: string;
    groqModel: string;
    geminiModel: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/config-status")
      .then(res => res.json())
      .then(data => setConfigStatus(data))
      .catch(err => console.error("Failed to load config status:", err));
  }, []);

  // Sync data to localStorage for durability
  useEffect(() => {
    localStorage.setItem("latex_resume_data", JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem("latex_resume_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("latex_resume_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const convertOklchToRgbOrHex = (cssText: string): string => {
    // Helper to parse values correctly (including percentage checking)
    const parseVal = (str: string): number => {
      if (!str) return 0;
      let val = parseFloat(str);
      if (str.endsWith("%")) {
        val = val / 100;
      }
      return val;
    };

    // 1. Convert oklch(...) matches
    let converted = cssText.replace(/oklch\(([^)]+)\)/gi, (match, inner) => {
      try {
        const parts = inner.split("/");
        const mainPart = parts[0].trim();
        const alphaPart = parts[1] ? parts[1].trim() : null;

        const values = mainPart.split(/[\s,]+/).filter(Boolean);
        if (values.length < 3) return match;

        const l = parseVal(values[0]);
        const c = parseVal(values[1]);
        const h = parseVal(values[2]);

        let alpha = 1;
        if (alphaPart) {
          alpha = parseVal(alphaPart);
        }

        if (isNaN(l) || isNaN(c) || isNaN(h)) {
          return `rgba(0, 0, 0, ${alpha})`;
        }

        const hRad = (h * Math.PI) / 180;
        const a_lab = c * Math.cos(hRad);
        const b_lab = c * Math.sin(hRad);

        const l_lms = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
        const m_lms = l - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
        const s_lms = l - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

        const l_cube = Math.pow(Math.max(0, l_lms), 3);
        const m_cube = Math.pow(Math.max(0, m_lms), 3);
        const s_cube = Math.pow(Math.max(0, s_lms), 3);

        let r_lin = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
        let g_lin = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
        let b_lin = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076127010 * s_cube;

        r_lin = Math.max(0, Math.min(1, r_lin));
        g_lin = Math.max(0, Math.min(1, g_lin));
        b_lin = Math.max(0, Math.min(1, b_lin));

        const toSRGB = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        const r = Math.round(toSRGB(r_lin) * 255);
        const g = Math.round(toSRGB(g_lin) * 255);
        const b = Math.round(toSRGB(b_lin) * 255);

        if (alphaPart) {
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      } catch (err) {
        console.error("Error converting oklch:", err);
        return match;
      }
    });

    // 2. Convert oklab(...) matches
    converted = converted.replace(/oklab\(([^)]+)\)/gi, (match, inner) => {
      try {
        const parts = inner.split("/");
        const mainPart = parts[0].trim();
        const alphaPart = parts[1] ? parts[1].trim() : null;

        const values = mainPart.split(/[\s,]+/).filter(Boolean);
        if (values.length < 3) return match;

        const l = parseVal(values[0]);
        const a_lab = parseVal(values[1]);
        const b_lab = parseVal(values[2]);

        let alpha = 1;
        if (alphaPart) {
          alpha = parseVal(alphaPart);
        }

        if (isNaN(l) || isNaN(a_lab) || isNaN(b_lab)) {
          return `rgba(0, 0, 0, ${alpha})`;
        }

        const l_lms = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
        const m_lms = l - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
        const s_lms = l - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

        const l_cube = Math.pow(Math.max(0, l_lms), 3);
        const m_cube = Math.pow(Math.max(0, m_lms), 3);
        const s_cube = Math.pow(Math.max(0, s_lms), 3);

        let r_lin = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
        let g_lin = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
        let b_lin = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076127010 * s_cube;

        r_lin = Math.max(0, Math.min(1, r_lin));
        g_lin = Math.max(0, Math.min(1, g_lin));
        b_lin = Math.max(0, Math.min(1, b_lin));

        const toSRGB = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        const r = Math.round(toSRGB(r_lin) * 255);
        const g = Math.round(toSRGB(g_lin) * 255);
        const b = Math.round(toSRGB(b_lin) * 255);

        if (alphaPart) {
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      } catch (err) {
        console.error("Error converting oklab:", err);
        return match;
      }
    });

    return converted;
  };

  const handleExportDocx = async () => {
    try {
      setNotification({
        type: "success",
        message: "Compiling ATS-optimized Word document... Exporting started."
      });
      const blob = await generateDocx(resumeData, settings);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = resumeData.personalInfo.fullName
        ? resumeData.personalInfo.fullName.trim().replace(/\s+/g, "_")
        : "Vikas_Singh_Baghel";
      a.href = url;
      a.download = `${safeName}_Resume.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setNotification({
        type: "success",
        message: "Success! High-fidelity Word (.docx) document downloaded."
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error("DOCX download failed:", err);
      setNotification({
        type: "error",
        message: `Word export failed: ${err.message || err}`
      });
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("resume-printable-canvas");
    if (!element) {
      window.print();
      return;
    }

    setNotification({
      type: "success",
      message: "Compiling LaTeX-styled PDF layout... Download will start automatically."
    });

    const runHtml2Pdf = async () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      if (!html2pdf) {
        setNotification({
          type: "error",
          message: "PDF compilation engine is loading. Please click download again in 2 seconds."
        });
        return;
      }

      // Temporarily store original styles to restore them later
      const originalTransform = element.style.transform;
      const originalTransformOrigin = element.style.transformOrigin;
      const originalShadow = element.style.boxShadow;
      const originalBorder = element.style.border;
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;

      // Intercept and proxy window.getComputedStyle to translate oklch/oklab dynamically for html2canvas
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function (el: Element, pseudoElt?: string) {
        const style = originalGetComputedStyle.call(window, el, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            const val = Reflect.get(target, prop);
            if (typeof val === "string" && (val.toLowerCase().includes("oklch") || val.toLowerCase().includes("oklab"))) {
              return convertOklchToRgbOrHex(val);
            }
            if (typeof val === "function") {
              if (prop === "getPropertyValue") {
                return function (propertyName: string) {
                  const v = target.getPropertyValue(propertyName);
                  if (typeof v === "string" && (v.toLowerCase().includes("oklch") || v.toLowerCase().includes("oklab"))) {
                    return convertOklchToRgbOrHex(v);
                  }
                  return v;
                };
              }
              return val.bind(target);
            }
            return val;
          }
        });
      };

      // Reset scaling and styling for pixel-perfect 1:1 printing dimensions
      element.style.transform = "none";
      element.style.transformOrigin = "top center";
      element.style.boxShadow = "none";
      element.style.border = "none";
      element.style.height = "1122px";
      element.style.maxHeight = "1122px";
      element.style.overflow = "hidden";

      // 1. Process inline stylesheets
      const stylesToRestore: { element: HTMLStyleElement; originalText: string }[] = [];
      const styleElements = document.querySelectorAll("style");
      
      styleElements.forEach((styleEl) => {
        const text = styleEl.textContent || "";
        if (text.toLowerCase().includes("oklch") || text.toLowerCase().includes("oklab")) {
          stylesToRestore.push({ element: styleEl, originalText: text });
          styleEl.textContent = convertOklchToRgbOrHex(text);
        }
      });

      // 1.5. Process element inline styles attributes
      const elementStylesToRestore: { element: HTMLElement; originalStyle: string }[] = [];
      const allElements = element.querySelectorAll("*");
      
      const inspectAndConvertStyle = (el: HTMLElement) => {
        const styleAttr = el.getAttribute("style");
        if (styleAttr && (styleAttr.toLowerCase().includes("oklch") || styleAttr.toLowerCase().includes("oklab"))) {
          elementStylesToRestore.push({ element: el, originalStyle: styleAttr });
          el.setAttribute("style", convertOklchToRgbOrHex(styleAttr));
        }
      };

      inspectAndConvertStyle(element);
      allElements.forEach((el) => {
        inspectAndConvertStyle(el as HTMLElement);
      });

      // 2. Process same-origin linked stylesheets (production builds)
      const linksToRestore: { element: HTMLLinkElement; originalRel: string }[] = [];
      const tempStyles: HTMLStyleElement[] = [];

      const linkElements = document.querySelectorAll("link[rel='stylesheet']") as NodeListOf<HTMLLinkElement>;
      for (const linkEl of Array.from(linkElements)) {
        try {
          if (linkEl.href && linkEl.href.startsWith(window.location.origin)) {
            const response = await fetch(linkEl.href);
            if (response.ok) {
              const cssText = await response.text();
              if (cssText.toLowerCase().includes("oklch") || cssText.toLowerCase().includes("oklab")) {
                const convertedCss = convertOklchToRgbOrHex(cssText);
                const tempStyle = document.createElement("style");
                tempStyle.textContent = convertedCss;
                document.head.appendChild(tempStyle);
                tempStyles.push(tempStyle);

                linksToRestore.push({ element: linkEl, originalRel: linkEl.rel });
                linkEl.rel = "alternate"; // Disables the linked sheet so our converted one is active
              }
            }
          }
        } catch (e) {
          console.warn("Could not pre-process linked style sheet:", linkEl.href, e);
        }
      }

      const safeName = resumeData.personalInfo.fullName
        ? resumeData.personalInfo.fullName.trim().replace(/\s+/g, "_")
        : "Vikas_Singh_Baghel";

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${safeName}_Resume.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        enableLinks: true,
        html2canvas: {
          scale: 2.5, // Extremely crisp high-resolution rendering
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      };

      const cleanupStylesheets = () => {
        // Restore window.getComputedStyle
        window.getComputedStyle = originalGetComputedStyle;

        // Restore inline style content
        stylesToRestore.forEach(({ element, originalText }) => {
          element.textContent = originalText;
        });

        // Restore element inline styles
        elementStylesToRestore.forEach(({ element, originalStyle }) => {
          element.setAttribute("style", originalStyle);
        });

        // Restore links and remove temp styles
        linksToRestore.forEach(({ element, originalRel }) => {
          element.rel = originalRel;
        });
        tempStyles.forEach((styleEl) => {
          styleEl.remove();
        });
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          // Restore original preview scale & styling
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.boxShadow = originalShadow;
          element.style.border = originalBorder;
          element.style.height = originalHeight;
          element.style.maxHeight = originalMaxHeight;
          element.style.overflow = originalOverflow;

          cleanupStylesheets();

          setNotification({
            type: "success",
            message: "Success! High-fidelity PDF downloaded successfully."
          });
          setTimeout(() => setNotification(null), 4000);
        })
        .catch((err: any) => {
          console.error("PDF download failed:", err);
          // Restore styles
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.boxShadow = originalShadow;
          element.style.border = originalBorder;
          element.style.height = originalHeight;
          element.style.maxHeight = originalMaxHeight;
          element.style.overflow = originalOverflow;

          cleanupStylesheets();

          setNotification({
            type: "error",
            message: "Client-side PDF compiler failed. Opening browser print window instead..."
          });
          setTimeout(() => {
            setNotification(null);
            window.print();
          }, 2000);
        });
    };

    // @ts-ignore
    if (window.html2pdf) {
      runHtml2Pdf();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = runHtml2Pdf;
      script.onerror = () => {
        setNotification({
          type: "error",
          message: "Could not load cloud compiler. Triggering browser print dialog..."
        });
        setTimeout(() => {
          setNotification(null);
          window.print();
        }, 2000);
      };
      document.head.appendChild(script);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset the resume? Your current edits will be lost.")) {
      setResumeData(defaultResumeData);
      setSettings({
        template: "swiss-modern",
        fontFamily: "sans",
        fontSize: "md",
        marginSize: "normal",
        accentColor: "#18181b",
        lineSpacing: "normal"
      });
    }
  };

  const startFromScratch = () => {
    setResumeData(defaultResumeData);
    setCurrentView("editor");
    setNotification({
      type: "success",
      message: "Started with professional defaults. Customize the sections to build your LaTeX document!"
    });
    setTimeout(() => setNotification(null), 6000);
  };

  const triggerMachineCompile = () => {
    setMachineStatus("COMPILING");
    setMachineProgress(0);
    const interval = setInterval(() => {
      setMachineProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setMachineStatus("SUCCESS");
          // Calculate scores based on settings
          const scoreBase = machineKeywords.length * 4 + (machineTemplate === "cyber" ? 12 : machineTemplate === "modern" ? 8 : 4);
          const score = Math.min(99, Math.max(70, 78 + scoreBase));
          setMachineAtsScore(score);
          setMachineRecruiterGrade(score >= 95 ? "A+" : score >= 90 ? "A" : score >= 85 ? "B+" : "B");
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Perform AI ATS Parsing and Refactoring with super-fast concurrent logging
  const handleAiRefactor = async () => {
    if (!resumeText.trim()) {
      alert("Please paste your resume text or upload a file first.");
      return;
    }

    setIsParsing(true);
    setCompilationLogs([]);

    const activeModel = configStatus?.hasGroq ? "Groq (Llama-3.3-70B)" : "Gemini-2.5-Flash";
    const logSteps = [
      "⚡ [SYSTEM] Spawning isolated latex-compiler pipeline...",
      "🔍 [PARSER] Reading resume text blocks & layout coordinates...",
      `🧠 [AI-AGENT] Connecting to ${activeModel} model...`,
      "📝 [AI-AGENT] Performing Deep ATS Optimization on phrasing...",
      "✨ [AI-AGENT] Rewriting achievements with Google XYZ metrics...",
      "📈 [COMPILER] Formatting technical skills into structured taxonomy...",
      "📂 [COMPILER] Aligning dates, institutions, and experiences...",
      "📁 [LATEX] Generating target-ready LaTeX source document...",
      "✅ [SUCCESS] Parse successful! Compilation ended with 0 errors."
    ];

    let currentStep = 0;
    // Live logs stream every 120ms to keep the user engaged without delaying the process
    const intervalId = setInterval(() => {
      if (currentStep < logSteps.length - 1) {
        setCompilationLogs(prev => [...prev, logSteps[currentStep]]);
        currentStep++;
      }
    }, 120);

    try {
      const response = await fetch("/api/gemini/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeText: resumeText,
          jobDescription: uploadJobDescription
        })
      });

      if (!response.ok) {
        throw new Error("Failed to parse resume via Gemini server.");
      }

      const data = await response.json();
      
      // Stop the log-interval immediately
      clearInterval(intervalId);

      // Fast-forward logs to complete instantly
      setCompilationLogs(logSteps);

      // Brief delay for the user to see the beautiful success log
      await new Promise(resolve => setTimeout(resolve, 500));

      if (data.parsedData) {
        setResumeData(data.parsedData);
        setCurrentView("editor");
        setShowUploadModal(false);
        setResumeText("");
        setUploadedFileName("");
        setNotification({
          type: "success",
          message: "⚡ ATS Optimized! Your resume was refactored with peak Quantifiable Metrics, active LaTeX variables, and organized sections."
        });
        setTimeout(() => setNotification(null), 8000);
      } else {
        throw new Error("Empty structure returned.");
      }
    } catch (err: any) {
      clearInterval(intervalId);
      console.error("Parsing Error:", err);
      setNotification({
        type: "error",
        message: `Failed to compile resume: ${err.message || "Unknown compile error"}`
      });
    } finally {
      setIsParsing(false);
    }
  };

  // Handle Drag and Drop files
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFileName(file.name);
    setIsExtractingFile(true);
    setNotification({
      type: "success",
      message: `Analyzing and extracting text from "${file.name}"...`
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (event.target && event.target.result) {
          const dataUrl = event.target.result as string;
          // Extract the base64 part
          const base64Data = dataUrl.split(",")[1];

          const response = await fetch("/api/gemini/parse-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Data, fileName: file.name })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to parse document");
          }

          const result = await response.json();
          if (result.text) {
            setResumeText(result.text);
            setNotification({
              type: "success",
              message: `Successfully extracted text from "${file.name}". You can now review it and click 'Refactor & Compile Resume'!`
            });
            setTimeout(() => setNotification(null), 6000);
          } else {
            throw new Error("No text was extracted.");
          }
        } else {
          throw new Error("Failed to read file contents.");
        }
      } catch (err: any) {
        console.error("Extraction error:", err);
        setUploadedFileName("");
        setNotification({
          type: "error",
          message: `File Extraction Failed: ${err.message || "Please try pasting the text manually."}`
        });
      } finally {
        setIsExtractingFile(false);
      }
    };

    reader.onerror = () => {
      setUploadedFileName("");
      setIsExtractingFile(false);
      setNotification({
        type: "error",
        message: "Failed to read file from disk."
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* 1. TOAST / STATUS NOTIFICATIONS BANNER */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 flex justify-center no-print"
          >
            <div className={`max-w-2xl p-4 border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 rounded-none font-mono text-xs
              ${notification.type === "success" 
                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300" 
                : "bg-red-50 dark:bg-red-950/80 text-red-950 dark:text-red-300"}`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <p className="font-bold uppercase">{notification.type === "success" ? "Operation Succeeded" : "System Alert"}</p>
                <p>{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. RENDER FLOW CONTROLLER */}
      {currentView === "home" ? (
        <>
          <LandingPage
            setCurrentView={setCurrentView}
            setShowUploadModal={setShowUploadModal}
            setResumeData={setResumeData}
            defaultResumeData={defaultResumeData}
            configStatus={configStatus}
          />

          {/* =======================================================
             AI UPLOAD & REFACTOR EXPERIENCES MODAL
             ======================================================= */}
          <AnimatePresence>
            {showUploadModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="w-full max-w-3xl bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(100,100,100,0.5)] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto rounded-none text-left"
                >
                  
                  {/* Header */}
                  <div className="flex justify-between items-start border-b-2 border-black dark:border-zinc-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          {configStatus?.hasGroq ? "Groq Llama-3.3-70B Compiler Core" : "Gemini-2.5-Flash Compiler Core"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
                        Upload & ATS-Refactor Resume
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        if (!isParsing) {
                          setShowUploadModal(false);
                          setCompilationLogs([]);
                        }
                      }}
                      className="p-1 text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                      disabled={isParsing}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {!isParsing ? (
                    <>
                      {/* Drag & Drop File Area */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleFileDrop}
                        className={`border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-3 relative min-h-[140px]
                          ${isDragOver 
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" 
                            : "border-black dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/50"}`}
                      >
                        {isExtractingFile ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-2">
                            <RefreshCw size={28} className="text-emerald-500 animate-spin" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 animate-pulse">
                                Extracting Document Text...
                              </p>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 lowercase">
                                analyzing content with high-accuracy server-side document parsers
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept=".txt,.md,.json,.pdf,.docx,.doc,.png,.jpg,.jpeg,.webp"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isExtractingFile}
                            />
                            <Upload size={32} className="text-zinc-400" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold uppercase text-black dark:text-white">
                                {uploadedFileName ? `Selected: ${uploadedFileName}` : "Drag and Drop file here"}
                              </p>
                              <p className="text-[10px] text-zinc-400 lowercase">
                                accepts PDF (.pdf), Word (.docx, .doc), Images (.png, .jpg, .webp), Markdown (.md), JSON (.json), or plain text (.txt).
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Target Job Description / Keywords (Optional) */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          Target Job Description / Role Keywords (Optional):
                        </label>
                        <textarea
                          rows={3}
                          value={uploadJobDescription}
                          onChange={(e) => setUploadJobDescription(e.target.value)}
                          placeholder="Paste target job description or keywords here (e.g. 'Kubernetes, Go, AWS, high throughput'). The AI will match these keywords naturally inside achievement bullets and summary..."
                          className="w-full p-2.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white border-2 border-black dark:border-zinc-700 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-zinc-500 leading-relaxed"
                        />
                      </div>

                      {/* Manual Paste Text Area */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                          Or Paste Raw Resume Content / Rough Drafts:
                        </label>
                        <textarea
                          rows={8}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste your existing resume here... rough layouts, copied LinkedIn text, or bullet points are fully accepted. Our AI model will completely categorize and rewrite them."
                          className="w-full p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white border-2 border-black dark:border-zinc-700 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-zinc-500 leading-relaxed"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setShowUploadModal(false)}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-black dark:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAiRefactor}
                          className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-black dark:border-emerald-600 cursor-pointer flex items-center gap-1.5"
                        >
                          <Cpu size={14} />
                          <span>Refactor & Compile Resume</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    
                    /* LIVE COMPILING LOGGER SCREEN */
                    <div className="space-y-4 py-4 font-mono">
                      
                      {/* Spinning Loader status */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">
                            COMPILER ENGINE AT PORT 3000
                          </span>
                        </div>
                        <span className="text-zinc-400">
                          Analyzing draft segments...
                        </span>
                      </div>

                      {/* Terminal screen container */}
                      <div className="p-4 bg-zinc-950 text-emerald-400 text-xs border-2 border-black rounded-none min-h-[220px] max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin">
                        {compilationLogs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="leading-relaxed"
                          >
                            {log}
                          </motion.div>
                        ))}
                      </div>

                      <div className="text-[10px] text-zinc-500 italic text-center">
                        * Please hold on. The AI model is parsing grammar details, formulating Google XYZ metric parameters, and translating content to standard LaTeX models.
                      </div>

                    </div>
                  )}

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : currentView === "ats" ? (
        <AtsChecker
          setCurrentView={setCurrentView}
          setResumeData={setResumeData}
          setNotification={setNotification}
          configStatus={configStatus}
        />
      ) : (
        
        /* =======================================================
           WORKSPACE VIEW: MAIN BUILDER DASHBOARD
           ======================================================= */
        <>
          <Header
            settings={settings}
            onSettingsChange={setSettings}
            showCodeView={showCodeView}
            onToggleCodeView={setShowCodeView}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onPrint={handlePrint}
            onExportDocx={handleExportDocx}
            currentView={currentView}
            onViewChange={setCurrentView}
            configStatus={configStatus}
          />

          {/* Main split interactive layout workspace */}
          <main id="main-workspace-split" className="flex-1 w-full max-w-[1700px] mx-auto px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch overflow-hidden print:block print:p-0 print:m-0">
            
            {/* Left Side: Interactive Creator Engine */}
            <div id="creator-engine-card" className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] print:hidden">
              <ResumeForm
                data={resumeData}
                onChange={setResumeData}
                darkMode={darkMode}
                settings={settings}
                scrollHeight={scrollHeight}
              />
              
              {/* Quick Stats & Controls Bar */}
              <div className="no-print mt-3 p-3 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-zinc-500 uppercase">Live-Compilation Active</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetData}
                    className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                    title="Reset Workspace"
                  >
                    <RefreshCw size={11} />
                    <span>Reset Draft</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Real-Time LaTeX/Preview output */}
            <div id="compiler-engine-card" className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] print:block print:h-auto print:w-full print:p-0 print:m-0">
              <AnimatePresence mode="wait">
                {!showCodeView ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="h-full flex flex-col"
                  >
                    <ResumePreview
                      data={resumeData}
                      settings={settings}
                      zoom={zoom}
                      onZoomChange={setZoom}
                      onDataChange={setResumeData}
                      scrollHeight={scrollHeight}
                      onScrollHeightChange={setScrollHeight}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="latex"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="h-full flex flex-col"
                  >
                    <LatexExporter
                      data={resumeData}
                      settings={settings}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </main>

          {/* 3. Full-featured Landing Page Footer */}
          <div className="no-print w-full">
            <Footer
              onLaunchEditor={() => {
                setResumeData(defaultResumeData);
                setCurrentView("editor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onLaunchATS={() => {
                setCurrentView("ats");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </>
      )}

    </div>
  );
}
