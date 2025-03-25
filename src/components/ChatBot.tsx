
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { generateAIResponse, getApiKey, ChatMessage } from "@/utils/openaiService";
import ApiKeyInput from "./ApiKeyInput";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hello! I'm your AI mental health coach. How are you feeling today?",
    isUser: false,
    timestamp: new Date(),
  },
];

const SYSTEM_PROMPT = `You are a compassionate mental health coach. Your role is to provide supportive, empathetic responses that help the user explore their emotions and develop coping strategies. 

You should:
- Respond with empathy and validation
- Ask thoughtful follow-up questions
- Suggest evidence-based coping strategies when appropriate
- Never give medical advice or attempt to diagnose
- Keep responses concise (2-4 sentences max)
- Focus on emotional support and gentle guidance

If the user expresses severe distress or suicidal thoughts, encourage them to contact a mental health professional or a crisis helpline immediately.`;

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!getApiKey());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Prepare conversation history for OpenAI with proper typing
      const conversationHistory: ChatMessage[] = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: (msg.isUser ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.text
        })),
        { role: 'user' as const, content: input }
      ];

      // Get response from OpenAI
      const aiResponse = await generateAIResponse(conversationHistory);

      const botMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Fallback to basic responses if API fails
      toast({
        title: "AI Response Error",
        description: "Falling back to basic responses",
        variant: "destructive"
      });
      
      const lowerCaseMessage = input.toLowerCase();
      let response = "";

      if (lowerCaseMessage.includes("sad") || lowerCaseMessage.includes("depress")) {
        response = "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to explore some gentle mood-lifting activities?";
      } else if (lowerCaseMessage.includes("anxious") || lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("worried")) {
        response = "I notice you're feeling anxious. Let's try a quick breathing exercise: breathe in for 4 counts, hold for 4, and exhale for 6. Would you like to continue with more calming techniques?";
      } else if (lowerCaseMessage.includes("happy") || lowerCaseMessage.includes("good") || lowerCaseMessage.includes("great")) {
        response = "I'm glad you're feeling positive! What's contributed to your good mood today? Recognizing these factors can help us build on them.";
      } else if (lowerCaseMessage.includes("angry") || lowerCaseMessage.includes("upset") || lowerCaseMessage.includes("frustrat")) {
        response = "I understand you're feeling frustrated. These emotions are valid. Would it help to talk about what triggered these feelings?";
      } else if (lowerCaseMessage.includes("tired") || lowerCaseMessage.includes("exhausted") || lowerCaseMessage.includes("fatigue")) {
        response = "Being tired can really affect our mental state. Have you been able to prioritize rest lately? Perhaps we could discuss some gentle energy-boosting strategies.";
      } else if (
        lowerCaseMessage.includes("hello") || 
        lowerCaseMessage.includes("hi") || 
        lowerCaseMessage.includes("hey")
      ) {
        response = "Hello! How are you feeling today? I'm here to listen and support you.";
      } else {
        response = "Thank you for sharing. Can you tell me more about how that makes you feel? I'm here to listen and offer support without judgment.";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">
      {!hasApiKey && <ApiKeyInput onKeySet={handleApiKeySet} />}
      
      <motion.div 
        className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-lg mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center">
          <div className="w-10 h-10 rounded-full bg-emotionTeal flex items-center justify-center text-white mr-3">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Mental Health Coach</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {hasApiKey ? "Powered by GPT-4" : "Basic responses (add API key for GPT-4)"}
            </p>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 scroll-hidden">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={cn(
                  "mb-4 max-w-[80%]",
                  message.isUser ? "ml-auto" : "mr-auto"
                )}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-emotionTeal flex items-center justify-center text-white mr-2 mt-1 flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-2xl py-2 px-4",
                      message.isUser
                        ? "bg-emotionBlue text-white rounded-tr-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={cn(
                      "text-xs mt-1",
                      message.isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-emotionBlue flex items-center justify-center text-white ml-2 mt-1 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              className="flex items-center mb-4 max-w-[80%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-emotionTeal flex items-center justify-center text-white mr-2 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none py-2 px-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t dark:border-gray-700">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-full py-3 px-4 bg-gray-100 dark:bg-gray-700 border-none focus-visible:ring-2 focus-visible:ring-emotionBlue"
            />
            <Button
              type="submit"
              className="ml-2 w-10 h-10 p-0 rounded-full bg-emotionBlue hover:bg-emotionBlue-dark text-white flex items-center justify-center"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
