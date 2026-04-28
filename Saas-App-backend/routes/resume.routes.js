const express = require("express");
const router = express.Router();
const { generateResume, enhanceSection } = require("../controllers/resume.controller");
 
router.post("/generate", generateResume);
router.post("/enhance-section", enhanceSection);
 
module.exports = router;