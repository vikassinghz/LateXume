import React from "react";
import { Plus, Upload, Sparkles, FileText, ArrowRight, LayoutTemplate, Award } from "lucide-react";
import { motion } from "motion/react";
import { emptyResumeData, defaultResumeData } from "../utils/defaultData";

interface ResumeModesProps {
  setCurrentView: (view: "home" | "editor" | "ats") => void;
  setShowUploadModal: (show: boolean) => void;
  setResumeData: (data: any) => void;
}

export default function ResumeModes({
  setCurrentView,
  setShowUploadModal,
  setResumeData,
}: ResumeModesProps) {
  const handleStartFromScratch = () => {
    setResumeData(defaultResumeData);
    setCurrentView("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImportResume = () => {
    setShowUploadModal(true);
  };

  return (
    <section
      id="resume-modes-section"
      className="relative bg-[#000000] py-28 md:py-36 border-t border-[#1A1F25] overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[#09111A] rounded-full blur-[140px] pointer-events-none opacity-80" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12 text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.2em] font-mono text-blue-400 uppercase font-light block">
            Get Started
          </span>
          <h2 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-3xl sm:text-4xl tracking-tight">
            Select an option below
          </h2>
          <p className="font-sans font-light text-zinc-400 text-sm tracking-wide">
            Create a resume from scratch, upload an existing one to edit, or analyze your score with our checker.
          </p>
        </div>

        {/* The Three Big Resume-Themed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* CARD 1: BUILD FROM SCRATCH */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ y: 2, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleStartFromScratch}
            className="group relative flex flex-col justify-between p-8 min-h-[580px] rounded-sm border-2 border-zinc-800 bg-[#121212]/50 hover:bg-[#080e14] hover:border-blue-500/50 shadow-[6px_6px_0px_0px_#1A1F25] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,0.25)] transition-all duration-300 cursor-pointer text-left overflow-hidden"
          >
            {/* Liquid glass glow & top light strip */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-transparent group-hover:from-[#09111A]/10 group-hover:to-[#1A1F25]/20 transition-all duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent group-hover:w-full transition-all duration-700 pointer-events-none" />

            {/* Inner Content wrapper */}
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">
                    ENGINE MODE // 01
                  </span>
                  <h3 className="font-display font-light text-white text-xl tracking-wide uppercase">
                    Build from Scratch
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center bg-[#000000] group-hover:border-blue-500/30 group-hover:bg-[#121212] transition-all duration-300">
                  <Plus size={15} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>

              <p className="font-sans font-light text-zinc-400 text-[13px] leading-relaxed tracking-wide">
                Start with a clean slate and recruiter-approved professional layouts. Fill in your achievements section-by-section with live previewing.
              </p>

              {/* Theme: Resume layout mockup inside card */}
              <div className="w-full aspect-[4/3.5] border border-[#1A1F25] bg-[#000000] rounded-sm p-5 relative overflow-hidden group-hover:border-zinc-800 transition-all">
                {/* Visual guidelines & empty grids */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                
                <div className="h-full w-full border border-dashed border-zinc-800 rounded-sm p-4 flex flex-col justify-between relative">
                  {/* Empty resume schema placeholders */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                      <div className="w-28 h-2 bg-zinc-800 animate-pulse" />
                      <div className="w-16 h-1 bg-zinc-900" />
                    </div>

                    <div className="space-y-2">
                      <div className="w-12 h-2.5 bg-blue-500/10 rounded-none border border-blue-500/20 flex items-center justify-center">
                        <span className="text-[6px] font-mono text-blue-400 tracking-wider">NEW</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-zinc-900" />
                        <div className="w-5/6 h-1 bg-zinc-900" />
                        <div className="w-4/6 h-1 bg-zinc-900" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-16 h-1.5 bg-zinc-800" />
                      <div className="space-y-1">
                        <div className="w-11/12 h-1 bg-zinc-900" />
                        <div className="w-9/12 h-1 bg-zinc-900" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 mt-2">
                    <span>// READY TO COMPILE</span>
                    <LayoutTemplate size={8} className="text-zinc-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between group-hover:text-blue-400 transition-colors">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#888] group-hover:text-blue-400 transition-colors">
                Initialize Fresh Canvas
              </span>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

          </motion.div>

          {/* CARD 2: BUILD FROM EXISTING RESUME */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ y: 2, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleImportResume}
            className="group relative flex flex-col justify-between p-8 min-h-[580px] rounded-sm border-2 border-zinc-800 bg-[#121212]/50 hover:bg-[#080e14] hover:border-blue-500/50 shadow-[6px_6px_0px_0px_#1A1F25] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,0.25)] transition-all duration-300 cursor-pointer text-left overflow-hidden"
          >
            {/* Liquid glass glow & top light strip */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-transparent group-hover:from-[#09111A]/10 group-hover:to-[#1A1F25]/20 transition-all duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent group-hover:w-full transition-all duration-700 pointer-events-none" />

            {/* Inner Content wrapper */}
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">
                    ENGINE MODE // 02
                  </span>
                  <h3 className="font-display font-light text-white text-xl tracking-wide uppercase">
                    Build from Existing
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center bg-[#000000] group-hover:border-blue-500/30 group-hover:bg-[#121212] transition-all duration-300">
                  <Upload size={14} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>

              <p className="font-sans font-light text-zinc-400 text-[13px] leading-relaxed tracking-wide">
                Import your existing PDF, DOCX, or raw text resume. Our system extracts your details and imports them instantly into our templates.
              </p>

              {/* Theme: Populated Resume layout mockup with Active Scanning Laser Overlay inside card */}
              <div className="w-full aspect-[4/3.5] border border-[#1A1F25] bg-[#000000] rounded-sm p-5 relative overflow-hidden group-hover:border-zinc-800 transition-all">
                {/* Visual guidelines & filled grids */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

                {/* Laser scan animation line */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-blue-500/30 shadow-[0_0_15px_3px_rgba(59,130,246,0.3)] animate-[scan_3s_ease-in-out_infinite] z-20" />

                <div className="h-full w-full border border-[#1A1F25] rounded-sm p-4 flex flex-col justify-between relative">
                  {/* Populated resume placeholders */}
                  <div className="space-y-3.5">
                    <div className="border-b border-zinc-900 pb-2 space-y-1">
                      <div className="w-32 h-2 bg-white/80" />
                      <div className="w-20 h-1 bg-zinc-600" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="w-14 h-2 bg-blue-500/10" />
                        <div className="w-8 h-1 bg-zinc-600" />
                      </div>
                      <div className="w-full h-1 bg-zinc-800" />
                      <div className="w-11/12 h-1 bg-zinc-800" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-2 bg-blue-500/10" />
                        <div className="w-10 h-1 bg-zinc-600" />
                      </div>
                      <div className="w-10/12 h-1 bg-zinc-800" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-mono mt-2">
                    <span className="text-blue-400 flex items-center gap-1 animate-pulse">
                      <Sparkles size={7} />
                      ANALYZING SCHEMAS OK
                    </span>
                    <FileText size={8} className="text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between group-hover:text-blue-400 transition-colors">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#888] group-hover:text-blue-400 transition-colors">
                Ingest Existing Profile
              </span>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

          </motion.div>

          {/* CARD 3: TO CHECK ATS SCORE */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ y: 2, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => {
              setCurrentView("ats");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative flex flex-col justify-between p-8 min-h-[580px] rounded-sm border-2 border-zinc-800 bg-[#121212]/50 hover:bg-[#080e14] hover:border-blue-500/50 shadow-[6px_6px_0px_0px_#1A1F25] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,0.25)] transition-all duration-300 cursor-pointer text-left overflow-hidden"
          >
            {/* Liquid glass glow & top light strip */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-transparent group-hover:from-[#09111A]/10 group-hover:to-[#1A1F25]/20 transition-all duration-700 pointer-events-none" />
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent group-hover:w-full transition-all duration-700 pointer-events-none" />

            {/* Inner Content wrapper */}
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">
                    ENGINE MODE // 03
                  </span>
                  <h3 className="font-display font-light text-white text-xl tracking-wide uppercase">
                    Check ATS Score
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center bg-[#000000] group-hover:border-blue-500/30 group-hover:bg-[#121212] transition-all duration-300">
                  <Award size={14} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>

              <p className="font-sans font-light text-zinc-400 text-[13px] leading-relaxed tracking-wide">
                Upload your resume to calculate its ATS score. Get bullet-point-by-bullet-point suggestions and live feedback to improve your impact.
              </p>

              {/* Theme: Score and stats mockup inside card */}
              <div className="w-full aspect-[4/3.5] border border-[#1A1F25] bg-[#000000] rounded-sm p-5 relative overflow-hidden group-hover:border-zinc-800 transition-all">
                {/* Visual guidelines & grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

                <div className="h-full w-full border border-zinc-800 rounded-sm p-4 flex flex-col justify-between relative">
                  {/* Score gauge visual mockup */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-dashed border-blue-500/30 flex items-center justify-center relative">
                      <span className="text-[10px] font-mono text-blue-400">88%</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="w-16 h-2 bg-zinc-600" />
                      <div className="w-24 h-1 bg-zinc-800" />
                    </div>
                  </div>

                  {/* Audit lists */}
                  <div className="space-y-1.5 my-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <div className="w-20 h-1.5 bg-zinc-800" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <div className="w-28 h-1.5 bg-zinc-800" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                      <div className="w-24 h-1.5 bg-zinc-800" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-mono mt-1">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Sparkles size={7} />
                      AUDIT COMPLETE
                    </span>
                    <LayoutTemplate size={8} className="text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between group-hover:text-blue-400 transition-colors">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#888] group-hover:text-blue-400 transition-colors">
                Check ATS Score
              </span>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
