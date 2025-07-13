
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Droplet, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WaterTrackerProps {
  date: Date;
}

// Constants
const GLASSES_TARGET = 8;
const GLASS_SIZE_ML = 250;

export const WaterTracker = ({ date }: WaterTrackerProps) => {
  const { user } = useAuth();
  const dateKey = format(date, "yyyy-MM-dd");
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load saved data when date changes
  useEffect(() => {
    if (user) {
      loadWaterData();
    }
  }, [dateKey, user]);

  const loadWaterData = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const waterData = JSON.parse(data.notes || '{}');
        setWaterGlasses(waterData.water_glasses || 0);
        setIsSaved(true);
      } else {
        setWaterGlasses(0);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };
  
  const saveWaterData = async () => {
    setLoading(true);
    try {
      const waterData = { water_glasses: waterGlasses };

      const { data: existingData } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", dateKey)
        .single();

      if (existingData) {
        const existingNotes = JSON.parse(existingData.notes || '{}');
        const updatedNotes = { ...existingNotes, ...waterData };
        
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
            notes: JSON.stringify(waterData)
          });

        if (error) throw error;
      }

      setIsSaved(true);
      toast.success("Water intake saved successfully");
    } catch (error) {
      console.error('Error saving water data:', error);
      toast.error("Failed to save water data");
    } finally {
      setLoading(false);
    }
  };
  
  const incrementGlasses = () => {
    if (waterGlasses < GLASSES_TARGET * 1.5) {
      setWaterGlasses(prevGlasses => prevGlasses + 1);
    }
  };
  
  const decrementGlasses = () => {
    if (waterGlasses > 0) {
      setWaterGlasses(prevGlasses => prevGlasses - 1);
    }
  };
  
  const progressPercentage = (waterGlasses / GLASSES_TARGET) * 100;
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-emotionBlue mb-2">
            <Droplet className="h-6 w-6 text-emotionBlue" />
            <span>{waterGlasses} / {GLASSES_TARGET} glasses</span>
          </div>
          <p className="text-sm text-gray-500">
            {waterGlasses * GLASS_SIZE_ML} ml of {GLASSES_TARGET * GLASS_SIZE_ML} ml target
          </p>
        </div>
        
        <Progress value={progressPercentage > 100 ? 100 : progressPercentage} className="h-3" />
        
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {progressPercentage >= 100 
              ? "🎉 Target reached!" 
              : `${Math.round(progressPercentage)}% of daily target`}
          </p>
          {progressPercentage > 100 && (
            <p className="text-xs text-green-600">
              +{waterGlasses - GLASSES_TARGET} extra glasses
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-4 py-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decrementGlasses}
            disabled={waterGlasses <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex items-end space-x-1 min-w-[100px] justify-center">
            {[...Array(Math.min(8, waterGlasses))].map((_, i) => (
              <div 
                key={i} 
                className="w-2 bg-blue-400 rounded-t-sm" 
                style={{ 
                  height: `${20 + (i * 4)}px`,
                  opacity: 0.7 + (i * 0.04)
                }}
              />
            ))}
            {waterGlasses === 0 && (
              <p className="text-sm text-gray-400">No water yet</p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={incrementGlasses}
            disabled={waterGlasses >= GLASSES_TARGET * 1.5}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={saveWaterData}
        className="w-full bg-emotionBlue hover:bg-emotionBlue/90"
        disabled={loading}
      >
        {loading ? (
          "Saving..."
        ) : isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Update Water Intake
          </>
        ) : (
          "Save Water Intake"
        )}
      </Button>
    </div>
  );
};
