const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

async function generateAI(prompt) {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small-latest", // free tier model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();

  if (data.error) throw new Error("Mistral API error: " + data.error.message);

  return data.choices[0]?.message?.content?.trim() || "";
}

module.exports = { generateAI, generateWithMistral: generateAI }