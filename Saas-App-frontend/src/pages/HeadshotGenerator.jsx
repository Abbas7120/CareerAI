import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ghost = `${btn} hover:bg-accent hover:text-accent-foreground h-9 px-3`;

const STYLES = [
  { id: "linkedin",      label: "LinkedIn",     description: "Navy blue background",  color: "#0a4c8a" },
  { id: "professional",  label: "Professional", description: "Soft grey background",  color: "#a0a0a0" },
  { id: "white",         label: "Clean White",  description: "Pure white background", color: "#f0f0f0" },
  { id: "dark",          label: "Dark",         description: "Dark studio look",      color: "#28283a" },
  { id: "gradient_blue", label: "Gradient",     description: "Blue gradient",         color: "#3b6db4" },
];

const TIPS = [
  "Face the camera directly",
  "Use good lighting (near a window works great)",
  "Plain clothing looks most professional",
  "Neutral facial expression",
];

export default function HeadshotGenerator() {
  const [selectedStyle, setSelectedStyle] = useState("linkedin");
  const [originalImage, setOriginalImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP)");
      return;
    }
    setError(null);
    setResultImage(null);
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage({ src: e.target.result, file });
    reader.readAsDataURL(file);
  };

  const generateHeadshot = async () => {
    if (!originalImage) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", originalImage.file);
      formData.append("style", selectedStyle);

      const res = await fetch(`${API_BASE}/api/image/headshot`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Processing failed");

      setResultImage(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `headshot-${selectedStyle}.jpg`;
    a.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
              <Link to="/dashboard" className={`${ghost} mb-6`}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Headshot Generator</h1>
          <p className="text-gray-500 mt-1">
            Transform any photo into a professional headshot — face detection, enhancement, and background replacement, all on-device.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Upload + Style */}
          <div className="col-span-1 space-y-4">
            {/* Photo tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Tips for best results</p>
              <ul className="space-y-1">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-blue-600">
                    <span className="mt-0.5">→</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Style picker */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Background Style</p>
              <div className="space-y-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all
                      ${selectedStyle === s.id
                        ? "bg-indigo-50 border-2 border-indigo-400"
                        : "border-2 border-transparent hover:bg-gray-50"}`}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex-shrink-0 border border-white shadow"
                      style={{ background: s.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.label}</p>
                      <p className="text-xs text-gray-400">{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Upload + Result */}
          <div className="col-span-2 space-y-4">
            {/* Upload zone */}
            {!originalImage ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Upload your photo</p>
                    <p className="text-sm text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Before / After comparison */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Original Photo
                    </div>
                    <div className="p-3">
                      <img src={originalImage.src} alt="Original" className="w-full rounded-xl object-contain max-h-72" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      AI Headshot
                    </div>
                    <div className="p-3 min-h-[200px] flex items-center justify-center bg-gray-50 rounded-xl m-3">
                      {resultImage ? (
                        <img src={resultImage} alt="Headshot" className="w-full rounded-xl object-contain max-h-72" />
                      ) : loading ? (
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                          <div className="relative">
                            <svg className="animate-spin w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-indigo-600">Generating headshot…</p>
                            <p className="text-xs text-gray-400 mt-0.5">Detecting face · Enhancing · Replacing background</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-300">Your professional headshot will appear here</p>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  {!resultImage ? (
                    <button
                      onClick={generateHeadshot}
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? "Generating…" : "Generate Professional Headshot"}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={downloadResult}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download Headshot
                      </button>
                      <button
                        onClick={() => { setResultImage(null); }}
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Try Another Style
                      </button>
                    </>
                  )}
                  <button
                    onClick={reset}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    New Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}