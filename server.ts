import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createRequire } from "module";
import { extractText } from "unpdf";
import Groq from "groq-sdk";

// Create a require helper that works flawlessly in both ESM (dev) and CJS (prod build)
const customRequire = typeof import.meta !== "undefined" && import.meta.url
  ? createRequire(import.meta.url)
  : (typeof require !== "undefined" ? require : (pkg: string) => { throw new Error(`Cannot require ${pkg}`); });

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Groq safely on the server side
const groqApiKey = process.env.GROQ_API_KEY || process.env.GROQ_KEY || process.env.GROQ_API_TOKEN || process.env.GROQ_TOKEN;
let groq: Groq | null = null;

if (groqApiKey) {
  groq = new Groq({
    apiKey: groqApiKey,
  });
  console.log("Groq client initialized successfully with GROQ_API_KEY.");
} else {
  console.warn("WARNING: GROQ_API_KEY is not defined in the environment. Groq fallback may be unavailable.");
}

// Keep Gemini initialization as secondary/backup fallback option
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log("Gemini client initialized successfully as secondary fallback.");
}

// API: Check configuration status of models
app.get("/api/config-status", (req, res) => {
  res.json({
    hasGroq: !!groq,
    hasGemini: !!ai,
    primaryProvider: groq ? "Groq" : (ai ? "Gemini" : "None"),
    groqModel: "llama-3.3-70b-versatile",
    geminiModel: "gemini-2.5-flash"
  });
});

// Helper to ensure Groq is initialized
function getGroq(): Groq {
  if (!groq) {
    throw new Error("GROQ_API_KEY environment variable is missing. Please add it to your secrets under Settings -> Secrets.");
  }
  return groq;
}

// Helper to ensure Gemini is initialized
function getAi(): GoogleGenAI {
  if (!ai) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please add it to your secrets.");
  }
  return ai;
}

interface GroqChatParams {
  model?: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: any }>;
  temperature?: number;
  response_format?: { type: "json_object" };
}

