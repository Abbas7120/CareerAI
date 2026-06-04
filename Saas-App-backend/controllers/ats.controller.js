
// const db = require("../config/mysql");
// const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://careerai-1-lwj8.onrender.com";

// async function callAiService(endpoint, payload) {
//   const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//     timeout: 300000,
//   });

//   const data = await response.json();

//   if (!response.ok || data.error) {
//     throw new Error(data.error || `AI service returned ${response.status}`);
//   }

//   return data;
// }

// /**
//  * Builds a structured resume text from the individual blocks
//  * so the Python AI service receives a proper resume string.
//  */
// function buildResumeText({ education, experience, skills }) {
//   const lines = [];

//   // Education block
//   if (education && education.length > 0) {
//     lines.push("EDUCATION");
//     education.forEach((edu) => {
//       lines.push(
//         `${edu.degree}${edu.specialization ? " in " + edu.specialization : ""} — ${edu.institution || ""} (${edu.year || ""})`
//       );
//     });
//     lines.push("");
//   }

//   // Experience / Internship block
//   if (experience && experience.length > 0) {
//     lines.push("EXPERIENCE");
//     experience.forEach((exp) => {
//       lines.push(`${exp.role} at ${exp.company} (${exp.duration || ""})`);
//       if (exp.description) lines.push(exp.description);
//     });
//     lines.push("");
//   }

//   // Skills block
//   if (skills && skills.length > 0) {
//     lines.push("SKILLS");
//     lines.push(skills.join(", "));
//   }

//   return lines.join("\n");
// }

// exports.analyzeResume = async (req, res) => {
//   try {
//     const { education, experience, skills, jobDescription } = req.body;

//     // ── Validation ──────────────────────────────
//     if (!jobDescription || jobDescription.trim().length < 30) {
//       return res.status(400).json({
//         error: "Job description is required (minimum 30 characters)",
//       });
//     }

//     if (
//       (!education || education.length === 0) &&
//       (!experience || experience.length === 0) &&
//       (!skills || skills.length === 0)
//     ) {
//       return res.status(400).json({
//         error: "Please fill in at least one section: Education, Experience, or Skills",
//       });
//     }

//     // ── Build resume text from structured blocks ─
//     const resumeText = buildResumeText({ education, experience, skills });

//     if (resumeText.trim().length < 30) {
//       return res.status(400).json({
//         error: "Please add more details to your profile sections",
//       });
//     }

//     // ── Call Python AI service ───────────────────
//     const result = await callAiService("/api/ats-check", {
//       resume: resumeText,
//       jobDescription: jobDescription.trim(),
//     });
// try{
//       await db.query(
//         `INSERT INTO ats_analysis 
//         (resume_content, job_description, score, match_summary, missing_keywords, action_items)
//         VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           resumeText,
//           jobDescription,
//           result.score || 0,
//           JSON.stringify(result.breakdown || {}),
//           (result.missingKeywords || []).join(", "),
//           (result.suggestions || []).join(", "),
//         ]
//       );

//       console.log("ATS analysis saved to DB");
//     } catch (dbErr) {
//       console.error("DB save failed:", dbErr.message);
//     }


//     return res.json({
//       success: true,
//       score: result.score,
//       breakdown: result.breakdown,
//       matchedKeywords: result.matchedKeywords,
//       missingKeywords: result.missingKeywords,
//       suggestions: result.suggestions,
//       // Return the built resume text so frontend can show it
//       resumeText,
//     });
//   } catch (err) {
//     console.error("[ats-check]", err.message);
//     return res.status(500).json({
//       error: "ATS analysis failed",
//       detail: err.message,
//     });
//   }
// };


const TECH_SKILLS = new Set([
  "python","javascript","typescript","java","c++","c#","go","rust",
  "react","angular","vue","node.js","express","django","flask","spring",
  "sql","mysql","postgresql","mongodb","redis","elasticsearch",
  "aws","azure","gcp","docker","kubernetes","terraform","jenkins",
  "git","linux","bash","rest","graphql","microservices",
  "machine learning","deep learning","tensorflow","pytorch","scikit-learn",
  "html","css","tailwind","figma","agile","scrum","ci/cd",
  "data analysis","power bi","tableau","excel","communication",
  "leadership","problem solving","teamwork","project management",
]);

const STOP_WORDS = new Set([
  "the","and","or","of","to","a","an","in","for","with","on","at","by",
  "from","as","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "shall","can","not","no","but","if","then","that","this","it","its",
  "we","i","you","they","he","she","our","their","your","my","his","her",
  "also","more","other","into","through","during","before","after","about",
  "between","out","over","under","again","once","here","there","when",
  "where","why","how","all","both","each","few","most","some",
  "such","than","too","very","just","because","while","although","however",
]);

function tokenize(text) {
  const words = text.toLowerCase().match(/\b[a-zA-Z][a-zA-Z0-9+#.]*\b/g) || [];
  return words.filter(w => !STOP_WORDS.has(w) && w.length > 2);
}

function wordFreq(text) {
  const freq = {};
  tokenize(text).forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return freq;
}

function extractKeywords(text) {
  const keywords = new Set();
  const lower = text.toLowerCase();

  // Match known tech skills
  TECH_SKILLS.forEach(skill => { if (lower.includes(skill)) keywords.add(skill); });

  // Single words
  const freq = wordFreq(text);
  Object.keys(freq).forEach(w => { if (w.length > 3) keywords.add(w); });

  // Bigrams
  const words = lower.match(/\b[a-z][a-z0-9]*\b/g) || [];
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i+1])) {
      const bigram = `${words[i]} ${words[i+1]}`;
      if (bigram.length > 6) keywords.add(bigram);
    }
  }
  return keywords;
}

