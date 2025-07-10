
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
import { Video, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Therapist {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  bio?: string;
  avatar_url?: string;
}

interface TherapySession {
  id: string;
  session_date: string;
  session_type: string;
  status: string;
  therapist: Therapist;
}

const SessionsContent = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      sessionType: "video",
    },
  });

  useEffect(() => {
    loadTherapists();
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  const loadTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'therapist');

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error loading therapists:', error);
    }
  };

  const loadUserSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          therapist:profiles!therapy_sessions_therapist_id_fkey (
            id,
            user_id,
            first_name,
            last_name,
            specialty,
            bio,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .order('session_date', { ascending: true });

      if (error) throw error;
      setSessions(data as any || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };
  
  const handleBookSession = async () => {
    if (!date || !selectedTherapist || !selectedTime) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date, therapist, and time slot.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create session date from selected date and time
      const sessionDateTime = new Date(date);
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
      sessionDateTime.setHours(hour24, minutes || 0, 0, 0);

      const { error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user?.id,
          therapist_id: selectedTherapist.user_id,
          session_date: sessionDateTime.toISOString(),
          session_type: form.getValues('sessionType'),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Session requested!",
        description: `Your session request with ${selectedTherapist.first_name} ${selectedTherapist.last_name} has been sent.`,
      });

      setSelectedTime(null);
      setSelectedTherapist(null);
      await loadUserSessions();
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-md border"
          />
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Session Type</h3>
            <Form {...form}>
              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Session Types</SelectLabel>
                          <SelectItem value="video">
                            <div className="flex items-center">
                              <Video className="mr-2 h-4 w-4" />
                              <span>Video Call</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="inperson">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>In Person</span>
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </Form>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Available Therapists</h2>
          <div className="space-y-4">
            {therapists.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No therapists available at the moment
              </p>
            ) : (
              therapists.map((therapist) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {therapist.first_name} {therapist.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {therapist.specialty || 'Licensed Therapist'}
                      </p>
                      {therapist.bio && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {therapist.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Times:</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          className={selectedTherapist?.id === therapist.id && selectedTime === time 
                            ? "bg-primary text-white" 
                            : ""}
                          onClick={() => {
                            setSelectedTherapist(therapist);
                            setSelectedTime(time);
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              onClick={handleBookSession}
              disabled={!selectedTherapist || !selectedTime || loading}
            >
              {loading ? "Booking..." : "Book Session"}
            </Button>
          </div>

          {/* User's Sessions */}
          {sessions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Sessions</h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {session.therapist.first_name} {session.therapist.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.session_date), "PPP 'at' p")}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {session.session_type} session
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsContent;
