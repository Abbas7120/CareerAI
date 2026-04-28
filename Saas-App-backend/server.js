require("dotenv").config()

const PORT=process.env.PORT || 5000

const express = require("express")
const cors = require("cors")

const initDB = require("./config/initDB")

const resumeRoutes = require("./routes/resume.routes")
const atsRoutes = require("./routes/ats.routes")
const linkedinRoutes = require("./routes/linkedin.routes")
const aboutRoutes = require("./routes/about.routes")
const imageRoutes = require("./routes/image.routes")
const app = express()

app.use(cors({origin: "*"}))
app.use(express.json())

app.use("/api/resumes",resumeRoutes)
app.use("/api/ats",atsRoutes)
app.use("/api/linkedin",linkedinRoutes)
app.use("/api/about",aboutRoutes)
app.use("/api/image",imageRoutes)


//app.use("/api/ai",aiRoutes)
async function start(){

await initDB()

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`)
})

}

start()