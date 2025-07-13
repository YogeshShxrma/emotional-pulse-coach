
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Bell, Brain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MeditationTrackerProps {
  date: Date;
}

export const MeditationTracker = ({ date }: MeditationTrackerProps) => {
  const { user } = useAuth();
  const dateKey = format(date, "yyyy-MM-dd");
  const [meditationMinutes, setMeditationMinutes] = useState(10);
  const [reminderTime, setReminderTime] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load saved data when date changes
  useEffect(() => {
    if (user) {
      loadMeditationData();
    }
  }, [dateKey, user]);

  const loadMeditationData = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const meditationData = JSON.parse(data.notes || '{}');
        setMeditationMinutes(meditationData.meditation_minutes || 10);
        setReminderTime(meditationData.reminder_time || "");
        setHasReminder(Boolean(meditationData.reminder_time));
        setIsSaved(true);
      } else {
        setMeditationMinutes(10);
        setReminderTime("");
        setHasReminder(false);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error loading meditation data:', error);
    }
  };
  
  const saveMeditationData = async () => {
    setLoading(true);
    try {
      const meditationData = { 
        meditation_minutes: meditationMinutes, 
        meditation_completed: true,
        reminder_time: hasReminder ? reminderTime : undefined
      };

      const { data: existingData } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (existingData) {
        const existingNotes = JSON.parse(existingData.notes || '{}');
        const updatedNotes = { ...existingNotes, ...meditationData };
        
        const { error } = await supabase
          .from("daily_checkins")
          .update({ notes: JSON.stringify(updatedNotes) })
          .eq("user_id", user?.id)
          .eq("date", dateKey);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("daily_checkins")
          .insert({
            user_id: user?.id,
            date: dateKey,
            status: "okay",
            notes: JSON.stringify(meditationData)
          });

        if (error) throw error;
      }

      setIsSaved(true);
      
      if (hasReminder && reminderTime) {
        toast.success(`Meditation reminder set for ${reminderTime}`);
      }
      
      toast.success("Meditation data saved successfully");
    } catch (error) {
      console.error('Error saving meditation data:', error);
      toast.error("Failed to save meditation data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReminderToggle = () => {
    setHasReminder(!hasReminder);
  };
  
  const getDurationLabel = (minutes: number) => {
    if (minutes < 5) return "Quick session";
    if (minutes < 15) return "Short session";
    if (minutes < 30) return "Medium session";
    return "Long session";
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="meditation-minutes">Meditation Duration: {meditationMinutes} minutes</Label>
          <span className="text-sm text-gray-500">{getDurationLabel(meditationMinutes)}</span>
        </div>
        <Slider
          id="meditation-minutes"
          min={1}
          max={60}
          step={1}
          value={[meditationMinutes]}
          onValueChange={(value) => setMeditationMinutes(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1m</span>
          <span>15m</span>
          <span>30m</span>
          <span>60m</span>
        </div>
      </div>
      
      <div className="space-y-2 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <Label htmlFor="reminder-toggle" className="flex items-center gap-2 cursor-pointer">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Set Reminder</span>
          </Label>
          <Button 
            variant="outline" 
            size="sm" 
            className={hasReminder ? "bg-amber-100 dark:bg-amber-900/30" : ""}
            onClick={handleReminderToggle}
          >
            {hasReminder ? "Remove Reminder" : "Add Reminder"}
          </Button>
        </div>
        
        {hasReminder && (
          <div className="mt-3 space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              You'll receive a notification at this time to meditate
            </p>
          </div>
        )}
      </div>
      
      <Button 
        onClick={saveMeditationData}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        disabled={loading}
      >
        {loading ? (
          "Saving..."
        ) : isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Update Meditation
          </>
        ) : (
          "Save Meditation"
        )}
      </Button>
    </div>
  );
};
