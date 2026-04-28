const express = require("express")
const router = express.Router()

const { generateBio } = require("../controllers/about.controller")

router.post("/generate", generateBio)

module.exports = router