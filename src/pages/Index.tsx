
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Camera, MessageCircle, BarChart3 } from "lucide-react";
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
      icon: BarChart3,
      title: "Mood Tracking",
      description: "Visualize your emotional patterns and receive tailored insights.",
      color: "emotionGreen",
      link: "/mood"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emotionBlue-light via-white to-emotionTeal-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 bg-emotionBlue bg-opacity-10 dark:bg-opacity-20 rounded-full">
                <span className="text-emotionBlue text-sm font-medium">AI-Powered Mental Health</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                Your Personal
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emotionBlue to-emotionTeal ml-2">
                  Emotion Coach
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                Understand your emotions through AI-powered facial and voice analysis, receive personalized support, and track your mental well-being journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  asChild
                  className="px-6 py-6 text-base font-medium rounded-xl bg-gradient-to-r from-emotionBlue to-emotionTeal hover:opacity-90 text-white"
                >
                  <Link to="/scan">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="px-6 py-6 text-base font-medium rounded-xl border-2"
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
              className="relative mx-auto max-w-md"
            >
              <div className="relative w-full aspect-[3/4] bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emotionBlue-light/30 to-emotionTeal-light/30 dark:from-emotionBlue-dark/10 dark:to-emotionTeal-dark/10" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-24 h-24 rounded-full bg-emotionBlue/10 dark:bg-emotionBlue-dark/20 flex items-center justify-center mb-6">
                    <Brain className="w-12 h-12 text-emotionBlue" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Emotional Intelligence</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                    Our AI analyzes micro-expressions and voice patterns to understand your emotional state.
                  </p>
                  
                  <div className="w-full bg-white dark:bg-gray-700 rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-emotionGreen-light dark:bg-emotionGreen-dark/20 flex items-center justify-center mr-2">
                        <span className="text-lg">😊</span>
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
                  
                  <div className="w-full bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-sm font-medium mb-2">AI Recommendation:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      "Great job maintaining a positive mood! Would you like to explore activities to sustain this emotional state?"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emotionTeal-light dark:bg-emotionTeal-dark/20 rounded-full blur-xl z-0"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emotionBlue-light dark:bg-emotionBlue-dark/20 rounded-full blur-xl z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven therapeutic approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-light dark:bg-${feature.color}-dark/20 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                
                <Link to={feature.link} className={`inline-flex items-center text-${feature.color} font-medium`}>
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-emotionBlue to-emotionTeal rounded-3xl overflow-hidden shadow-lg"
        >
          <div className="p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Begin Your Emotional Wellness Journey</h2>
            <p className="text-white text-opacity-90 mb-6 max-w-lg">
              Take the first step toward better understanding and managing your emotions with our AI-powered emotional coach.
            </p>
            
            <Button 
              asChild
              variant="secondary"
              className="px-6 py-6 text-base font-medium rounded-xl bg-white text-emotionBlue hover:bg-gray-100"
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
      <footer className="bg-gray-50 dark:bg-gray-900 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Emotional Pulse Coach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
