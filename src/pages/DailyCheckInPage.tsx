
import { motion } from "framer-motion";
import DailyRoutineTracker from "@/components/DailyRoutineTracker";

const DailyCheckInPage = () => {
  return (
    <div className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Daily Check-In</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Track your daily habits and routines to improve your overall well-being
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-4 text-sm">
          <div className="px-3 py-1 bg-emotionPurple/10 rounded-full text-emotionPurple">Sleep tracking</div>
          <div className="px-3 py-1 bg-emotionBlue/10 rounded-full text-emotionBlue">Hydration tracking</div>
          <div className="px-3 py-1 bg-amber-500/10 rounded-full text-amber-600">Meditation reminders</div>
        </div>
      </motion.div>
      
      <div className="flex justify-center">
        <DailyRoutineTracker />
      </div>
    </div>
  );
};

export default DailyCheckInPage;
