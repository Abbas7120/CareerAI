import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ScanSearch, Loader2, Copy, Check } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;
const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const ghost = `${btn} hover:bg-accent hover:text-accent-foreground h-9 px-3`;
// ─── Data ────────────────────────────────────────────────────────────────────

const DEGREE_OPTIONS = [
  "Bachelor of Technology (B.Tech)",
  "Bachelor of Engineering (B.E)",
  "Bachelor of Science (B.Sc)",
  "Bachelor of Computer Applications (BCA)",
  "Bachelor of Commerce (B.Com)",
  "Bachelor of Arts (B.A)",
  "Bachelor of Business Administration (BBA)",
  "Master of Technology (M.Tech)",
  "Master of Engineering (M.E)",
  "Master of Science (M.Sc)",
  "Master of Computer Applications (MCA)",
  "Master of Business Administration (MBA)",
  "Master of Commerce (M.Com)",
  "Doctor of Philosophy (PhD)",
  "Diploma",
  "10th (Secondary)",
  "12th (Senior Secondary)",
  "Other",
];

const SPECIALIZATION_OPTIONS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Data Science",
  "Artificial Intelligence & ML",
  "Cybersecurity",
  "Cloud Computing",
  "Software Engineering",
  "Business Analytics",
  "Finance",
  "Marketing",
  "Human Resources",
  "Operations Management",
  "Physics",
  "Mathematics",
  "Chemistry",
  "Biology",
  "Economics",
  "Psychology",
  "English Literature",
  "Other",
];

const SKILLS_LIST = [
  // Programming Languages
  "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#", "Go",
  "Rust", "Ruby", "PHP", "Swift", "Kotlin", "R", "MATLAB", "Scala",
  // Web
  "React", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Redux", "GraphQL", "REST API",
  // Backend / DB
  "Django", "Flask", "Spring Boot", "FastAPI", "MySQL", "PostgreSQL",
  "MongoDB", "Redis", "Elasticsearch", "Firebase", "Supabase",
  // DevOps / Cloud
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins",
  "CI/CD", "Linux", "Bash", "Git", "GitHub Actions",
  // AI / ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "NLP", "Computer Vision", "Pandas", "NumPy", "Matplotlib",
  "Power BI", "Tableau", "Data Analysis", "Data Science",
  // Design / Tools
  "Figma", "Adobe XD", "Canva", "Photoshop",
  // Soft Skills
  "Communication", "Leadership", "Teamwork", "Problem Solving",
  "Project Management", "Agile", "Scrum", "Time Management",
  // Other
  "Excel", "Word", "PowerPoint", "SQL", "NoSQL", "Microservices",
  "System Design", "DSA", "OOPs", "DBMS", "Operating Systems", "Networking",
].sort();

const SUGGESTION_STYLE = {
  critical: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    dot: "bg-red-400",    label: "Critical" },
  warning:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  dot: "bg-amber-400",  label: "Warning"  },
  info:     { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   dot: "bg-blue-400",   label: "Info"     },
  success:  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  dot: "bg-green-400",  label: "Good"     },
};

// ─── Skeleton Components ─────────────────────────────────────────────────────

function SkeletonPulse({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

function ScoreSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col items-center gap-4">
        <SkeletonPulse className="w-32 h-32 rounded-full" />
        <SkeletonPulse className="w-28 h-4" />
      </div>
    </div>
  );
}

function BreakdownSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <SkeletonPulse className="w-40 h-5" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <SkeletonPulse className="w-32 h-3" />
            <SkeletonPulse className="w-10 h-3" />
          </div>
          <SkeletonPulse className="w-full h-2" />
        </div>
      ))}
    </div>
  );
}

function KeywordSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <SkeletonPulse className="w-36 h-5" />
      <div className="flex flex-wrap gap-2">
        {[80, 60, 90, 70, 55, 75, 65].map((w, i) => (
          <SkeletonPulse key={i} className={`h-6 rounded-md`} style={{ width: `${w}px` }} />
        ))}
      </div>
    </div>
  );
}

function SuggestionSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <SkeletonPulse className="w-48 h-5" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <SkeletonPulse className="w-5 h-5 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonPulse className="w-40 h-4" />
            <SkeletonPulse className="w-full h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Decent" : "Needs work";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
        <text x="70" y="64" textAnchor="middle" fontSize="30" fontWeight="700" fill={color}>{score}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#9ca3af">ATS Score</text>
      </svg>
      <span className="text-sm font-semibold mt-1" style={{ color }}>{label} match</span>
    </motion.div>
  );
}

