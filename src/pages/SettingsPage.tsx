
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EmergencyAlert from "@/components/EmergencyAlert";

const SettingsPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(true);
  const [biometricLoginEnabled, setBiometricLoginEnabled] = useState(false);
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [isEmergencyAlertOpen, setIsEmergencyAlertOpen] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real app, this would change the theme
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
