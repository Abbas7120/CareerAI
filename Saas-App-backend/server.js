require("dotenv").config()

const express = require("express")
const cors = require("cors")

const initDB = require("./config/initDB")

const resumeRoutes = require("./routes/resume.routes")
const atsRoutes = require("./routes/ats.routes")
const linkedinRoutes = require("./routes/linkedin.routes")
const aboutRoutes = require("./routes/about.routes")
const imageRoutes = require("./routes/image.routes")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/resumes",resumeRoutes)
app.use("/api/ats",atsRoutes)
app.use("/api/linkedin",linkedinRoutes)
app.use("/api/about",aboutRoutes)
app.use("/api/image",imageRoutes)


//app.use("/api/ai",aiRoutes)
async function start(){

await initDB()

app.listen(5000,()=>{
console.log("Server running on 5000")
})

}

start()