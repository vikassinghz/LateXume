import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onLaunchEditor: () => void;
  configStatus?: {
    hasGroq: boolean;
    hasGemini: boolean;
    primaryProvider: string;
    groqModel: string;
    geminiModel: string;
  } | null;
}

export default function Hero({ onLaunchEditor, configStatus }: HeroProps) {
  const handleGetStarted = () => {
    const target = document.getElementById("resume-modes-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback if target section is not in DOM
      onLaunchEditor();
    }
  };

  const hasAnyKey = configStatus?.hasGroq || configStatus?.hasGemini;

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-32 pb-24 overflow-hidden bg-[#000000]"
    >
      {/* Subtle radial glow background behind hero utilizing requested colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] bg-[#09111A] rounded-full blur-[150px] pointer-events-none opacity-80" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#1A1F25]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-[#121212]/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative ultra-thin grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="0" x2="15%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
          {/* Faint status indicator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.04] bg-[#121212] text-zinc-400 font-mono text-[9px] uppercase tracking-[0.25em] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>LaTeX Resume Builder</span>
            </div>

            {!hasAnyKey && configStatus !== null && (
              <div className="text-[10px] text-zinc-400 font-mono max-w-md uppercase tracking-wider leading-relaxed bg-[#121212] border border-[#1A1F25] px-3.5 py-2">
                ⚡ Tip: Add <span className="text-white font-bold">GEMINI_API_KEY</span> under Settings &rarr; Secrets to unlock AI suggestions.
              </div>
            )}
          </div>

          <h1 className="font-poppins font-extralight leading-[1.25] tracking-tight text-[#F8FAFC] text-4xl sm:text-5xl md:text-6xl pb-2 relative">
            <span className="absolute -left-6 top-2 text-[8px] font-mono text-[#1A1F25]/60 hidden md:inline-block -rotate-90 origin-left tracking-[0.3em] uppercase select-none">
              [ COMPILER.V3 ]
            </span>
            Build{" "}
            <span className="relative inline-flex items-center group/res">
              <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 transition-all duration-300 group-hover/res:tracking-wide">
                resumes
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#1A1F25] group-hover/res:w-full transition-all duration-500 ease-out" />
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            </span>{" "}
            <br />
            that get you{" "}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 relative inline-block pr-2 select-none">
              hired
              <span className="absolute bottom-1.5 left-0 w-full h-[1px] bg-blue-500/20 -rotate-[1.5deg]" />
            </span>
            <span className="text-blue-500 font-normal inline-block animate-pulse">
              .
            </span>
          </h1>

          <p className="font-sans font-light text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg tracking-wide">
            Transform your professional achievements into a clean, ATS-ready resume. Use standard recruiter-approved LaTeX layouts that display your experience with perfect clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3.5 border border-[#1A1F25] text-white font-sans text-xs uppercase tracking-[0.25em] bg-[#1A1F25] hover:bg-[#121212] hover:border-zinc-700 transition-all duration-300 rounded-sm cursor-pointer select-none font-medium flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <span>Initialize Editor</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-blue-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Stacked High-Fidelity PDF Pages as requested by user */}
        <div className="lg:col-span-5 w-full flex justify-center pt-8 lg:pt-0">
          <div className="relative w-full max-w-[360px] aspect-[1/1.414] select-none">
            
            {/* Page 3 (Deepest Page in Stack) */}
            <div className="absolute inset-0 bg-white/95 rounded-xl shadow-[4px_12px_24px_rgba(0,0,0,0.18)] border border-zinc-200/40 origin-center rotate-6 translate-x-6 translate-y-3 opacity-40 pointer-events-none p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-16 h-2 bg-zinc-300 rounded-none mx-auto" />
                <div className="w-full h-[1px] bg-zinc-200 mt-2" />
                <div className="space-y-1">
                  <div className="w-24 h-1.5 bg-zinc-200 rounded-none" />
                  <div className="w-full h-1 bg-zinc-100 rounded-none" />
                  <div className="w-5/6 h-1 bg-zinc-100 rounded-none" />
                </div>
                <div className="w-full h-[1px] bg-zinc-200 mt-2" />
                <div className="space-y-1">
                  <div className="w-24 h-1.5 bg-zinc-200 rounded-none" />
                  <div className="w-full h-1 bg-zinc-100 rounded-none" />
                </div>
              </div>
            </div>

            {/* Page 2 (Middle Page in Stack) */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-[8px_16px_32px_rgba(0,0,0,0.22)] border border-zinc-200/60 origin-center -rotate-3 -translate-x-3 translate-y-1 opacity-80 pointer-events-none p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-20 h-2 bg-zinc-300 rounded-none mx-auto" />
                <div className="w-full h-[1px] bg-zinc-200 mt-2" />
                <div className="space-y-1.5">
                  <div className="w-24 h-1.5 bg-zinc-200 rounded-none" />
                  <div className="w-full h-1 bg-zinc-100 rounded-none" />
                  <div className="w-4/5 h-1 bg-zinc-100 rounded-none" />
                </div>
                <div className="w-full h-[1px] bg-zinc-200 mt-2" />
                <div className="space-y-1.5">
                  <div className="w-28 h-1.5 bg-zinc-200 rounded-none" />
                  <div className="w-full h-1 bg-zinc-100 rounded-none" />
                  <div className="w-11/12 h-1 bg-zinc-100 rounded-none" />
                </div>
              </div>
            </div>

            {/* Page 1 (Front High-Fidelity Resume Page) */}
            <div className="relative w-full h-full bg-white text-zinc-900 rounded-xl shadow-[12px_24px_48px_rgba(0,0,0,0.35)] border border-zinc-300/80 p-5 flex flex-col justify-between overflow-hidden">
              
              {/* Actual Mini Resume Rendering from the User's Image */}
              <div className="space-y-3.5">
                
                {/* Header Section */}
                <div className="text-center space-y-1 pb-1">
                  <h2 className="text-[14px] font-extrabold text-black tracking-tight uppercase">Alex singh</h2>
                  <h3 className="text-[7.5px] font-bold text-zinc-700 tracking-[0.12em] uppercase">SENIOR FULL-STACK ENGINEER</h3>
                  <div className="flex justify-center items-center flex-wrap gap-x-2 gap-y-0.5 text-[5.5px] text-zinc-500 font-mono pt-0.5">
                    <span>📞 +1 (555) 019-2834</span>
                    <span>•</span>
                    <span>✉️ alex.mercer@gmail.com</span>
                    <span>•</span>
                    <span>🌐 alexmercer.dev</span>
                    <span>•</span>
                    <span>💻 github.com/alexmercer</span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <div className="border-b-[0.5px] border-black pb-[2px] mb-1">
                    <h4 className="text-[7.5px] font-black tracking-wide text-black uppercase">PROFESSIONAL SUMMARY</h4>
                  </div>
                  <p className="text-[5.8px] leading-relaxed text-zinc-700 text-justify">
                    Senior Full-Stack Engineer with 6+ years of expertise in architecting high-scale distributed microservices, building pixel-perfect responsive web applications, and deploying real-time data streaming pipelines. Proven track record of optimizing systems to reduce API latency by 40%+ and leading engineering squads to launch AI-integrated software products.
                  </p>
                </div>

                {/* Professional Experience */}
                <div>
                  <div className="border-b-[0.5px] border-black pb-[2px] mb-1">
                    <h4 className="text-[7.5px] font-black tracking-wide text-black uppercase">PROFESSIONAL EXPERIENCE</h4>
                  </div>
                  
                  {/* Job 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[6.5px] font-bold text-black">
                      <span>Quantum Tech Corp</span>
                      <span>Sep 2023 – Present</span>
                    </div>
                    <div className="flex justify-between text-[5.8px] text-zinc-600 font-semibold">
                      <span>Senior Full-Stack Engineer</span>
                      <span>San Francisco, CA</span>
                    </div>
                    <ul className="list-disc pl-2.5 text-[5.5px] leading-normal text-zinc-700 space-y-0.5">
                      <li>Led cross-functional migration of enterprise monolith to serverless AWS Node.js microservices, reducing operational server costs by 32% and boosting scalability.</li>
                      <li>Architected real-time WebSocket messaging pipeline processing 12M+ daily active events with zero downtime, using Redis and Node.js.</li>
                    </ul>
                  </div>

                  {/* Job 2 */}
                  <div className="space-y-1 mt-1.5">
                    <div className="flex justify-between text-[6.5px] font-bold text-black">
                      <span>Aether Laboratories</span>
                      <span>Jun 2021 – Aug 2023</span>
                    </div>
                    <div className="flex justify-between text-[5.8px] text-zinc-600 font-semibold">
                      <span>Software Engineer II</span>
                      <span>Seattle, WA</span>
                    </div>
                    <ul className="list-disc pl-2.5 text-[5.5px] leading-normal text-zinc-700 space-y-0.5">
                      <li>Developed and maintained high-fidelity data visualizers using React and D3.js, increasing daily active dashboard engagement by 25%.</li>
                    </ul>
                  </div>
                </div>

                {/* Selected Projects */}
                <div>
                  <div className="border-b-[0.5px] border-black pb-[2px] mb-1">
                    <h4 className="text-[7.5px] font-black tracking-wide text-black uppercase">SELECTED PROJECTS</h4>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[6.5px] font-bold text-black">
                      <span>Apollo Compiler Engine <span className="font-normal text-zinc-500">| Rust, WebAssembly, React</span></span>
                      <span>Jan 2024 – Present</span>
                    </div>
                    <ul className="list-disc pl-2.5 text-[5.5px] leading-normal text-zinc-700 space-y-0.5">
                      <li>Authored high-performance WebAssembly compiler in Rust for reactive state serialization, enabling 8x faster local browser performance.</li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="border-b-[0.5px] border-black pb-[2px] mb-1">
                    <h4 className="text-[7.5px] font-black tracking-wide text-black uppercase">EDUCATION</h4>
                  </div>
                  <div className="flex justify-between text-[6.5px] font-bold text-black">
                    <span>Stanford University</span>
                    <span>Sep 2019 – May 2021</span>
                  </div>
                  <div className="text-[5.5px] text-zinc-600">
                    <span>Master of Science in Computer Science (Distributed Systems) — Stanford, CA</span>
                  </div>
                </div>

              </div>

              {/* Secure watermark label at bottom */}
              <div className="flex justify-between items-center border-t-[0.5px] border-zinc-200 pt-2 font-mono text-[5.5px] text-zinc-400">
                <span>COMPILED VIA LATEXUME STUDIO</span>
                <span>RENDER OK [184ms]</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
