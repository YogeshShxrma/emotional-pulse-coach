
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmotionType = "neutral" | "happy" | "sad" | "angry" | "surprised" | "fearful";

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
}

const EmotionScan = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [faceResult, setFaceResult] = useState<EmotionResult | null>(null);
  const [voiceResult, setVoiceResult] = useState<EmotionResult | null>(null);
  const [detectionProgress, setDetectionProgress] = useState(0);

  // Simulate face detection
  const simulateFaceDetection = () => {
    const emotions: EmotionType[] = ["neutral", "happy", "sad", "angry", "surprised", "fearful"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.5 + Math.random() * 0.5; // Between 0.5 and 1
    
    setFaceResult({
      emotion: randomEmotion,
      confidence: parseFloat(confidence.toFixed(2))
    });
  };
  
  // Simulate voice analysis
  const simulateVoiceAnalysis = () => {
    const emotions: EmotionType[] = ["neutral", "happy", "sad", "angry", "surprised", "fearful"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.5 + Math.random() * 0.5; // Between 0.5 and 1
    
    setVoiceResult({
      emotion: randomEmotion,
      confidence: parseFloat(confidence.toFixed(2))
    });
  };

  // Handle camera toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please check permissions.");
      }
    }
  };

  // Handle microphone toggle
  const toggleMic = async () => {
    if (micActive) {
      setMicActive(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicActive(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Unable to access microphone. Please check permissions.");
      }
    }
  };

  // Start emotion scan
  const startScan = () => {
    if (!cameraActive || !micActive) {
      alert("Please enable both camera and microphone first.");
      return;
    }
    
    setRecording(true);
    setDetectionProgress(0);
    setFaceResult(null);
    setVoiceResult(null);
    setScanComplete(false);
    
    // Simulate progress
    const interval = setInterval(() => {
      setDetectionProgress(prev => {
        const newProgress = prev + 2;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          simulateFaceDetection();
          simulateVoiceAnalysis();
          setRecording(false);
          setScanComplete(true);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);
  };

  // Reset scan
  const resetScan = () => {
    setScanComplete(false);
    setFaceResult(null);
    setVoiceResult(null);
    setDetectionProgress(0);
  };

  // Get emotion color based on type
  const getEmotionColor = (emotion: EmotionType) => {
    switch (emotion) {
      case "happy": return "emotionGreen";
      case "sad": return "emotionBlue";
      case "angry": return "emotionRed";
      case "surprised": return "emotionYellow";
      case "fearful": return "emotionOrange";
      default: return "gray";
    }
  };

  // Get emotion emoji based on type
  const getEmotionEmoji = (emotion: EmotionType) => {
    switch (emotion) {
      case "happy": return "😊";
      case "sad": return "😔";
      case "angry": return "😡";
      case "surprised": return "😲";
      case "fearful": return "😨";
      default: return "😐";
    }
  };

  // Get combined emotion
  const getCombinedEmotion = () => {
    if (!faceResult || !voiceResult) return null;
    
    // Simple algorithm: prioritize the emotion with higher confidence
    return faceResult.confidence > voiceResult.confidence ? faceResult : voiceResult;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">
      <motion.div 
        className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Camera feed */}
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            !cameraActive && "hidden"
          )}
        />
        
        {/* Canvas for face detection drawing */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Overlay with scan information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {!cameraActive && !scanComplete && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">Enable camera to begin</p>
            </div>
          )}
          
          {cameraActive && !scanComplete && recording && (
            <div className="w-full">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(79,209,197,1)"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45 * detectionProgress / 100} ${2 * Math.PI * 45 * (1 - detectionProgress / 100)}`}
                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-emotionTeal">{detectionProgress}%</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Analyzing...</span>
                  </div>
                </div>
                
                <div className="w-full max-w-sm">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-2">
                    Please stay still and speak naturally for best results
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {scanComplete && (
            <motion.div 
              className="w-full text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {faceResult && voiceResult && (
                <>
                  <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-4 rounded-2xl backdrop-blur-md mb-4">
                    <h3 className="text-xl font-semibold mb-4">Emotion Analysis</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                        <div className="text-3xl mb-2">{getEmotionEmoji(faceResult.emotion)}</div>
                        <div className="text-sm font-medium mb-1 capitalize">{faceResult.emotion}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Facial Expression</div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${getEmotionColor(faceResult.emotion)}`}
                            style={{ width: `${faceResult.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                        <div className="text-3xl mb-2">{getEmotionEmoji(voiceResult.emotion)}</div>
                        <div className="text-sm font-medium mb-1 capitalize">{voiceResult.emotion}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Voice Tone</div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${getEmotionColor(voiceResult.emotion)}`}
                            style={{ width: `${voiceResult.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {getCombinedEmotion() && (
                      <div className="bg-emotionTeal-light dark:bg-emotionTeal-dark/20 p-3 rounded-xl">
                        <p className="text-sm font-medium">You appear to be feeling <span className="font-bold capitalize">{getCombinedEmotion()?.emotion}</span></p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Would you like to talk about it?</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <Button 
                onClick={resetScan}
                className="w-full bg-emotionBlue hover:bg-emotionBlue-dark text-white"
              >
                Scan Again
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Controls */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={toggleCamera}
          variant={cameraActive ? "default" : "outline"}
          className={cn(
            "flex items-center justify-center h-14 rounded-xl",
            cameraActive && "bg-emotionBlue hover:bg-emotionBlue-dark text-white"
          )}
        >
          <Camera className="mr-2 h-5 w-5" />
          <span>{cameraActive ? "Camera On" : "Enable Camera"}</span>
        </Button>
        
        <Button
          onClick={toggleMic}
          variant={micActive ? "default" : "outline"}
          className={cn(
            "flex items-center justify-center h-14 rounded-xl",
            micActive && "bg-emotionTeal hover:bg-emotionTeal-dark text-white"
          )}
        >
          <Mic className="mr-2 h-5 w-5" />
          <span>{micActive ? "Mic On" : "Enable Mic"}</span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          onClick={startScan}
          disabled={recording || !cameraActive || !micActive}
          className="w-full h-14 text-lg font-medium rounded-xl bg-gradient-to-r from-emotionBlue to-emotionTeal hover:opacity-90 text-white"
        >
          {recording ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            "Start Emotion Scan"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default EmotionScan;
