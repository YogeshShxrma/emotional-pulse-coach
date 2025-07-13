
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Moon, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SleepTrackerProps {
  date: Date;
}

export const SleepTracker = ({ date }: SleepTrackerProps) => {
  const { user } = useAuth();
  const dateKey = format(date, "yyyy-MM-dd");
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load saved data when date changes
  useEffect(() => {
    if (user) {
      loadSleepData();
    }
  }, [dateKey, user]);

  const loadSleepData = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      if (data) {
        // Parse sleep data from notes if stored there, or add sleep_hours column later
        const sleepData = JSON.parse(data.notes || '{}');
        setSleepHours(sleepData.sleep_hours || 7);
        setSleepQuality(sleepData.sleep_quality || 3);
        setIsSaved(true);
      } else {
        setSleepHours(7);
        setSleepQuality(3);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
    }
  };
  
  const saveSleepData = async () => {
    setLoading(true);
    try {
      const sleepData = {
        sleep_hours: sleepHours,
        sleep_quality: sleepQuality
      };

      const { data: existingData } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (existingData) {
        // Update existing record
        const existingNotes = JSON.parse(existingData.notes || '{}');
        const updatedNotes = { ...existingNotes, ...sleepData };
        
        const { error } = await supabase
          .from("daily_checkins")
          .update({ notes: JSON.stringify(updatedNotes) })
          .eq("user_id", user?.id)
          .eq("date", dateKey);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from("daily_checkins")
          .insert({
            user_id: user?.id,
            date: dateKey,
            status: "okay",
            notes: JSON.stringify(sleepData)
          });

        if (error) throw error;
      }

      setIsSaved(true);
      toast.success("Sleep data saved successfully");
    } catch (error) {
      console.error('Error saving sleep data:', error);
      toast.error("Failed to save sleep data");
    } finally {
      setLoading(false);
    }
  };
  
  const getQualityLabel = (quality: number) => {
    switch (quality) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Good";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2 text-2xl font-bold text-blue-400 mb-2">
          <Moon className="h-6 w-6 text-blue-400" />
          <span>{sleepHours} hours of sleep</span>
        </div>
        <p className="text-sm text-gray-500">
          {sleepHours < 7 ? "Below recommended range (7-9 hours)" : "Within recommended range (7-9 hours)"}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="sleep-hours">Hours of Sleep: {sleepHours}</Label>
          <span className="text-sm text-gray-500">{sleepHours < 7 ? "Below recommended" : "Recommended"}</span>
        </div>
        <Slider
          id="sleep-hours"
          min={0}
          max={12}
          step={0.5}
          value={[sleepHours]}
          onValueChange={(value) => setSleepHours(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0h</span>
          <span>4h</span>
          <span>8h</span>
          <span>12h</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="sleep-quality">Sleep Quality: {getQualityLabel(sleepQuality)}</Label>
        </div>
        <Slider
          id="sleep-quality"
          min={1}
          max={5}
          step={1}
          value={[sleepQuality]}
          onValueChange={(value) => setSleepQuality(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Very Good</span>
          <span>Excellent</span>
        </div>
      </div>
      
      <Button 
        onClick={saveSleepData}
        className="w-full bg-blue-600 hover:bg-blue-700"
        type="button"
        disabled={loading}
      >
        {loading ? (
          "Saving..."
        ) : isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Update Sleep Hours
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Sleep Hours
          </>
        )}
      </Button>
    </div>
  );
};
