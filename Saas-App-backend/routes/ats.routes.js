const express = require("express")
const router = express.Router()

const { analyzeResume } = require("../controllers/ats.controller")

router.post("/ats-check", analyzeResume)

module.exports = router