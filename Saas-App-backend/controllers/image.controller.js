// const fetch = require("node-fetch");

// This is the URL of your Python ai_service.py deployed on Render
// Set this in your Render environment variables as AI_SERVICE_URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://careerai-1-lwj8.onrender.com";

async function callAiService(endpoint, payload) {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    timeout: 120000, // 2 minutes — HF cold starts can be slow
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || `AI service error ${response.status}`);
  }
  return data;
}

function bufferToDataUri(buffer, mimetype) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}

// ─── Background Removal ───────────────────────────────────────────────────────
exports.removeBackground = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please upload an image file" });

    const imageDataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);
    const result = await callAiService("/api/remove-bg", { image: imageDataUri });

    return res.json({ success: true, image: result.image, message: "Background removed successfully" });
  } catch (err) {
    console.error("[remove-bg]", err.message);
    return res.status(500).json({ error: "Background removal failed", detail: err.message });
  }
};

// ─── Headshot Generator ───────────────────────────────────────────────────────
exports.generateHeadshot = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please upload an image file" });

    const VALID_STYLES = ["linkedin", "professional", "white", "dark", "gradient_blue"];
    const style = VALID_STYLES.includes(req.body.style) ? req.body.style : "linkedin";

    const imageDataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);
    const result = await callAiService("/api/headshot", { image: imageDataUri, style });

    return res.json({ success: true, image: result.image, style: result.style });
  } catch (err) {
    console.error("[headshot]", err.message);
    return res.status(500).json({ error: "Headshot generation failed", detail: err.message });
  }
};