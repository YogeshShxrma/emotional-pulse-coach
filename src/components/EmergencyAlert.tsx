
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Check, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyAlert = ({ isOpen, onClose }: EmergencyAlertProps) => {
  const [contactSelected, setContactSelected] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  
  const emergencyContacts = [
    { id: "1", name: "Sarah Johnson", relation: "Therapist", phone: "(555) 123-4567" },
    { id: "2", name: "Michael Chen", relation: "Friend", phone: "(555) 987-6543" },
    { id: "3", name: "Crisis Helpline", relation: "Support Service", phone: "1-800-273-8255" },
  ];
  
  const handleSendAlert = () => {
    if (!contactSelected) return;
    
    // In a real app, this would send the alert
    setAlertSent(true);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      // Reset state after closing
      setTimeout(() => {
        setAlertSent(false);
        setContactSelected(null);
      }, 300);
    }, 2000);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-emotionRed p-4 text-white flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Emergency Alert</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {!alertSent ? (
                <>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We've detected signs of distress. Would you like to notify one of your emergency contacts?
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={cn(
                          "p-3 rounded-lg border transition-colors cursor-pointer",
                          contactSelected === contact.id
                            ? "border-emotionRed bg-emotionRed-light dark:bg-emotionRed-dark/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-emotionRed"
                        )}
                        onClick={() => setContactSelected(contact.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{contact.relation}</p>
                            <p className="text-sm mt-1">{contact.phone}</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center",
                            contactSelected === contact.id
                              ? "border-emotionRed bg-emotionRed text-white"
                              : "border-gray-300 dark:border-gray-600"
                          )}>
                            {contactSelected === contact.id && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      I'm OK
                    </Button>
                    <Button
                      onClick={handleSendAlert}
                      disabled={!contactSelected}
                      className="flex-1 bg-emotionRed hover:bg-emotionRed-dark text-white"
                    >
                      Send Alert
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Alert Sent</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your emergency contact has been notified.
                  </p>
                </div>
              )}
            </div>
            
            {/* Quick actions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-12"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Helpline</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-12"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Crisis Chat</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlert;
