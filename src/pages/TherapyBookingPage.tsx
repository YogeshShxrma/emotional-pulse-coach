import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Star, Video, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  specialty?: string;
  bio?: string;
}

const TherapyBookingPage = () => {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<"video" | "phone" | "chat">("video");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "therapist");

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast({
        title: "Error",
        description: "Failed to load therapists",
        variant: "destructive",
      });
    }
  };

  const bookSession = async () => {
    if (!selectedTherapist || !selectedDate || !selectedTime || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sessionDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const { error } = await supabase
        .from("therapy_sessions")
        .insert({
          user_id: user.id,
          therapist_id: selectedTherapist,
          session_date: sessionDateTime.toISOString(),
          session_type: sessionType,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Session Booked!",
        description: "Your therapy session has been scheduled. The therapist will confirm shortly.",
      });

      // Reset form
      setSelectedTherapist(null);
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Booking Failed",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  const sessionTypes = [
    { value: "video", label: "Video Call", icon: Video },
    { value: "phone", label: "Phone Call", icon: Phone },
    { value: "chat", label: "Text Chat", icon: MessageSquare }
  ];

  return (
    <div className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Book Therapy Session</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Connect with licensed therapists for personalized mental health support
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Therapist Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-emotionBlue" />
              Choose Your Therapist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTherapist === therapist.id
                      ? "border-emotionBlue bg-emotionBlue/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTherapist(therapist.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={therapist.avatar_url} />
                      <AvatarFallback>
                        {therapist.first_name[0]}{therapist.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Dr. {therapist.first_name} {therapist.last_name}
                      </h3>
                      {therapist.specialty && (
                        <Badge variant="secondary" className="mb-2">
                          {therapist.specialty}
                        </Badge>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {therapist.bio || "Experienced therapist dedicated to helping you achieve mental wellness."}
                      </p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.8 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Session Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {sessionTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={sessionType === type.value ? "default" : "outline"}
                  className="flex flex-col h-16 space-y-1"
                  onClick={() => setSessionType(type.value as any)}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-emotionTeal" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emotionGreen" />
                Select Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary & Confirm */}
        {selectedTherapist && selectedDate && selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p><strong>Therapist:</strong> Dr. {therapists.find(t => t.id === selectedTherapist)?.first_name} {therapists.find(t => t.id === selectedTherapist)?.last_name}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Session Type:</strong> {sessionTypes.find(t => t.value === sessionType)?.label}</p>
                <p><strong>Duration:</strong> 50 minutes</p>
                <p><strong>Price:</strong> $120</p>
              </div>
              
              <Button 
                onClick={bookSession} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TherapyBookingPage;