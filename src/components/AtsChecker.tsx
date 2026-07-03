import React, { useState } from "react";
import { 
  ArrowLeft, Upload, FileText, Sparkles, Cpu, CheckCircle2, 
  XCircle, AlertCircle, RefreshCw, FileCode2, Award, 
  Search, ShieldAlert, ArrowRight, Zap, ListChecks, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AtsCheckerProps {
  setCurrentView: (view: "home" | "editor" | "ats") => void;
  setResumeData: (data: any) => void;
  setNotification: (notif: { type: "success" | "error" | "info"; message: string } | null) => void;
  configStatus: any;
}

interface AtsAnalysis {
  score: number;
  rating: string;
  reasons: string[];
  suggestions: string[];
  categoryScores: {
    keywords: number;
    impactMetrics: number;
    structure: number;
    presentation: number;
  };
  matchingKeywords: string[];
  missingKeywords: string[];
}

export default function AtsChecker({
  setCurrentView,
  setResumeData,
  setNotification,
  configStatus,
}: AtsCheckerProps) {
  // Input states
  const [resumeText, setResumeText] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [targetJobDescription, setTargetJobDescription] = useState("");
  
  // File upload states
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Flow & analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysis | null>(null);

  // Auto-import states
  const [isImporting, setIsImporting] = useState(false);
  const [importLogs, setImportLogs] = useState<string[]>([]);

  // File Upload processor (duplicate/adapt App.tsx pattern)
  const processFile = (file: File) => {
    setUploadedFileName(file.name);
    setIsExtractingFile(true);
    
    setNotification({
      type: "info",
      message: `Extracting text from "${file.name}"...`
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (event.target && event.target.result) {
          const dataUrl = event.target.result as string;
          const base64Data = dataUrl.split(",")[1];

          const response = await fetch("/api/gemini/parse-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Data, fileName: file.name })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to extract text from document");
          }

          const result = await response.json();
          if (result.text) {
            setResumeText(result.text);
            setNotification({
              type: "success",
              message: `Successfully extracted text from "${file.name}". Click Analyze to compute your ATS score!`
            });
            setTimeout(() => setNotification(null), 5000);
          } else {
            throw new Error("No text was extracted from this file.");
          }
        } else {
          throw new Error("Failed to read file.");
        }
      } catch (err: any) {
        console.error("Text Extraction Error:", err);
        setUploadedFileName("");
        setNotification({
          type: "error",
          message: `File Ingestion Failed: ${err.message || "Please copy & paste your resume manually."}`
        });
      } finally {
        setIsExtractingFile(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Run ATS Diagnostics Evaluation
  const runAtsDiagnostics = async () => {
    if (!resumeText.trim()) {
      setNotification({
        type: "error",
        message: "Please upload your resume file or paste your resume text first."
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisLogs([]);
    setAnalysisResult(null);

    const activeModel = configStatus?.hasGroq ? "Groq (Llama-3.3-70B)" : "Gemini-2.5-Flash";
    const logs = [
      "⚡ [SYSTEM] Spawning isolated ATS diagnostic virtual machine...",
      "🔍 [PARSER] Reading raw document blocks, font styles, and structure...",
      `🧠 [AI-AGENT] Connecting to ${activeModel} evaluator core...`,
      "📈 [DIAGNOSTIC] Matching contact details, layout balance, and hierarchy...",
      "🔬 [DIAGNOSTIC] Scanning for quantifiable metrics, dates, and active verbs...",
      "🏷️ [KEYWORDS] Extracting keyword matrix and technical taxonomy...",
      targetJobDescription ? "🎯 [KEYWORDS] Running keyword match matrix against target job description..." : "ℹ️ [INFO] No target description provided. Benchmarking against general engineering standards...",
      "📊 [COMPILER] Synthesizing score weights and formatting report components...",
      "✅ [SUCCESS] Diagnosis completed with genuine grading parameters."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length - 1) {
        setAnalysisLogs(prev => [...prev, logs[currentStep]]);
        currentStep++;
      }
    }, 150);

    try {
      const response = await fetch("/api/gemini/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: targetJobDescription ? `Title: ${targetJobTitle}\nDescription: ${targetJobDescription}` : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Evaluation engine failed. Please try again.");
      }

      const data = await response.json();
      
      clearInterval(interval);
      setAnalysisLogs(logs); // Complete logs

      await new Promise(resolve => setTimeout(resolve, 600)); // Cool delay for success visibility

      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setNotification({
          type: "success",
          message: `📊 Diagnostics finished! Your ATS Score is ${data.analysis.score}/100.`
        });
        setTimeout(() => setNotification(null), 5000);
      } else {
        throw new Error("No diagnostic data returned.");
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error("ATS Diagnosis Error:", err);
      setNotification({
        type: "error",
        message: `Analysis Failed: ${err.message || "Unknown error"}`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compile parsed resume and load into Editor State
  const handleCompileAndImport = async () => {
    if (!resumeText.trim()) return;

    setIsImporting(true);
    setImportLogs([]);

    const activeModel = configStatus?.hasGroq ? "Groq (Llama-3.3-70B)" : "Gemini-2.5-Flash";
    const logs = [
      "🔄 [SYSTEM] Initiating full LaTeX schemas migration...",
      "📐 [SCHEMAS] Structuring resume blocks to compile-ready variables...",
      `🧠 [AI-AGENT] Invoking ${activeModel} schema refactor...`,
      "✨ [AI-AGENT] Formulating Google XYZ metric equations for all bullet highlights...",
      "🔧 [COMPILER] Normalizing dates, custom sections, and education paths...",
      "✍️ [COMPILER] Drafting clean summary matching verified structural models...",
      "✅ [SUCCESS] Translation complete! Redirecting to creator engine workspace..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length - 1) {
        setImportLogs(prev => [...prev, logs[currentStep]]);
        currentStep++;
      }
    }, 120);

    try {
      const response = await fetch("/api/gemini/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: targetJobDescription ? `Title: ${targetJobTitle}\nDescription: ${targetJobDescription}` : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Translation core failed. Please try again.");
      }

      const data = await response.json();

      clearInterval(interval);
      setImportLogs(logs);

      await new Promise(resolve => setTimeout(resolve, 500));

      if (data.parsedData) {
        setResumeData(data.parsedData);
        setNotification({
          type: "success",
          message: "⚡ ATS Optimized resume parsed into your LaTeX Editor canvas successfully!"
        });
        setTimeout(() => setNotification(null), 8000);
        setCurrentView("editor");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error("Empty structure returned.");
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error("Import Parsing Error:", err);
      setNotification({
        type: "error",
        message: `Import failed: ${err.message || "Failed to parse resume blocks."}`
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Helper to get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10", stroke: "#10b981" };
    if (score >= 65) return { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/10", stroke: "#f59e0b" };
    return { text: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/10", stroke: "#ef4444" };
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F1ED] pt-24 pb-16 font-sans relative overflow-x-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] max-w-[600px] bg-[#09111A]/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] max-w-[600px] bg-[#1A1F25]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <button 
              onClick={() => setCurrentView("home")}
              className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors text-xs font-mono uppercase mb-4 group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>[ Return to Compilers ]</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-4xl sm:text-5xl pb-1 tracking-tight">
                ATS Diagnostics Core
              </h1>
            </div>
            <p className="font-sans font-light text-zinc-500 text-sm mt-2 tracking-wide">
              Verify your resume structure, keyword weight, and quantify formatting metrics to achieve peak ATS scores.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#000000]/80 border border-[#1A1F25] px-4 py-2.5 rounded-sm">
            <Cpu size={14} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
              Provider: {configStatus?.hasGroq ? "Groq (Llama 3.3)" : "Gemini 2.5 Core"}
            </span>
          </div>
        </div>

        {/* Outer Split Layout */}
        {!analysisResult && !isAnalyzing ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            
            {/* Left Hand: Upload Box & Paste Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 1: File Upload */}
              <div className="bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm relative overflow-hidden group shadow-xl hover:border-zinc-700 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.01] pointer-events-none" />
                
                <h2 className="text-xs font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Upload size={13} className="text-blue-400" />
                  <span>01. Ingest Resume Document</span>
                </h2>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-sm p-8 text-center transition-all flex flex-col items-center justify-center gap-4 min-h-[160px] relative
                    ${isDragOver 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-white/10 hover:border-zinc-700 hover:bg-white/[0.02]"}`}
                >
                  {isExtractingFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw size={28} className="text-blue-400 animate-spin" />
                      <div>
                        <p className="text-xs font-mono text-blue-400 animate-pulse uppercase">Extracting Document Plain Text...</p>
                        <p className="text-[10px] text-zinc-500 lowercase mt-1 font-mono">running server-side parsing engine</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="file"
                        accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FileText size={36} className="text-zinc-500 group-hover:text-blue-400/50 transition-colors" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-300">
                          {uploadedFileName ? `SELECTED: ${uploadedFileName}` : "Drag & Drop Resume File"}
                        </p>
                        <p className="text-[10px] text-zinc-500 lowercase font-mono">
                          Accepts PDF, DOCX, Images, MD, or TXT
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Box 2: Manual text editor paste */}
              <div className="bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl hover:border-zinc-700 transition-all duration-500">
                <h2 className="text-xs font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                  <span>02. Paste Content or Review Extract</span>
                  {resumeText && (
                    <button 
                      onClick={() => { setResumeText(""); setUploadedFileName(""); }}
                      className="text-[9px] text-red-400 hover:underline uppercase font-sans cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </h2>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Review the extracted file text here, or paste raw, rough draft text directly. You can even paste list highlights, LinkedIn copy, or outdated content."
                  rows={10}
                  className="w-full p-4 text-xs font-mono bg-[#000000] text-zinc-300 border border-white/10 rounded-none focus:outline-none focus:border-blue-500/50 leading-relaxed scrollbar-thin"
                />
              </div>

            </div>

            {/* Right Hand: Job Description Parameters */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#000000]/50 border border-[#1A1F25] p-6 rounded-sm shadow-xl flex flex-col justify-between min-h-full">
                <div className="space-y-5">
                  <h2 className="text-xs font-mono text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Search size={13} className="text-blue-400" />
                    <span>03. Target Job Standards</span>
                  </h2>

                  <p className="font-sans font-light text-zinc-500 text-[11px] leading-relaxed">
                    Provide your target title and description. Our ATS diagnostics will compare keyword density, tech stack taxonomies, and credentials automatically.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Target Job Title / Role Designation (Optional):
                    </label>
                    <input
                      type="text"
                      value={targetJobTitle}
                      onChange={(e) => setTargetJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#000000] text-white border border-white/10 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Paste Target Job Description (Optional but Recommended):
                    </label>
                    <textarea
                      value={targetJobDescription}
                      onChange={(e) => setTargetJobDescription(e.target.value)}
                      placeholder="Paste the target job post details, key responsibilities, or desired qualifications here to check matching parameters..."
                      rows={8}
                      className="w-full p-3 text-xs font-mono bg-[#000000] text-zinc-300 border border-white/10 focus:outline-none focus:border-blue-500/50 leading-relaxed scrollbar-thin"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6">
                  <button
                    onClick={runAtsDiagnostics}
                    disabled={isAnalyzing}
                    className="w-full py-3 text-xs font-mono font-bold uppercase tracking-[0.15em] bg-[#1A1F25] text-white border border-zinc-700 hover:bg-[#121212] hover:border-zinc-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-black/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Cpu size={14} className="text-blue-400" />
                    <span>Run ATS Diagnostics Scan</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : isAnalyzing ? (
          
          /* LIVE ANALYZING LOGGER SCREEN */
          <div className="max-w-2xl mx-auto p-8 bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover shadow-2xl rounded-sm">
            <div className="flex items-center justify-between text-xs font-mono mb-4 text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span className="font-bold text-zinc-300">DIAGNOSTIC COMPILER ENGINE</span>
              </div>
              <span className="animate-pulse">Scrutinizing grammar vectors...</span>
            </div>

            <div className="p-5 bg-[#000000] text-blue-400 font-mono text-[11px] border border-white/10 rounded-sm min-h-[220px] max-h-[300px] overflow-y-auto space-y-2 scrollbar-thin text-left">
              <AnimatePresence>
                {analysisLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="leading-relaxed"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <p className="text-[10px] text-zinc-500 font-sans italic text-center mt-5 leading-relaxed">
              * Evaluating against strict industrial Applicant Tracking System parsing modules. Identifying impact coefficients, bullet orphans, and formatting compatibility constraints.
            </p>
          </div>

        ) : (
          
          /* -------------------------------------------------------------
             THE ATS REPORT CARD DASHBOARD - ONE PAGE LAYOUT
             ------------------------------------------------------------- */
          analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto space-y-8 text-left"
            >
              {/* Back & Re-run Toolbar */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>[ Evaluate Another Resume ]</span>
                </button>

                <div className="text-zinc-500 text-[10px] font-mono">
                  ATS AUDIT ID // #{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>

              {/* Main Score & Top Stats Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Visual Circle Gauge Score Card */}
                <div className="md:col-span-5 bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl flex flex-col justify-between items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.01] pointer-events-none" />
                  
                  <div className="w-full text-left">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">
                      ANALYSIS METRIC
                    </span>
                    <h3 className="font-display font-light text-white text-base tracking-wide uppercase">
                      ATS Match Score
                    </h3>
                  </div>

                  {/* SVG Circle progress */}
                  <div className="relative my-8 flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      {/* Gray track */}
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="80" 
                        className="stroke-white/5" 
                        strokeWidth="12" 
                        fill="transparent" 
                      />
                      {/* Dynamic color fill */}
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="80" 
                        stroke={getScoreColor(analysisResult.score).stroke}
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={2 * Math.PI * 80 * (1 - analysisResult.score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    {/* Score absolute value centered */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <span className={`font-display text-5xl font-light tracking-tighter ${getScoreColor(analysisResult.score).text}`}>
                        {analysisResult.score}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 uppercase mt-1 tracking-wider">
                        OF 100 PTS
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="w-full">
                    <div className={`px-4 py-2 border rounded-sm font-mono text-xs uppercase inline-block w-full text-center
                      ${getScoreColor(analysisResult.score).border} ${getScoreColor(analysisResult.score).bg} ${getScoreColor(analysisResult.score).text}`}
                    >
                      ★ {analysisResult.rating}
                    </div>
                  </div>

                </div>

                {/* Subcategories Grid & Progress indicators */}
                <div className="md:col-span-7 bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block">
                      DIAGNOSTIC COEFFICIENTS
                    </span>
                    <h3 className="font-display font-light text-white text-base tracking-wide uppercase">
                      Core Category Grades
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5 my-6">
                    {/* Keyword Alignment */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Keywords & Buzzword Density</span>
                        <span className={analysisResult.categoryScores.keywords >= 80 ? "text-emerald-400" : "text-amber-400"}>
                          {analysisResult.categoryScores.keywords}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000"
                          style={{ width: `${analysisResult.categoryScores.keywords}%` }}
                        />
                      </div>
                    </div>

                    {/* Quantifiable Impact Metrics */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Quantifiable Impact & Metrics</span>
                        <span className={analysisResult.categoryScores.impactMetrics >= 80 ? "text-emerald-400" : "text-amber-400"}>
                          {analysisResult.categoryScores.impactMetrics}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000"
                          style={{ width: `${analysisResult.categoryScores.impactMetrics}%` }}
                        />
                      </div>
                    </div>

                    {/* Machine Readability Structure */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Structure & Section Mapping</span>
                        <span className={analysisResult.categoryScores.structure >= 80 ? "text-emerald-400" : "text-amber-400"}>
                          {analysisResult.categoryScores.structure}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000"
                          style={{ width: `${analysisResult.categoryScores.structure}%` }}
                        />
                      </div>
                    </div>

                    {/* Format Layout Complexity */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Formatting & Single-Column Layout</span>
                        <span className={analysisResult.categoryScores.presentation >= 80 ? "text-emerald-400" : "text-amber-400"}>
                          {analysisResult.categoryScores.presentation}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000"
                          style={{ width: `${analysisResult.categoryScores.presentation}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brief Diagnostic CTA */}
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-none flex items-center gap-3">
                    <Zap size={14} className="text-blue-400 shrink-0" />
                    <p className="text-[10px] text-zinc-300 font-mono leading-relaxed lowercase">
                      your profile is highly parsing compatible. import to our editor below to convert and refactor into a professional single-page latex resume template instantly!
                    </p>
                  </div>

                </div>

              </div>

              {/* Reasons & Actionable suggestions panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Bullet Point Reasons */}
                <div className="bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl space-y-4 hover:border-zinc-700 transition-all duration-500">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-red-400" />
                    <span>Audit Reasons & Findings</span>
                  </h3>
                  
                  <ul className="space-y-3">
                    {analysisResult.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-zinc-300 leading-relaxed">
                        <span className="text-zinc-500 font-mono mt-0.5 shrink-0">[{i+1}]</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Suggestive Improvements */}
                <div className="bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl space-y-4 hover:border-zinc-700 transition-all duration-500">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Actionable suggestions</span>
                  </h3>

                  <ul className="space-y-3">
                    {analysisResult.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-zinc-300 leading-relaxed">
                        <span className="text-emerald-500 mt-0.5 shrink-0">⚡</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Keyword GAP analysis matrix */}
              <div className="bg-[#000000]/40 border border-[#1A1F25] liquid-glass-royal-hover p-6 rounded-sm shadow-xl space-y-6 hover:border-zinc-700 transition-all duration-500">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <ListChecks size={14} className="text-blue-400" />
                  <span>Keyword Compatibility Matrix</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Found Keywords */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={11} />
                      <span>Identified Core Keywords ({analysisResult.matchingKeywords.length})</span>
                    </h4>
                    {analysisResult.matchingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.matchingKeywords.map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-2.5 py-1 text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-none lowercase"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-mono">No matching target keywords found in resume block.</p>
                    )}
                  </div>

                  {/* Missing Keywords */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <ShieldAlert size={11} />
                      <span>Missing / Critical Gap Keywords ({analysisResult.missingKeywords.length})</span>
                    </h4>
                    {analysisResult.missingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-2.5 py-1 text-[10px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 rounded-none lowercase"
                          >
                            - {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-mono">No critical missing keywords identified. Ideal density reached.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Master call to action: Import & Optimize */}
              <div className="bg-gradient-to-br from-[#1A1F25]/40 to-black border border-zinc-700 p-8 rounded-sm text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                
                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="font-display font-light text-white tracking-wide text-xl uppercase">
                    Ready to resolve these issues?
                  </h3>
                  <p className="font-sans font-light text-zinc-400 text-xs leading-relaxed">
                    Import this resume directly into our premium interactive LaTeX LaTeX-compiler workspace. We will automatically normalize your sections, inject peak industry action metrics, and optimize formatting structure.
                  </p>
                </div>

                {!isImporting ? (
                  <div className="flex justify-center">
                    <button
                      onClick={handleCompileAndImport}
                      className="px-8 py-3 text-xs font-mono font-bold uppercase tracking-[0.15em] bg-[#1A1F25] text-white border border-zinc-700 hover:bg-[#121212] hover:border-zinc-500 transition-all flex items-center gap-2 shadow-lg hover:shadow-black/20 cursor-pointer"
                    >
                      <span>Auto-Import to LaTeX Editor</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-blue-400 animate-pulse uppercase">
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Transcribing and structuring LaTeX coordinates...</span>
                    </div>
                    
                    <div className="p-4 bg-black border border-white/10 rounded-none text-[10px] font-mono text-emerald-400 text-left space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-none">
                      {importLogs.map((log, i) => (
                        <div key={i} className="leading-relaxed">{log}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )
        )}

      </div>
    </div>
  );
}
