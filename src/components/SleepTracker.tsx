
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface SleepTrackerProps {
  date: Date;
}

// Simple in-memory storage for demo purposes
const sleepDataStore: Record<string, { hours: number; quality: number }> = {};

export const SleepTracker = ({ date }: SleepTrackerProps) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [isSaved, setIsSaved] = useState(false);
  
  // Load saved data when date changes
  useEffect(() => {
    const savedData = sleepDataStore[dateKey];
    if (savedData) {
      setSleepHours(savedData.hours);
      setSleepQuality(savedData.quality);
      setIsSaved(true);
    } else {
      setSleepHours(7);
      setSleepQuality(3);
      setIsSaved(false);
    }
  }, [dateKey]);
  
  const saveSleepData = () => {
    sleepDataStore[dateKey] = { hours: sleepHours, quality: sleepQuality };
    setIsSaved(true);
    toast.success("Sleep data saved successfully");
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
        className="w-full bg-emotionPurple hover:bg-emotionPurple/90"
      >
        {isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Update Sleep Data
          </>
        ) : (
          "Save Sleep Data"
        )}
      </Button>
    </div>
  );
};
