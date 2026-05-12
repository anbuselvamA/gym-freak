import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, ScanLine, CheckCircle, Zap, Dumbbell, Flame, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// We assume VITE_GEMINI_API_KEY is available in the environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function AICameraScanner({ onClose, onLogMeal }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [status, setStatus] = useState('camera'); // camera | scanning | result | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Camera access is required to scan food.");
        onClose();
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeImageWithAI = async (base64Image) => {
    try {
      if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      }

      // Remove the data URL prefix to get raw base64 string
      const base64Data = base64Image.split(',')[1];
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const prompt = `
        You are a highly advanced fitness and nutrition AI. Analyze this image.
        If the image contains food, identify it and estimate the total calories, protein (g), carbs (g), and fats (g).
        Also provide a 'rating' (Excellent, Great, Fair, or Poor) based on how good it is for fitness (muscle gain / fat loss), and a short 'comment' explaining why.
        If the image DOES NOT contain food (e.g., it's a person's face, a room, etc.), you MUST set the name to "No Food Detected", calories and macros to 0, rating to "Poor", and comment to "Please take a picture of food."

        You must return ONLY a valid JSON object matching exactly this structure:
        {
          "name": "Food Name",
          "cals": 0,
          "protein": 0,
          "carbs": 0,
          "fats": 0,
          "rating": "Excellent",
          "comment": "Short explanation"
        }
        Do not include markdown tags like \`\`\`json. Return only the JSON object.
      `;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up potential markdown formatting from AI response
      if (text.startsWith('```json')) text = text.substring(7);
      if (text.startsWith('```')) text = text.substring(3);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
      
      const jsonResult = JSON.parse(text.trim());
      
      // Map ratings to icons/colors for UI
      let icon = Flame;
      let color = "text-orange-400";
      if (jsonResult.rating === "Excellent") { icon = Dumbbell; color = "text-neon"; }
      if (jsonResult.rating === "Great") { icon = Zap; color = "text-blue-400"; }
      if (jsonResult.rating === "Poor" || jsonResult.cals === 0) { icon = AlertCircle; color = "text-red-500"; }
      
      setResult({ ...jsonResult, icon, color });
      setStatus('result');

    } catch (err) {
      console.error("AI Analysis Error:", err);
      setErrorMessage(err.message || "Failed to analyze image.");
      setStatus('error');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL('image/png');
      setCapturedImage(imgData);
      
      // Stop camera tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setStatus('scanning');
      analyzeImageWithAI(imgData);
    }
  };

  const handleLog = () => {
    if (result && result.cals > 0) {
      const mealToLog = {
        title: "AI Scanned Meal",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cals: result.cals,
        items: result.name,
        foodItems: [{ name: result.name, cals: result.cals, serving: '1 serving' }]
      };
      onLogMeal(mealToLog);
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles className="text-neon" size={20} />
          <span className="text-white font-bold tracking-tight">Nexus AI Vision</span>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-zinc-900 overflow-hidden flex items-center justify-center">
        
        {/* Camera View */}
        {(status === 'camera') && !capturedImage && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Captured Image View */}
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Scanned Food" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Scanning Overlay Animation */}
        {status === 'scanning' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              animate={{ y: [-100, 100, -100] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="w-64 h-1 bg-neon shadow-[0_0_20px_#39ff14] mb-8"
            />
            <ScanLine size={48} className="text-neon mb-4 animate-pulse" />
            <p className="text-white font-bold text-lg tracking-widest uppercase animate-pulse">AI Analyzing...</p>
            <p className="text-gray-400 text-xs mt-2">Gemini 1.5 Flash Vision Active</p>
          </div>
        )}

        {/* Camera Target Brackets */}
        {status === 'camera' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neon rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neon rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neon rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neon rounded-br-3xl"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls / Results Area */}
      <div className="bg-black rounded-t-[2.5rem] p-8 -mt-6 z-20 relative min-h-[260px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        
        {status === 'camera' && (
          <div className="flex flex-col items-center justify-center h-full pt-4">
            <p className="text-gray-400 text-sm mb-6 font-medium">Position food in the frame</p>
            <button 
              onClick={captureImage}
              className="w-20 h-20 rounded-full border-4 border-neon p-1 relative group flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-white group-active:scale-90 transition-transform"></div>
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm">Processing with Nexus AI...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertCircle size={40} className="text-red-500 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Scan Failed</h3>
            <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
            <button 
              onClick={() => {
                setCapturedImage(null);
                setResult(null);
                setStatus('camera');
                // Restart stream
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                  .then(s => {
                    setStream(s);
                    if (videoRef.current) videoRef.current.srcObject = s;
                  });
              }}
              className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'result' && result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h3 className="text-white font-extrabold text-xl tracking-tight leading-tight line-clamp-2">{result.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {result.icon && <result.icon size={14} className={result.color} />}
                  <span className={`${result.color} font-bold text-xs uppercase tracking-widest`}>{result.rating} Fit</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-4xl font-black ${result.cals === 0 ? 'text-red-500' : 'text-neon'} tracking-tighter`}>{result.cals}</span>
                <span className="text-gray-500 text-[10px] font-bold ml-1 block -mt-1">KCAL</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-zinc-900 rounded-2xl p-3 text-center border border-white/5">
                <p className="text-white font-black text-lg">{result.protein}g</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Protein</p>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-3 text-center border border-white/5">
                <p className="text-white font-black text-lg">{result.carbs}g</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Carbs</p>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-3 text-center border border-white/5">
                <p className="text-white font-black text-lg">{result.fats}g</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Fats</p>
              </div>
            </div>

            <div className={`text-sm leading-relaxed mb-6 bg-zinc-900/50 p-3.5 rounded-xl border ${result.cals === 0 ? 'border-red-500/30' : 'border-white/5'}`}>
              <span className={`${result.color} font-bold mr-2`}>Nexus AI:</span>
              <span className="text-gray-300">{result.comment}</span>
            </div>

            {result.cals > 0 ? (
              <button 
                onClick={handleLog}
                className="w-full py-4 rounded-2xl bg-neon text-black font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-[#2fe512] transition-colors shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95"
              >
                <CheckCircle size={20} />
                Log This Meal
              </button>
            ) : (
              <button 
                onClick={() => {
                  setCapturedImage(null);
                  setResult(null);
                  setStatus('camera');
                  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    .then(s => {
                      setStream(s);
                      if (videoRef.current) videoRef.current.srcObject = s;
                    });
                }}
                className="w-full py-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-500 font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors active:scale-95"
              >
                <Camera size={20} />
                Retake Photo
              </button>
            )}
          </motion.div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
