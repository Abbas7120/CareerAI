const express=require('express')
const router=express.Router()
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are accepted"), false);
    }
    cb(null, true);
  },
});

const {removeBackground}=require("../controllers/image.controller.js")
const {headshotGenerator}=require("../controllers/image.controller.js")
router.post("/remove-bg",upload.single("image"), removeBackground);
router.post("/headshot",upload.single("image"), headshotGenerator);
module.exports=router