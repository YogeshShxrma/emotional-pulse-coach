
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DailyRoutineTracker from "@/components/DailyRoutineTracker";
import { getMoodInsightsForCheckIn } from "@/utils/mentalStateAnalyzer";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

const DailyCheckInPage = () => {
  const { user } = useAuth();
  const [moodInsights, setMoodInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoodInsights();
    }
  }, [user]);

  const loadMoodInsights = async () => {
    try {
      const insights = await getMoodInsightsForCheckIn(user.id);
      setMoodInsights(insights);
    } catch (error) {
      console.error('Error loading mood insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'text-emerald-600 bg-emerald-50';
      case 'struggling':
        return 'text-amber-600 bg-amber-50';
      case 'needs support':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

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

      {/* AI-Powered Insights Card */}
      {!loading && moodInsights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-emotionTeal/5 to-emotionBlue/5 border-emotionTeal/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emotionTeal to-emotionBlue flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
                    {getTrendIcon(moodInsights.moodTrend)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(moodInsights.overallState)}`}>
                      {moodInsights.overallState}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {moodInsights.suggestion}
                  </p>
                  {moodInsights.preferredCoping && (
                    <p className="text-xs text-emotionTeal">
                      💡 Try: {moodInsights.preferredCoping}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <div className="flex justify-center">
        <DailyRoutineTracker />
      </div>
    </div>
  );
};

export default DailyCheckInPage;
