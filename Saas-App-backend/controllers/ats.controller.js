const fetch = require("node-fetch");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://careerai-1-lwj8.onrender.com";

async function callAiService(endpoint, payload) {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    timeout: 300000,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || `AI service returned ${response.status}`);
  }

  return data;
}

/**
 * Builds a structured resume text from the individual blocks
 * so the Python AI service receives a proper resume string.
 */
function buildResumeText({ education, experience, skills }) {
  const lines = [];

  // Education block
  if (education && education.length > 0) {
    lines.push("EDUCATION");
    education.forEach((edu) => {
      lines.push(
        `${edu.degree}${edu.specialization ? " in " + edu.specialization : ""} — ${edu.institution || ""} (${edu.year || ""})`
      );
    });
    lines.push("");
  }

  // Experience / Internship block
  if (experience && experience.length > 0) {
    lines.push("EXPERIENCE");
    experience.forEach((exp) => {
      lines.push(`${exp.role} at ${exp.company} (${exp.duration || ""})`);
      if (exp.description) lines.push(exp.description);
    });
    lines.push("");
  }

  // Skills block
  if (skills && skills.length > 0) {
    lines.push("SKILLS");
    lines.push(skills.join(", "));
  }

  return lines.join("\n");
}

exports.analyzeResume = async (req, res) => {
  try {
    const { education, experience, skills, jobDescription } = req.body;

    // ── Validation ──────────────────────────────
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({
        error: "Job description is required (minimum 30 characters)",
      });
    }

    if (
      (!education || education.length === 0) &&
      (!experience || experience.length === 0) &&
      (!skills || skills.length === 0)
    ) {
      return res.status(400).json({
        error: "Please fill in at least one section: Education, Experience, or Skills",
      });
    }

    // ── Build resume text from structured blocks ─
    const resumeText = buildResumeText({ education, experience, skills });

    if (resumeText.trim().length < 30) {
      return res.status(400).json({
        error: "Please add more details to your profile sections",
      });
    }

    // ── Call Python AI service ───────────────────
    const result = await callAiService("/api/ats-check", {
      resume: resumeText,
      jobDescription: jobDescription.trim(),
    });

    return res.json({
      success: true,
      score: result.score,
      breakdown: result.breakdown,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions,
      // Return the built resume text so frontend can show it
      resumeText,
    });
  } catch (err) {
    console.error("[ats-check]", err.message);
    return res.status(500).json({
      error: "ATS analysis failed",
      detail: err.message,
    });
  }
};