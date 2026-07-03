import { ResumeData, PageSettings } from "../types";

// Helper to escape LaTeX special characters
export function escapeLatex(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash ")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde ")
    .replace(/\^/g, "\\textasciicircum ")
    .replace(/\[/g, "{[}")
    .replace(/\]/g, "{]}");
}

export function generateLatex(data: ResumeData, settings: PageSettings): string {
  const p = data.personalInfo;
  const escP = {
    fullName: escapeLatex(p.fullName),
    title: escapeLatex(p.title),
    email: escapeLatex(p.email),
    phone: escapeLatex(p.phone),
    location: escapeLatex(p.location),
    website: escapeLatex(p.website),
    github: escapeLatex(p.github),
    linkedin: escapeLatex(p.linkedin),
    summary: escapeLatex(p.summary)
  };

  switch (settings.template) {
    case "jakes-tech":
      return generateJakesTechLatex(data, escP, settings);
    case "swiss-modern":
      return generateSwissModernLatex(data, escP, settings);
    case "deedy-two-col":
      return generateDeedyTwoColLatex(data, escP, settings);
    case "classic-latex":
    default:
      return generateClassicLatex(data, escP, settings);
  }
}

function generateClassicLatex(data: ResumeData, p: any, settings: PageSettings): string {
  const isSerif = settings.fontFamily === "garamond" || settings.fontFamily === "times-new-roman";
  const fontCommand = isSerif ? "" : "\\renewcommand{\\familydefault}{\\sfdefault}";
  
  return `%-------------------------
% Resume in LaTeX (Classic Academic Template)
%------------------------

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\cleanlook

${fontCommand}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that pdf latex is machine readable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small\\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${p.fullName}} \\\\ \\vspace{4pt}
    \\small ${p.title} \\\\ \\vspace{2pt}
    \\small ${p.location} $|$ ${p.phone} $|$ \\href{mailto:${p.email}}{${p.email}} $|$ 
    \\href{https://${p.website}}{${p.website}} $|$ 
    \\href{https://github.com/${p.github}}{github.com/${p.github}}
\\end{center}

%----------SUMMARY----------
\\section{Professional Summary}
\\small{
  ${p.summary}
}

%-----------EDUCATION-----------
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${data.education.map(edu => `
    \\resumeSubheading{
      ${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}{
      ${escapeLatex(edu.degree)} in ${escapeLatex(edu.fieldOfStudy)}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}
      ${edu.description ? `\\vspace{2pt}\\\\ \\small{${escapeLatex(edu.description)}}` : ""}
    `).join("\n")}
  \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${data.experience.map(exp => `
    \\resumeSubheading{
      ${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}{
      ${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\begin{itemize}
        ${exp.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join("\n        ")}
      \\end{itemize}
    `).join("\n")}
  \\end{itemize}

%-----------PROJECTS-----------
\\section{Projects}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${data.projects.map(proj => `
    \\resumeProjectHeading{
      \\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies.join(", "))}}}{${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate)}}
      \\begin{itemize}
        ${proj.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join("\n        ")}
      \\end{itemize}
    `).join("\n")}
  \\end{itemize}

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${data.skills.map(sk => `\\textbf{${escapeLatex(sk.category)}}: ${escapeLatex(sk.skills.join(", "))} \\\\`).join("\n     ")}
    }}
 \\end{itemize}

\\end{document}
`;
}

