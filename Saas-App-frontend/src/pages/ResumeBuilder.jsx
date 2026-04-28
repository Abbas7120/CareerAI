import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API_BASE = "http://localhost:5000";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ghost = `${btn} hover:bg-accent hover:text-accent-foreground h-9 px-3`;
// ─── Template definitions ─────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional ATS-friendly",
    accent: "#1e3a5f",
    tag: "Most hired",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Clean two-column layout",
    accent: "#0f766e",
    tag: "Popular",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Sleek editorial style",
    accent: "#7c3aed",
    tag: "Creative",
  },
];

// ─── Resume Preview Renderers ─────────────────────────────────────────────────

function ClassicPreview({ data }) {
  const { fullName, email, phone, linkedin, portfolio, education, skills,
    summary, experience, achievements, extracurricular } = data;

  return (
    <div className="font-serif text-[11px] leading-relaxed text-gray-900 p-8 bg-white min-h-full"
      style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="text-center border-b-2 border-[#1e3a5f] pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-wide text-[#1e3a5f] uppercase">
          {fullName || "Your Name"}
        </h1>
        <p className="text-gray-600 mt-1 text-[10px]">
          {[email, phone, linkedin, portfolio].filter(Boolean).join(" · ")}
        </p>
      </div>

      {summary && (
        <Section title="Professional Summary" accent="#1e3a5f">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {education && (
        <Section title="Education" accent="#1e3a5f">
          <p className="text-gray-700 whitespace-pre-wrap">{education}</p>
        </Section>
      )}

      {skills && (
        <Section title="Skills" accent="#1e3a5f">
          <div className="flex flex-wrap gap-1">
            {skills.split(/[,\n]/).map((s, i) => s.trim() && (
              <span key={i} className="bg-[#1e3a5f]/10 text-[#1e3a5f] px-2 py-0.5 rounded text-[9px] font-medium">
                {s.trim()}
              </span>
            ))}
          </div>
        </Section>
      )}

      {experience && (
        <Section title="Professional Experience" accent="#1e3a5f">
          <p className="text-gray-700 whitespace-pre-wrap">{experience}</p>
        </Section>
      )}

      {achievements && (
        <Section title="Achievements" accent="#1e3a5f">
          <p className="text-gray-700 whitespace-pre-wrap">{achievements}</p>
        </Section>
      )}

      {extracurricular && (
        <Section title="Extracurricular Activities" accent="#1e3a5f">
          <p className="text-gray-700 whitespace-pre-wrap">{extracurricular}</p>
        </Section>
      )}
    </div>
  );
}

function ModernPreview({ data }) {
  const { fullName, email, phone, linkedin, portfolio, education, skills,
    summary, experience, achievements, extracurricular } = data;

  return (
    <div className="text-[10.5px] leading-relaxed text-gray-900 bg-white min-h-full flex"
      style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Left sidebar */}
      <div className="w-[34%] bg-[#0f766e] text-white p-5 flex-shrink-0">
        <div className="mb-5">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3">
            {(fullName || "?")[0]}
          </div>
          <h1 className="text-lg font-bold leading-tight">{fullName || "Your Name"}</h1>
        </div>

        <div className="space-y-0.5 mb-4 text-[9px] text-white/80">
          {email && <p>✉ {email}</p>}
          {phone && <p>✆ {phone}</p>}
          {linkedin && <p>in {linkedin}</p>}
          {portfolio && <p>🌐 {portfolio}</p>}
        </div>

        {skills && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-white/30 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.split(/[,\n]/).map((s, i) => s.trim() && (
                <span key={i} className="bg-white/20 px-1.5 py-0.5 rounded text-[8px]">{s.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {education && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-white/30 pb-1">
              Education
            </h2>
            <p className="text-[9px] text-white/80 whitespace-pre-wrap">{education}</p>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-5 space-y-3">
        {summary && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0f766e] border-b border-[#0f766e]/30 pb-1 mb-1.5">
              Profile
            </h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}

        {experience && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0f766e] border-b border-[#0f766e]/30 pb-1 mb-1.5">
              Experience
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{experience}</p>
          </div>
        )}

        {achievements && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0f766e] border-b border-[#0f766e]/30 pb-1 mb-1.5">
              Achievements
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{achievements}</p>
          </div>
        )}

        {extracurricular && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0f766e] border-b border-[#0f766e]/30 pb-1 mb-1.5">
              Extracurricular
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{extracurricular}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalPreview({ data }) {
  const { fullName, email, phone, linkedin, portfolio, education, skills,
    summary, experience, achievements, extracurricular } = data;

  return (
    <div className="text-[10.5px] leading-relaxed text-gray-900 bg-white min-h-full p-8"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-black tracking-tighter text-gray-900 leading-none">
          {fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 mt-2 text-[9px] text-gray-500">
          {[email, phone, linkedin, portfolio].filter(Boolean).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
        {summary && (
          <p className="mt-3 text-gray-600 text-[10px] border-l-2 border-[#7c3aed] pl-3 leading-relaxed">
            {summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left col */}
        <div className="col-span-1 space-y-4">
          {skills && (
            <MinSection title="Skills" accent="#7c3aed">
              <div className="space-y-0.5">
                {skills.split(/[,\n]/).map((s, i) => s.trim() && (
                  <p key={i} className="text-gray-600">— {s.trim()}</p>
                ))}
              </div>
            </MinSection>
          )}
          {education && (
            <MinSection title="Education" accent="#7c3aed">
              <p className="text-gray-600 whitespace-pre-wrap">{education}</p>
            </MinSection>
          )}
        </div>

        {/* Right col */}
        <div className="col-span-2 space-y-4">
          {experience && (
            <MinSection title="Experience" accent="#7c3aed">
              <p className="text-gray-700 whitespace-pre-wrap">{experience}</p>
            </MinSection>
          )}
          {achievements && (
            <MinSection title="Achievements" accent="#7c3aed">
              <p className="text-gray-700 whitespace-pre-wrap">{achievements}</p>
            </MinSection>
          )}
          {extracurricular && (
            <MinSection title="Activities" accent="#7c3aed">
              <p className="text-gray-700 whitespace-pre-wrap">{extracurricular}</p>
            </MinSection>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div className="mb-3">
      <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: accent, borderBottom: `1px solid ${accent}40`, paddingBottom: "2px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function MinSection({ title, accent, children }) {
  return (
    <div>
      <h2 className="text-[9px] font-bold uppercase tracking-widest mb-1.5"
        style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── AI Enhance Button ────────────────────────────────────────────────────────

function AIEnhanceField({ label, section, value, onChange, enhancedValue, onEnhanced, placeholder, rows = 4, context }) {
  const [enhancing, setEnhancing] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);

  const enhance = async () => {
    if (!value.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch(`${API_BASE}/api/resumes/enhance-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, text: value, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onEnhanced(data.enhanced);
      setShowEnhanced(true);
    } catch (err) {
      alert("Enhancement failed: " + err.message);
    } finally {
      setEnhancing(false);
    }
  };

  const useEnhanced = () => {
    onChange(enhancedValue);
    setShowEnhanced(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={enhance}
          disabled={enhancing || !value.trim()}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg"
        >
          {enhancing ? (
            <>
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Enhancing…
            </>
          ) : (
            <>✨ Enhance with AI</>
          )}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-colors"
      />

      <AnimatePresence>
        {showEnhanced && enhancedValue && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700">✨ AI Enhanced Version</span>
              <span className="text-[10px] text-purple-500">preview</span>
            </div>
            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {enhancedValue}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={useEnhanced}
                className="text-[10px] font-semibold bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Use this
              </button>
              <button
                type="button"
                onClick={() => setShowEnhanced(false)}
                className="text-[10px] font-semibold text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Keep mine
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Template", "Personal", "Education & Skills", "Experience", "Achievements", "Preview"];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`flex flex-col items-center`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < current ? "bg-purple-600 text-white" : i === current ? "bg-purple-600 text-white ring-4 ring-purple-100" : "bg-gray-100 text-gray-400"}`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${i === current ? "text-purple-600" : "text-gray-400"}`}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${i < current ? "bg-purple-600" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-colors bg-white"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previewRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", linkedin: "", portfolio: "",
    education: "", skills: "",
    rawSummary: "", rawExperience: "", rawAchievements: "", rawExtracurricular: "",
  });

  // Enhanced versions (shown in preview)
  const [enhanced, setEnhanced] = useState({
    summary: "", experience: "", achievements: "", extracurricular: "",
  });

  // Final generated resume
  const [generated, setGenerated] = useState(null);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));
  const setEnh = (field) => (val) => setEnhanced((p) => ({ ...p, [field]: val }));

  // Live preview data
  const previewData = {
    fullName: form.fullName, email: form.email, phone: form.phone,
    linkedin: form.linkedin, portfolio: form.portfolio,
    education: form.education, skills: form.skills,
    summary:        enhanced.summary        || form.rawSummary,
    experience:     enhanced.experience     || form.rawExperience,
    achievements:   enhanced.achievements   || form.rawAchievements,
    extracurricular: enhanced.extracurricular || form.rawExtracurricular,
  };

  const templateConfig = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];

  const generateResume = async () => {
    if (!form.fullName || !form.email || !form.education || !form.skills) {
      setError("Please fill: Name, Email, Education and Skills");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/resumes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, templateId: template }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenerated(data);
      if (data.enhanced) setEnhanced(data.enhanced);
      setStep(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const el = previewRef.current;
    if (!el) return;

    const printWindow = window.open("", "_blank");
    const tpl = TEMPLATES.find((t) => t.id === template);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${form.fullName || "Resume"} — ${tpl?.name}</title>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>${el.innerHTML}</body>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </html>
    `);
    printWindow.document.close();
  };

  const PreviewComponent = template === "classic" ? ClassicPreview
    : template === "modern" ? ModernPreview : MinimalPreview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30"
    >

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex flex-col items-start gap-4">
  {/* Back Button */}
  <Link 
    to="/dashboard" 
    className={`${ghost} flex items-center text-sm `}
  >
    <ArrowLeft className="mr-2 h-4 w-4" /> 
    <span>Back</span>
  </Link>

  {/* Heading Group */}
  <div className="flex flex-col gap-1">
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
      Resume Builder
    </h1>
    <p className="text-sm text-gray-500">
      AI-powered professional resumes
    </p>
  </div>
</div>
        <div className="flex gap-2">
          {step === 5 && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="flex h-[calc(100vh-57px)]">

        {/* LEFT — Form panel */}
        <div className="w-[44%] flex-shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <div className="p-6">
            <StepBar current={step} />

            <AnimatePresence mode="wait">

              {/* STEP 0 — Template picker */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                  <h2 className="text-base font-bold text-gray-800 mb-1">Choose a template</h2>
                  <p className="text-xs text-gray-400 mb-5">Pick the style that fits your industry and personality</p>
                  <div className="space-y-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTemplate(t.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          template === t.id
                            ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-100"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Mini template thumbnail */}
                          <div className="w-14 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm"
                            style={{ background: t.accent }}>
                            <div className="w-full h-full flex flex-col p-1.5 gap-0.5">
                              <div className="w-full h-1 bg-white/40 rounded" />
                              <div className="w-3/4 h-0.5 bg-white/30 rounded" />
                              <div className="flex-1 flex gap-1 mt-0.5">
                                {t.id === "modern" && <div className="w-1/3 bg-white/20 rounded" />}
                                <div className="flex-1 space-y-0.5">
                                  <div className="w-full h-0.5 bg-white/20 rounded" />
                                  <div className="w-4/5 h-0.5 bg-white/20 rounded" />
                                  <div className="w-3/4 h-0.5 bg-white/20 rounded" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{t.name}</span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: t.accent + "20", color: t.accent }}>
                                {t.tag}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                          </div>
                          {template === t.id && (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[10px] font-bold">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Personal info */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Personal Information</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Your contact details go at the top of the resume</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Full Name" required>
                      <Input value={form.fullName} onChange={set("fullName")} placeholder="Aryan Johri" />
                    </Field>
                    <Field label="Email" required>
                      <Input type="email" value={form.email} onChange={set("email")} placeholder="aryan@gmail.com" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Phone Number">
                      <Input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                    </Field>
                    <Field label="LinkedIn URL">
                      <Input value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/aryan" />
                    </Field>
                  </div>
                  <Field label="Portfolio / GitHub / Website">
                    <Input value={form.portfolio} onChange={set("portfolio")} placeholder="github.com/aryan or portfolio.dev" />
                  </Field>
                </motion.div>
              )}

              {/* STEP 2 — Education & Skills */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Education & Skills</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Your academic background and technical skills</p>
                  </div>
                  <Field label="Education" required>
                    <textarea
                      value={form.education}
                      onChange={(e) => set("education")(e.target.value)}
                      placeholder={`B.Tech Computer Science\nXYZ University, Lucknow\n2021 – 2025 | CGPA: 8.2`}
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                    />
                  </Field>
                  <Field label="Skills (comma-separated)" required>
                    <textarea
                      value={form.skills}
                      onChange={(e) => set("skills")(e.target.value)}
                      placeholder="React, Node.js, Python, Machine Learning, SQL, AWS, Docker, Git..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                    />
                  </Field>
                </motion.div>
              )}

              {/* STEP 3 — Summary & Experience */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Summary & Experience</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Write your raw thoughts — AI will polish them ✨</p>
                  </div>
                  <AIEnhanceField
                    label="Professional Summary"
                    section="summary"
                    value={form.rawSummary}
                    onChange={set("rawSummary")}
                    enhancedValue={enhanced.summary}
                    onEnhanced={setEnh("summary")}
                    context={{ fullName: form.fullName, skills: form.skills }}
                    placeholder="Write a few sentences about yourself — your background, what you do best, and your career goal. AI will turn this into a professional summary."
                    rows={3}
                  />
                  <AIEnhanceField
                    label="Work Experience & Internships"
                    section="experience"
                    value={form.rawExperience}
                    onChange={set("rawExperience")}
                    enhancedValue={enhanced.experience}
                    onEnhanced={setEnh("experience")}
                    placeholder={`Internship at ABC Corp, May 2024 – Jul 2024\nWorked on React dashboard, fixed bugs, built an API\n\nFreelance project for a client, built e-commerce site`}
                    rows={6}
                  />
                </motion.div>
              )}

              {/* STEP 4 — Achievements & Extras */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Achievements & Activities</h2>
                    <p className="text-xs text-gray-400 mt-0.5">The extras that make you stand out</p>
                  </div>
                  <AIEnhanceField
                    label="Achievements & Awards"
                    section="achievements"
                    value={form.rawAchievements}
                    onChange={set("rawAchievements")}
                    enhancedValue={enhanced.achievements}
                    onEnhanced={setEnh("achievements")}
                    placeholder={`Won hackathon at college 2024\nGot 95% in 12th boards\nSelected for Google DSC program\nPublished paper on ML in XYZ journal`}
                    rows={5}
                  />
                  <AIEnhanceField
                    label="Extracurricular Activities"
                    section="extracurricular"
                    value={form.rawExtracurricular}
                    onChange={set("rawExtracurricular")}
                    enhancedValue={enhanced.extracurricular}
                    onEnhanced={setEnh("extracurricular")}
                    placeholder={`President of coding club 2023-2024\nVolunteered at NGO for 6 months\nCaptain of college football team\nOrganised annual tech fest with 500+ attendees`}
                    rows={4}
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 5 — Final preview (full screen right panel) */}
              {step === 5 && generated && (
                <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">🎉 Resume Ready!</h2>
                    <p className="text-xs text-gray-400">Your AI-enhanced resume is on the right. Download as PDF.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-green-700">✓ All sections enhanced by AI</p>
                    <p className="text-xs text-green-600">Template: <strong>{templateConfig.name}</strong></p>
                    <p className="text-xs text-green-600">Click "Download PDF" in the top bar to save your resume.</p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    ← Edit content
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {step < 5 && (
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={generateResume}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Generating…
                      </>
                    ) : "✨ Generate Resume"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Live preview */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center py-6 px-4">
          <div className="mb-3 flex items-center gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border
                  ${template === t.id ? "text-white border-transparent shadow-lg" : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"}`}
                style={template === t.id ? { background: templateConfig.accent } : {}}
              >
                {t.name}
              </button>
            ))}
            <span className="text-[10px] text-gray-400 ml-2">Live preview</span>
          </div>

          {/* A4 paper */}
          <div
            ref={previewRef}
            className="w-full max-w-[595px] min-h-[842px] shadow-2xl shadow-black/20 overflow-hidden"
            style={{ aspectRatio: "1 / 1.414", borderRadius: "2px" }}
          >
            <PreviewComponent data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}