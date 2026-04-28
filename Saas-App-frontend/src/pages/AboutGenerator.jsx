import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Loader2, Copy, Check } from "lucide-react";
// import { callAITool } from "@/lib/ai";
import { postJSON } from "../lib/api"
import { toast } from "sonner";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ghost = `${btn} hover:bg-accent hover:text-accent-foreground h-9 px-3`;
const heroFull = `${btn} bg-blue-600 text-primary-foreground font-semibold shadow-lg hover:opacity-90 h-10 px-4 w-full`;
const inputClass =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const textareaClass = `${inputClass} min-h-[80px]`;
const selectClass = `${inputClass} h-10 appearance-none cursor-pointer`;

const AboutGenerator = () => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    goals: "",
    tone: "Professional",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.skills) {
      toast.error("Please fill in name and skills");
      return;
    }
    setLoading(true);
        try {
        const res = await postJSON("/api/about/generate", {
fullName: form.name,
targetRole: form.role,
keySkills: form.skills,
experience: form.experience,
careerGoals: form.goals,
tone: form.tone
})
setResult(res.bio)
toast.success("About sections generated!")
        } catch (err) { toast.error(err.message); } finally { setLoading(false); }
    
  };

  
// setResult(res.bio)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
<div className="min-h-screen py-10 flex justify-center">
      <div className="container max-w-6xl px-6">
        <Link to="/dashboard" className={`${ghost} mb-6`}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-center gap-3">
            {/* <div
              className="rounded-lg p-3"
              style={{
                background:
                  "linear-gradient(135deg, hsl(45 90% 50%), hsl(30 85% 50%))",
              }}
            >
             <User className="h-6 w-6 text-card" /> 
            </div> */}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                About Section Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Create compelling profile summaries
              </p>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Target Role
                </label>
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value }))
                  }
                  placeholder="Frontend Developer"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Key Skills *
                </label>
                <textarea
                  className={textareaClass}
                  value={form.skills}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, skills: e.target.value }))
                  }
                  placeholder="React, TypeScript, UI/UX Design..."
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Experience
                </label>
                <textarea
                  className={textareaClass}
                  value={form.experience}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experience: e.target.value }))
                  }
                  placeholder="2 years as intern, built 5 projects..."
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Career Goals
                </label>
                <textarea
                  className={textareaClass}
                  value={form.goals}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, goals: e.target.value }))
                  }
                  placeholder="Looking to join a product team..."
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Tone
                </label>
                <select
                  className={selectClass}
                  value={form.tone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tone: e.target.value }))
                  }
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Confident">Confident</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>
              <button type="submit" className={heroFull} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  "Generate About Sections"
                )}
              </button>
            </form>
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-semibold text-card-foreground">
                  Generated Summaries
                </h2>
                {result && (
                  <button
                    className={`${ghost} h-8 w-8 p-0`}
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              {result ? (
                <div className="prose prose-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap text-sm text-card-foreground">
                  {result}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Fill in your details to generate professional About sections.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutGenerator;
