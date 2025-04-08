
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Bell, Brain } from "lucide-react";
import { toast } from "sonner";

interface MeditationTrackerProps {
  date: Date;
}

// Simple in-memory storage for demo purposes
const meditationDataStore: Record<string, { minutes: number; completed: boolean; reminderTime?: string }> = {};

export const MeditationTracker = ({ date }: MeditationTrackerProps) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const [meditationMinutes, setMeditationMinutes] = useState(10);
  const [reminderTime, setReminderTime] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Load saved data when date changes
  useEffect(() => {
    const savedData = meditationDataStore[dateKey];
    if (savedData) {
      setMeditationMinutes(savedData.minutes);
      setReminderTime(savedData.reminderTime || "");
      setHasReminder(Boolean(savedData.reminderTime));
      setIsSaved(true);
    } else {
      setMeditationMinutes(10);
      setReminderTime("");
      setHasReminder(false);
      setIsSaved(false);
    }
  }, [dateKey]);
  
  const saveMeditationData = () => {
    meditationDataStore[dateKey] = { 
      minutes: meditationMinutes, 
      completed: true,
      reminderTime: hasReminder ? reminderTime : undefined
    };
    setIsSaved(true);
    
    if (hasReminder && reminderTime) {
      // In a real app, this would set a system notification
      // For demo, we'll just show a toast
      toast.success(`Meditation reminder set for ${reminderTime}`);
    }
    
    toast.success("Meditation data saved successfully");
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
      >
        {isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Update Meditation Data
          </>
        ) : (
          "Save Meditation Data"
        )}
      </Button>
    </div>
  );
};
