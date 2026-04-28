import { Sparkles } from "lucide-react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
     <span className="font-display text-xl font-bold text-foreground">CareerAI</span>
     
          <p className="mt-6 text-sm">
            Experience the power of AI with CareerAI. <br /> Transform you
            content creation with our suite of premium AI tools. Write articles,
            generate images,check ATS,build your resume and enhance your workflow.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Our Tools </h2>
            <ul className="text-sm space-y-2">
             <li>
  <Link to="/dashboard/resume-builder" className="hover:text-purple-600 transition-colors">
    Resume Builder
  </Link>
</li>
<li>
  <Link to="/dashboard/ats-checker" className="hover:text-purple-600 transition-colors">
    ATS Checker
  </Link>
</li>
<li>
  <Link to="/dashboard/bg-removal" className="hover:text-purple-600 transition-colors">
    BG Removal
  </Link>
</li>
<li>
  <Link to="/dashboard/headshot-generator" className="hover:text-purple-600 transition-colors">
    Headshot Generator
  </Link>
</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-2">
              <p>
                The latest news, articles, and resources related to jobs sent to your inbox
                weekly.
              </p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className=" w-24 h-9 text-black border border-gray-500/30 rounded cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 ©{" "}
        <a target="_blank" href="">
        Team HACKWAVE
        </a>
        . All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;