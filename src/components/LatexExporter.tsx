import React, { useState } from "react";
import { ResumeData, PageSettings } from "../types";
import { generateLatex } from "../utils/latexGenerator";
import { Copy, Check, Download, FileCode, Info, ExternalLink } from "lucide-react";

interface LatexExporterProps {
  data: ResumeData;
  settings: PageSettings;
}

export default function LatexExporter({ data, settings }: LatexExporterProps) {
  const [copied, setCopied] = useState(false);
  
  // Compile the raw LaTeX text
  const latexCode = generateLatex(data, settings);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy code: " + err);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([latexCode], { type: "application/x-tex" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // format file name
      const safeName = data.personalInfo.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "resume";
      link.download = `${safeName}_latex_resume.tex`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export LaTeX file: " + err);
    }
  };

  return (
    <div id="latex-exporter-container" className="flex flex-col h-full bg-zinc-900 text-zinc-100 border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] overflow-hidden font-mono">
      
      {/* Header */}
      <div id="latex-header" className="p-4 border-b-2 border-black dark:border-zinc-700 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">[//] Raw LaTeX Source</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 font-mono text-xs bg-zinc-800 hover:bg-zinc-750 text-white border border-zinc-700 py-1.5 px-3 font-semibold cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Source</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 font-mono text-xs bg-emerald-600 hover:bg-emerald-500 text-white border border-black py-1.5 px-3 font-semibold cursor-pointer transition-colors"
          >
            <Download size={13} />
            <span>Download .tex</span>
          </button>
        </div>
      </div>

      {/* Compiler instructions/tips */}
      <div id="latex-instructions" className="p-3 bg-zinc-950/70 border-b border-zinc-800 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2.5">
        <Info size={14} className="text-zinc-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            This code is compile-ready for standard LaTeX engines (pdfLaTeX). For 100% cloud rendering, you can copy this and paste it directly into a new project on{" "}
            <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-0.5">
              Overleaf <ExternalLink size={8} />
            </a>
            .
          </p>
          <p className="text-zinc-500">
            * Selected font: <span className="text-zinc-300 capitalize">{settings.fontFamily}</span> | Document Template: <span className="text-zinc-300 capitalize">{settings.template.replace("-", " ")}</span>
          </p>
        </div>
      </div>

      {/* Code viewport */}
      <div id="latex-code-viewport" className="flex-1 overflow-auto p-4 bg-zinc-950 text-zinc-300 text-xs select-all">
        <pre className="font-mono whitespace-pre select-text leading-relaxed">
          <code>{latexCode}</code>
        </pre>
      </div>

    </div>
  );
}