// Robust helper to query Groq with automatic retry and model fallback
async function generateGroqChatWithRetry(
  params: GroqChatParams,
  retries = 2,
  delayMs = 1000
): Promise<any> {
  const client = getGroq();
  let lastError: any = null;
  
  // Use llama-3.3-70b-versatile for top tier capabilities, fallback to llama-3.1-8b-instant or mixtral
  const requestedModel = params.model || "llama-3.3-70b-versatile";
  const defaultFallbacks = ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama-3.1-8b-instant"];
  const modelsToTry = [requestedModel, ...defaultFallbacks.filter(m => m !== requestedModel)];

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Calling Groq using model: ${modelName}, attempt: ${attempt + 1}`);
        const response = await client.chat.completions.create({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errorMsg = String(err.message || err.stack || err);
        console.error(`Groq call failed with model ${modelName} on attempt ${attempt + 1}:`, err);

        if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
          break; // Don't retry for bad client parameters
        }

        const isTransient = err.status === 429 || err.status === 503 ||
          errorMsg.includes("429") ||
          errorMsg.includes("503") ||
          errorMsg.includes("rate limit") ||
          errorMsg.includes("overloaded");

        if (isTransient) {
          console.log(`Transient rate/capacity error on Groq model ${modelName}. Trying next fallback model...`);
          break;
        }

        if (attempt < retries) {
          const currentDelay = delayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with Groq.");
}

interface GenerateContentParams {
  model: string;
  contents: any;
  config?: any;
}

// Helper to execute generateContent with auto-retries and dynamic model fallback (Gemini backup)
async function generateContentWithRetry(
  params: GenerateContentParams,
  retries = 2,
  delayMs = 1000
): Promise<any> {
  const client = getAi();
  let lastError: any = null;
  
  // Dynamically prioritize the requested model first, then fall back to others
  const requestedModel = params.model || "gemini-2.5-flash";
  const defaultFallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
  const modelsToTry = [requestedModel, ...defaultFallbacks.filter(m => m !== requestedModel)];

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Calling Gemini using model: ${modelName}, attempt: ${attempt + 1}`);
        const response = await client.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errorMsg = String(err.message || err.stack || err);
        console.error(`Gemini call failed with model ${modelName} on attempt ${attempt + 1}:`, err);

        // If it's a client-side 4xx error (other than 429), don't retry and don't try fallback
        if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
          break;
        }

        // Check if the error is due to high demand, overload, or unavailable (503 / 429 / UNAVAILABLE)
        const isTransientError = err.status === 503 || 
          err.status === 429 ||
          errorMsg.includes("503") ||
          errorMsg.includes("429") ||
          errorMsg.includes("UNAVAILABLE") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("overloaded");

        if (isTransientError) {
          console.log(`Transient/high-demand error on ${modelName}. Instantly trying next available model...`);
          break; // Break the inner retry loop to instantly move to the next model in the list
        }

        if (attempt < retries) {
          const currentDelay = delayMs * Math.pow(2, attempt);
          console.log(`Waiting ${currentDelay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini.");
}

// API: Enhance a bullet point using Groq (Google XYZ Resume formula, with Gemini fallback)
app.post(["/api/gemini/enhance", "/api/groq/enhance"], async (req, res) => {
  try {
    const { draftText, jobTitle, companyName, jobDescription } = req.body;
    if (!draftText) {
      return res.status(400).json({ error: "draftText is required" });
    }

    const prompt = `You are a professional resume consultant specializing in elite, human-sounding resumes.
Improve the following draft resume bullet point for a candidate working as a "${jobTitle || "Professional"}" at "${companyName || "a company"}".
${jobDescription ? `Target Job Description or Keywords to match: "${jobDescription}"` : ""}

Draft Bullet Point: "${draftText}"

Follow these rules strictly:
1. Keep the bullet clean, human-sounding, short, clear, and action-focused.
2. If target job description keywords are provided, match the keywords naturally inside the achievement bullet. Avoid keyword stuffing.
3. Show impact, not just duties, by adding numbers, percentages, time saved, or bugs fixed.
4. Avoid overly formal, generic phrases such as "results-driven professional".
5. For a human-sounding bullet, write in candidate's own words, e.g.: "Built a Python-based data cleaning pipeline that reduced manual preprocessing time by 40% for a Kaggle project."
6. Keep it brief, professional, and impactful (exactly one line/sentence). Do not add preamble, chatty explanations, or quotes. Just return the enhanced bullet point itself.
7. CRITICAL length optimization (No trailing orphans/dangles): Avoid creating bullet points that wrap to a new line with only 1-3 words (e.g., 1-2 trailing words). Optimize the phrasing and word count so that the bullet point fits exactly on a single line, or if it spans multiple lines, make sure the final line is filled at least halfway (at least 6-10 words on that line) to ensure the resume looks filled and balanced in any template.`;

    let enhanced = "";
    if (groq) {
      console.log("Using Groq for bullet enhancement");
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional resume consultant specializing in elite, human-sounding resumes." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });
      enhanced = response.choices[0]?.message?.content?.trim() || draftText;
    } else {
      console.log("Using Gemini fallback for bullet enhancement");
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      enhanced = response.text?.trim() || draftText;
    }

    // Clean up code blocks or extra quotes
    if (enhanced.startsWith("```")) {
      enhanced = enhanced.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }
    if (enhanced.startsWith('"') && enhanced.endsWith('"')) {
      enhanced = enhanced.slice(1, -1);
    }

    res.json({ enhanced });
  } catch (err: any) {
    console.error("Enhance Error:", err);
    res.status(500).json({ error: err.message || "Failed to enhance resume draft" });
  }
});

