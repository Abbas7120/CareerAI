"""
CareerAI - Lightweight AI Service
Uses Hugging Face Inference API for image tasks — no rembg, no opencv, no heavy installs.
ATS checker runs fully local with spaCy (small model, ~15MB).

Deploy this on Render free tier — total install size stays under 200MB.

Install:
  pip install flask flask-cors requests pillow spacy
  python -m spacy download en_core_web_sm
  
Environment variable needed:
  HF_TOKEN=hf_your_token_here  (free at huggingface.co/settings/tokens)
"""

import os
import io
import base64
import math
import re
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageEnhance, ImageFilter

app = Flask(__name__)
CORS(app)

HF_TOKEN = os.environ.get("HF_TOKEN", "")
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# ─── Lazy spaCy loader ────────────────────────────────────────────────────────
_nlp = None
def get_nlp():
    global _nlp
    if _nlp is None:
        import spacy
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 1 — BACKGROUND REMOVAL  (HF: briaai/RMBG-1.4)
# ══════════════════════════════════════════════════════════════════════════════

HF_RMBG_URL = "https://router.huggingface.co/hf-inference/models/briaai/RMBG-1.4"

def call_hf_remove_bg(image_bytes: bytes) -> bytes:
    """Send image bytes to HF RMBG-1.4, get back PNG bytes with transparency."""
    response = requests.post(
        HF_RMBG_URL,
        headers={**HF_HEADERS, "Content-Type": "image/jpeg"},
        data=image_bytes,
        timeout=60,
    )
    if response.status_code == 200:
        return response.content          # PNG bytes returned by the model
    # Model loading (503) — wait and retry once
    if response.status_code == 503:
        import time
        time.sleep(20)
        response = requests.post(
            HF_RMBG_URL,
            headers={**HF_HEADERS, "Content-Type": "image/jpeg"},
            data=image_bytes,
            timeout=90,
        )
        if response.status_code == 200:
            return response.content
    raise Exception(f"HF BG removal failed ({response.status_code}): {response.text[:200]}")


