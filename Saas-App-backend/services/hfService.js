const fetch = require("node-fetch");
const FormData = require("form-data");

const HF_URL = "https://kar113456-careerai.hf.space/remove-bg"; // <-- your HF URL

exports.removeBGFromHF = async (base64) => {
  try {
    const buffer = Buffer.from(base64, "base64");

    const formData = new FormData();
    formData.append("image", buffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    const response = await fetch(HF_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HF API failed: ${response.status}`);
    }

    return await response.buffer(); // return image buffer

  } catch (err) {
    console.error("HF SERVICE ERROR:", err);
    throw err;
  }
};