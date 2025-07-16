
import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Camera, MessageCircle, BarChart3, Settings, AlertCircle, Clock, Users } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background mobile-safe-area">
      <main className="flex-1 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto mobile-container py-4 sm:py-6 relative min-h-[calc(100vh-5rem)] pb-20">
          {/* Emergency Button - Repositioned to right side */}
          {isEmerging && (
            <motion.div 
              className="fixed right-4 sm:right-6 bottom-24 sm:bottom-20 z-40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <button 
                className="mobile-touch-target flex flex-col items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-emotionRed text-white shadow-lg hover:scale-105 transition-transform"
                onClick={() => alert("Emergency contact alerted")}
              >
                <AlertCircle className="w-7 h-7 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          )}
          <Outlet />
        </div>
      </main>
      
      {/* Navigation Bar - Mobile optimized */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-border z-50 mobile-safe-area"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-6 py-2 px-2">
            <NavItem to="/scan" label="Scan" icon={Camera} isActive={location.pathname === "/scan"} />
            <NavItem to="/chat" label="Chat" icon={MessageCircle} isActive={location.pathname === "/chat"} />
            <NavItem to="/therapy" label="Therapy" icon={Users} isActive={location.pathname === "/therapy"} />
            <NavItem to="/daily-check-in" label="Check-In" icon={Clock} isActive={location.pathname === "/daily-check-in"} />
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
        "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 mobile-touch-target",
        isActive 
          ? "text-emotionBlue dark:text-emotionBlue-light" 
          : "text-gray-500 dark:text-gray-400"
      )}
    >
      {({ isActive }) => (
        <>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200",
            isActive 
              ? "bg-emotionBlue-light dark:bg-emotionBlue-dark/20" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}>
            <Icon className={cn(
              "w-5 h-5 sm:w-4 sm:h-4",
              isActive && "text-emotionBlue dark:text-emotionBlue-light"
            )} />
          </div>
          <span className="text-xs mt-1 font-medium text-center leading-tight">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default Layout;
