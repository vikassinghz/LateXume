import React from "react";
import { Cpu, Terminal, Eye, FileText } from "lucide-react";

export default function Features() {
  const list = [
    {
      icon: <Terminal size={18} className="text-blue-400" />,
      label: "ATS Optimization",
      desc: "Keeps your layout and keywords aligned so recruiter applicant tracking systems parse your resume without errors.",
    },
    {
      icon: <Cpu size={18} className="text-blue-400" />,
      label: "LaTeX Layouts",
      desc: "Generates elegant, professional LaTeX templates without requiring you to write any complex code.",
    },
    {
      icon: <Eye size={18} className="text-blue-400" />,
      label: "Live Preview",
      desc: "See your resume updates instantly as you edit. Fast, reliable, and rendered directly in your browser.",
    },
    {
      icon: <FileText size={18} className="text-blue-400" />,
      label: "Clean PDF Export",
      desc: "Export pristine, print-ready PDFs with correct margins that load instantly in any document reader.",
    },
  ];

  return (
    <section
      id="features-section"
      className="relative bg-[#000000] py-20 border-t border-[#1A1F25] overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-[30%] left-[5%] w-[400px] h-[400px] bg-[#09111A] rounded-full blur-[120px] pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Head */}
        <div className="mb-12 text-left max-w-xl space-y-3">
          <span className="text-[10px] tracking-[0.2em] font-mono text-blue-400 uppercase font-light">
            [ core capabilities ]
          </span>
          <h2 className="font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 text-3xl sm:text-4xl pb-1 tracking-tight">
            Designed for clarity and speed.
          </h2>
          <p className="font-sans font-light text-zinc-400 text-sm tracking-wide">
            Everything you need to write and export a standard-compliant, recruiter-approved resume.
          </p>
        </div>

        {/* 4-Column Grid with thin borders and unique corner-bracketed translucent cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-8 min-h-[220px] rounded-xl border border-white/[0.04] bg-[#0c1017]/30 backdrop-blur-md hover:border-blue-500/30 hover:bg-[#0c1017]/50 transition-all duration-500"
            >
              {/* Unique technical corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-700/60 rounded-tl-xl group-hover:border-blue-500/80 transition-all duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-700/60 rounded-tr-xl group-hover:border-blue-500/80 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-700/60 rounded-bl-xl group-hover:border-blue-500/80 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-700/60 rounded-br-xl group-hover:border-blue-500/80 transition-all duration-300" />

              {/* Smooth glow blur underlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-transparent group-hover:from-blue-500/[0.02] group-hover:to-cyan-500/[0.05] transition-all duration-700 pointer-events-none rounded-xl" />
              
              {/* Thin top hover light line */}
              <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="w-10 h-10 rounded-lg border border-white/5 flex items-center justify-center bg-black/40 group-hover:border-blue-500/30 group-hover:bg-blue-950/20 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-light text-[15px] text-white tracking-wide uppercase">
                  {item.label}
                </h3>
              </div>

              <p className="font-sans font-light text-zinc-400 text-[13px] leading-relaxed tracking-wide pt-6 border-t border-white/[0.03] mt-4 relative z-10">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