@app.route("/api/remove-bg", methods=["POST"])
def remove_bg():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        raw = data["image"]
        if "," in raw:
            raw = raw.split(",", 1)[1]
        img_bytes = base64.b64decode(raw)

        # Resize to max 1024px before sending to save bandwidth & avoid HF limits
        pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        MAX = 1024
        if max(pil.size) > MAX:
            pil.thumbnail((MAX, MAX), Image.LANCZOS)
        buf = io.BytesIO()
        pil.save(buf, format="JPEG", quality=90)
        buf.seek(0)
        resized_bytes = buf.read()

        result_bytes = call_hf_remove_bg(resized_bytes)

        result_b64 = base64.b64encode(result_bytes).decode("utf-8")
        return jsonify({
            "success": True,
            "image": f"data:image/png;base64,{result_b64}",
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 2 — ATS CHECKER  (local spaCy NLP — lightweight, no GPU needed)
# ══════════════════════════════════════════════════════════════════════════════

TECH_SKILLS = {
    "python","javascript","typescript","java","c++","c#","go","rust",
    "react","angular","vue","node.js","express","django","flask","spring",
    "sql","mysql","postgresql","mongodb","redis","elasticsearch",
    "aws","azure","gcp","docker","kubernetes","terraform","jenkins",
    "git","linux","bash","rest","graphql","microservices",
    "machine learning","deep learning","tensorflow","pytorch","scikit-learn",
    "html","css","tailwind","figma","agile","scrum","ci/cd",
    "data analysis","power bi","tableau","excel","communication",
    "leadership","problem solving","teamwork","project management",
}

STOP_WORDS = {
    "the","and","or","of","to","a","an","in","for","with","on","at","by",
    "from","as","is","are","was","were","be","been","being","have","has",
    "had","do","does","did","will","would","could","should","may","might",
    "shall","can","not","no","but","if","then","that","this","it","its",
    "we","i","you","they","he","she","our","their","your","my","his","her",
}

def extract_keywords(text):
    nlp = get_nlp()
    doc = nlp(text.lower())
    keywords = set()
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip()
        if len(phrase) > 2 and phrase not in STOP_WORDS:
            keywords.add(phrase)
    for ent in doc.ents:
        if ent.label_ in ("ORG", "PRODUCT", "GPE"):
            keywords.add(ent.text.lower().strip())
    for token in doc:
        if not token.is_stop and not token.is_punct and token.pos_ in ("NOUN","PROPN","VERB") and len(token.text) > 2:
            keywords.add(token.lemma_.lower())
    text_lower = text.lower()
    for skill in TECH_SKILLS:
        if skill in text_lower:
            keywords.add(skill)
    return keywords

def tfidf_similarity(r, j):
    def freq(text):
        words = re.findall(r'\b[a-z]{2,}\b', text.lower())
        f = {}
        for w in words:
            if w not in STOP_WORDS:
                f[w] = f.get(w, 0) + 1
        return f
    rf, jf = freq(r), freq(j)
    all_w = set(rf) | set(jf)
    dot = sum(rf.get(w, 0) * jf.get(w, 0) for w in all_w)
    mr = math.sqrt(sum(v**2 for v in rf.values()))
    mj = math.sqrt(sum(v**2 for v in jf.values()))
    return dot / (mr * mj) if mr and mj else 0.0

def calculate_ats_score(resume_text, jd_text):
    rkw, jkw = extract_keywords(resume_text), extract_keywords(jd_text)
    kw_score   = len(rkw & jkw) / len(jkw) if jkw else 0.5
    tf_score   = tfidf_similarity(resume_text, jd_text)
    jd_lower, r_lower = jd_text.lower(), resume_text.lower()
    jd_skills  = {s for s in TECH_SKILLS if s in jd_lower}
    r_skills   = {s for s in TECH_SKILLS if s in r_lower}
    sk_score   = len(r_skills & jd_skills) / len(jd_skills) if jd_skills else 1.0
    total      = min(int((kw_score * 0.4 + tf_score * 0.4 + sk_score * 0.2) * 100), 99)
    missing_tech    = [s for s in jd_skills if s not in r_skills]
    missing_general = [k for k in list(jkw) if k not in rkw and k not in TECH_SKILLS][:10]
    return {
        "score": total,
        "keyword_match":    round(kw_score * 100),
        "content_similarity": round(tf_score * 100),
        "skills_coverage":  round(sk_score * 100),
        "matched_keywords": list(rkw & jkw)[:15],
        "missing_keywords": missing_tech[:8] + missing_general[:max(0, 12 - len(missing_tech))],
    }

def generate_suggestions(sd, resume_text, jd_text):
    s = []
    if sd["score"] < 50:
        s.append({"type":"critical","title":"Low keyword alignment","detail":"Rewrite your summary and skills section to mirror the JD language."})
    if sd["missing_keywords"]:
        s.append({"type":"warning","title":"Add missing keywords","detail":f"These appear in the JD but not your resume: {', '.join(sd['missing_keywords'][:5])}"})
    if sd["skills_coverage"] < 60:
        s.append({"type":"warning","title":"Strengthen technical skills section","detail":"The JD asks for specific technical skills that are missing."})
    if not re.search(r'\d+%|\d+x|\$\d+|\d+ year', resume_text):
        s.append({"type":"info","title":"Add measurable achievements","detail":"Add numbers: 'Reduced load time by 40%', 'Led team of 8', etc."})
    if sd["score"] >= 75:
        s.append({"type":"success","title":"Strong ATS alignment","detail":"Your resume is well-optimised. Focus on polishing your summary."})
    return s

@app.route("/api/ats-check", methods=["POST"])
def ats_check():
    try:
        data = request.get_json()
        resume = data.get("resume", "").strip()
        jd     = data.get("jobDescription", "").strip()
        if not resume or not jd:
            return jsonify({"error": "Both resume and jobDescription are required"}), 400
        sd = calculate_ats_score(resume, jd)
        return jsonify({
            "success": True,
            "score": sd["score"],
            "breakdown": {
                "keywordMatch":      sd["keyword_match"],
                "contentSimilarity": sd["content_similarity"],
                "skillsCoverage":    sd["skills_coverage"],
            },
            "matchedKeywords": sd["matched_keywords"],
            "missingKeywords": sd["missing_keywords"],
            "suggestions":     generate_suggestions(sd, resume, jd),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 3 — HEADSHOT GENERATOR
# Strategy:
#   1. Remove background via HF RMBG-1.4  (reuse same function)
#   2. Enhance the subject image with PIL  (brightness, contrast, sharpen)
#   3. Composite on chosen solid background colour
#   4. Return as JPEG
# No OpenCV / face detection model needed — PIL does the job for enhancement.
# ══════════════════════════════════════════════════════════════════════════════

BG_COLORS = {
    "linkedin":      (8,   76,  138),
    "professional":  (240, 240, 240),
    "white":         (255, 255, 255),
    "dark":          (28,  28,  40),
    "gradient_blue": None,           # handled separately
}

def enhance_and_composite(subject_png_bytes: bytes, style: str, orig_size: tuple) -> bytes:
    """Enhance subject and paste onto chosen background colour."""
    subject = Image.open(io.BytesIO(subject_png_bytes)).convert("RGBA")

    # Resize to portrait dimensions
    W, H = 500, 600
    subject = subject.resize((W, H), Image.LANCZOS)

    # Enhance with PIL
    rgb = subject.convert("RGB")
    rgb = ImageEnhance.Brightness(rgb).enhance(1.06)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
    rgb = ImageEnhance.Color(rgb).enhance(1.08)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.5)
    subject.paste(rgb, mask=subject.split()[3])   # keep alpha

    # Background
    if style == "gradient_blue":
        import numpy as np
        arr = np.zeros((H, W, 3), dtype=np.uint8)
        for row in range(H):
            t = row / H
            arr[row] = [int((1-t)*10+t*30), int((1-t)*60+t*100), int((1-t)*140+t*180)]
        bg = Image.fromarray(arr, "RGB").convert("RGBA")
    else:
        color = BG_COLORS.get(style, BG_COLORS["professional"])
        bg = Image.new("RGBA", (W, H), (*color, 255))

    composite = Image.alpha_composite(bg, subject)

    out = io.BytesIO()
    composite.convert("RGB").save(out, format="JPEG", quality=92, optimize=True)
    out.seek(0)
    return out.read()


@app.route("/api/headshot", methods=["POST"])
def headshot():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        raw = data["image"]
        if "," in raw:
            raw = raw.split(",", 1)[1]
        img_bytes = base64.b64decode(raw)

        style = data.get("style", "linkedin")
        if style not in BG_COLORS:
            style = "linkedin"

        # Step 1 — Resize
        pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        orig_size = pil.size
        pil.thumbnail((1024, 1024), Image.LANCZOS)
        buf = io.BytesIO()
        pil.save(buf, format="JPEG", quality=88)
        buf.seek(0)
        resized_bytes = buf.read()

        # Step 2 — Remove background via HF
        no_bg_bytes = call_hf_remove_bg(resized_bytes)

        # Step 3 — Enhance + composite
        final_bytes = enhance_and_composite(no_bg_bytes, style, orig_size)

        result_b64 = base64.b64encode(final_bytes).decode("utf-8")
        return jsonify({
            "success": True,
            "image": f"data:image/jpeg;base64,{result_b64}",
            "style": style,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Health ───────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "hf_token_set": bool(HF_TOKEN)})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"[CareerAI] Starting on port {port}")
    print(f"[CareerAI] HF token: {'SET' if HF_TOKEN else 'NOT SET — image features will fail'}")
    # Pre-load spaCy on startup to avoid cold start on first ATS request
    print("[CareerAI] Loading spaCy model...")
    get_nlp()
    print("[CareerAI] Ready.")
    app.run(host="0.0.0.0", port=port, debug=False)