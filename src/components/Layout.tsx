
import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Camera, MessageCircle, BarChart3, Settings, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  const [isEmerging, setIsEmerging] = useState(false);
  
  useEffect(() => {
    // Simulate an emergency after 10 seconds for demo purposes
    const timer = setTimeout(() => {
      setIsEmerging(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-hidden">
        <div className="container max-w-screen-xl mx-auto py-4 px-4 sm:px-6 relative min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
      
      {/* Navigation Bar */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md rounded-t-xl z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center py-2">
            <NavItem to="/scan" label="Scan" icon={Camera} isActive={location.pathname === "/scan"} />
            <NavItem to="/chat" label="Chat" icon={MessageCircle} isActive={location.pathname === "/chat"} />
            <NavItem to="/daily-check-in" label="Check-In" icon={Clock} isActive={location.pathname === "/daily-check-in"} />
            
            {/* Emergency Button */}
            {isEmerging && (
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <button 
                  className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-emotionRed text-white absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-lg"
                  onClick={() => alert("Emergency contact alerted")}
                >
                  <AlertCircle className="w-7 h-7" />
                </button>
              </motion.div>
            )}
            
            <NavItem to="/mood" label="Mood" icon={BarChart3} isActive={location.pathname === "/mood"} />
            <NavItem to="/settings" label="Settings" icon={Settings} isActive={location.pathname === "/settings"} />
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

const NavItem = ({ to, label, icon: Icon, isActive }: { to: string; label: string; icon: any; isActive: boolean }) => {
  return (
    <NavLink 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200",
        isActive 
          ? "text-emotionBlue dark:text-emotionBlue-light" 
          : "text-gray-500 dark:text-gray-400"
      )}
    >
      {({ isActive }) => (
        <>
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
            isActive 
              ? "bg-emotionBlue-light dark:bg-emotionBlue-dark/20" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              isActive && "text-emotionBlue dark:text-emotionBlue-light"
            )} />
          </div>
          <span className="text-xs mt-1 font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default Layout;