// API: Generate tailored professional summary
app.post(["/api/gemini/generate-summary", "/api/groq/generate-summary"], async (req, res) => {
  try {
    const { personalInfo, experience, skills, jobDescription } = req.body;
    
    const prompt = `You are an elite resume editor. Generate a highly polished, human-sounding professional summary statement for a resume.
Use the following user profile details:
- Name: ${personalInfo?.fullName || ""}
- Target Title: ${personalInfo?.title || "Professional"}
- Background summary: ${personalInfo?.summary || "Looking to leverage skills for growth"}
- Experience: ${JSON.stringify(experience || [])}
- Core Skills: ${JSON.stringify(skills || [])}
${jobDescription ? `- Target Job Description or Keywords to match: ${jobDescription}` : ""}

Follow these rules strictly:
1. Write a cohesive, powerful summary of 2-3 sentences.
2. The summary MUST strictly follow this structured pattern in a unified flow: [Who you are] + [what you specialize in] + [your top skills] + [your main achievement/value].
3. Keep the resume clean, keyword-matched, and human-sounding.
4. If target Job Description/Keywords are provided, match the keywords naturally in the summary.
5. Avoid overly formal, generic phrases such as "results-driven professional."
6. Rewrite text so it sounds personal, specific, and action-focused. No greetings, preambles, or formatting.
7. CRITICAL: The summary must be highly concise, strictly no more than 3 lines of text (approx. 40-50 words maximum).
8. CRITICAL length optimization (No trailing orphans/dangles): Do not let the final sentence wrap to a new line with only 1-3 trailing words. Carefully construct, edit, and adjust the word lengths and sentence structures so that they cleanly fill the line, leaving no awkward single-word or short-word dangles at the bottom. The content should feel filled and tightly packed across the space.`;

    let summary = "";
    if (groq) {
      console.log("Using Groq for summary generation");
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an elite resume editor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });
      summary = response.choices[0]?.message?.content?.trim() || "";
    } else {
      console.log("Using Gemini fallback for summary generation");
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      summary = response.text?.trim() || "";
    }

    if (summary.startsWith("```")) {
      summary = summary.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }
    if (summary.startsWith('"') && summary.endsWith('"')) {
      summary = summary.slice(1, -1);
    }

    res.json({ summary });
  } catch (err: any) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate professional summary" });
  }
});

// API: Suggest skills based on resume details
app.post(["/api/gemini/suggest-skills", "/api/groq/suggest-skills"], async (req, res) => {
  try {
    const { jobTitle, experienceList } = req.body;

    const prompt = `Based on the target job title "${jobTitle || "Software Engineer"}" and the following work experience details:
${JSON.stringify(experienceList || [])}

Suggest a list of the 10 most relevant professional skills, technologies, frameworks, and methodologies.
Return the result strictly as a JSON array of strings. Do not include markdown codeblocks, do not write explanations. Just return the valid JSON array of strings.
Example: ["React", "TypeScript", "System Architecture", "GraphQL"]`;

    let skillsText = "";
    if (groq) {
      console.log("Using Groq for skill suggestions");
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a career assistant. Return ONLY a valid JSON array of strings, e.g. [\"SkillA\", \"SkillB\"]." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });
      skillsText = response.choices[0]?.message?.content?.trim() || "[]";
    } else {
      console.log("Using Gemini fallback for skill suggestions");
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      skillsText = response.text?.trim() || "[]";
    }

    let skills: string[] = [];
    try {
      skills = JSON.parse(skillsText);
    } catch {
      const clean = skillsText.replace(/```json/g, "").replace(/```/g, "").trim();
      skills = JSON.parse(clean);
    }

    if (skills && !Array.isArray(skills) && typeof skills === "object") {
      const keys = Object.keys(skills);
      if (keys.length > 0 && Array.isArray((skills as any)[keys[0]])) {
        skills = (skills as any)[keys[0]];
      }
    }

    res.json({ skills: Array.isArray(skills) ? skills : [] });
  } catch (err: any) {
    console.error("Suggest Skills Error:", err);
    res.status(500).json({ error: err.message || "Failed to suggest skills" });
  }
});

