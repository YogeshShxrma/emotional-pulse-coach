
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EmergencyAlert from "@/components/EmergencyAlert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { signOut, user, profile } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(true);
  const [biometricLoginEnabled, setBiometricLoginEnabled] = useState(false);
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [isEmergencyAlertOpen, setIsEmergencyAlertOpen] = useState(false);
  const [userStreaks, setUserStreaks] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      fetchUserStreaks();
    }
  }, [user]);

  const clearChatHistory = async () => {
    if (!user) return;
    
    try {
      // Delete all conversations
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.id);
      
      if (convError) throw convError;

      // Delete all chat sessions
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', user.id);
      
      if (sessionError) throw sessionError;

      // Delete all mental states
      const { error: stateError } = await supabase
        .from('user_mental_states')
        .delete()
        .eq('user_id', user.id);
      
      if (stateError) throw stateError;

      toast({
        title: "Chat History Cleared",
        description: "All your chat conversations have been deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast({
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchUserStreaks = async () => {
    try {
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setUserStreaks(data);
    } catch (error) {
      console.error("Error fetching user streaks:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real app, this would change the theme
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <div className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Customize your app experience and manage your account
        </p>
      </motion.div>
      
      <div className="max-w-xl mx-auto space-y-6">
        {/* User Profile & Streaks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="w-4 h-4 mr-2 text-emotionBlue" />
              Profile & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emotionBlue-light dark:bg-emotionBlue-dark/20 flex items-center justify-center">
                <User className="w-8 h-8 text-emotionBlue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {userStreaks && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-emotionGreen">{userStreaks.current_streak}</div>
                  <div className="text-xs text-gray-500">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-emotionBlue">{userStreaks.longest_streak}</div>
                  <div className="text-xs text-gray-500">Longest Streak</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-emotionTeal">{userStreaks.total_checkins}</div>
                  <div className="text-xs text-gray-500">Total Check-ins</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="w-4 h-4 mr-2 text-emotionBlue" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Profile</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Change your password</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Biometric Login</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use face or fingerprint for login</p>
              </div>
              <Switch 
                checked={biometricLoginEnabled} 
                onCheckedChange={setBiometricLoginEnabled} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-4 h-4 mr-2 text-emotionTeal" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">App Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reminders and insights</p>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Emergency Contacts</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alert trusted contacts in emergencies</p>
              </div>
              <Switch 
                checked={emergencyContactsEnabled} 
                onCheckedChange={setEmergencyContactsEnabled} 
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setIsEmergencyAlertOpen(true)}
            >
              Manage Emergency Contacts
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-4 h-4 mr-2 text-emotionGreen" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Data Collection</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow anonymous data to improve app</p>
              </div>
              <Switch 
                checked={dataCollectionEnabled} 
                onCheckedChange={setDataCollectionEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Clear Chat History</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delete all previous chat conversations</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearChatHistory}
              >
                Clear Chats
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Delete My Data</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remove all your personal data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              {theme === "light" ? (
                <Sun className="w-4 h-4 mr-2 text-emotionYellow" />
              ) : (
                <Moon className="w-4 h-4 mr-2 text-emotionBlue" />
              )}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
              </div>
              <Switch 
                checked={theme === "dark"} 
                onCheckedChange={toggleTheme} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-6" />
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center h-10 text-gray-700 dark:text-gray-300"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <EmergencyAlert 
        isOpen={isEmergencyAlertOpen}
        onClose={() => setIsEmergencyAlertOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
