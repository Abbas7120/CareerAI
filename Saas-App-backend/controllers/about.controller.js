// const { generateAI } = require("../services/mistral.service")

// exports.generateBio = async(req,res)=>{

// const { fullName,targetRole,keySkills,experience,careerGoals,tone } = req.body

//  const prompt = `You are a professional LinkedIn profile writer. Write a LinkedIn About section for this person.

// Name: ${fullName}
// Target Role: ${targetRole}
// Key Skills: ${keySkills}
// Experience: ${experience}
// Career Goals: ${careerGoals}
// Tone: ${tone}

// Rules you MUST follow:
// - Output ONLY the bio text — no preamble, no "Here's your bio", no "Sure!", no labels, no commentary
// - Start directly with the first sentence of the bio
// - 3–5 sentences, punchy and human-sounding
// - Do not wrap in quotes or markdown

// Now write the bio:
// `

// const bio = await generateAI(prompt)

// res.json({bio})

// }

const { generateWithMistral } = require("../services/mistral.service")
const { generateWithGemini } = require("../services/gemini.service")
const db = require("../config/mysql");
exports.generateBio = async (req, res) => {
const {
    fullName, targetRole, keySkills,
    experience, careerGoals, tone,
    clerkUserId, email,          
  } = req.body;
  const prompt = `You are a professional LinkedIn profile writer. Write a LinkedIn About section for this person.

Name: ${fullName}
Target Role: ${targetRole}
Key Skills: ${keySkills}
Experience: ${experience}
Career Goals: ${careerGoals}
Tone: ${tone}

Rules you MUST follow:
- Output ONLY the bio text — no preamble, no "Here's your bio", no "Sure!", no labels, no commentary
- Start directly with the first sentence of the bio
- 3–5 sentences, punchy and human-sounding
- Do not wrap in quotes or markdown

Now write the bio:
`

  let bio = ""

 try {
    console.log("[Bio] Trying Mistral...");
    bio = await generateWithMistral(prompt);
  } catch (mistralErr) {
    console.warn("[Bio] Mistral failed:", mistralErr.message, "— switching to Gemini");
    bio = await generateWithGemini(prompt);
  }
 
  const finalBio = bio.trim();
 
  // ── Save to user_outputs (only if signed in) ─────────────────────────────
  if (clerkUserId) {
    try {
      await db.query(
        `INSERT INTO user_outputs (clerk_user_id, email, feature, input_summary, output, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          clerkUserId,
          email || "",
          "about",
          `About for: ${fullName}${targetRole ? " — " + targetRole : ""}`,
          finalBio,
        ]
      );
    } catch (dbErr) {
      console.warn("[about] History save failed (non-critical):", dbErr.message);
    }
  }
 
  return res.json({ bio: finalBio });
};
 