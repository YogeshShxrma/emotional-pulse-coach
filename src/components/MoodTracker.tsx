
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, LineChart, Pie } from "recharts";
import { 
  Calendar, 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Clock,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock data for charts
const weeklyData = [
  { day: "Mon", happy: 70, sad: 20, angry: 10, neutral: 60 },
  { day: "Tue", happy: 60, sad: 30, angry: 10, neutral: 70 },
  { day: "Wed", happy: 40, sad: 40, angry: 20, neutral: 50 },
  { day: "Thu", happy: 30, sad: 50, angry: 20, neutral: 40 },
  { day: "Fri", happy: 50, sad: 30, angry: 20, neutral: 60 },
  { day: "Sat", happy: 80, sad: 10, angry: 10, neutral: 70 },
  { day: "Sun", happy: 75, sad: 15, angry: 10, neutral: 65 },
];

const monthlyData = [
  { name: "Happy", value: 60, color: "#6FCF97" },
  { name: "Sad", value: 20, color: "#2D9CDB" },
  { name: "Angry", value: 10, color: "#EB5757" },
  { name: "Anxious", value: 10, color: "#F2C94C" },
];

const hourlyData = [
  { time: "6am", level: 3 },
  { time: "9am", level: 5 },
  { time: "12pm", level: 7 },
  { time: "3pm", level: 4 },
  { time: "6pm", level: 6 },
  { time: "9pm", level: 8 },
];

// Recent mood entries
const recentMoods = [
  { id: 1, mood: "Happy", time: "Today, 2:30 PM", note: "Finished a project at work", icon: "😊" },
  { id: 2, mood: "Anxious", time: "Today, 11:15 AM", note: "Before team meeting", icon: "😰" },
  { id: 3, mood: "Calm", time: "Yesterday, 8:45 PM", note: "After evening meditation", icon: "😌" },
  { id: 4, mood: "Sad", time: "Yesterday, 4:20 PM", note: "Received disappointing news", icon: "😔" },
];

// Insights based on mood data
const insights = [
  "You tend to feel happiest on Saturday mornings",
  "Your mood typically dips on Wednesday afternoons",
  "Evening meditation appears to improve your mood",
  "You often report feeling anxious before meetings"
];

const MoodTracker = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-sm">
              <BarChartIcon className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm">
              <Info className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChartIcon className="w-4 h-4 mr-2 text-emotionBlue" />
                    Weekly Mood
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <BarChart
                    width={300}
                    height={200}
                    data={weeklyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <Bar dataKey="happy" fill="#6FCF97" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sad" fill="#2D9CDB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="angry" fill="#EB5757" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </BarChart>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PieChartIcon className="w-4 h-4 mr-2 text-emotionTeal" />
                    Emotion Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <PieChart width={300} height={200}>
                    <Pie
                      data={monthlyData}
                      cx={150}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label
                    >
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-4">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <LineChartIcon className="w-4 h-4 mr-2 text-emotionGreen" />
                  Daily Mood Fluctuation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <LineChart
                  width={630}
                  height={200}
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#43B8B2" 
                    strokeWidth={3}
                    dot={{ stroke: '#43B8B2', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ stroke: '#43B8B2', strokeWidth: 2, r: 6, fill: '#43B8B2' }}
                  />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                </LineChart>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-emotionYellow" />
                  Recent Mood Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="divide-y dark:divide-gray-700">
                  {recentMoods.map((entry) => (
                    <div key={entry.id} className="py-3 flex items-center">
                      <div className="text-3xl mr-3">{entry.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{entry.mood}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.time}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Mood Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Mood calendar visualization coming soon</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Track your daily moods over time</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Your Mood Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-emotionTeal-light dark:bg-emotionTeal-dark/20 flex items-center justify-center mr-3 mt-0.5">
                        <Info className="w-4 h-4 text-emotionTeal" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-6 p-4 bg-emotionBlue-light dark:bg-emotionBlue-dark/20 rounded-lg">
                  <h4 className="font-medium text-emotionBlue-dark dark:text-emotionBlue-light mb-2">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Based on your patterns, consider practicing meditation in the evenings and preparing more thoroughly for meetings to reduce anxiety.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MoodTracker;