// API: Extract plain text from PDF, DOCX, or text/markdown document uploads (Supports Groq OCR & Gemini fallback)
app.post(["/api/gemini/parse-file", "/api/groq/parse-file"], async (req, res) => {
  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "No document data received." });
    }

    const buffer = Buffer.from(base64Data, "base64");
    const extension = fileName ? fileName.split(".").pop().toLowerCase() : "";
    const isImage = ["png", "jpg", "jpeg", "webp", "heic", "heif"].includes(extension);

    let extractedText = "";

    if (extension === "pdf") {
      try {
        console.log("Attempting local PDF extraction via unpdf...");
        const uint8Array = new Uint8Array(buffer);
        const parsed = await extractText(uint8Array, { mergePages: true });
        extractedText = parsed.text || "";
      } catch (pdfErr: any) {
        console.error("PDF extraction error via unpdf:", pdfErr);
      }

      // Fallback to Gemini OCR/Document parsing if local parsing failed or returned empty text
      if (!extractedText || !extractedText.trim()) {
        try {
          if (ai) {
            console.log("Local PDF extraction returned empty. Falling back to Gemini server-side document parsing...");
            const response = await generateContentWithRetry({
              model: "gemini-2.5-flash",
              contents: [
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64Data
                  }
                },
                "Please extract and transcribe all readable plain text from this PDF resume document. Maintain the structural section titles, bullet points, headers, organizations, and details. Do not add any conversational remarks, introductions, or formatting. Just output the clean extracted text."
              ]
            });
            extractedText = response.text || "";
            console.log(`Gemini server-side PDF extraction succeeded. Length: ${extractedText.length} characters.`);
          } else {
            console.warn("PDF extraction returned empty, and Gemini fallback is not available. (Groq does not support direct PDF OCR directly).");
            return res.status(400).json({ error: "Local text extraction from PDF returned empty. Please upload a digital/selectable PDF or convert it to an image format to run Groq OCR." });
          }
        } catch (geminiPdfErr: any) {
          console.error("Gemini server-side PDF extraction failed:", geminiPdfErr);
          return res.status(500).json({ error: `Failed to extract text from PDF: ${geminiPdfErr.message || "Unknown error"}` });
        }
      }
    } else if (isImage) {
      try {
        console.log(`Detected image file format (.${extension}). Extracting text...`);
        let mimeType = "image/png";
        if (extension === "jpg" || extension === "jpeg") {
          mimeType = "image/jpeg";
        } else if (extension === "webp") {
          mimeType = "image/webp";
        } else if (extension === "heic") {
          mimeType = "image/heic";
        } else if (extension === "heif") {
          mimeType = "image/heif";
        }

        if (groq) {
          console.log("Using Groq llama-3.2-11b-vision-preview for Image OCR");
          const response = await generateGroqChatWithRetry({
            model: "llama-3.2-11b-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Please read and transcribe all readable text from this resume image. Preserve the alignment, bullet points, and sections. Do not add any conversational remarks, intros, or descriptions. Return only the extracted text."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${base64Data}`
                    }
                  }
                ]
              }
            ]
          });
          extractedText = response.choices[0]?.message?.content || "";
        } else {
          console.log("Using Gemini fallback for Image OCR");
          const response = await generateContentWithRetry({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              },
              "Please read and transcribe all readable text from this resume image. Preserve the alignment, bullet points, and sections. Do not add any conversational remarks, intros, or descriptions. Return only the extracted text."
            ]
          });
          extractedText = response.text || "";
        }
        console.log(`Image OCR extraction succeeded. Length: ${extractedText.length} characters.`);
      } catch (imgErr: any) {
        console.error("Image OCR extraction failed:", imgErr);
        return res.status(500).json({ error: `Failed to extract text from image: ${imgErr.message || "Unknown error"}` });
      }
    } else if (extension === "docx" || extension === "doc") {
      try {
        const mammothModule = customRequire("mammoth");
        let mammoth = mammothModule;
        
        if (mammoth && typeof mammoth.extractRawText !== "function") {
          if (mammoth.default && typeof mammoth.default.extractRawText === "function") {
            mammoth = mammoth.default;
          }
        }

        if (!mammoth || typeof mammoth.extractRawText !== "function") {
          throw new Error("Resolved mammoth has no extractRawText method.");
        }

        const parsed = await mammoth.extractRawText({ buffer });
        extractedText = parsed.value || "";
      } catch (docxErr: any) {
        console.error("DOCX Parse error:", docxErr);
        return res.status(500).json({ error: `Failed to extract text from Word Document: ${docxErr.message}` });
      }
    } else {
      // txt, md, json or similar
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ error: "No text could be extracted from this document." });
    }

    res.json({ text: extractedText.trim() });
  } catch (err: any) {
    console.error("Parse-file route error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred while parsing file." });
  }
});

// API: Parse raw resume text and auto-optimize for ATS with high LaTeX rendering compatibility
app.post(["/api/gemini/parse-resume", "/api/groq/parse-resume"], async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const prompt = `You are an elite, world-class resume writer and ATS (Applicant Tracking System) optimization expert.
You have been given a candidate's raw, unoptimized or partially complete resume text.
${jobDescription ? `The target Job Description is:
"""
${jobDescription}
"""` : ""}

Your mission is to perform two tasks in one run:
1. Parse and extract all relevant details into the structured JSON format required below.
2. Maximize the candidate's ATS score through "Deep Phrasing & Content Optimization" while keeping it highly professional, clean, and human-sounding.

CRITICAL RESUME WRITING DIRECTIVES THAT YOU MUST STRICTLY FOLLOW:
- Keep the resume clean, keyword-matched, and human-sounding.
- Use standard section headings: Summary, Skills, Experience, Education, and Projects.
- CRITICAL summary requirement: The summary MUST strictly follow this structured pattern: [Who you are] + [what you specialize in] + [your top skills] + [your main achievement/value] in 2-3 concise sentences.
- CRITICAL length optimization (No trailing orphans/dangles): For all generated professional summaries, experience/project highlight bullets, and description lines, ensure they do NOT wrap to a new line containing only 1-3 trailing words. Optimize the length and phrasing of each bullet/sentence so it either fits cleanly on a single line, or if it spans multiple lines, the last line must be filled at least halfway (at least 6-10 words on that line) to ensure the resume looks filled and balanced in any template.
- If a target Job Description is provided above, match the keywords from it naturally inside the resume content (e.g., inside achievement bullets or skills) rather than stuffed.
- Show impact, not just duties, by adding numbers, percentages, time saved, or bugs fixed naturally.
- Avoid overly formal, generic phrases such as "results-driven professional."
- Rewrite AI-generated text so it sounds personal, specific, and candidate's own words.
- Avoid keyword stuffing; place keywords naturally inside achievement bullets.
- Keep bullets short, clear, and action-focused.
- Use real details from candidate's projects, internships, or work.
- For a fresher or early-career candidate, aim for a concise 1-page resume structure.
- For human-sounding bullets, write with a descriptive, personal style. E.g., "Built a Python-based data cleaning pipeline that reduced manual preprocessing time by 40% for a Kaggle project."
- Avoid tables, text boxes, icons, graphics, charts, and photos. Keep it in a clean, compatible plain-text format that easily renders in a single-column.
- The output structure must be optimized to render into a single-column layout without tables or complex graphics.
- **AT LEAST 3 PROJECTS REQUIRED**: Under all conditions, the parsed JSON output "projects" array MUST have at least 3 distinct projects. If the candidate's raw text contains fewer than 3 projects, extract separate sub-projects, open-source work, academic assignments, or significant internship contributions and present them as at least 3 distinct projects in the JSON. If they have 4 or more, parse them all.
- **CUSTOM/OTHER SECTIONS**: If there are other sections in the raw resume that do not map to the main system sections (personalInfo, education, experience, projects, skills), such as "Certifications", "Awards", "Publications", "Volunteer Work", "Languages", "Interests", etc., you MUST parse them into the "customSections" array. Each custom section has a title (e.g., "Certifications") and a list of structured items.

Return a valid JSON object matching the detailed structure. Make sure all ID fields (id) are unique short strings (like "edu_1", "exp_1", "proj_1", "sk_1", "cust_1", "item_1").

REQUIRED JSON STRUCTURE:
{
  "personalInfo": {
    "fullName": "Full Name",
    "title": "Job Title / Professional Designation (e.g. Senior Software Engineer)",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, State / City, Country",
    "website": "Personal Website URL or blank",
    "github": "Github username ONLY (no URL, e.g. 'johndoe') or blank",
    "linkedin": "Linkedin username ONLY (no URL, e.g. 'john-doe-123') or blank",
    "summary": "Tailored professional summary following this EXACT pattern: [Who you are] + [what you specialize in] + [your top skills] + [your main achievement/value]. Max 40-50 words, 2-3 sentences."
  },
  "education": [
    {
      "id": "edu_1",
      "institution": "University / College Name",
      "degree": "Degree (e.g., B.S., M.S.)",
      "fieldOfStudy": "Field of Study / Major (e.g., Computer Science)",
      "startDate": "Start Date (e.g., Sep 2018 or 2018)",
      "endDate": "End Date / Expected Date (e.g., May 2022 or Present)",
      "location": "City, State or Country",
      "description": "Any honors, GPA, or special achievements, or empty"
    }
  ],
  "experience": [
    {
      "id": "exp_1",
      "company": "Company Name",
      "position": "Job Title (e.g. Lead Developer)",
      "startDate": "Start Date (e.g., Jun 2021)",
      "endDate": "End Date (e.g., Dec 2023 or Present)",
      "location": "City, State or Country",
      "description": "",
      "highlights": [
        "Highly quantified human-sounding bullet point 1 starting with active verb",
        "Highly quantified human-sounding bullet point 2 starting with active verb"
      ]
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "name": "Project Name",
      "role": "Role in the project (e.g. Creator, Full-Stack Developer)",
      "startDate": "Start Date",
      "endDate": "End Date",
      "technologies": ["React", "TypeScript", "Node.js"],
      "description": "Short summary of the project",
      "highlights": [
        "Quantified achievement 1",
        "Quantified achievement 2"
      ],
      "url": "Project link or empty"
    }
  ],
  "skills": [
    {
      "id": "sk_1",
      "category": "E.g. Languages or Frameworks or Cloud",
      "skills": ["JavaScript", "Python", "Go"]
    }
  ],
  "languages": ["English", "Spanish"],
  "interests": ["Open-Source", "Competitive Programming"],
  "customSections": [
    {
      "id": "cust_1",
      "title": "Certifications",
      "items": [
        {
          "id": "item_1",
          "title": "AWS Certified Solutions Architect",
          "subtitle": "Amazon Web Services",
          "startDate": "2023",
          "endDate": "",
          "location": "",
          "description": "Passed on first attempt"
        }
      ]
    }
  ]
}

RAW RESUME TO PARSE AND OPTIMIZE:
"""
${resumeText}
"""

Ensure the output is STRICTLY valid JSON only. Do not wrap the JSON in Markdown codeblocks. Just return the JSON object.`;

    let parsedText = "";
    if (groq) {
      console.log("Using Groq for resume parsing");
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an elite, world-class resume writer and ATS optimization expert. Respond ONLY with raw, valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      parsedText = response.choices[0]?.message?.content?.trim() || "{}";
    } else {
      console.log("Using Gemini fallback for resume parsing");
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      parsedText = response.text?.trim() || "{}";
    }

    if (parsedText.startsWith("```")) {
      parsedText = parsedText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const parsedJson = JSON.parse(parsedText);
    res.json({ parsedData: parsedJson });
  } catch (err: any) {
    console.error("Parse Resume Error:", err);
    res.status(500).json({ error: err.message || "Failed to parse and optimize resume" });
  }
});

// API: Compress or expand a resume to fit exactly one page
app.post(["/api/gemini/fit-to-page", "/api/groq/fit-to-page"], async (req, res) => {
  try {
    const { resumeData, targetDirection } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "resumeData is required" });
    }

    let prompt = "";
    if (targetDirection === "compress") {
      prompt = `You are an expert resume editor and typographer. The provided resume is overflowing one page.
Your task is to edit, trim, and compress this resume so it fits EXACTLY onto a single page, without over-shortening it. You must preserve the highest possibility of lines and text density that can fit on one page.

Follow these compression and density maximization strategies:
1. Only shorten content just enough so it fits within the single-page boundary. Do not make it too short! Keep as much detail, metrics, and accomplishments as possible.
2. If the professional summary is extremely long, slightly refine it to be more concise (around 2-3 sentences, maximum 45 words).
3. Slightly compress and trim wordy sentences in experience highlights or project descriptions. Focus on reducing line wraps that cause "orphan" words (i.e., a single trailing word wrapped to a new line) as resolving these saves massive vertical space without losing content.
4. Keep all key credentials, jobs, degrees, and skills intact. Only edit descriptions and bullet points to be punchier and more compact.
5. Do not invent completely new text, just optimize the existing text for maximum single-page line capacity.
6. Maintain the exact same JSON format, structure, and all item "id" values. Do not change any fields other than text values (like descriptions, summaries, experience highlights, project highlights, etc.).

Resume JSON data to compress:
${JSON.stringify(resumeData, null, 2)}

Return only a valid JSON object matching the input structure. Do not include markdown blocks.`;
    } else {
      prompt = `You are an expert resume writer and typographer. The provided resume is underfilled and has extra vacant space at the bottom of the single page.
Your task is to expand, enrich, and add high-value professional details to this resume so that it fills out the entire single page beautifully down to the very last line before the footer, without overflowing.

Follow these single-page filling and expansion strategies:
1. Enrich the professional summary. If it is too brief, expand it to 3 cohesive, high-impact sentences (around 55-65 words) highlighting key skills, core expertise, and value proposition.
2. Under "experience" and "projects", add more details to bullet highlights or add 1-2 new highly-quantified achievements and responsibilities (using strong action verbs like 'Engineered', 'Optimized', 'Spearheaded' and real metrics). If an experience or project has fewer than 3 highlights, expand them to 3 or 4 compelling highlights.
3. Elaborate on descriptions, making sure every sentence is professionally detailed, polished, and occupies space elegantly.
4. Add relevant, common industry technologies or sub-skills to the skills section matching the candidate's professional title to make it look robust and complete.
5. The goal is to perfectly maximize the vertical density so that the resume content occupies the entire single page (right up to the bottom margin/footer), leaving minimal empty/vacant white space.
6. Maintain the exact same JSON structure, and all item "id" values. Ensure that you do not change any fields other than the text-based descriptions, summaries, highlights, etc.

Resume JSON data to expand:
${JSON.stringify(resumeData, null, 2)}

Return only a valid JSON object matching the input structure. Do not include markdown blocks.`;
    }

    let resultText = "";
    if (groq) {
      console.log(`Using Groq for fit-to-page: ${targetDirection}`);
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert resume editor. Respond ONLY with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      resultText = response.choices[0]?.message?.content?.trim() || "{}";
    } else {
      console.log(`Using Gemini fallback for fit-to-page: ${targetDirection}`);
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      resultText = response.text?.trim() || "{}";
    }

    if (resultText.startsWith("```")) {
      resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const parsedJson = JSON.parse(resultText);
    res.json({ updatedData: parsedJson });
  } catch (err: any) {
    console.error("Fit to Page Error:", err);
    res.status(500).json({ error: err.message || "Failed to fit resume to page" });
  }
});

