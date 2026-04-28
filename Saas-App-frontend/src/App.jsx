import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";

import HeadshotGenerator from "./pages/HeadshotGenerator";
import ATSChecker from "./pages/ATSChecker";
import AboutGenerator from "./pages/AboutGenerator";
import BGRemoval from "./pages/BGRemoval";
import LinkedInGenerator from "./pages/LinkedInGenerator";
import Community from "./pages/ResumeBuilder";
import ResumeBuilder from "./pages/ResumeBuilder";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFond";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>

      <Toaster />
            <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/resume-builder" element={<ResumeBuilder />} />
        <Route path="/dashboard/ats-checker" element={<ATSChecker />} />
        <Route path="/dashboard/bg-removal" element={<BGRemoval />} />
        <Route path="/dashboard/about-generator" element={<AboutGenerator />} />
        <Route path="/dashboard/linkedin-generator" element={<LinkedInGenerator />} />
        <Route path="/dashboard/headshot-generator" element={<HeadshotGenerator />} />
    <Route path="*" element={<NotFound/>}/>
      
      </Routes>
    </div>
  );
};

export default App;