import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, AlertTriangle, Mic, MicOff, Volume2, VolumeX, RotateCcw, Shield } from "lucide-react";
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
  isVoiceMessage?: boolean;
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
  
  // Voice interaction states
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePermissionGranted, setVoicePermissionGranted] = useState(false);
  const [showVoicePrivacyNotice, setShowVoicePrivacyNotice] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const { user, profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history on component mount
  useEffect(() => {
    if (user && !sessionId) {
      loadChatHistory();
    }
  }, [user]);

  // Initialize session when user is available but no session exists
  useEffect(() => {
    if (user && !sessionId) {
      initializeSession();
    }
  }, [user, sessionId]);

  // Initialize voice capabilities
  useEffect(() => {
    const checkVoiceSupport = () => {
      const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const speechSynthesis = 'speechSynthesis' in window;
      setIsVoiceSupported(speechRecognition && speechSynthesis);
      
      if (speechSynthesis) {
        synthRef.current = window.speechSynthesis;
        loadVoices();
      }
    };

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const femaleVoices = englishVoices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
      );
      
      setAvailableVoices(englishVoices);
      
      // Prefer calm, slow female voice
      const preferredVoice = femaleVoices.find(voice => 
        voice.name.toLowerCase().includes('samantha')
      ) || femaleVoices[0] || englishVoices[0];
      
      setSelectedVoice(preferredVoice);
    };

    checkVoiceSupport();
    
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Mental state analysis function
  const analyzeMentalState = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const analysis = {
      mood: 'neutral' as 'positive' | 'negative' | 'neutral' | 'anxious' | 'depressed',
      intensity: 1,
      keywords: [] as string[],
      emotions: [] as string[]
    };

    // Detect negative emotions
    if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('hopeless') || lowerMessage.includes('worthless')) {
      analysis.mood = 'depressed';
      analysis.intensity = 3;
      analysis.emotions.push('depression');
      analysis.keywords.push('sadness', 'depression');
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('panic') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      analysis.mood = 'anxious';
      analysis.intensity = 3;
      analysis.emotions.push('anxiety');
      analysis.keywords.push('anxiety', 'worry');
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad') || lowerMessage.includes('irritated')) {
      analysis.mood = 'negative';
      analysis.intensity = 2;
      analysis.emotions.push('anger');
      analysis.keywords.push('anger', 'frustration');
    } else if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelm') || lowerMessage.includes('burnout')) {
      analysis.mood = 'negative';
      analysis.intensity = 2;
      analysis.emotions.push('stress');
      analysis.keywords.push('stress', 'overwhelm');
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('excited')) {
      analysis.mood = 'positive';
      analysis.intensity = 1;
      analysis.emotions.push('happiness');
      analysis.keywords.push('happiness', 'positive');
    }

    return analysis;
  };

  // Preferences extraction function
  const extractPreferences = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const preferences = {
      communicationStyle: 'supportive' as 'supportive' | 'direct' | 'gentle',
      preferredActivities: [] as string[],
      copingMechanisms: [] as string[],
      triggers: [] as string[]
    };

    // Detect communication preferences
    if (lowerMessage.includes('direct') || lowerMessage.includes('straight') || lowerMessage.includes('honest')) {
      preferences.communicationStyle = 'direct';
    } else if (lowerMessage.includes('gentle') || lowerMessage.includes('soft') || lowerMessage.includes('patient')) {
      preferences.communicationStyle = 'gentle';
    }

    // Detect preferred activities
    if (lowerMessage.includes('meditation') || lowerMessage.includes('mindful')) {
      preferences.preferredActivities.push('meditation');
    }
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('run')) {
      preferences.preferredActivities.push('exercise');
    }
    if (lowerMessage.includes('music') || lowerMessage.includes('listen')) {
      preferences.preferredActivities.push('music');
    }
    if (lowerMessage.includes('journal') || lowerMessage.includes('write')) {
      preferences.preferredActivities.push('journaling');
    }

    // Detect coping mechanisms
    if (lowerMessage.includes('breathing') || lowerMessage.includes('breath')) {
      preferences.copingMechanisms.push('breathing exercises');
    }
    if (lowerMessage.includes('talk') || lowerMessage.includes('vent')) {
      preferences.copingMechanisms.push('talking');
    }

    return preferences;
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!isVoiceSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript, true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = "Voice recognition failed. Please try again.";
      if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please enable microphone permissions.";
      } else if (event.error === 'network') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast({
        title: "Voice Input Error",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [isVoiceSupported]);

  // Text-to-speech function
  const speakText = useCallback((text: string) => {
    if (!synthRef.current || isAudioMuted || !selectedVoice) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 0.8; // Slower, calmer pace
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [selectedVoice, isAudioMuted]);

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setVoicePermissionGranted(true);
      setShowVoicePrivacyNotice(false);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please enable microphone access to use voice features.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Start voice input
  const startVoiceInput = async () => {
    if (!isVoiceSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input. Please type your message.",
        variant: "destructive"
      });
      return;
    }

    if (!voicePermissionGranted) {
      setShowVoicePrivacyNotice(true);
      return;
    }

    recognitionRef.current = initializeSpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Stop voice input
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Toggle audio mute
  const toggleAudioMute = () => {
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    setIsAudioMuted(!isAudioMuted);
  };

  // Repeat last AI response
  const repeatLastResponse = () => {
    const lastBotMessage = messages.filter(msg => !msg.isUser).pop();
    if (lastBotMessage) {
      speakText(lastBotMessage.text);
    }
  };

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      // Get the most recent session
      const { data: latestSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError;
      }

      if (latestSession) {
        setSessionId(latestSession.id);
        setMessageCount(latestSession.message_count || 1);

        // Load conversations for this session
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('session_id', latestSession.id)
          .order('created_at', { ascending: true });

        if (convError) throw convError;

        if (conversations && conversations.length > 0) {
          const chatHistory: Message[] = [INITIAL_MESSAGES[0]]; // Keep welcome message
          
          conversations.forEach(conv => {
            // Add user message
            chatHistory.push({
              id: `user-${conv.id}`,
              text: conv.message,
              isUser: true,
              timestamp: new Date(conv.created_at),
            });
            
            // Add AI response
            chatHistory.push({
              id: `ai-${conv.id}`,
              text: conv.response,
              isUser: false,
              timestamp: new Date(conv.updated_at),
              emotionalTone: conv.emotional_tone
            });
          });
          
          setMessages(chatHistory);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

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

  const handleSendMessage = async (messageText?: string, isVoice = false) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
      isVoiceMessage: isVoice,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Show typing animation for realism
    setTimeout(async () => {
      try {
        const context = profile ? `User ID: ${user?.id}. User is a ${profile.role}. Name: ${profile.first_name} ${profile.last_name}` : `User ID: ${user?.id}. No user context available`;

        // Analyze user mental state and preferences from message
        const mentalState = analyzeMentalState(textToSend);
        const preferences = extractPreferences(textToSend);

        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: textToSend,
            context: context,
            sessionId: sessionId,
            messageCount: messageCount,
            mentalState: mentalState,
            preferences: preferences
          }
        });

        // Save mental state and preferences to database
        try {
          await supabase.from('user_mental_states').insert({
            user_id: user.id,
            session_id: sessionId,
            mood: mentalState.mood,
            intensity: mentalState.intensity,
            keywords: mentalState.keywords,
            emotions: mentalState.emotions,
            communication_style: preferences.communicationStyle,
            preferred_activities: preferences.preferredActivities,
            coping_mechanisms: preferences.copingMechanisms,
            triggers: preferences.triggers
          });
        } catch (stateError) {
          console.error('Error saving mental state:', stateError);
        }

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

        // Speak AI response if not muted
        if (!isAudioMuted && !data.isCrisis) {
          setTimeout(() => speakText(botMessage.text), 500);
        }

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

        // Speak fallback response if not muted
        if (!isAudioMuted) {
          setTimeout(() => speakText(botMessage.text), 500);
        }

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
                      {message.isVoiceMessage && (
                        <span className="ml-2 text-emotionTeal">• 🎤 Voice</span>
                      )}
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
        
        {/* Voice Controls */}
        {isVoiceSupported && voicePermissionGranted && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudioMute}
                className="rounded-full"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={repeatLastResponse}
                className="rounded-full"
                disabled={isSpeaking}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

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
              disabled={isTyping || isListening}
            />
            
            {/* Voice Input Button */}
            {isVoiceSupported && (
              <Button
                type="button"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={cn(
                  "w-11 h-11 p-0 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl",
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                )}
                disabled={isTyping}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <MicOff className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              type="submit"
              className="w-11 h-11 p-0 rounded-full bg-gradient-to-r from-emotionTeal to-emotionBlue hover:from-emotionTeal-600 hover:to-emotionBlue-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={!input.trim() || isTyping || isListening}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Voice Status */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center"
            >
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                🎤 Listening... Speak now
              </p>
            </motion.div>
          )}
          
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center"
            >
              <p className="text-sm text-emotionTeal font-medium">
                🔊 Menti AI is speaking...
              </p>
            </motion.div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Menti AI provides support, not medical advice. For emergencies, contact your local crisis line.
          </p>
        </div>
      </motion.div>

      {/* Voice Privacy Notice */}
      <AnimatePresence>
        {showVoicePrivacyNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-auto shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-emotionTeal mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice Privacy Notice
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <p>
                  • Your voice will be processed locally on your device for speech recognition
                </p>
                <p>
                  • Voice data is not stored or transmitted to external servers
                </p>
                <p>
                  • Only the transcribed text is sent to our AI for response generation
                </p>
                <p>
                  • You can disable voice features at any time
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowVoicePrivacyNotice(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const granted = await requestMicrophonePermission();
                    if (granted) {
                      startVoiceInput();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emotionTeal to-emotionBlue"
                >
                  Allow & Continue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;