import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  ScanSearch,
  Eraser,
  User,
  
  Camera,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  InfoIcon,
} from "lucide-react";
import Testimonial from "../components/Testimonial";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const heroBtn = `${btn} bg-blue-600 text-primary-foreground font-semibold shadow-lg hover:opacity-90 h-11 px-8`;
const outlineBtn = `${btn} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-11 px-8`;

const tools = [
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "AI-crafted professional resumes",
    bg: "bg-teal-500",
  },
  {
    icon: ScanSearch,
    title: "ATS Checker",
    desc: "Beat applicant tracking systems",
    bg: "bg-purple-500",
  },
  {
    icon: Eraser,
    title: "BG Removal",
    desc: "Clean professional photos instantly",
    bg: "bg-red-500",
  },
  {
    icon: User,
    title: "About Generator",
    desc: "Compelling profile summaries",
    bg: "bg-yellow-500",
  },
  {
    icon: InfoIcon,
    title: "LinkedIn Posts",
    desc: "Engaging professional content",
    bg: "bg-blue-500",
  },
  {
    icon: Camera,
    title: "AI Headshots",
    desc: "Studio-quality profile photos",
    bg: "bg-green-500",
  },
];

const stats = [
  { icon: Zap, label: "AI-Powered", desc: "Google Gemini engine" },
  { icon: Shield, label: "Secure", desc: "Enterprise-grade security" },
  { icon: Clock, label: "Instant", desc: "Results in seconds" },
];

const Home = () => {
  return (

    
 <div className="min-h-screen  ">
    
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{ background: "var(--hero-gradient)" }}
        />
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground card-shadow">
              ✨ Your AI Career Companion
            </span>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Land your dream job with{" "}
              <span className="gradient-text">AI-powered</span> tools
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Build professional resumes, optimize for ATS, generate LinkedIn
              content, and create stunning headshots — all from one unified
              platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/dashboard" className={heroBtn}>
                Start for Free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link to="/dashboard" className={outlineBtn}>
                View Tools
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-8 mx-auto text-gray-600">
          <img src={assets.user_group} alt="users" className="h-8" />{" "}
          <span>
            Trusted by over{" "}
            <span className="font-semibold text-gray-700">10,000+</span>{" "}
            creators worldwide
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="bg-blue-600 rounded-lg p-2.5">
                  <stat.icon className="h-5 w-5 text-card" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to{" "}
              <span className="gradient-text">get hired</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Six powerful AI tools in one platform, designed for students and
              freshers entering the job market.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-6 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${tool.bg}`}>
                  {" "}
                  <tool.icon className="h-5 w-5 text-card" />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/dashboard" className={heroBtn}>
              Explore All Tools <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-12">
        <div className="container">
          <Testimonial />
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 CareerAI. Built to help you succeed.
        </div>
      </footer> */}
      <Footer />
    </div>

  );
};

export default Home;
