import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TherapySession {
  id: string;
  user_id: string;
  session_date: string;
  session_type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  profiles: {
    first_name?: string;
    last_name?: string;
  };
}

const TherapistDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .select(`
          *,
          profiles!therapy_sessions_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq("therapist_id", user?.id)
        .order("session_date", { ascending: true });

      if (error) throw error;
      setSessions(data as any || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from("therapy_sessions")
        .update({ status })
        .eq("id", sessionId);

      if (error) throw error;

      setSessions(sessions.map(session => 
        session.id === sessionId ? { ...session, status } : session
      ));

      toast({
        title: "Session updated",
        description: `Session ${status} successfully`,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const upcomingSessions = sessions.filter(s => s.status === 'confirmed' && new Date(s.session_date) > new Date());
  const completedSessions = sessions.filter(s => s.status === 'completed');

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Therapist Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your therapy sessions and patient interactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">{pendingSessions.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                  <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Sessions</p>
                  <p className="text-2xl font-bold">{completedSessions.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{new Set(sessions.map(s => s.user_id)).size}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Session Requests</CardTitle>
              <CardDescription>
                Review and respond to new therapy session requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">
                      {session.profiles?.first_name} {session.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.session_date), "PPP 'at' p")}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {session.session_type} session
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateSessionStatus(session.id, 'confirmed')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSessionStatus(session.id, 'cancelled')}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>
              Complete overview of your therapy sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No sessions scheduled yet
              </p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">
                        {session.profiles?.first_name} {session.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.session_date), "PPP 'at' p")}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {session.session_type} session
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} text-white`}>
                      {session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TherapistDashboard;