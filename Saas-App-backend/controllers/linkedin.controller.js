// const { generateWithMistral } = require("../services/mistral.service")
// const { generateWithGemini } = require("../services/gemini.service")
// const db = require("../config/mysql");

// exports.generatePost = async (req, res) => {
//   const { topic, tone, contentType } = req.body

//   const prompt = `
// You are a LinkedIn content creator. Write a ${contentType} LinkedIn post about: ${topic}

// Tone: ${tone}

// Rules you MUST follow:
// - Output ONLY the post text itself — no preamble, no "Here's your post", no "Sure!", no intro sentence, no commentary before or after
// - Start directly with the first line of the post (a hook, a question, a bold statement, or an emoji)
// - End with relevant hashtags on the last line
// - Do not wrap in quotes or markdown

// Now write the post:
// `

//   let raw = ""

//   try {
//     console.log("[LinkedIn Post] Trying Mistral...")
//     raw = await generateWithMistral(prompt)
//   } catch (mistralErr) {
//     console.warn("[LinkedIn Post] Mistral failed:", mistralErr.message, "— switching to Gemini")
//     raw = await generateWithGemini(prompt)
//   }

//   const post = raw
//     .replace(/^(here'?s?|sure[,!]?|absolutely[,!]?|of course[,!]?|great[,!]?|below is|here is)[^\n]*\n?/gi, "")
//     .replace(/^(your (linkedin )?post|the post)[^\n]*\n?/gi, "")
//     .trim()

//     try {
//     await db.query(
//       `INSERT INTO linkedin_posts 
//       (topic, content_type, tone, post_content, hashtags)
//       VALUES (?, ?, ?, ?, ?)`,
//       [topic, contentType, tone, post, hashtags]
//     );

//     console.log("LinkedIn post saved to DB");
//   } catch (dbErr) {
//     console.error("DB save failed:", dbErr.message);
//   }


//  return  res.json({ post })
// }

const { generateWithMistral } = require("../services/mistral.service");
const { generateWithGemini }  = require("../services/gemini.service");
const db = require("../config/mysql");

exports.generatePost = async (req, res) => {
  const {
    topic, tone, contentType,
    clerkUserId, email,         // ← from frontend
  } = req.body;

  const prompt = `You are a LinkedIn content creator. Write a ${contentType} LinkedIn post about: ${topic}

Tone: ${tone}

Rules you MUST follow:
- Output ONLY the post text itself — no preamble, no "Here's your post", no "Sure!", no intro sentence, no commentary before or after
- Start directly with the first line of the post (a hook, a question, a bold statement, or an emoji)
- End with relevant hashtags on the last line
- Do not wrap in quotes or markdown

Now write the post:`;

  let raw = "";

  try {
    console.log("[LinkedIn Post] Trying Mistral...");
    raw = await generateWithMistral(prompt);
  } catch (mistralErr) {
    console.warn("[LinkedIn Post] Mistral failed:", mistralErr.message, "— switching to Gemini");
    raw = await generateWithGemini(prompt);
  }

  const post = raw
    .replace(/^(here'?s?|sure[,!]?|absolutely[,!]?|of course[,!]?|great[,!]?|below is|here is)[^\n]*\n?/gi, "")
    .replace(/^(your (linkedin )?post|the post)[^\n]*\n?/gi, "")
    .trim();

  // ── Save to user_outputs (only if signed in) ─────────────────────────────
  if (clerkUserId) {
    try {
      await db.query(
        `INSERT INTO user_outputs (clerk_user_id, email, feature, input_summary, output, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          clerkUserId,
          email || "",
          "linkedin",
          `Post about: ${topic} (${contentType}, ${tone.split(" ")[0]})`,
          post,
        ]
      );
    } catch (dbErr) {
      console.warn("[linkedin] History save failed (non-critical):", dbErr.message);
    }
  }

  return res.json({ post });
};