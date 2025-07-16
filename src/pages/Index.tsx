
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Camera, MessageCircle, BarChart3, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Emotion Recognition",
      description: "Analyze facial expressions to detect your emotional state in real-time.",
      color: "emotionBlue",
      link: "/scan"
    },
    {
      icon: MessageCircle,
      title: "AI Therapy Chat",
      description: "Talk with an AI coach that provides personalized mental health support.",
      color: "emotionTeal",
      link: "/chat"
    },
    {
      icon: Clock,
      title: "Daily Check-Ins",
      description: "Track your sleep, water intake, and other daily routines to improve well-being.",
      color: "emotionGreen",
      link: "/daily-check-in"
    },
    {
      icon: BarChart3,
      title: "Mood Tracking",
      description: "Visualize your emotional patterns and receive tailored insights.",
      color: "emotionPurple",
      link: "/mood"
    },
    {
      icon: Calendar,
      title: "Online Therapy Sessions",
      description: "Book private sessions with licensed professionals from around the world.",
      color: "emotionTeal",
      link: "/sessions"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 mobile-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emotionBlue-light via-white to-emotionTeal-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <div className="inline-block mb-4 px-4 py-2 bg-emotionBlue bg-opacity-10 dark:bg-opacity-20 rounded-full">
                <span className="text-emotionBlue text-sm sm:text-base font-medium">AI-Powered Mental Health</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight">
                Your Personal
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emotionBlue to-emotionTeal block sm:inline sm:ml-2">
                  Emotion Coach
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Understand your emotions through AI-powered facial and voice analysis, receive personalized support, and track your mental well-being journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button 
                  asChild
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-emotionBlue to-emotionTeal hover:opacity-90 text-white shadow-lg"
                >
                  <Link to="/scan">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-2 shadow-sm"
                >
                  <Link to="/chat">
                    Try AI Chat
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-sm order-1 lg:order-2"
            >
              <div className="relative w-full aspect-[3/4] bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emotionBlue-light/30 to-emotionTeal-light/30 dark:from-emotionBlue-dark/10 dark:to-emotionTeal-dark/10" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emotionBlue/10 dark:bg-emotionBlue-dark/20 flex items-center justify-center mb-4 sm:mb-6">
                    <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-emotionBlue" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">Emotional Intelligence</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-6 leading-relaxed">
                    Our AI analyzes micro-expressions and voice patterns to understand your emotional state.
                  </p>
                  
                  <div className="w-full bg-white dark:bg-gray-700 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emotionGreen-light dark:bg-emotionGreen-dark/20 flex items-center justify-center mr-2">
                        <span className="text-base sm:text-lg">😊</span>
                      </div>
                      <span className="text-sm font-medium">Happiness detected</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2 mb-1">
                      <div className="bg-emotionGreen h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Confidence: 75%</span>
                      <span>Strong signal</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white dark:bg-gray-700 rounded-xl p-3 sm:p-4 shadow-sm">
                    <p className="text-sm font-medium mb-2">AI Recommendation:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      "Great job maintaining a positive mood! Would you like to explore activities to sustain this emotional state?"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-emotionTeal-light dark:bg-emotionTeal-dark/20 rounded-full blur-xl z-0"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 bg-emotionBlue-light dark:bg-emotionBlue-dark/20 rounded-full blur-xl z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 mobile-container bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Key Features</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with proven therapeutic approaches.
            </p>
          </div>
          
          <div className="mobile-responsive-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow mobile-touch-target"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-${feature.color}-light dark:bg-${feature.color}-dark/20 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}`} />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
                
                <Link to={feature.link} className={`inline-flex items-center text-${feature.color} font-medium text-sm sm:text-base hover:underline`}>
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 mobile-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-emotionBlue to-emotionTeal rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
        >
          <div className="p-6 sm:p-8 lg:p-12 text-white text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Begin Your Emotional Wellness Journey</h2>
            <p className="text-white text-opacity-90 mb-6 max-w-lg mx-auto sm:mx-0 text-sm sm:text-base leading-relaxed">
              Take the first step toward better understanding and managing your emotions with our AI-powered emotional coach.
            </p>
            
            <Button 
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl bg-white text-emotionBlue hover:bg-gray-100 shadow-md"
            >
              <Link to="/scan">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 mobile-container mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} Emotional Pulse Coach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
