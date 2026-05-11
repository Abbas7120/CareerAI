import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText, ScanSearch, Eraser, User,
  InfoIcon, Camera, Trash2, ChevronDown,
  ChevronUp, Copy, Check, Sparkles,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── Feature config — matches your existing Dashboard tools ──────────────────
const FEATURES = [
  { id: "all",        label: "All",             Icon: Sparkles,   color: "from-gray-400 to-gray-500"         },
  { id: "ats",        label: "ATS Checker",     Icon: ScanSearch, color: "from-violet-500 to-purple-600"     },
  { id: "resume",     label: "Resume Builder",  Icon: FileText,   color: "from-teal-400 to-cyan-500"         },
  { id: "linkedin",   label: "LinkedIn Post",   Icon: InfoIcon,   color: "from-blue-500 to-blue-600"         },
  { id: "about",      label: "About Section",   Icon: User,       color: "from-amber-400 to-orange-500"      },
  { id: "bg-removal", label: "BG Removal",      Icon: Eraser,     color: "from-rose-400 to-pink-500"         },
  { id: "headshot",   label: "Headshot",        Icon: Camera,     color: "from-emerald-400 to-teal-500"      },
];

// ─── Small components ─────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StatCard({ label, count, Icon, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{count}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

function HistoryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const feature = FEATURES.find(f => f.id === item.feature) || FEATURES[0];
  const { Icon, color, label } = feature;

  const date = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const time = new Date(item.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  // Parse ATS JSON output for nicer display
  let displayOutput = item.output;
  let atsData = null;
  try {
    const parsed = JSON.parse(item.output);
    if (parsed.score !== undefined) atsData = parsed;
  } catch {}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {item.input_summary && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.input_summary}</p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-foreground font-medium">{date}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide" : "View"}
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="px-5 py-4 bg-muted/30 space-y-3">
              {atsData ? (
                /* ATS score display */
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-violet-600">{atsData.score}</span>
                    <span className="text-sm text-muted-foreground">/ 100 ATS Score</span>
                  </div>
                  {atsData.breakdown && (
                    <div className="space-y-2">
                      {Object.entries(atsData.breakdown).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span className="font-semibold text-foreground">{val}%</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Text output */
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {displayOutput}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <CopyButton text={item.output} />
                <span className="text-xs text-muted-foreground sm:hidden">{date} · {time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-2.5 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function History() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [history, setHistory]     = useState([]);
  const [stats, setStats]         = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchHistory();
      fetchStats();
    }
  }, [isSignedIn, user]);

  const fetchHistory = async (feature = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = feature && feature !== "all"
        ? `${API_BASE}/api/dashboard/history/${user.id}?feature=${feature}`
        : `${API_BASE}/api/dashboard/history/${user.id}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.success) setHistory(data.history);
      else throw new Error(data.error);
    } catch (err) {
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res  = await fetch(`${API_BASE}/api/dashboard/stats/${user.id}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchHistory(tab === "all" ? null : tab);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/dashboard/history/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId: user.id }),
      });
      setHistory(prev => prev.filter(item => item.id !== id));
      // Update stats
      fetchStats();
    } catch {}
  };

  // Loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to view History</h1>
          <p className="text-muted-foreground text-sm">
            Your generated resumes, LinkedIn posts, ATS scores, and more will all appear here.
          </p>
          <SignInButton mode="modal">
            <button className="bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-md">
              Sign In to Continue
            </button>
          </SignInButton>
        </motion.div>
      </div>
    );
  }

  const totalCount = Object.values(stats).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* User info strip */}
          <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 mb-6 shadow-sm">
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="w-12 h-12 rounded-xl object-cover shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">{user.fullName || "Welcome!"}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
            >
              ← Back to tools
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Your History</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              All your previously generated content in one place
            </p>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Outputs"  count={totalCount}          Icon={Sparkles}   gradient="from-blue-400 to-blue-600"      delay={0}    />
          <StatCard label="ATS Checks"     count={stats.ats      || 0} Icon={ScanSearch} gradient="from-violet-500 to-purple-600"   delay={0.05} />
          <StatCard label="Resumes Built"  count={stats.resume   || 0} Icon={FileText}   gradient="from-teal-400 to-cyan-500"       delay={0.1}  />
          <StatCard label="LinkedIn Posts" count={stats.linkedin || 0} Icon={InfoIcon}   gradient="from-blue-500 to-blue-600"       delay={0.15} />
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FEATURES.map(f => {
            const { Icon } = f;
            const count = f.id !== "all" && stats[f.id] ? stats[f.id] : null;
            return (
              <button
                key={f.id}
                onClick={() => handleTabChange(f.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                  ${activeTab === f.id
                    ? "bg-blue-400 text-white border-transparent shadow-md"
                    : "border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 bg-card"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
                {count && (
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${activeTab === f.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── History list ── */}
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm text-center">
              {error}
            </div>
          ) : history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-dashed border-border p-14 text-center space-y-4"
            >
              <div className="text-5xl">📭</div>
              <p className="font-semibold text-foreground">No history yet</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Use any tool and your results will automatically be saved here.
              </p>
              <Link
                to="/dashboard"
                className="inline-block mt-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                Go to tools →
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              {history.map(item => (
                <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
}