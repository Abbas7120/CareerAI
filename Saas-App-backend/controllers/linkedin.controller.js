// // const { generateAI } = require("../services/gemini.service")
// const { generateAI } = require("../services/mistral.service")
// exports.generatePost = async(req,res)=>{

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
 
//   const post = await generateAI(prompt)
 
//   // Strip any leaked preamble lines as a safety net
//   const cleaned = post
//     .replace(/^(here'?s?|sure[,!]?|absolutely[,!]?|of course[,!]?|great[,!]?|below is|here is)[^\n]*\n?/gi, "")
//     .replace(/^(your (linkedin )?post|the post)[^\n]*\n?/gi, "")
//     .trim()
 
//   res.json({ post: cleaned })


// }

const { generateWithMistral } = require("../services/mistral.service")
const { generateWithGemini } = require("../services/gemini.service")

exports.generatePost = async (req, res) => {
  const { topic, tone, contentType } = req.body

  const prompt = `
You are a LinkedIn content creator. Write a ${contentType} LinkedIn post about: ${topic}

Tone: ${tone}

Rules you MUST follow:
- Output ONLY the post text itself — no preamble, no "Here's your post", no "Sure!", no intro sentence, no commentary before or after
- Start directly with the first line of the post (a hook, a question, a bold statement, or an emoji)
- End with relevant hashtags on the last line
- Do not wrap in quotes or markdown

Now write the post:
`

  let raw = ""

  try {
    console.log("[LinkedIn Post] Trying Mistral...")
    raw = await generateWithMistral(prompt)
  } catch (mistralErr) {
    console.warn("[LinkedIn Post] Mistral failed:", mistralErr.message, "— switching to Gemini")
    raw = await generateWithGemini(prompt)
  }

  const post = raw
    .replace(/^(here'?s?|sure[,!]?|absolutely[,!]?|of course[,!]?|great[,!]?|below is|here is)[^\n]*\n?/gi, "")
    .replace(/^(your (linkedin )?post|the post)[^\n]*\n?/gi, "")
    .trim()

  res.json({ post })
}