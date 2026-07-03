# LateXume

LateXume is an AI-assisted resume builder that helps you create, improve, preview, and export a polished resume without fighting formatting. It combines a clean browser editor, live ATS scoring, AI-powered text cleanup, document import, and export tools for both LaTeX and Word.

## What it does

LateXume is built for people who want a resume that looks professional and reads well for both recruiters and ATS systems. You can start from scratch, import an existing resume, or paste raw content and shape it into a cleaner version.

It gives you:

- A structured resume editor with live preview
- ATS scoring and suggestions based on your resume content
- AI-assisted bullet point, summary, and skills improvements
- Resume import from PDF, DOCX, images, markdown, text, and JSON
- LaTeX source export and Word DOCX export
- A resume parsing flow that can fall back to Gemini for PDF text extraction when local parsing is not enough
- Groq as the primary AI provider for most resume generation tasks

## Why this is useful

Most resume tools either make editing awkward or produce documents that look fine but are hard to keep ATS-friendly. LateXume tries to solve both problems at once. It keeps the writing process fast, keeps the layout consistent, and gives you feedback before you send anything out.

It is especially useful if you want to:

- Turn an old resume into a cleaner version quickly
- Improve bullet points so they sound specific and impactful
- Check whether your resume is missing common ATS signals
- Export a professional document without hand-writing LaTeX
- Keep your resume data saved locally in the browser while you edit

## Tech stack

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion and GSAP for animation
- Lucide React for icons

Backend:

- Express
- Node.js
- tsx for local development
- esbuild for the production server bundle

AI and document tooling:

- Groq SDK for primary resume generation
- Google GenAI for fallback Gemini calls and server-side PDF extraction
- unpdf for local PDF text extraction
- docx for Word export generation
- mammoth for DOCX text extraction

## How it works

The app is split into two parts:

1. The browser app handles editing, previewing, ATS checks, and exports.
2. The Express server handles AI calls and document parsing.

The AI flow is intentionally practical:

- Groq is used first for resume writing, rewriting, summaries, skill suggestions, and ATS-related generation.
- Gemini is kept as a fallback for cases where Groq is unavailable.
- For PDF uploads, the server first tries local extraction with unpdf.
- If the PDF text comes back empty, Gemini can step in to extract the document text server-side.

That means Gemini may appear in the logs even when Groq is the main provider for resume generation. In this app, Gemini is mainly a fallback and extraction helper, not the default writing engine.

## Main features

- Build a resume from scratch with live preview
- Import an existing resume and clean it up
- Upload PDF, DOCX, TXT, MD, JSON, or image files for parsing
- Generate or improve bullet points, summaries, and skills with AI
- Check ATS-style resume quality and keyword alignment
- Export to DOCX for editing in Word
- Copy or download the LaTeX source for Overleaf or local compilation
- Save editor state in localStorage so work persists between sessions

## Running locally

### Prerequisites

- Node.js 18 or newer

### Install

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and add at least one AI key.

```bash
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

Groq is the primary provider. Gemini is useful as a backup and for PDF extraction fallback.

### Run in development

```bash
npm run dev
```

The app starts the local Express server and the frontend dev flow from the same project.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

## Available scripts

- `npm run dev` - starts the development server with `tsx server.ts`
- `npm run build` - builds the Vite frontend and bundles the Node server
- `npm start` - runs the production server from `dist/server.cjs`
- `npm run lint` - type-checks the project with `tsc --noEmit`
- `npm run clean` - removes generated build output

## File format support

LateXume can work with several common resume formats:

- PDF
- DOCX / DOC
- TXT / Markdown
- JSON
- Image uploads such as PNG, JPG, JPEG, WebP, HEIC, and HEIF

## What makes it efficient

The app is lightweight in the places that matter:

- Resume state is stored locally in the browser, so reloads do not wipe your work.
- Local PDF extraction is attempted first before falling back to AI extraction.
- Groq handles most generation tasks, which keeps the main writing path fast and focused.
- The server only gets involved when parsing, exporting, or calling AI models.
- The UI is built with Vite and modern React, so edits and previews stay responsive.

## Notes

- If Groq is not configured, the app can fall back to Gemini for supported generation paths.
- If Gemini is not configured, PDF text extraction fallback may be limited when local parsing fails.
- The ATS checker is meant to guide improvement, not replace a real recruiter review.
- The app is optimized for fast iteration, clean output, and practical resume editing rather than heavy design gimmicks.

## In short

LateXume is a resume builder for people who want something practical: fast editing, stronger wording, ATS-aware structure, and export options that are actually useful. It is meant to save time, reduce formatting friction, and make the resume itself easier to improve.
