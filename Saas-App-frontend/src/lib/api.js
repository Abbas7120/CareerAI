const API_BASE = "http://localhost:5000"
// const API_BASE = import.meta.env.VITE_API_URL
export async function postJSON(endpoint, data) {

const res = await fetch(`${API_BASE}${endpoint}`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(data)
})

if (!res.ok) {
throw new Error("API request failed")
}

return res.json()
}

export async function postImage(endpoint, file) {

const formData = new FormData()
formData.append("image", file)

const res = await fetch(`${API_BASE}${endpoint}`, {
method: "POST",
body: formData
})

if (!res.ok) {
throw new Error("Image processing failed")
}

return res
}