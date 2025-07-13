
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Info,
  Plus,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface MoodEntry {
  id: string;
  mood: string;
  notes?: string;
  sleep_hours?: number;
  anxiety_level?: number;
  stress_level?: number;
  created_at: string;
}

const MoodTracker = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState("May 1 - May 7, 2023");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Chart data states
  const [weeklyMoodData, setWeeklyMoodData] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);
  const [sleepData, setSleepData] = useState<any[]>([]);
  
  // Form state
  const [mood, setMood] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState('');
  const [stressLevel, setStressLevel] = useState('');

  useEffect(() => {
    if (user) {
      loadMoodEntries();
      loadChartData();
    }
  }, [user]);

  const loadMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_tracker')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const loadChartData = async () => {
    try {
      // Get last 7 days of data for weekly view
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      
      const { data: weekData, error: weekError } = await supabase
        .from('mood_tracker')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (weekError) throw weekError;

      // Process weekly mood data
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = dayNames[date.getDay()];
        
        const dayEntries = weekData?.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate.toDateString() === date.toDateString();
        }) || [];

        const moodCounts = {
          happy: dayEntries.filter(e => ['happy', 'very_happy'].includes(e.mood)).length,
          anxious: dayEntries.reduce((sum, e) => sum + (e.anxiety_level || 0), 0) / (dayEntries.length || 1),
          sad: dayEntries.filter(e => ['sad', 'very_sad'].includes(e.mood)).length,
        };

        weeklyData.push({
          name: dayName,
          ...moodCounts
        });
      }
      setWeeklyMoodData(weeklyData);

      // Process emotion distribution
      const allMoods = weekData?.map(entry => entry.mood) || [];
      const moodCounts = allMoods.reduce((acc: any, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      const emotionDist = Object.entries(moodCounts).map(([mood, count]) => ({
        name: mood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count as number
      }));
      setEmotionDistribution(emotionDist);

      // Process sleep data
      const sleepInfo = weeklyData.map((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        
        const dayEntries = weekData?.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate.toDateString() === date.toDateString();
        }) || [];

        const avgSleep = dayEntries.length > 0 
          ? dayEntries.reduce((sum, e) => sum + (e.sleep_hours || 0), 0) / dayEntries.length
          : 0;

        return {
          date: day.name,
          hours: avgSleep
        };
      });
      setSleepData(sleepInfo);

    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const handleSubmitMood = async () => {
    if (!mood) {
      toast({
        title: "Missing mood",
        description: "Please select your mood level",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mood_tracker')
        .insert({
          user_id: user?.id,
          mood: mood as any,
          notes: notes || null,
          sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
          anxiety_level: anxietyLevel ? parseInt(anxietyLevel) : null,
          stress_level: stressLevel ? parseInt(stressLevel) : null,
        });

      if (error) throw error;

      toast({
        title: "Mood entry saved!",
        description: "Your mood has been recorded successfully.",
      });

      // Reset form and close dialog
      setMood('');
      setNotes('');
      setSleepHours('');
      setAnxietyLevel('');
      setStressLevel('');
      setDialogOpen(false);
      
      // Reload entries and chart data
      await loadMoodEntries();
      await loadChartData();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (moodLevel: string) => {
    switch (moodLevel) {
      case 'very_happy': return '😄';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      case 'very_sad': return '😭';
      default: return '😐';
    }
  };

  const getMoodColor = (moodLevel: string) => {
    switch (moodLevel) {
      case 'very_happy': return 'text-green-600';
      case 'happy': return 'text-green-500';
      case 'neutral': return 'text-yellow-500';
      case 'sad': return 'text-orange-500';
      case 'very_sad': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
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
            <div className="flex gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Mood Entry</DialogTitle>
                    <DialogDescription>
                      Track your mood and emotional state
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mood">How are you feeling?</Label>
                      <Select value={mood} onValueChange={setMood}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_happy">😄 Very Happy</SelectItem>
                          <SelectItem value="happy">😊 Happy</SelectItem>
                          <SelectItem value="neutral">😐 Neutral</SelectItem>
                          <SelectItem value="sad">😢 Sad</SelectItem>
                          <SelectItem value="very_sad">😭 Very Sad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="How are you feeling? What's on your mind?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sleep">Sleep Hours</Label>
                        <Input
                          id="sleep"
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          placeholder="8.5"
                          value={sleepHours}
                          onChange={(e) => setSleepHours(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="anxiety">Anxiety Level (1-10)</Label>
                        <Input
                          id="anxiety"
                          type="number"
                          min="1"
                          max="10"
                          placeholder="5"
                          value={anxietyLevel}
                          onChange={(e) => setAnxietyLevel(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stress">Stress Level (1-10)</Label>
                      <Input
                        id="stress"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="5"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleSubmitMood} disabled={loading} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Entry"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recent Mood Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Mood Entries</CardTitle>
              <CardDescription>Your latest mood tracking entries</CardDescription>
            </CardHeader>
            <CardContent>
              {moodEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No mood entries yet</p>
                  <p className="text-sm text-muted-foreground">Start tracking your mood to see patterns</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moodEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className={`font-medium capitalize ${getMoodColor(entry.mood)}`}>
                            {entry.mood.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {entry.sleep_hours && <p>Sleep: {entry.sleep_hours}h</p>}
                        {entry.anxiety_level && <p>Anxiety: {entry.anxiety_level}/10</p>}
                        {entry.stress_level && <p>Stress: {entry.stress_level}/10</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Overview</CardTitle>
              <CardDescription>Track your emotional patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyMoodData.length > 0 ? weeklyMoodData : [
                    { name: 'Mon', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Tue', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Wed', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Thu', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Fri', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Sat', happy: 0, anxious: 0, sad: 0 },
                    { name: 'Sun', happy: 0, anxious: 0, sad: 0 }
                  ]}>
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
                      data={emotionDistribution.length > 0 ? emotionDistribution : [
                        { name: 'No Data', value: 1 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => emotionDistribution.length > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : 'No data yet'}
                    >
                      {(emotionDistribution.length > 0 ? emotionDistribution : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={emotionDistribution.length > 0 ? COLORS[index % COLORS.length] : '#e5e7eb'} />
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
                  <LineChart data={sleepData.length > 0 ? sleepData : [
                    { date: 'Mon', hours: 0 },
                    { date: 'Tue', hours: 0 },
                    { date: 'Wed', hours: 0 },
                    { date: 'Thu', hours: 0 },
                    { date: 'Fri', hours: 0 },
                    { date: 'Sat', hours: 0 },
                    { date: 'Sun', hours: 0 }
                  ]}>
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
