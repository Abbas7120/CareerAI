import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";



const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ghost = `${btn} hover:bg-accent hover:text-accent-foreground h-9 px-3`;

// const API_BASE= "http://localhost:5000";  
const API_BASE = import.meta.env.VITE_API_URL;

export default function BGRemoval() {
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const processImage = async () => {
  if (!originalImage) return;
  setLoading(true);
  setError(null);

  try {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = originalImage.src;
    await new Promise(r => (img.onload = r));

    const MAX = 1024;
    let w = img.width, h = img.height;
    if (w > MAX || h > MAX) {
      if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
      else { w = Math.round((w * MAX) / h); h = MAX; }
    }

    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);

    const uploadBlob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.85));
    const formData = new FormData();
    formData.append("image", uploadBlob, "image.jpg");

    const res = await fetch(`${API_BASE}/api/image/remove-bg`, {
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
// const processImage = async () => {
//   if (!originalImage) return;
//   setLoading(true);
//   setError(null);

//   try {
//     const canvas = document.createElement("canvas");
//     const img = new Image();
//     img.src = originalImage.src;
//     await new Promise(r => (img.onload = r));

//     const MAX = 1024;
//     let w = img.width, h = img.height;
//     if (w > MAX || h > MAX) {
//       if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
//       else { w = Math.round((w * MAX) / h); h = MAX; }
//     }

//     canvas.width = w;
//     canvas.height = h;
//     canvas.getContext("2d").drawImage(img, 0, 0, w, h);

//     const uploadBlob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.85));
//     const formData = new FormData();
//     formData.append("image", uploadBlob, "image.jpg");

//     const res = await fetch(`${API_BASE}/api/image/remove-bg`, {
//       method: "POST",
//       body: formData,
//     });

//     // ✅ CORRECT — parse as JSON, then use data.image directly
//     const data = await res.json();
//     if (!res.ok || !data.success) throw new Error(data.error || "Processing failed");

//     setResultImage(data.image); // data.image is already "data:image/png;base64,..."

//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

  const downloadResult = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = "background-removed.png";
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
      <div className="max-w-4xl mx-auto">
         <Link to="/dashboard" className={`${ghost} mb-6`}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Link>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Background Remover</h1>
          <p className="text-gray-500 mt-1">
            Remove image backgrounds instantly using AI — no external API required.
          </p>
        </div>

        {/* Upload Area */}
        {!originalImage ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
              ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/40"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">Drop your image here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse — JPG, PNG, WEBP up to 10MB</p>
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
          <div className="space-y-6">
            {/* Before / After */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span className="text-sm font-medium text-gray-600">Original</span>
                </div>
                <div className="p-4">
                  <img src={originalImage.src} alt="Original" className="w-full rounded-lg object-contain max-h-64" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-sm font-medium text-gray-600">Background Removed</span>
                </div>
                <div className="p-4 min-h-50 flex items-center justify-center"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e7eb'/%3E%3C/svg%3E\")" }}>
                  {resultImage ? (
                    <img src={resultImage} alt="Result" className="w-full rounded-lg object-contain max-h-64" />
                  ) : loading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span className="text-sm">Processing with AI…</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Result will appear here</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!resultImage ? (
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Removing background…
                    </>
                  ) : "Remove Background"}
                </button>
              ) : (
                <button
                  onClick={downloadResult}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download PNG
                </button>
              )}
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                New Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}