function tfidfSimilarity(r, j) {
  const rf = wordFreq(r), jf = wordFreq(j);
  const allW = new Set([...Object.keys(rf), ...Object.keys(jf)]);
  let dot = 0;
  allW.forEach(w => { dot += (rf[w] || 0) * (jf[w] || 0); });
  const mr = Math.sqrt(Object.values(rf).reduce((s, v) => s + v*v, 0));
  const mj = Math.sqrt(Object.values(jf).reduce((s, v) => s + v*v, 0));
  return (mr && mj) ? dot / (mr * mj) : 0;
}

function calculateAtsScore(resumeText, jdText) {
  const rkw = extractKeywords(resumeText);
  const jkw = extractKeywords(jdText);
  const lower_r = resumeText.toLowerCase();
  const lower_j = jdText.toLowerCase();

  const intersection = new Set([...rkw].filter(x => jkw.has(x)));
  const kwScore  = jkw.size > 0 ? intersection.size / jkw.size : 0.5;
  const tfScore  = tfidfSimilarity(resumeText, jdText);

  const jdSkills = new Set([...TECH_SKILLS].filter(s => lower_j.includes(s)));
  const rSkills  = new Set([...TECH_SKILLS].filter(s => lower_r.includes(s)));
  const skScore  = jdSkills.size > 0
    ? [...jdSkills].filter(s => rSkills.has(s)).length / jdSkills.size
    : 1.0;

  const total = Math.min(Math.floor((kwScore * 0.4 + tfScore * 0.4 + skScore * 0.2) * 100), 99);

  const missingTech    = [...jdSkills].filter(s => !rSkills.has(s)).slice(0, 8);
  const missingGeneral = [...jkw]
    .filter(k => !rkw.has(k) && !TECH_SKILLS.has(k) && k.length > 4 && !k.includes(" "))
    .slice(0, Math.max(0, 12 - missingTech.length));

  return {
    score:              total,
    keywordMatch:       Math.round(kwScore * 100),
    contentSimilarity:  Math.round(tfScore * 100),
    skillsCoverage:     Math.round(skScore * 100),
    matchedKeywords:    [...intersection].slice(0, 15),
    missingKeywords:    [...missingTech, ...missingGeneral],
  };
}

function generateSuggestions(sd, resumeText) {
  const s = [];
  if (sd.score < 50)
    s.push({ type:"critical", title:"Low keyword alignment", detail:"Rewrite your summary and skills to mirror the JD language." });
  if (sd.missingKeywords.length > 0)
    s.push({ type:"warning", title:"Add missing keywords", detail:`These appear in the JD but not your resume: ${sd.missingKeywords.slice(0,5).join(", ")}` });
  if (sd.skillsCoverage < 60)
    s.push({ type:"warning", title:"Strengthen technical skills", detail:"The JD asks for specific technical skills that are missing." });
  if (!/\d+%|\d+x|\$\d+|\d+ year/i.test(resumeText))
    s.push({ type:"info", title:"Add measurable achievements", detail:"Add numbers: 'Reduced load time by 40%', 'Led team of 8', etc." });
  if (sd.score >= 75)
    s.push({ type:"success", title:"Strong ATS alignment", detail:"Your resume is well-optimised. Focus on polishing your summary." });
  return s;
}

function buildResumeText({ education, experience, skills }) {
  const lines = [];
  if (education?.length > 0) {
    lines.push("EDUCATION");
    education.forEach(edu => {
      lines.push(`${edu.degree}${edu.specialization ? " in " + edu.specialization : ""} — ${edu.institution || ""} (${edu.year || ""})`);
    });
    lines.push("");
  }
  if (experience?.length > 0) {
    lines.push("EXPERIENCE");
    experience.forEach(exp => {
      lines.push(`${exp.role} at ${exp.company} (${exp.duration || ""})`);
      if (exp.description) lines.push(exp.description);
    });
    lines.push("");
  }
  if (skills?.length > 0) {
    lines.push("SKILLS");
    lines.push(skills.join(", "));
  }
  return lines.join("\n");
}

exports.analyzeResume = async (req, res) => {
  try {
    const { education, experience, skills, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ error: "Job description is required (minimum 30 characters)" });
    }
    if ((!education || education.length === 0) &&
        (!experience || experience.length === 0) &&
        (!skills || skills.length === 0)) {
      return res.status(400).json({ error: "Please fill in at least one section: Education, Experience, or Skills" });
    }

    const resumeText = buildResumeText({ education, experience, skills });
    if (resumeText.trim().length < 30) {
      return res.status(400).json({ error: "Please add more details to your profile sections" });
    }

    // ── Run ATS scoring directly in Node.js — no Python call needed ──
    const sd = calculateAtsScore(resumeText, jobDescription.trim());

    return res.json({
      success: true,
      score: sd.score,
      breakdown: {
        keywordMatch:      sd.keywordMatch,
        contentSimilarity: sd.contentSimilarity,
        skillsCoverage:    sd.skillsCoverage,
      },
      matchedKeywords: sd.matchedKeywords,
      missingKeywords: sd.missingKeywords,
      suggestions:     generateSuggestions(sd, resumeText),
      resumeText,
    });

  } catch (err) {
    console.error("[ats-check]", err.message);
    return res.status(500).json({ error: "ATS analysis failed", detail: err.message });
  }
};