function MiniBar({ label, value, delay = 0 }) {
  const [animated, setAnimated] = useState(0);
  const color = value >= 75 ? "bg-green-500" : value >= 50 ? "bg-amber-400" : "bg-red-400";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${animated}%`, transition: "width 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </div>
    </div>
  );
}

function KeywordBadge({ word, matched, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.25 }}
      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium
        ${matched ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}
    >
      {matched ? "✓ " : "✗ "}{word}
    </motion.span>
  );
}

function SkillInput({ selected = [], onChange }) {
  const [input, setInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = SKILLS_LIST.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(s)
  ).slice(0, 5); // limit suggestions

  const addSkill = (skill) => {
    if (!skill) return;
    onChange([...selected, skill]);
    setInput("");
    setActiveIndex(0);
  };

  const removeSkill = (skill) => {
    onChange(selected.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[activeIndex]);
      } else {
        addSkill(input); // allow custom skill
      }
    }

    if (e.key === "Backspace" && input === "" && selected.length > 0) {
      removeSkill(selected[selected.length - 1]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl px-3 py-2 bg-white">
      {/* Selected skills */}
      <div className="flex flex-wrap gap-1.5 mb-1">
        {selected.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSkill(s)}
              className="hover:text-indigo-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter..."
        className="w-full text-sm outline-none"
      />

      {/* Suggestions (inline, minimal UI) */}
      {input && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {suggestions.map((s, i) => (
            <span
              key={s}
              onClick={() => addSkill(s)}
              className={`px-2 py-0.5 text-xs rounded-md cursor-pointer border
                ${
                  i === activeIndex
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                }`}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Select helper ────────────────────────────────────────────────────────────

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Education block ──────────────────────────────────────────────────────────

const EMPTY_EDU = { degree: "", specialization: "", institution: "", year: "" };

function EducationBlock({ entries, onChange }) {
  const update = (i, field, val) => {
    const next = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    onChange(next);
  };
  const add = () => onChange([...entries, { ...EMPTY_EDU }]);
  const remove = (i) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {entries.map((edu, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100 relative"
        >
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs font-bold flex items-center justify-center"
            >×</button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Degree *</label>
              <Select
                value={edu.degree}
                onChange={(v) => update(i, "degree", v)}
                options={DEGREE_OPTIONS}
                placeholder="Select degree…"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Specialization</label>
              <Select
                value={edu.specialization}
                onChange={(v) => update(i, "specialization", v)}
                options={SPECIALIZATION_OPTIONS}
                placeholder="Select specialization…"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => update(i, "institution", e.target.value)}
                placeholder="College / University name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Passing Year</label>
              <input
                type="text"
                value={edu.year}
                onChange={(e) => update(i, "year", e.target.value)}
                placeholder="e.g. 2024"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </motion.div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-base leading-none">+</span>
        Add another degree
      </button>
    </div>
  );
}

// ─── Experience block ─────────────────────────────────────────────────────────

const EMPTY_EXP = { role: "", company: "", duration: "", type: "Experience", description: "" };
const EXP_TYPES = ["Experience", "Internship", "Project", "Freelance"];

function ExperienceBlock({ entries, onChange }) {
  const update = (i, field, val) => {
    const next = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    onChange(next);
  };
  const add = () => onChange([...entries, { ...EMPTY_EXP }]);
  const remove = (i) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {entries.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100 relative"
        >
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs font-bold flex items-center justify-center"
            >×</button>
          )}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
              <Select
                value={exp.type}
                onChange={(v) => update(i, "type", v)}
                options={EXP_TYPES}
                placeholder="Type…"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Role / Position *</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => update(i, "role", e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Company / Organisation</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => update(i, "company", e.target.value)}
                placeholder="Company name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Duration</label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => update(i, "duration", e.target.value)}
              placeholder="e.g. Jan 2023 – Jun 2023 or 6 months"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Key responsibilities / achievements</label>
            <textarea
              value={exp.description}
              onChange={(e) => update(i, "description", e.target.value)}
              placeholder="Briefly describe what you did and achieved…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>
        </motion.div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-base leading-none">+</span>
        Add another experience
      </button>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ATSChecker() {
  const [education, setEducation]       = useState([{ ...EMPTY_EDU }]);
  const [experience, setExperience]     = useState([{ ...EMPTY_EXP }]);
  const [skills, setSkills]             = useState([]);
  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Staged skeleton loading — reveal boxes one by one like YouTube
  const [visibleCards, setVisibleCards] = useState([]);

  const CARD_KEYS = ["score", "breakdown", "matched", "missing", "suggestions"];

  const revealCards = () => {
    setVisibleCards([]);
    CARD_KEYS.forEach((key, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, key]);
      }, i * 350); // staggered reveal
    });
  };

  const analyseResume = async () => {
    setError(null);
    setResult(null);

    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError("Please enter a job description (at least 30 characters)");
      return;
    }

    const hasEdu = education.some((e) => e.degree);
    const hasExp = experience.some((e) => e.role);
    const hasSkills = skills.length > 0;

    if (!hasEdu && !hasExp && !hasSkills) {
      setError("Please fill in at least one section — Education, Experience, or Skills");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ats/ats-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education: education.filter((e) => e.degree),
          experience: experience.filter((e) => e.role),
          skills,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Analysis failed");

      setResult(data);
      revealCards();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isVisible = (key) => visibleCards.includes(key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-8">
      
      <div className="max-w-6xl mx-auto space-y-6">
 <Link to="/dashboard" className={`${ghost} mb-6`}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Link>
        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-center gap-4">
          
          <div>
          
            <h1 className="text-2xl font-bold text-gray-900">ATS Resume Checker</h1>
            <p className="text-sm text-gray-500">Fill in your profile and paste a job description to get your ATS score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT: Input Form ──────────────────── */}
          <div className="space-y-4">

            {/* Education */}
            <Section title="Education" subtitle="Add your degrees and qualifications">
              <EducationBlock entries={education} onChange={setEducation} />
            </Section>

            {/* Experience */}
            <Section title="Experience & Internships" subtitle="Add your work history, internships, or projects">
              <ExperienceBlock entries={experience} onChange={setExperience} />
            </Section>

            {/* Skills */}
            <Section  title="Skills" subtitle="Select all relevant technical and soft skills">
           <SkillInput selected={skills} onChange={setSkills} />
              {skills.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">{skills.length} skill{skills.length !== 1 ? "s" : ""} selected</p>
              )}
            </Section>

            {/* Job Description */}
            <Section title="Job Description" subtitle="Paste the job posting you're applying for">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here — the more detail, the better your ATS score analysis will be…"
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
              <span className="text-xs text-gray-300 float-right mt-1">{jobDescription.length} chars</span>
            </Section>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              onClick={analyseResume}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Analysing with AI…
                </>
              ) : (
                <>
                 Analyse My Resume
                </>
              )}
            </button>
          </div>

          {/* ── RIGHT: Results ────────────────────── */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-200 p-10 space-y-3">
                <span className="text-5xl">📝</span>
                <p className="text-gray-500 font-medium">Your ATS analysis will appear here</p>
                <p className="text-sm text-gray-400">Fill in the form on the left and click Analyse</p>
              </div>
            )}

            {/* Skeleton loading state */}
            {loading && (
              <div className="space-y-4">
                <ScoreSkeleton />
                <BreakdownSkeleton />
                <KeywordSkeleton />
                <KeywordSkeleton />
                <SuggestionSkeleton />
              </div>
            )}

            {/* Real results — staggered reveal */}
            {result && !loading && (
              <div className="space-y-4">

                {/* Score */}
                <AnimatePresence>
                  {isVisible("score") ? (
                    <motion.div
                      key="score"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center"
                    >
                      <ScoreRing score={result.score} />
                      <p className="text-xs text-gray-400 mt-3 text-center max-w-xs">
                        This score reflects how well your profile matches the job description's keywords, skills, and content.
                      </p>
                    </motion.div>
                  ) : <ScoreSkeleton />}
                </AnimatePresence>

                {/* Breakdown bars */}
                <AnimatePresence>
                  {isVisible("breakdown") ? (
                    <motion.div
                      key="breakdown"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
                    >
                      <h3 className="text-sm font-semibold text-gray-800">Score Breakdown</h3>
                      <MiniBar label="Keyword match"       value={result.breakdown.keywordMatch}      delay={200} />
                      <MiniBar label="Content similarity"  value={result.breakdown.contentSimilarity} delay={400} />
                      <MiniBar label="Skills coverage"     value={result.breakdown.skillsCoverage}    delay={600} />
                    </motion.div>
                  ) : <BreakdownSkeleton />}
                </AnimatePresence>

                {/* Matched keywords */}
                <AnimatePresence>
                  {isVisible("matched") ? (
                    <motion.div
                      key="matched"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Matched Keywords</h3>
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          {result.matchedKeywords.length} found
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matchedKeywords.length > 0
                          ? result.matchedKeywords.map((kw, i) => (
                              <KeywordBadge key={kw} word={kw} matched delay={i * 0.04} />
                            ))
                          : <p className="text-sm text-gray-400">No strong keyword matches found yet</p>}
                      </div>
                    </motion.div>
                  ) : <KeywordSkeleton />}
                </AnimatePresence>

                {/* Missing keywords */}
                <AnimatePresence>
                  {isVisible("missing") ? (
                    <motion.div
                      key="missing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Missing Keywords</h3>
                        <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                          add these
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords.length > 0
                          ? result.missingKeywords.map((kw, i) => (
                              <KeywordBadge key={kw} word={kw} matched={false} delay={i * 0.04} />
                            ))
                          : <p className="text-sm text-gray-400">🎉 No critical keyword gaps found!</p>}
                      </div>
                    </motion.div>
                  ) : <KeywordSkeleton />}
                </AnimatePresence>

                {/* Suggestions */}
                <AnimatePresence>
                  {isVisible("suggestions") && result.suggestions?.length > 0 ? (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
                    >
                      <h3 className="text-sm font-semibold text-gray-800">Personalised Recommendations</h3>
                      {result.suggestions.map((s, i) => {
                        const meta = SUGGESTION_STYLE[s.type] || SUGGESTION_STYLE.info;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className={`flex gap-3 p-3 rounded-xl border ${meta.bg} ${meta.border}`}
                          >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${meta.dot}`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={`text-xs font-bold uppercase tracking-wide ${meta.text}`}>{meta.label}</p>
                                <p className={`text-sm font-semibold ${meta.text}`}>{s.title}</p>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">{s.detail}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : isVisible("suggestions") ? null : <SuggestionSkeleton />}
                </AnimatePresence>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}