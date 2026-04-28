import { motion } from "framer-motion";
import ToolCard from "../components/ToolCard";
import {
  FileText,
  ScanSearch,
  Eraser,
  User,
  InfoIcon,
  Camera,
} from "lucide-react";
import Footer from "../components/Footer";

const tools = [
  {
    title: "Resume Builder",
    description:
      "Create a professional, well-formatted resume using AI. Enter your details and get a polished resume ready for applications.",
    icon: FileText,
    href: "/dashboard/resume-builder",
    gradient: "linear-gradient(135deg, hsl(172 66% 50%), hsl(190 80% 45%))",
  },
  {
    title: "ATS Resume Checker",
    description:
      "Analyze your resume against ATS rules. Get a score and actionable suggestions to improve keywords and formatting.",
    icon: ScanSearch,
    href: "/dashboard/ats-checker",
    gradient: "linear-gradient(135deg, hsl(262 83% 58%), hsl(280 70% 55%))",
  },
  {
    title: "Background Removal",
    description:
      "Upload any photo and instantly remove the background for clean, professional images perfect for resumes and profiles.",
    icon: Eraser,
    href: "/dashboard/bg-removal",
    gradient: "linear-gradient(135deg, hsl(340 75% 55%), hsl(10 80% 55%))",
  },
  {
    title: "About Section Generator",
    description:
      "Generate compelling About/Summary sections for your resume or LinkedIn based on your skills and career goals.",
    icon: User,
    href: "/dashboard/about-generator",
    gradient: "linear-gradient(135deg, hsl(45 90% 50%), hsl(30 85% 50%))",
  },
  {
    title: "LinkedIn Post Generator",
    description:
      "Create engaging LinkedIn posts and articles to build your professional brand and online presence.",
    icon: InfoIcon,
    href: "/dashboard/linkedin-generator",
    gradient: "linear-gradient(135deg, hsl(210 80% 50%), hsl(220 75% 55%))",
  },
  {
    title: "AI Headshot Generator",
    description:
      "Transform your casual photos into professional headshots perfect for LinkedIn, resumes, and personal branding.",
    icon: Camera,
    href: "/dashboard/headshot-generator",
    gradient: "linear-gradient(135deg, hsl(150 60% 45%), hsl(172 66% 50%))",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
              Create amazing content <br /> with{" "}
              <span className="text-primary">AI tools</span>
            </h1>
            <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
              Transform your content creation with our suite of premium AI
              tools. Write Resume, Check ATS , generate headshot images, and
              enhance your workflow.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
              gradient={tool.gradient}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
