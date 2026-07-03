import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const isAnimating = useRef(false);
  
  // References for pages
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);

  // References for page shadows (Front and Back)
  const shadowFront1Ref = useRef<HTMLDivElement>(null);
  const shadowBack1Ref = useRef<HTMLDivElement>(null);
  const shadowFront2Ref = useRef<HTMLDivElement>(null);
  const shadowBack2Ref = useRef<HTMLDivElement>(null);

  // References for left text steps
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial 3D configuration
    gsap.set(".perspective-container", {
      perspective: 1800,
      transformStyle: "preserve-3d"
    });

    gsap.set([page1Ref.current, page2Ref.current, page3Ref.current], {
      transformOrigin: "left center",
      transformStyle: "preserve-3d",
      z: 0
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      isAnimating.current = true;
      const duration = 0.95;
      const ease = "power2.inOut";

      // 1. ANIMATE LEFT STEP DETAILS FADES & SLIDES
      const textRefs = [step1Ref, step2Ref, step3Ref];
      textRefs.forEach((ref, idx) => {
        if (idx === step) {
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: duration,
            ease: ease,
          });
        } else {
          const yOffset = idx < step ? -30 : 30;
          gsap.to(ref.current, {
            opacity: 0,
            y: yOffset,
            scale: 0.95,
            pointerEvents: "none",
            duration: duration,
            ease: ease,
          });
        }
      });

      // 2. ANIMATE 3D BOOK PAGES SMOOTH FLIPS
      
      // Page 1 Animation (Controls Step 01 -> Step 02 transition)
      if (step === 0) {
        // Page 1 closed on the right side
        gsap.to(page1Ref.current, {
          rotateY: 0,
          z: 3,
          duration: duration,
          ease: ease,
          onComplete: () => { isAnimating.current = false; }
        });
        // Transition Page 1 Front shadow (no shadow when flat)
        gsap.to(shadowFront1Ref.current, { opacity: 0, duration: duration * 0.4 });
        // Page 1 Back shadow (dark when face down on right)
        gsap.to(shadowBack1Ref.current, { opacity: 0.9, duration: duration * 0.4 });
      } else {
        // Page 1 turned to the left side
        gsap.to(page1Ref.current, {
          rotateY: -170,
          z: 1,
          duration: duration,
          ease: ease,
          onComplete: () => { if (step === 1) isAnimating.current = false; }
        });
        // Front side darkens as it flips
        gsap.to(shadowFront1Ref.current, { opacity: 0.85, duration: duration * 0.5 });
        // Back side lightens as it rests on left
        gsap.to(shadowBack1Ref.current, { opacity: 0, duration: duration * 0.5 });
      }

      // Page 2 Animation (Controls Step 02 -> Step 03 transition)
      if (step <= 1) {
        // Page 2 closed on right side
        gsap.to(page2Ref.current, {
          rotateY: 0,
          z: 2,
          duration: duration,
          ease: ease,
        });
        // Shadows update
        gsap.to(shadowFront2Ref.current, { opacity: 0, duration: duration * 0.4 });
        gsap.to(shadowBack2Ref.current, { opacity: 0.9, duration: duration * 0.4 });
      } else {
        // Page 2 turned to the left side
        gsap.to(page2Ref.current, {
          rotateY: -164,
          z: 2,
          duration: duration,
          ease: ease,
          onComplete: () => { isAnimating.current = false; }
        });
        // Front side darkens as it flips
        gsap.to(shadowFront2Ref.current, { opacity: 0.85, duration: duration * 0.5 });
        // Back side lightens as it rests on left
        gsap.to(shadowBack2Ref.current, { opacity: 0, duration: duration * 0.5 });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [step]);

  const steps = [
    {
      num: "01",
      label: "Input Details",
      title: "Structure Your Credentials",
      desc: "Begin with a blank template or upload your existing resume. Enter your contact details, experience, education, and skills in simple, structured fields.",
      content: {
        title: "EXPERIENCE",
        heading: "Senior Systems Architect // Vanta Corp",
        dates: "2024 — PRESENT // NEW YORK, NY",
        bullets: [
          "Led development of a high-speed distributed parser processing 100k requests/sec.",
          "Overhauled system infrastructure reducing cloud computing expenses by 32% within 90 days."
        ],
        title2: "EDUCATION",
        edu: "B.S. Computer Science — Columbia University (2018 - 2022)"
      }
    },
    {
      num: "02",
      label: "Choose Style",
      title: "Select Specs & Layouts",
      desc: "Customize the design to fit your industry. Instantly switch between classic academic, corporate, modern brutalist, or minimalist layouts with correct margins.",
      content: {
        title: "EXPERIENCE",
        heading: "SENIOR SYSTEMS ARCHITECT // VANTA CORP",
        dates: "2024 — PRESENT // NEW YORK, NY",
        bullets: [
          "Pioneered secure compiler systems utilizing strict AST validation protocols.",
          "Spearheaded cloud optimization pipelines delivering immediate render latency reductions."
        ],
        title2: "CORE TECH",
        edu: "LaTeX, React, TypeScript, Rust, Docker, Kubernetes, AWS"
      }
    },
    {
      num: "03",
      label: "Compile PDF",
      title: "Export Vector PDF",
      desc: "Instantly export your resume to a clean PDF or editable DOCX. Perfectly formatted for easy reading by both hiring managers and applicant tracking software.",
      content: {
        title: "EXPERIENCE SUMMARY",
        heading: "Vanta Corp — Lead Systems Developer",
        dates: "2024 — Present // NY",
        bullets: [
          "Maximized layout rendering speeds to 184ms using custom AST cache strategies.",
          "Delivered enterprise resume templates to over 5,000 engineering candidates globally."
        ],
        title2: "EXECUTIVE SUMMARY",
        edu: "Passionate systems designer specializing in high-performance web applications and typographical perfection."
      }
    }
  ];

  const handleNext = () => {
    if (isAnimating.current) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (isAnimating.current) return;
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <section
      id="how-it-works-section"
      ref={containerRef}
      className="relative bg-[#000000] border-t border-[#1A1F25] py-16 sm:py-24 lg:py-0 lg:h-screen w-full flex items-center overflow-hidden"
    >
      {/* Ambient glow decoration */}
      <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-[#09111A] rounded-full blur-[130px] pointer-events-none opacity-80" />
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] bg-[#1A1F25]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {/* Left Column: Fixed steps with slick custom menu & action controllers */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center">
          
          <span className="text-[9px] tracking-[0.3em] font-mono text-blue-400 uppercase font-light mb-6 block">
            [ workflow engine ]
          </span>

          {/* Interactive Steps Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 border-b border-white/5 pb-5">
            {steps.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => {
                  if (!isAnimating.current) setStep(idx);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                  step === idx
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "text-zinc-500 border border-transparent hover:text-zinc-300"
                }`}
              >
                <span className="opacity-50">{s.num}</span>
                <span className="font-sans font-light text-[11px] sm:text-xs">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Steps Description Slot (Absolute height matching longest slide to prevent layout shifting) */}
          <div className="relative h-[160px] sm:h-[180px] md:h-[150px] lg:h-[220px]">
            
            {/* Step 1 Text */}
            <div
              ref={step1Ref}
              className="absolute inset-x-0 space-y-3 sm:space-y-4 text-left transform-gpu"
            >
              <div className="font-display font-light text-[36px] sm:text-[44px] lg:text-[56px] text-white/10 leading-none">
                01
              </div>
              <h3 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-3xl sm:text-4xl pb-1 tracking-tight">
                {steps[0].title}
              </h3>
              <p className="font-sans font-light text-zinc-400 text-[11px] sm:text-sm leading-relaxed tracking-wide">
                {steps[0].desc}
              </p>
            </div>

            {/* Step 2 Text */}
            <div
              ref={step2Ref}
              className="absolute inset-x-0 space-y-3 sm:space-y-4 text-left opacity-0 pointer-events-none transform-gpu"
            >
              <div className="font-display font-light text-[36px] sm:text-[44px] lg:text-[56px] text-white/10 leading-none">
                02
              </div>
              <h3 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-3xl sm:text-4xl pb-1 tracking-tight">
                {steps[1].title}
              </h3>
              <p className="font-sans font-light text-zinc-400 text-[11px] sm:text-sm leading-relaxed tracking-wide">
                {steps[1].desc}
              </p>
            </div>

            {/* Step 3 Text */}
            <div
              ref={step3Ref}
              className="absolute inset-x-0 space-y-3 sm:space-y-4 text-left opacity-0 pointer-events-none transform-gpu"
            >
              <div className="font-display font-light text-[36px] sm:text-[44px] lg:text-[56px] text-white/10 leading-none">
                03
              </div>
              <h3 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-3xl sm:text-4xl pb-1 tracking-tight">
                {steps[2].title}
              </h3>
              <p className="font-sans font-light text-zinc-400 text-[11px] sm:text-sm leading-relaxed tracking-wide">
                {steps[2].desc}
              </p>
            </div>

          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                step === 0
                  ? "text-zinc-600 border border-zinc-800/40 cursor-not-allowed opacity-40"
                  : "text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95"
              }`}
            >
              <ChevronLeft size={14} />
              <span>PREVIOUS</span>
            </button>

            <div className="text-xs font-mono text-zinc-500">
              <span className="text-white font-medium">{step + 1}</span> / {steps.length}
            </div>

            <button
              onClick={handleNext}
              disabled={step === steps.length - 1}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                step === steps.length - 1
                  ? "text-zinc-600 border border-zinc-800/40 cursor-not-allowed opacity-40"
                  : "bg-[#1A1F25] text-white font-medium border border-zinc-700 hover:bg-[#121212] hover:border-zinc-500 active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
              }`}
            >
              <span>{step === steps.length - 1 ? "FINISH" : "NEXT STEP"}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <span className="text-[10px] text-zinc-600 font-mono mt-4 block text-left">
            💡 Tip: Click on either side of the resume pages to flip them!
          </span>

        </div>

        {/* Right Column: Fully Responsive 3D physical book resume page-turn animation */}
        <div className="col-span-1 lg:col-span-7 flex justify-center items-center h-[38vh] min-[480px]:h-[44vh] sm:h-[48vh] lg:h-[600px] relative">
          
          <div className="perspective-container relative w-full max-w-[280px] min-[380px]:max-w-[340px] min-[480px]:max-w-[420px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-[760px] aspect-[2/1.4] select-none mx-auto">
            
            {/* The Book spine central divider line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-zinc-300/10 z-40 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.05)]" />

            {/* ==================== PAGE 3 (REVEALED LAST, BACK LAYER) ==================== */}
            <div
              ref={page3Ref}
              onClick={handlePrev} // Left-side click flips page 2 back
              className="absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0c] shadow-2xl p-2.5 xs:p-3 sm:p-5 md:p-6 flex flex-col justify-between text-left border border-white/10 z-10 cursor-pointer overflow-hidden transform-gpu"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Image 3 Replica: Compile & Export PDF Panel */}
              <div className="flex flex-col h-full justify-between">
                
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[7px] xs:text-[8px] sm:text-[10px] text-white tracking-wider uppercase font-medium">
                      LaTeXume Compiler
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5 border border-white/5 scale-90 xs:scale-100 origin-right">
                    <span className="px-1.5 py-0.5 bg-white/10 text-white rounded font-mono text-[5px] xs:text-[6px] sm:text-[8px] font-bold">
                      PREVIEW
                    </span>
                    <span className="px-1.5 py-0.5 text-zinc-500 font-mono text-[5px] xs:text-[6px] sm:text-[8px]">
                      LATEX CODE
                    </span>
                  </div>
                </div>

                {/* Main Content: Big Download Button & Customizations */}
                <div className="my-auto py-2 space-y-2 sm:space-y-3.5">
                  
                  {/* Download Action */}
                  <div className="space-y-1 sm:space-y-2">
                    <div className="bg-emerald-600 hover:bg-emerald-500 text-black rounded-md py-1.5 sm:py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all">
                      <span className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-black rounded-sm border-t-transparent animate-spin hidden" />
                      <span className="font-mono font-bold text-[8px] xs:text-[10px] sm:text-xs tracking-wider">
                        DOWNLOAD PDF
                      </span>
                    </div>
                  </div>

                  {/* Font, Margins & Accent Summary selectors matching screenshot */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-left">
                    <div className="bg-white/[0.02] border border-white/5 rounded p-1 xs:p-1.5">
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500">
                        MARGINS
                      </span>
                      <span className="font-mono text-[6px] xs:text-[7px] sm:text-[9px] text-zinc-300 font-medium">
                        Normal (0.75in)
                      </span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded p-1 xs:p-1.5">
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500">
                        FONT SIZE
                      </span>
                      <span className="font-mono text-[6px] xs:text-[7px] sm:text-[9px] text-zinc-300 font-medium">
                        11pt / Normal
                      </span>
                    </div>
                  </div>

                  {/* Terminal compilation logs */}
                  <div className="bg-black/40 rounded border border-white/5 p-1.5 font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-emerald-400/90 leading-normal space-y-0.5 select-none">
                    <p className="text-zinc-500">{" >> npx pdflatex main.tex"}</p>
                    <p>✓ AST parser schema optimized [184ms]</p>
                    <p>✓ Compiled output size: 124KB</p>
                    <p className="text-white font-semibold">✓ Status: Vector PDF generated successfully</p>
                  </div>

                </div>

                {/* Footer Bar */}
                <div className="border-t border-white/5 pt-1.5 sm:pt-2 flex justify-between items-center text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-500">
                  <span>PAGE 3 OF 3</span>
                  <span className="text-emerald-400">READY TO PRINT</span>
                </div>

              </div>
            </div>


            {/* ==================== PAGE 2 (MIDDLE LAYER) ==================== */}
            <div
              ref={page2Ref}
              className="absolute top-0 right-0 w-1/2 h-full z-20 transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* PAGE 2 FRONT: Choose Style Customizer */}
              <div
                onClick={handleNext} // Click right side to flip to Page 3
                className="absolute inset-0 bg-[#0a0a0c] shadow-2xl p-2.5 xs:p-3 sm:p-5 md:p-6 flex flex-col justify-between text-left border border-white/10 cursor-pointer overflow-hidden transform-gpu"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Overlay shadow to capture fold lighting */}
                <div
                  ref={shadowFront2Ref}
                  className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-0 pointer-events-none z-50 transition-opacity duration-100"
                />

                <div className="flex flex-col h-full justify-between">
                  
                  {/* Top Header */}
                  <div className="border-b border-white/5 pb-1.5">
                    <h4 className="font-mono text-[7px] xs:text-[8px] sm:text-[10px] text-white tracking-widest uppercase font-medium">
                      LA-TEX RESUME STUDIO
                    </h4>
                    <p className="font-mono text-[5px] xs:text-[6px] sm:text-[7px] text-zinc-500 tracking-wider uppercase mt-0.5">
                      // DOCUMENT DESIGN CONFIG
                    </p>
                  </div>

                  {/* Customization Grid */}
                  <div className="my-auto py-1 sm:py-2.5 space-y-1.5 sm:space-y-3">
                    
                    {/* Template Selector */}
                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5 sm:mb-1">
                        DOCUMENT TEMPLATE
                      </span>
                      <div className="bg-white/[0.03] border border-white/10 rounded px-1.5 py-1 flex items-center justify-between text-[6px] xs:text-[7px] sm:text-[10px] font-mono text-cyan-400">
                        <span>Jake's SE Tech</span>
                        <ChevronRight size={8} className="transform rotate-90 text-zinc-500" />
                      </div>
                    </div>

                    {/* Font & Spacing Selection Inline */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5">
                          TYPEFACE
                        </span>
                        <div className="bg-white/[0.03] border border-white/10 rounded px-1 py-0.5 sm:py-1 text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-300">
                          Arial (Standard)
                        </div>
                      </div>
                      <div>
                        <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5">
                          MARGIN SIZE
                        </span>
                        <div className="bg-white/[0.03] border border-white/10 rounded px-1 py-0.5 sm:py-1 text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-300">
                          Normal (0.75in)
                        </div>
                      </div>
                    </div>

                    {/* Color Accents (matching screenshot circular layout) */}
                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-1">
                        COLOR ACCENTS
                      </span>
                      <div className="flex items-center gap-1 xs:gap-1.5">
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#18181b] border border-white/50 cursor-pointer" />
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-indigo-500 cursor-pointer" />
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 cursor-pointer" />
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-rose-500 cursor-pointer" />
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-blue-500 cursor-pointer" />
                        <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-500 cursor-pointer" />
                      </div>
                    </div>

                  </div>

                  {/* Bottom Tab Indicators */}
                  <div className="border-t border-white/5 pt-1.5 flex justify-between items-center text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-500">
                    <span>PAGE 2 OF 3</span>
                    <span className="text-cyan-400">DESIGN ACTIVE</span>
                  </div>

                </div>
              </div>

              {/* PAGE 2 BACK (Visible on the left after page turns) */}
              <div
                onClick={handlePrev} // Click left side to flip Page 2 back
                className="absolute inset-0 bg-[#070709] shadow-2xl p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-between text-left border border-white/10 select-none cursor-pointer transform-gpu"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Overlay shadow to capture fold lighting */}
                <div
                  ref={shadowBack2Ref}
                  className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent opacity-0 pointer-events-none z-50 transition-opacity duration-100"
                />

                <div className="h-full w-full flex flex-col justify-between relative">
                  <div className="space-y-3">
                    <span className="text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-cyan-500 tracking-[0.2em] block uppercase">
                      // ENGINE PIPELINE SECURE
                    </span>
                    <h4 className="font-display font-light text-zinc-300 text-[9px] xs:text-[10px] sm:text-sm tracking-wide uppercase">
                      Specs Configured
                    </h4>
                    <p className="font-sans font-light text-zinc-500 text-[7px] xs:text-[8px] sm:text-[10px] leading-relaxed">
                      All layout components, margins, typefaces, and color systems have been rendered into vector AST structures successfully.
                    </p>
                    <div className="space-y-1 pt-1.5 xs:pt-3">
                      <div className="h-[2px] bg-cyan-400/20 w-1/3" />
                      <div className="h-[1px] bg-white/5 w-3/4" />
                      <div className="h-[1px] bg-white/5 w-2/3" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 size={10} className="text-cyan-400" />
                    <span className="font-mono text-[5px] xs:text-[6px] sm:text-[8px] tracking-widest uppercase">STYLE COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>


            {/* ==================== PAGE 1 (TOP LAYER) ==================== */}
            <div
              ref={page1Ref}
              className="absolute top-0 right-0 w-1/2 h-full z-30 transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* PAGE 1 FRONT: Personal Metadata Form */}
              <div
                onClick={handleNext} // Click right side to flip to Page 2
                className="absolute inset-0 bg-[#0a0a0c] shadow-2xl p-2.5 xs:p-3 sm:p-5 md:p-6 flex flex-col justify-between text-left border border-white/10 cursor-pointer overflow-hidden transform-gpu"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Overlay shadow to capture fold lighting */}
                <div
                  ref={shadowFront1Ref}
                  className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-0 pointer-events-none z-50 transition-opacity duration-100"
                />

                <div className="flex flex-col h-full justify-between">
                  
                  {/* Tabs Bar matching Screenshot 1 */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <div className="flex items-center gap-0.5 xs:gap-1 scale-90 xs:scale-100 origin-left">
                      <span className="px-1.5 py-0.5 bg-white text-black rounded font-mono text-[5px] xs:text-[6px] sm:text-[8px] font-bold uppercase">
                        personal
                      </span>
                      <span className="px-1.5 py-0.5 text-zinc-500 font-mono text-[5px] xs:text-[6px] sm:text-[8px] uppercase">
                        experience
                      </span>
                      <span className="px-1.5 py-0.5 text-zinc-500 font-mono text-[5px] xs:text-[6px] sm:text-[8px] uppercase">
                        projects
                      </span>
                    </div>
                    <span className="text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 font-mono hidden min-[440px]:inline">
                      Info
                    </span>
                  </div>

                  {/* Header Title */}
                  <div className="pt-1 xs:pt-2">
                    <h4 className="font-mono text-[7px] xs:text-[8px] sm:text-[10px] text-white tracking-wider uppercase font-medium">
                      [?] PERSONAL METADATA
                    </h4>
                  </div>

                  {/* Input Fields Grid (scaled carefully for miniature size) */}
                  <div className="my-auto py-1 sm:py-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
                    
                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5 uppercase">
                        Full Name
                      </span>
                      <div className="bg-white/[0.02] border border-white/5 rounded px-1 py-0.5 sm:py-1 text-[6px] xs:text-[7px] sm:text-[9px] font-mono text-zinc-300">
                        John Doe
                      </div>
                    </div>

                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5 uppercase">
                        Target Job Title
                      </span>
                      <div className="bg-white/[0.02] border border-white/5 rounded px-1 py-0.5 sm:py-1 text-[6px] xs:text-[7px] sm:text-[9px] font-mono text-zinc-300">
                        Lead Architect
                      </div>
                    </div>

                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5 uppercase">
                        Email Address
                      </span>
                      <div className="bg-white/[0.02] border border-white/5 rounded px-1 py-0.5 sm:py-1 text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-300 truncate">
                        john.doe@email.com
                      </div>
                    </div>

                    <div>
                      <span className="block font-mono text-[5px] xs:text-[6px] sm:text-[8px] text-zinc-500 mb-0.5 uppercase">
                        Location (City, ST)
                      </span>
                      <div className="bg-white/[0.02] border border-white/5 rounded px-1 py-0.5 sm:py-1 text-[6px] xs:text-[7px] sm:text-[9px] font-mono text-zinc-300">
                        San Francisco, CA
                      </div>
                    </div>

                  </div>

                  {/* Bottom Metadata Indicators */}
                  <div className="border-t border-white/5 pt-1 flex justify-between items-center text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-zinc-500">
                    <span>PAGE 1 OF 3</span>
                    <span className="text-cyan-400">INPUT ACTIVE</span>
                  </div>

                </div>
              </div>

              {/* PAGE 1 BACK (Visible on the left after page turns) */}
              <div
                onClick={handlePrev} // Click left side to flip Page 1 back
                className="absolute inset-0 bg-[#070709] shadow-2xl p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-between text-left border border-white/10 select-none cursor-pointer transform-gpu"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Overlay shadow to capture fold lighting */}
                <div
                  ref={shadowBack1Ref}
                  className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent opacity-0 pointer-events-none z-50 transition-opacity duration-100"
                />

                <div className="h-full w-full flex flex-col justify-between relative">
                  <div className="space-y-3">
                    <span className="text-[5px] xs:text-[6px] sm:text-[8px] font-mono text-cyan-500 tracking-[0.2em] block uppercase">
                      // PROCESS COMPLETED
                    </span>
                    <h4 className="font-display font-light text-zinc-300 text-[9px] xs:text-[10px] sm:text-sm tracking-wide uppercase">
                      Metadata Built
                    </h4>
                    <p className="font-sans font-light text-zinc-500 text-[7px] xs:text-[8px] sm:text-[10px] leading-relaxed">
                      All personal profiles, contact credentials, and job descriptions have been parsed into secure state-store successfully.
                    </p>
                    <div className="space-y-1 pt-1.5 xs:pt-3">
                      <div className="h-[2px] bg-cyan-400/20 w-1/3" />
                      <div className="h-[1px] bg-white/5 w-3/4" />
                      <div className="h-[1px] bg-white/5 w-2/3" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 size={10} className="text-cyan-400" />
                    <span className="font-mono text-[5px] xs:text-[6px] sm:text-[8px] tracking-widest uppercase">INPUT COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
