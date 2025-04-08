
import { useState } from "react";
import { motion } from "framer-motion";
import { format, subDays, addDays } from "date-fns";
import { Calendar, ArrowLeft, ArrowRight, Droplet, Clock, Meditation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SleepTracker } from "./SleepTracker";
import { WaterTracker } from "./WaterTracker";
import { MeditationTracker } from "./MeditationTracker";
import { toast } from "sonner";

const DailyRoutineTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  
  const goToPreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };
  
  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    if (nextDay <= new Date()) {
      setCurrentDate(nextDay);
    } else {
      toast.info("Cannot track future dates");
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-emotionBlue" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextDay}
              disabled={format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-emotionPurple" />
                Sleep Tracker
              </CardTitle>
              <CardDescription>Track your sleep duration and quality</CardDescription>
            </CardHeader>
            <CardContent>
              <SleepTracker date={currentDate} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplet className="mr-2 h-5 w-5 text-emotionBlue" />
                Water Intake
              </CardTitle>
              <CardDescription>Track your daily water consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <WaterTracker date={currentDate} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Meditation className="mr-2 h-5 w-5 text-amber-500" />
                Meditation Tracker
              </CardTitle>
              <CardDescription>Track your meditation time and set reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <MeditationTracker date={currentDate} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>View your past tracking data</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-500">
                  History view coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Wellness Insights</CardTitle>
              <CardDescription>AI-powered observations based on your tracking data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Sleep Pattern</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've averaged 7.2 hours of sleep over the past week, which is within the recommended range.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Hydration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're consistently reaching 80% of your daily water intake goal. Try to increase by one glass per day.
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Meditation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Regular meditation practice can help reduce stress and improve focus. Try to maintain consistency in your practice.
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Recommendation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set consistent bedtimes to improve sleep quality. Consider using a water tracking app to remind you to drink water throughout the day.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DailyRoutineTracker;
