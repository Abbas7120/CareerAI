const express = require("express");

 const fetch = require("node-fetch");   // npm install node-fetch@2

 
const AI_SERVICE_URL =  "https://kar113456-careerai.hf.space";
 
// Multer config — accept images up to 10 MB in memory

 
/** Convert an uploaded file buffer to a base64 data URI */
function bufferToDataUri(buffer, mimetype) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}
 
/** Forward a JSON payload to the Python AI service */
async function callAiService(endpoint, payload) {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    timeout: 300000, // 60s — model inference can take a moment
  });
 
  const data = await response.json();
 
  if (!response.ok || data.error) {
    throw new Error(data.error || `AI service returned ${response.status}`);
  }
 
  return data;
}
// exports.removeBackground=async(req,res)=>{
//     try {
//     if (!req.file) {
//       return res.status(400).json({ error: "Please upload an image file" });
//     }
 
//     const imageDataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);
 
//     const result = await callAiService("/api/remove-bg", { image: imageDataUri });
 
//     return res.json({
//       success: true,
//       image: result.image,   // transparent PNG as data URI
//       message: "Background removed successfully",
//     });
 
//   } catch (err) {
//     console.error("[remove-bg]", err.message);
//     return res.status(500).json({
//       error: "Background removal failed",
//       detail: err.message,
//     });
//   }
// }
const { removeBGFromHF } = require("../services/hfService");

exports.removeBackground = async (req, res) => {
 try {
    const base64 = req.file.buffer.toString("base64");

    const result = await callAiService("/api/remove-bg", {
      image: base64
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.headshotGenerator=async(req,res)=>{
  //    try {
  //   if (!req.file) {
  //     return res.status(400).json({ error: "Please upload an image file" });
  //   }
 
  //   const VALID_STYLES = ["linkedin", "professional", "white", "dark", "gradient_blue"];
  //   const style = VALID_STYLES.includes(req.body.style) ? req.body.style : "professional";
 
  //   const imageDataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);
 
  //   const result = await callAiService("/api/headshot", {
  //     image: imageDataUri,
  //     style,
  //   });
 
  //   return res.json({
  //     success: true,
  //     image: result.image,   // enhanced portrait as JPEG data URI
  //     style: result.style,
  //     message: "Professional headshot generated",
  //   });
 
  // } catch (err) {
  //   console.error("[headshot]", err.message);
  //   return res.status(500).json({
  //     error: "Headshot generation failed",
  //     detail: err.message,
  //   });
  // }
  try{
    const base64 = req.file.buffer.toString("base64");

    const result = await callAiService("/api/headshot", {
      image: base64,
      style: req.body.style || "professional"
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}