// API: Analyze resume ATS compatibility and provide deep insights
app.post(["/api/gemini/analyze-ats", "/api/groq/analyze-ats"], async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "resumeText is required for analysis." });
    }

    const prompt = `You are an extremely thorough and honest applicant tracking system (ATS) expert.
Review the following candidate's resume text. Optionally compare it against the target job description if provided.

Resume Text:
"""
${resumeText}
"""

${jobDescription ? `Target Job Description:
"""
${jobDescription}
"""` : `No specific target job description was provided. Evaluate this resume against general modern professional and industry standards for the specified title, or general industry standards.`}

Analyze the resume and return a JSON object with the following schema:
{
  "score": 75,
  "rating": "Strong Match",
  "reasons": [
    "Brief explanation of why this score was given (e.g., 'Found 12 critical keyword alignments but lacks strong quantifiable metrics.')",
    "Formatting and structural layout scan assessment"
  ],
  "suggestions": [
    "Specific improvement tip 1 (e.g., 'Quantify your accomplishments. Instead of \"Responsible for database maintenance\", write \"Optimized MySQL query performance, reducing response latency by 25%\".')",
    "Specific improvement tip 2"
  ],
  "categoryScores": {
    "keywords": 80,
    "impactMetrics": 65,
    "structure": 90,
    "presentation": 85
  },
  "matchingKeywords": ["React", "TypeScript"],
  "missingKeywords": ["Kubernetes", "CI/CD"]
}

Ensure the output is strictly valid JSON only. Do not wrap the JSON in Markdown codeblocks. Just return the JSON object.`;

    let resultText = "";
    if (groq) {
      console.log("Using Groq for ATS analysis");
      const response = await generateGroqChatWithRetry({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert ATS resume evaluator. Respond ONLY with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      resultText = response.choices[0]?.message?.content?.trim() || "{}";
    } else {
      console.log("Using Gemini fallback for ATS analysis");
      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      resultText = response.text?.trim() || "{}";
    }

    if (resultText.startsWith("```")) {
      resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const analysisJson = JSON.parse(resultText);
    res.json({ analysis: analysisJson });
  } catch (err: any) {
    console.error("ATS Analysis Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze resume ATS score" });
  }
});

// API: Export LaTeX template
app.post("/api/latex/export", (req, res) => {
  const { latexCode, fileName } = req.body;
  if (!latexCode) {
    return res.status(400).send("No LaTeX code provided");
  }
  
  res.setHeader("Content-Disposition", `attachment; filename=${fileName || "resume.tex"}`);
  res.setHeader("Content-Type", "application/x-tex");
  res.send(latexCode);
});

// Vite middleware for development vs static production serve
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted as Express middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server listening at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite/Express initialization failed:", err);
});
