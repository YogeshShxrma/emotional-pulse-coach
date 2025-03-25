
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Pie, 
  Cell 
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const moodData = [
  { name: 'Mon', happy: 8, anxious: 3, sad: 2 },
  { name: 'Tue', happy: 5, anxious: 6, sad: 4 },
  { name: 'Wed', happy: 7, anxious: 4, sad: 1 },
  { name: 'Thu', happy: 6, anxious: 5, sad: 3 },
  { name: 'Fri', happy: 9, anxious: 2, sad: 1 },
  { name: 'Sat', happy: 8, anxious: 3, sad: 2 },
  { name: 'Sun', happy: 7, anxious: 4, sad: 3 },
];

const emotionDistribution = [
  { name: 'Happy', value: 52 },
  { name: 'Calm', value: 18 },
  { name: 'Anxious', value: 12 },
  { name: 'Sad', value: 8 },
  { name: 'Angry', value: 10 },
];

const sleepData = [
  { date: 'Mon', hours: 6.5 },
  { date: 'Tue', hours: 7.2 },
  { date: 'Wed', hours: 6.8 },
  { date: 'Thu', hours: 8.1 },
  { date: 'Fri', hours: 7.5 },
  { date: 'Sat', hours: 8.5 },
  { date: 'Sun', hours: 7.7 },
];

const MoodTracker = () => {
  const [currentWeek, setCurrentWeek] = useState("May 1 - May 7, 2023");
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-emotionBlue" />
              <span className="text-sm font-medium">{currentWeek}</span>
            </div>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Overview</CardTitle>
              <CardDescription>Track your emotional patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="happy" fill="#4ECDC4" name="Happy" />
                    <Bar dataKey="anxious" fill="#FFD166" name="Anxious" />
                    <Bar dataKey="sad" fill="#6A7FDB" name="Sad" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emotion Distribution</CardTitle>
              <CardDescription>Breakdown of your emotional states</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sleep Patterns</CardTitle>
              <CardDescription>Hours of sleep each night</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }} 
                    />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Visualize your emotional patterns over the past month</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-500">
                  <Info className="h-8 w-8 mx-auto mb-2" />
                  Monthly data visualization coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Emotional Insights</CardTitle>
              <CardDescription>AI-powered observations based on your mood data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Pattern Recognition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You tend to experience more positive emotions on weekends. Consider incorporating weekend activities into your weekday routine.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Sleep Correlation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your mood score is 28% higher on days when you get 7+ hours of sleep. Prioritizing sleep may improve your emotional well-being.
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Recommendation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Try practicing mindfulness techniques before bed to improve sleep quality and reduce anxiety levels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MoodTracker;
