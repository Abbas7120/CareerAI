// const { generateAI } = require("../services/gemini.service")
// const db = require("../config/mysql")

// exports.generateResume = async(req,res)=>{

// const { fullName,email,education,skills,experience,projects } = req.body

// const prompt = `
// Act as a professional resume writer.

// Create a resume using this data.

// Name:${fullName}
// Education:${education}
// Skills:${skills}
// Experience:${experience}
// Projects:${projects}
// `

// const resume = await generateAI(prompt)

// await db.query(
// `INSERT INTO resumes(full_name,email,education,skills,experience,projects,generated_resume)
// VALUES (?,?,?,?,?,?,?)`,
// [fullName,email,education,skills,experience,projects,resume]
// )

// res.json({resume})

// }

//  const { GoogleGenAI } = require("@google/genai");
//  const GEMINI_API_KEY = "AIzaSyAAIiBcWCluvC0uPT8lpCo0TjoLXkMWd8A";

//  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
 
//  const db = require("../config/mysql")


// // ─── AI helper ────────────────────────────────────────────────────────────────
// async function enhanceWithAI(prompt) {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.1-flash-lite-preview",
//       contents: prompt,
//     });
//     return response.text?.trim() || "";
//   } catch (error) {
//     console.error("AI Enhancement Error:", error.message);
//     throw new Error("AI enhancement failed: " + error.message);
//   }
// }

const { generateAI: mistralAI } = require("../services/mistral.service")
const { generateAI: geminiAI } = require("../services/gemini.service")
const db = require("../config/mysql");

// ─── Smart AI helper — Mistral first, Gemini fallback ────────────────────────
async function enhanceWithAI(prompt) {
  try {
    console.log("[Resume] Trying Mistral...")
    return await mistralAI(prompt);
  } catch (err) {
    console.warn("[Resume] Mistral failed:", err.message, "— switching to Gemini");
    return await geminiAI(prompt);
  }
}

// ─── Everything below unchanged ──────────────────────────────────────────────
// ─── Enhance individual sections ─────────────────────────────────────────────
async function enhanceSection(sectionType, rawText, context = {}) {
  const prompts = {
    summary: `You are a professional resume writer. Enhance this personal summary for a resume.
Make it concise (3-4 sentences), professional, impactful, and ATS-friendly.
Use strong action-oriented language. Do NOT use bullet points. Return ONLY the enhanced summary text.

Candidate context: ${JSON.stringify(context)}
Raw summary input: "${rawText}"`,

    experience: `You are a professional resume writer. Enhance these work experience details into professional resume bullet points.
For each position, write 3-4 strong bullet points starting with action verbs (Led, Built, Developed, Improved, Managed, etc.).
Include quantifiable achievements where possible. Format as:
[Job Title] | [Company] | [Duration]
• bullet point
• bullet point
Return ONLY the formatted experience section, no extra commentary.

Raw experience input: "${rawText}"`,

    achievements: `You are a professional resume writer. Transform these raw achievements into impressive resume-ready bullet points.
Each point should be concise, specific, and impactful. Start each with a strong action verb or result metric.
Format: • [Achievement]
Return ONLY the formatted achievement bullet points.

Raw achievements input: "${rawText}"`,

    extracurricular: `You are a professional resume writer. Enhance these extracurricular activities for a resume.
Make them sound impactful and leadership-oriented. Show skills gained.
Format: • [Activity/Role] — [Brief impact or skill]
Return ONLY the formatted extracurricular bullet points.

Raw activities input: "${rawText}"`,
  };

  return await enhanceWithAI(prompts[sectionType]);
}

// ─── Generate full resume text for a template ────────────────────────────────
async function generateResumeContent(data, templateId) {
  const {
    fullName, email, phone, linkedin, portfolio,
    education, skills, summary, experience,
    achievements, extracurricular
  } = data;

  const prompt = `You are an expert resume writer. Generate a complete, professional resume using the data below.
Template style: ${templateId === "classic" ? "Traditional ATS-friendly" : templateId === "modern" ? "Modern professional" : "Creative minimal"}

Strictly follow this structure and return ONLY the resume content (no commentary):

${fullName}
${email} | ${phone}${linkedin ? " | " + linkedin : ""}${portfolio ? " | " + portfolio : ""}

PROFESSIONAL SUMMARY
${summary}

EDUCATION
${education}

SKILLS
${skills}

PROFESSIONAL EXPERIENCE
${experience}

ACHIEVEMENTS
${achievements}

EXTRACURRICULAR ACTIVITIES
${extracurricular}

Make it compelling, ATS-friendly, and professional. Use strong action verbs. Keep it to 1 page worth of content.`;

  return await enhanceWithAI(prompt);
}

// ─── Main controller ──────────────────────────────────────────────────────────
exports.generateResume = async (req, res) => {
  try {
    const {
      fullName, email, phone, linkedin, portfolio,
      education, skills, templateId = "classic",
      rawSummary, rawExperience, rawAchievements, rawExtracurricular,
    } = req.body;

    // Validation
    if (!fullName || !email || !education || !skills) {
      return res.status(400).json({ error: "Name, email, education and skills are required" });
    }

    // Enhance all sections in parallel
    const [enhancedSummary, enhancedExperience, enhancedAchievements, enhancedExtracurricular] =
      await Promise.all([
        rawSummary      ? enhanceSection("summary",       rawSummary,      { fullName, skills }) : Promise.resolve(""),
        rawExperience   ? enhanceSection("experience",    rawExperience)   : Promise.resolve(""),
        rawAchievements ? enhanceSection("achievements",  rawAchievements) : Promise.resolve(""),
        rawExtracurricular ? enhanceSection("extracurricular", rawExtracurricular) : Promise.resolve(""),
      ]);

    // Generate final resume
    const resume = await generateResumeContent({
      fullName, email, phone, linkedin, portfolio,
      education, skills,
      summary:        enhancedSummary,
      experience:     enhancedExperience,
      achievements:   enhancedAchievements,
      extracurricular: enhancedExtracurricular,
    }, templateId);

    // Save to DB
    try {
      await db.query(
        `INSERT INTO resumes (full_name, email, education, skills, experience, projects, generated_resume)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullName, email, education, skills, rawExperience || "", rawAchievements || "", resume]
      );
    } catch (dbErr) {
      console.warn("DB save failed (non-critical):", dbErr.message);
    }

    return res.json({
      success: true,
      resume,
      enhanced: {
        summary:        enhancedSummary,
        experience:     enhancedExperience,
        achievements:   enhancedAchievements,
        extracurricular: enhancedExtracurricular,
      },
    });
  } catch (err) {
    console.error("[generateResume]", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// ─── Enhance single section (called live from frontend) ───────────────────────
exports.enhanceSection = async (req, res) => {
  try {
    const { section, text, context } = req.body;
    if (!section || !text?.trim()) {
      return res.status(400).json({ error: "Section type and text are required" });
    }
    const enhanced = await enhanceSection(section, text, context || {});
    return res.json({ success: true, enhanced });
  } catch (err) {
    console.error("[enhanceSection]", err.message);
    return res.status(500).json({ error: err.message });
  }
};