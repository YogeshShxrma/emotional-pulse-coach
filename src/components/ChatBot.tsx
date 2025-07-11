import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotionalTone?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hi there! I'm Menti AI, your personal mental health companion. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling today?",
    isUser: false,
    timestamp: new Date(),
  },
];

const QUICK_REPLIES = [
  "I'm feeling anxious",
  "I want motivation", 
  "I need to vent",
  "Suggest a calming exercise"
];

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(1);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const { user, profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize session when component mounts
  useEffect(() => {
    if (user && !sessionId) {
      initializeSession();
    }
  }, [user]);

  const initializeSession = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Show typing animation for realism
    setTimeout(async () => {
      try {
        const context = profile ? `User ID: ${user?.id}. User is a ${profile.role}. Name: ${profile.first_name} ${profile.last_name}` : `User ID: ${user?.id}. No user context available`;

        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: textToSend,
            context: context,
            sessionId: sessionId,
            messageCount: messageCount
          }
        });

        if (error) throw error;

        // Check for crisis response
        if (data.isCrisis) {
          setShowCrisisAlert(true);
          setTimeout(() => setShowCrisisAlert(false), 10000); // Hide after 10 seconds
        }

        const botMessage: Message = {
          id: Date.now().toString(),
          text: data.response || "I'm here to help. Could you please rephrase your question?",
          isUser: false,
          timestamp: new Date(),
          emotionalTone: data.emotionalTone
        };

        setMessages((prev) => [...prev, botMessage]);
        setMessageCount(data.messageCount || messageCount + 1);

      } catch (error) {
        console.error('Error:', error);
        
        // Enhanced fallback responses based on emotional context
        const lowerCaseMessage = textToSend.toLowerCase();
        let response = "";

        if (lowerCaseMessage.includes("anxious") || lowerCaseMessage.includes("worried") || lowerCaseMessage.includes("panic")) {
          response = "I can hear that you're feeling anxious right now. That must be really uncomfortable. Let's try taking a moment to ground ourselves - can you name 5 things you can see around you right now?";
        } else if (lowerCaseMessage.includes("sad") || lowerCaseMessage.includes("depress") || lowerCaseMessage.includes("hopeless")) {
          response = "I'm so sorry you're feeling this way. Depression can make everything feel so heavy. You're not alone in this, and reaching out shows incredible strength. What's one small thing that used to bring you even a tiny bit of joy?";
        } else if (lowerCaseMessage.includes("angry") || lowerCaseMessage.includes("frustrated") || lowerCaseMessage.includes("mad")) {
          response = "It sounds like you're really frustrated right now, and that's completely valid. Sometimes anger is telling us something important. Can you help me understand what's been building up for you?";
        } else if (lowerCaseMessage.includes("stressed") || lowerCaseMessage.includes("overwhelm")) {
          response = "Feeling overwhelmed can be so draining. Let's take this one piece at a time - you don't have to carry it all at once. What feels like the most pressing thing on your mind right now?";
        } else if (lowerCaseMessage.includes("motivation")) {
          response = "I believe in your strength, even when you can't feel it. Sometimes motivation comes after we take action, not before. What's one tiny step you could take today, no matter how small?";
        } else if (lowerCaseMessage.includes("vent") || lowerCaseMessage.includes("talk")) {
          response = "I'm here to listen to whatever you need to share. This is your safe space - no judgment, just understanding. What's been weighing on your heart?";
        } else {
          response = "Thank you for sharing that with me. I can sense this is important to you. Can you tell me a bit more about how that's been affecting you? I'm here to listen and support you.";
        }

        const botMessage: Message = {
          id: Date.now().toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setMessageCount(prev => prev + 1);

        toast({
          title: "Connection Issue",
          description: "I'm using offline responses. Full features will return shortly.",
          variant: "default"
        });
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 2000); // Random typing delay for realism
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TypingIndicator = () => (
    <motion.div
      className="flex items-center mb-4 max-w-[80%]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="w-8 h-8 rounded-full bg-emotionTeal flex items-center justify-center text-white mr-2 flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none py-3 px-4">
        <div className="flex space-x-1">
          <motion.div 
            className="w-2 h-2 rounded-full bg-emotionTeal"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-emotionTeal"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-emotionTeal"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">
      {/* Crisis Alert */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Crisis Support Available:</strong> If you're in immediate danger, please call 911 or go to your nearest emergency room.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-lg mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emotionTeal to-emotionBlue flex items-center justify-center text-white mr-3 shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Menti AI</h3>
            <p className="text-xs text-emotionTeal dark:text-emotionTeal">
              Your mental health companion
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={cn(
                  "max-w-[85%]",
                  message.isUser ? "ml-auto" : "mr-auto"
                )}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className={cn("flex items-start", message.isUser ? "justify-end" : "justify-start")}>
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emotionTeal to-emotionBlue flex items-center justify-center text-white mr-2 mt-1 flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "rounded-2xl py-3 px-4 shadow-sm",
                        message.isUser
                          ? "bg-gradient-to-r from-emotionBlue to-blue-600 text-white rounded-tr-none"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-600"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <div className={cn(
                      "text-xs mt-1 px-2",
                      message.isUser ? "text-right text-blue-600 dark:text-blue-400" : "text-left text-gray-500 dark:text-gray-400"
                    )}>
                      {formatTime(message.timestamp)}
                      {message.emotionalTone && !message.isUser && (
                        <span className="ml-2 text-emotionTeal">• {message.emotionalTone}</span>
                      )}
                    </div>
                  </div>
                  
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emotionBlue to-blue-600 flex items-center justify-center text-white ml-2 mt-1 flex-shrink-0 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Buttons */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_REPLIES.map((reply, index) => (
              <motion.button
                key={index}
                onClick={() => handleSendMessage(reply)}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-emotionTeal hover:text-white transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTyping}
              >
                {reply}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <Input
              type="text"
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-full py-3 px-4 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-emotionTeal focus-visible:border-emotionTeal text-sm"
              disabled={isTyping}
            />
            <Button
              type="submit"
              className="w-11 h-11 p-0 rounded-full bg-gradient-to-r from-emotionTeal to-emotionBlue hover:from-emotionTeal-600 hover:to-emotionBlue-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Menti AI provides support, not medical advice. For emergencies, contact your local crisis line.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;