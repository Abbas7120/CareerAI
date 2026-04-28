const axios = require("axios");

async function removeBGFromHF(imageBase64) {
  const response = await axios.post(
    "https://gullubaba-career-ai.hf.space/run/predict",
    {
      data: [`data:image/png;base64,${imageBase64}`]
    }
  );

  const resultBase64 = response.data.data[0].split(",")[1];

  return Buffer.from(resultBase64, "base64");
}

module.exports = { removeBGFromHF };