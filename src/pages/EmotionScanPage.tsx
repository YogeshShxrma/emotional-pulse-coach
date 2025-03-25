
import { motion } from "framer-motion";
import EmotionScan from "@/components/EmotionScan";

const EmotionScanPage = () => {
  return (
    <div className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Emotion Scanner</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Analyze your facial expressions and voice to understand your emotional state
        </p>
      </motion.div>
      
      <div className="flex justify-center">
        <EmotionScan />
      </div>
    </div>
  );
};

export default EmotionScanPage;
