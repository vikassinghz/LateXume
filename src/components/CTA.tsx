import React from "react";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onLaunchEditor: () => void;
}

export default function CTA({ onLaunchEditor }: CTAProps) {
  return (
    <section
      id="cta-section"
      className="relative bg-[#000000] py-32 md:py-40 border-t border-[#1A1F25] overflow-hidden text-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#09111A] rounded-full blur-[140px] pointer-events-none opacity-80" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-10">
        <span className="text-[10px] tracking-[0.3em] font-mono text-blue-400 uppercase font-light block">
          [ system deployment ]
        </span>

        <h2 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-5xl sm:text-6xl max-w-2xl mx-auto pb-1 tracking-tight">
          Ready to build your executive profile?
        </h2>

        <p className="font-sans font-light text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto tracking-wide">
          Bypass visual resume builders. Secure a world-class typographical document built for standard recruiter screens and parsing engines.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onLaunchEditor}
            className="px-10 py-4 border border-[#1A1F25] text-white font-sans text-xs uppercase tracking-[0.25em] bg-[#1A1F25] hover:bg-[#121212] hover:border-zinc-700 transition-all duration-300 rounded-sm cursor-pointer select-none font-medium flex items-center gap-2 group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span>Launch Compiler Engine</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-blue-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
