import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onLaunchEditor: () => void;
  onLaunchATS: () => void;
}

export default function Navbar({ onLaunchEditor, onLaunchATS }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCompileNow = () => {
    const target = document.getElementById("resume-modes-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      onLaunchEditor();
    }
  };

  return (
    <nav
      id="homepage-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#000000]/85 backdrop-blur-md border-[#1A1F25] py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        
        {/* Left: Original Wordmark */}
        <div
          id="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <span className="font-anoother text-2xl text-white tracking-wider group-hover:text-blue-400 transition-colors">
            LTX
          </span>
          <div className="h-4 w-[1px] bg-white/20" />
          <div className="flex flex-col">
            <span className="font-anoother text-[11px] tracking-wider text-white uppercase leading-none group-hover:text-blue-400 transition-colors">
              LateXume
            </span>
            <span className="font-mono text-[7px] text-zinc-500 tracking-[0.15em] mt-0.5 uppercase">
              make it suitable
            </span>
          </div>
        </div>

        {/* Center/Right: Original Sleek Links */}
        <div id="nav-links" className="hidden md:flex items-center gap-8">
          <button
            onClick={() => {
              const featuresSection = document.getElementById("features-section");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          
          <button
            onClick={() => {
              const howItWorksSection = document.getElementById("how-it-works-section");
              if (howItWorksSection) {
                howItWorksSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Workflow
          </button>

          <button
            onClick={onLaunchATS}
            className="flex items-center gap-1.5 text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles size={11} className="text-blue-400 animate-pulse" />
            <span>ATS Diagnostic</span>
          </button>

          <button
            onClick={handleCompileNow}
            className="px-5 py-2.5 border border-[#1A1F25] text-white font-sans text-[10px] uppercase tracking-[0.2em] bg-[#1A1F25] hover:bg-black hover:border-zinc-700 transition-all duration-300 rounded-sm cursor-pointer select-none font-semibold flex items-center gap-1.5 group shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
          >
            <span>Compile Now</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform text-blue-400" />
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={onLaunchATS}
            className="flex items-center gap-1 text-[9px] font-sans font-medium uppercase tracking-[0.15em] text-zinc-400 bg-[#121212] border border-[#1A1F25] px-2.5 py-1.5 rounded-sm"
          >
            <Sparkles size={10} className="text-blue-400" />
            <span>ATS</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#000000]/95 backdrop-blur-md border-b border-[#1A1F25] px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const featuresSection = document.getElementById("features-section");
              if (featuresSection) featuresSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-left text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-zinc-400 hover:text-white py-1.5"
          >
            Capabilities
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const howItWorksSection = document.getElementById("how-it-works-section");
              if (howItWorksSection) howItWorksSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-left text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-zinc-400 hover:text-white py-1.5"
          >
            Workflow
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLaunchATS();
            }}
            className="text-left text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-zinc-400 hover:text-white py-1.5 flex items-center gap-1.5"
          >
            <Sparkles size={11} className="text-blue-400" />
            <span>ATS Diagnostic</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleCompileNow();
            }}
            className="text-center text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-white bg-[#1A1F25] border border-[#1A1F25] hover:bg-black py-3 rounded-sm"
          >
            Compile Now
          </button>
        </div>
      )}
    </nav>
  );
}