function generateJakesTechLatex(data: ResumeData, p: any, settings: PageSettings): string {
  const isSerif = settings.fontFamily === "garamond" || settings.fontFamily === "times-new-roman";
  const fontCommand = isSerif ? "\\usepackage{charter}" : "\\usepackage[sfdefault]{FiraSans}";
  return `%-------------------------
% Resume in LaTeX (Jake's Resume - Tech Style)
%------------------------

\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Font configurations
${fontCommand}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\cleanlook

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-5pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titrule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\fontfamily{qhv}\\selectfont \\textbf{${p.fullName}}} \\\\ \\vspace{4pt}
    \\small ${p.phone} $|$ \\href{mailto:${p.email}}{${p.email}} $|$ 
    \\href{https://linkedin.com/in/${p.linkedin}}{linkedin.com/in/${p.linkedin}} $|$
    \\href{https://github.com/${p.github}}{github.com/${p.github}}
\\end{center}

%----------SUMMARY----------
\\section{Summary}
\\small{
  ${p.summary}
}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    ${data.experience.map(exp => `
    \\resumeSubheading{
      ${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}{
      ${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
      \\resumeItemListStart
        ${exp.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join("\n        ")}
      \\resumeItemListEnd
    `).join("\n")}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
    ${data.projects.map(proj => `
    \\resumeSubheading{
      ${escapeLatex(proj.name)}}{${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate)}}{
      ${escapeLatex(proj.role)}}{${escapeLatex(proj.technologies.join(", "))}}
      \\resumeItemListStart
        ${proj.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join("\n        ")}
      \\resumeItemListEnd
    `).join("\n")}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    ${data.education.map(edu => `
    \\resumeSubheading{
      ${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}{
      ${escapeLatex(edu.degree)} in ${escapeLatex(edu.fieldOfStudy)}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}
    `).join("\n")}
  \\resumeSubHeadingListEnd

%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${data.skills.map(sk => `\\textbf{${escapeLatex(sk.category)}}: {${escapeLatex(sk.skills.join(", "))}}`).join(" \\\\ \n     ")}
    }}
 \\end{itemize}

\\end{document}
`;
}

function generateSwissModernLatex(data: ResumeData, p: any, settings: PageSettings): string {
  // Stark, heavy brutalist theme
  return `%-------------------------
% Resume in LaTeX (Brutalist / Swiss Modern Template)
%------------------------

\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{geometry}
\\geometry{verbose,tmargin=0.6in,bmargin=0.6in,lmargin=0.6in,rmargin=0.6in}

% Helvetica-like sans-serif and TeX typewriter monospaced
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[scaled=0.9]{beramono}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting with bold uppercase Swiss style and square brackets
\\titleformat{\\section}{
  \\vspace{10pt}\\bfseries\\Large\\ttfamily
}{}{0em}{[\\,\\!}[\\,\\!]

\\begin{document}

%----------HEADER----------
\\begin{tabular*}{1\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Huge ${p.fullName.toUpperCase()}} & \\texttt{${p.location}} \\\\
  \\textit{${p.title.toUpperCase()}} & \\texttt{${p.email}} $|$ \\texttt{${p.phone}} \\\\
  \\href{https://${p.website}}{\\texttt{${p.website}}} & \\href{https://github.com/${p.github}}{\\texttt{github.com/${p.github}}}
\\end{tabular*}

\\vspace{12pt}
\\hrule height 2pt
\\vspace{10pt}

%----------SUMMARY----------
\\section{PROFILE}
\\small{${p.summary}}

%-----------EXPERIENCE-----------
\\section{EXPERIENCE}
${data.experience.map(exp => `
\\vspace{6pt}
\\begin{tabular*}{1\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{${escapeLatex(exp.position.toUpperCase())}} $|$ \\texttt{${escapeLatex(exp.company.toUpperCase())}} & \\texttt{${escapeLatex(exp.startDate)} - ${escapeLatex(exp.endDate)}} \\\\
  \\textit{\\small ${escapeLatex(exp.location)}} & \\\\
\\end{tabular*}
\\begin{itemize}[leftmargin=0.15in, label=\\texttt{+}]
  ${exp.highlights.map(h => `\\item \\small{${escapeLatex(h)}}`).join("\n  ")}
\\end{itemize}
`).join("\n")}

%-----------PROJECTS-----------
\\section{SELECTED PROJECTS}
${data.projects.map(proj => `
\\vspace{6pt}
\\begin{tabular*}{1\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{${escapeLatex(proj.name.toUpperCase())}} $|$ \\texttt{${escapeLatex(proj.technologies.join(", "))}} & \\texttt{${escapeLatex(proj.startDate)} - ${escapeLatex(proj.endDate)}} \\\\
\\end{tabular*}
\\begin{itemize}[leftmargin=0.15in, label=\\texttt{+}]
  ${proj.highlights.map(h => `\\item \\small{${escapeLatex(h)}}`).join("\n  ")}
\\end{itemize}
`).join("\n")}

%-----------EDUCATION-----------
\\section{EDUCATION}
${data.education.map(edu => `
\\vspace{6pt}
\\begin{tabular*}{1\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{${escapeLatex(edu.institution.toUpperCase())}} & \\texttt{${escapeLatex(edu.startDate)} - ${escapeLatex(edu.endDate)}} \\\\
  \\textit{\\small ${escapeLatex(edu.degree)} in ${escapeLatex(edu.fieldOfStudy)}} & \\texttt{${escapeLatex(edu.location)}} \\\\
\\end{tabular*}
`).join("\n")}

%-----------SKILLS-----------
\\section{CAPABILITIES}
\\begin{itemize}[leftmargin=0.15in, label=\\texttt{/}]
  ${data.skills.map(sk => `\\item \\small \\textbf{${escapeLatex(sk.category.toUpperCase())}}: ${escapeLatex(sk.skills.join(", "))}`).join("\n  ")}
\\end{itemize}

\\end{document}
`;
}

function generateDeedyTwoColLatex(data: ResumeData, p: any, settings: PageSettings): string {
  // Beautiful Two Column LaTeX template
  return `%-------------------------
% Resume in LaTeX (Two-Column Deedy Style)
%------------------------

\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{geometry}
\\geometry{tmargin=0.5in,bmargin=0.5in,lmargin=0.5in,rmargin=0.5in}

\\renewcommand{\\familydefault}{\\sfdefault}

\\begin{document}

%----------HEADER----------
\\begin{center}
  \\Huge \\textbf{${p.fullName}} \\\\
  \\vspace{2pt}
  \\large \\textit{${p.title}} \\\\
  \\vspace{4pt}
  \\small ${p.email} $|$ ${p.phone} $|$ ${p.location}
\\end{center}

\\vspace{6pt}
\\hrule
\\vspace{10pt}

% Two Columns
\\begin{minipage}[t]{0.3\\textwidth}
  \\vspace{0pt} % align minipages top
  
  \\section*{About}
  \\small{${p.summary}}
  
  \\vspace{12pt}
  \\section*{Education}
  ${data.education.map(edu => `
    \\textbf{\\small ${escapeLatex(edu.institution)}} \\\\
    {\\scriptsize ${escapeLatex(edu.degree)} in ${escapeLatex(edu.fieldOfStudy)}} \\\\
    {\\scriptsize ${escapeLatex(edu.startDate)} - ${escapeLatex(edu.endDate)}} \\\\
    \\vspace{4pt}
  `).join("")}
  
  \\vspace{12pt}
  \\section*{Skills}
  ${data.skills.map(sk => `
    \\textbf{\\small ${escapeLatex(sk.category)}} \\\\
    {\\scriptsize ${escapeLatex(sk.skills.join(", "))}} \\\\
    \\vspace{4pt}
  `).join("")}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.66\\textwidth}
  \\vspace{0pt} % align minipages top
  
  \\section*{Experience}
  ${data.experience.map(exp => `
    \\textbf{\\small ${escapeLatex(exp.position)}} $|$ \\textit{\\small ${escapeLatex(exp.company)}} \\\\
    {\\scriptsize ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)} $|$ ${escapeLatex(exp.location)}}
    \\begin{itemize}[leftmargin=0.15in, topsep=1pt, itemsep=1pt]
      ${exp.highlights.map(h => `\\item \\scriptsize{${escapeLatex(h)}}`).join("\n      ")}
    \\end{itemize}
    \\vspace{6pt}
  `).join("")}
  
  \\vspace{6pt}
  \\section*{Selected Projects}
  ${data.projects.map(proj => `
    \\textbf{\\small ${escapeLatex(proj.name)}} $|$ \\textit{\\small ${escapeLatex(proj.technologies.join(", "))}} \\\\
    {\\scriptsize ${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate)}}
    \\begin{itemize}[leftmargin=0.15in, topsep=1pt, itemsep=1pt]
      ${proj.highlights.map(h => `\\item \\scriptsize{${escapeLatex(h)}}`).join("\n      ")}
    \\end{itemize}
    \\vspace{6pt}
  `).join("")}

\\end{minipage}

\\end{document}
`;
}
