const { GoogleGenAI } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// The client automatically looks for the GEMINI_API_KEY env variable
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview", // Use the latest 2.5 or 3.0 models
      contents: prompt,
    });

    // The new SDK returns .text directly on the response object
    return response.text; 
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

module.exports = { generateAI, generatewithGemini: generateAI };