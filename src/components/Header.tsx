import React from "react";
import { PageSettings, TemplateId } from "../types";
import { Printer, Download, Eye, FileCode, Moon, Sun, Sliders, Type, Layout, Palette, Sparkles } from "lucide-react";

interface HeaderProps {
  settings: PageSettings;
  onSettingsChange: (newSettings: PageSettings) => void;
  showCodeView: boolean;
  onToggleCodeView: (val: boolean) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onPrint: () => void;
  onExportDocx?: () => void;
  currentView?: "home" | "editor";
  onViewChange?: (view: "home" | "editor") => void;
  configStatus?: {
    hasGroq: boolean;
    hasGemini: boolean;
    primaryProvider: string;
    groqModel: string;
    geminiModel: string;
  } | null;
}

export default function Header({
  settings,
  onSettingsChange,
  showCodeView,
  onToggleCodeView,
  darkMode,
  onToggleDarkMode,
  onPrint,
  onExportDocx,
  currentView = "editor",
  onViewChange,
  configStatus
}: HeaderProps) {

  const handleTemplateChange = (template: TemplateId) => {
    onSettingsChange({ ...settings, template });
  };

  const handleFontChange = (fontFamily: "calibri" | "arial" | "helvetica" | "garamond" | "times-new-roman") => {
    onSettingsChange({ ...settings, fontFamily });
  };

  const handleFontSizeChange = (fontSize: "sm" | "md" | "lg") => {
    onSettingsChange({ ...settings, fontSize });
  };

  const handleMarginChange = (marginSize: "compact" | "normal" | "wide") => {
    onSettingsChange({ ...settings, marginSize });
  };

  const handleSpacingChange = (lineSpacing: "tight" | "normal" | "loose") => {
    onSettingsChange({ ...settings, lineSpacing });
  };

  const handleColorChange = (accentColor: string) => {
    onSettingsChange({ ...settings, accentColor });
  };

  const colors = [
    { name: "Classic Slate", value: "#18181b" },
    { name: "Indigo Tech", value: "#4f46e5" },
    { name: "Emerald Bio", value: "#059669" },
    { name: "Crimson Law", value: "#dc2626" },
    { name: "Deep Cobalt", value: "#1d4ed8" },
    { name: "Rust Craft", value: "#b45309" }
  ];

  return (
    <header id="app-header-controls" className="no-print w-full bg-[#030712] text-white border-b border-[#1A1F25] p-5 md:p-6 space-y-6 font-mono">
      
      {/* Brand Title & Mode Toggles */}
      <div id="header-brand-row" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Title branding inspired by reference images */}
        <div 
          onClick={() => onViewChange && onViewChange("home")}
          className={`flex items-center gap-3 ${onViewChange ? "cursor-pointer group hover:opacity-95 transition-opacity" : ""}`}
          title="Return to Home Page"
        >
          <div className="relative flex items-center justify-center w-12 h-12 border border-[#1A1F25] bg-[#0d1117] rounded-sm group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all">
            <span className="font-sans font-black text-sm text-white tracking-widest">
              LTX
            </span>
          </div>
          <div>
            <h1 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              LaTeXume Studio <span className="font-mono text-zinc-500 text-[10px] font-medium tracking-widest">// AI COMPILER</span>
            </h1>
            <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">
              Secure Local Compiling & Bullet Point Synthesizer
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[9px] uppercase tracking-wider">
              <span className={`w-1.5 h-1.5 rounded-full ${configStatus?.hasGroq ? "bg-emerald-500" : (configStatus?.hasGemini ? "bg-cyan-500" : "bg-amber-500")} animate-pulse`} />
              <span className="text-zinc-500 font-mono">
                AI Engine: {configStatus?.hasGroq ? "Groq Llama-3.3-70B" : (configStatus?.hasGemini ? "Gemini-2.5-Flash" : "Local Engine")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls deck */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Back to Home Button */}
          {onViewChange && currentView === "editor" && (
            <button
              onClick={() => onViewChange("home")}
              className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-zinc-300 hover:text-white bg-[#1A1F25] hover:bg-[#111] border border-[#2A2F35] hover:border-zinc-700 rounded-sm cursor-pointer tracking-wider uppercase transition-all duration-300"
            >
              <span>&larr; Lobby</span>
            </button>
          )}

          {/* Toggle between previewer and latex editor */}
          <div className="flex border border-[#1A1F25] bg-black p-0.5 rounded-sm">
            <button
              onClick={() => onToggleCodeView(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-all rounded-sm
                ${!showCodeView 
                  ? "bg-[#1A1F25] text-white" 
                  : "text-zinc-400 hover:text-white"}`}
            >
              <Eye size={12} className="text-blue-400" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onToggleCodeView(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-all rounded-sm
                ${showCodeView 
                  ? "bg-[#1A1F25] text-white" 
                  : "text-zinc-400 hover:text-white"}`}
            >
              <FileCode size={12} className="text-blue-400" />
              <span>LaTeX Code</span>
            </button>
          </div>

          {/* Download / Print Resume */}
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/20 rounded-sm cursor-pointer tracking-wider uppercase transition-all active:scale-[0.98]"
            >
              <Printer size={13} />
              <span className="uppercase tracking-wider">Download PDF</span>
            </button>
            {onExportDocx && (
              <button
                onClick={onExportDocx}
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold bg-[#1A1F25] hover:bg-[#252a32] text-white border border-[#2A2F35] rounded-sm cursor-pointer tracking-wider uppercase transition-all active:scale-[0.98]"
                title="Export ATS-compatible Word file"
              >
                <Download size={13} className="text-blue-400" />
                <span className="uppercase tracking-wider">Download DOCX</span>
              </button>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 border border-[#1A1F25] bg-[#121212] hover:bg-[#1A1F25] text-zinc-400 hover:text-white rounded-sm cursor-pointer transition-all"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Styled Grid Divider */}
      <div className="h-[1px] bg-[#1A1F25] w-full" />

      {/* Styles & Customizers Board */}
      <div id="customizer-board" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
        
        {/* 1. Template Select */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            <Layout size={12} className="text-blue-400" />
            <span>Document Template</span>
          </label>
          <select
            value={settings.template}
            onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
            className="w-full p-2 border border-[#1A1F25] bg-[#0c1017] text-zinc-200 focus:outline-none focus:border-zinc-700 rounded-sm cursor-pointer"
          >
            <option value="classic-latex">Classic Academic LaTeX</option>
            <option value="swiss-modern">Swiss Brutalist (Ref)</option>
            <option value="jakes-tech">Jake's SE Tech</option>
            <option value="deedy-two-col">Deedy Two-Column</option>
          </select>
        </div>

        {/* 2. Typeface Selection */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            <Type size={12} className="text-blue-400" />
            <span>Document Typeface</span>
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleFontChange(e.target.value as "calibri" | "arial" | "helvetica" | "garamond" | "times-new-roman")}
            className="w-full p-2 border border-[#1A1F25] bg-[#0c1017] text-zinc-200 focus:outline-none focus:border-zinc-700 rounded-sm cursor-pointer"
          >
            <option value="calibri">Calibri (Classic Corporate)</option>
            <option value="arial">Arial (Standard Clean)</option>
            <option value="helvetica">Helvetica (Modern Sans)</option>
            <option value="garamond">Garamond (Elegant Serif)</option>
            <option value="times-new-roman">Times New Roman (Legacy Manual)</option>
          </select>
        </div>

        {/* 3. Margin Scale */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            <Sliders size={12} className="text-blue-400" />
            <span>Margins</span>
          </label>
          <select
            value={settings.marginSize}
            onChange={(e) => handleMarginChange(e.target.value as "compact" | "normal" | "wide")}
            className="w-full p-2 border border-[#1A1F25] bg-[#0c1017] text-zinc-200 focus:outline-none focus:border-zinc-700 rounded-sm cursor-pointer"
          >
            <option value="compact">Compact (0.4in)</option>
            <option value="normal">Normal (0.5" Top, 0.6" Sides)</option>
            <option value="wide">Wide (0.75in)</option>
          </select>
        </div>

        {/* 4. Font Sizing & spacing */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            <Sliders size={12} className="text-blue-400" />
            <span>Size & Spacing</span>
          </label>
          <div className="flex gap-1.5">
            <select
              value={settings.fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value as "sm" | "md" | "lg")}
              className="w-1/2 p-2 border border-[#1A1F25] bg-[#0c1017] text-zinc-200 focus:outline-none focus:border-zinc-700 rounded-sm cursor-pointer"
            >
              <option value="sm">10pt</option>
              <option value="md">11pt</option>
              <option value="lg">12pt</option>
            </select>
            <select
              value={settings.lineSpacing}
              onChange={(e) => handleSpacingChange(e.target.value as "tight" | "normal" | "loose")}
              className="w-1/2 p-2 border border-[#1A1F25] bg-[#0c1017] text-zinc-200 focus:outline-none focus:border-zinc-700 rounded-sm cursor-pointer"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </div>

        {/* 5. Custom Color Accent */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            <Palette size={12} className="text-blue-400" />
            <span>Color Accents</span>
          </label>
          <div className="flex gap-1.5 flex-wrap mt-1">
            {colors.map((col) => (
              <button
                key={col.value}
                onClick={() => handleColorChange(col.value)}
                style={{ backgroundColor: col.value }}
                className={`w-6 h-6 border border-zinc-800 rounded-full transition-transform cursor-pointer
                  ${settings.accentColor === col.value ? "scale-110 ring-2 ring-blue-500/50" : "hover:scale-105 opacity-80 hover:opacity-100"}`}
                title={col.name}
              />
            ))}
          </div>
        </div>

      </div>

    </header>
  );
}
