import React from "react";
import { Instagram, Linkedin, Github, Youtube, ArrowUp } from "lucide-react";

interface FooterProps {
  onLaunchEditor: () => void;
  onLaunchATS: () => void;
}

export default function Footer({ onLaunchEditor, onLaunchATS }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#000000] border-t border-[#1A1F25] pt-28 pb-16 overflow-hidden font-sans min-h-[500px]">
      {/* Subtle grid pattern layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Massive vertical text on the right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.35] hidden md:block">
        <span
          className="font-anoother text-[11vw] text-zinc-800 tracking-[0.25em] whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          LATEXUME
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start w-full">
          
          {/* Column 1: Logo & Info */}
          <div className="md:col-span-4 flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <span className="font-anoother text-2xl text-white tracking-wider">
                LTX
              </span>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="flex flex-col">
                <span className="font-anoother text-[11px] tracking-wider text-white uppercase leading-none">
                  LateXume
                </span>
                <span className="font-mono text-[7px] text-zinc-500 tracking-[0.1em] mt-0.5 uppercase">
                  make it suitable
                </span>
              </div>
            </div>
            
            <p className="font-sans font-light text-zinc-500 text-[13px] leading-relaxed max-w-xs text-left">
              An offline-first, executive compiler platform designed to synthesize markdown variables into typographically superior vector files.
            </p>

            {/* Minimal Line Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://github.com/vikassinghz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 bg-[#000000] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <Github size={14} />
              </a>
              <a
                href="https://linkedin.com/in/vikassinghz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 bg-[#000000] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://instagram.com/vikassinghz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 bg-[#000000] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-8 grid grid-cols-2 gap-8 w-full text-left md:pl-16">
            
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[9px] font-light tracking-[0.2em] text-zinc-400 uppercase select-none">
                // PLATFORM
              </h4>
              <div className="flex flex-col gap-2.5 text-[13px] font-sans font-light text-zinc-500">
                <button
                  onClick={onLaunchEditor}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Compile Editor
                </button>
                <button
                  onClick={onLaunchATS}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  ATS Screener
                </button>
                <a href="#how-it-works-section" className="hover:text-white transition-colors">
                  System Workflow
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[9px] font-light tracking-[0.2em] text-zinc-400 uppercase select-none">
                // SPECIFICATION
              </h4>
              <div className="flex flex-col gap-2 text-[12px] font-mono text-zinc-500">
                <div>
                  <span className="block text-[8px] text-zinc-600 uppercase tracking-wider">LATENCY:</span>
                  <span className="text-zinc-400 font-light">184ms (avg)</span>
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-600 uppercase tracking-wider">COMPILER:</span>
                  <span className="text-zinc-400 font-light">LaTeX Core v3.0</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-zinc-600 select-none">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} LATEXUME CORES // DESIGNED BY VIKAS SINGH BAGHEL // ALL RIGHTS RESERVED</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white uppercase tracking-[0.15em] transition-colors border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] px-3.5 py-1.5 rounded-sm cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={10} />
          </button>
        </div>
      </div>
    </footer>
  );
}
