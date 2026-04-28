import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, InfoIcon, Loader2, Copy, Check } from "lucide-react";
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

const LinkedInGenerator = () => {
  const [form, setForm] = useState({
    topic: "",
    type: "post",
    tone: "Professional yet conversational",
    context: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
        try {
         const res = await postJSON("/api/linkedin/generate", {
topic: form.topic,
tone: form.tone,
contentType: form.type
})

setResult(res.post)
          // setResult(res);
          toast.success("Posts generated!");
        } catch (err) { toast.error(err.message); } finally { setLoading(false); }
    
  };

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
            <div
              className="rounded-lg p-3"
              style={{
                background:
                  "linear-gradient(135deg, hsl(210 80% 50%), hsl(220 75% 55%))",
              }}
            >
              <InfoIcon className="h-6 w-6 text-card" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                LinkedIn Post Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Create engaging professional content
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
                  Topic *
                </label>
                <input
                  className={inputClass}
                  value={form.topic}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, topic: e.target.value }))
                  }
                  placeholder="My journey into tech, Tips for new developers..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Content Type
                </label>
                <select
                  className={selectClass}
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="post">Short Post</option>
                  <option value="article">Long Article</option>
                  <option value="story">Personal Story</option>
                  <option value="tips">Tips & Advice</option>
                </select>
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
                  <option value="Professional yet conversational">
                    Professional
                  </option>
                  <option value="Inspirational and motivating">
                    Inspirational
                  </option>
                  <option value="Casual and friendly">Casual</option>
                  <option value="Thought-provoking and analytical">
                    Analytical
                  </option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Additional Context
                </label>
                <textarea
                  className={textareaClass}
                  value={form.context}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, context: e.target.value }))
                  }
                  placeholder="Any specific details, achievements, or angles..."
                  rows={3}
                />
              </div>
              <button type="submit" className={heroFull} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  "Generate Posts"
                )}
              </button>
            </form>
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-semibold text-card-foreground">
                  Generated Content
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
                  Enter a topic to generate engaging LinkedIn content.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkedInGenerator;
