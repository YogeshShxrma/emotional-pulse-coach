
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  available: string[];
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Clinical Psychology",
    location: "New York, USA",
    available: ["9:00 AM", "11:00 AM", "2:00 PM"],
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cognitive Behavioral Therapy",
    location: "Toronto, Canada",
    available: ["10:00 AM", "1:00 PM", "4:00 PM"],
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Anxiety & Depression",
    location: "London, UK",
    available: ["8:00 AM", "12:00 PM", "3:00 PM"],
    image: "https://randomuser.me/api/portraits/women/66.jpg"
  }
];

const SessionsContent = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      sessionType: "video",
    },
  });
  
  const handleBookSession = () => {
    if (!date || !selectedDoctor || !selectedTime) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date, doctor, and time slot.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Session booked!",
      description: `Your session with ${selectedDoctor.name} is scheduled for ${format(date, "MMMM d, yyyy")} at ${selectedTime}.`,
    });
    
    setSelectedTime(null);
  };

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
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{doctor.location}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Times:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.available.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        className={selectedDoctor?.id === doctor.id && selectedTime === time 
                          ? "bg-emotionBlue text-white" 
                          : ""}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setSelectedTime(time);
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full bg-emotionBlue hover:bg-emotionBlue-dark/90"
              onClick={handleBookSession}
              disabled={!selectedDoctor || !selectedTime}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsContent;
