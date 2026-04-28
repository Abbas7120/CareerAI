const db = require("./mysql")

async function initDB(){

await db.query(`
CREATE TABLE IF NOT EXISTS resumes(
id INT AUTO_INCREMENT PRIMARY KEY,
full_name TEXT,
email TEXT,
education TEXT,
skills TEXT,
experience TEXT,
projects TEXT,
generated_resume LONGTEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS ats_analysis(
id INT AUTO_INCREMENT PRIMARY KEY,
resume_content LONGTEXT,
job_description LONGTEXT,
score INT,
match_summary TEXT,
missing_keywords TEXT,
action_items TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS linkedin_posts(
id INT AUTO_INCREMENT PRIMARY KEY,
topic TEXT,
content_type TEXT,
tone TEXT,
post_content LONGTEXT,
hashtags TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS profile_bios(
id INT AUTO_INCREMENT PRIMARY KEY,
full_name TEXT,
target_role TEXT,
key_skills TEXT,
experience TEXT,
career_goals TEXT,
tone TEXT,
bio_option_1 TEXT,
bio_option_2 TEXT,
bio_option_3 TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS images(
id INT AUTO_INCREMENT PRIMARY KEY,
original_image TEXT,
processed_image TEXT,
tool_type TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

console.log("Database ready")

}

module.exports = initDB