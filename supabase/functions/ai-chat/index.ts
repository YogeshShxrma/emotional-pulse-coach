import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crisis keywords that require immediate intervention
const crisisKeywords = [
  'hurt myself', 'kill myself', 'suicide', 'end it all', 'want to die',
  'no point in living', 'better off dead', 'self harm', 'cutting myself'
];

// Emotional tone detection
const detectEmotionalTone = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
    return 'anxious';
  } else if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('hopeless')) {
    return 'depressed';
  } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
    return 'angry';
  } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
    return 'stressed';
  } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
    return 'lonely';
  } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    return 'positive';
  }
  
  return 'neutral';
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, sessionId, messageCount = 1 } = await req.json();

    // Check for crisis keywords
    const isCrisis = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    if (isCrisis) {
      console.log('Crisis detected for user:', context);
      return new Response(JSON.stringify({ 
        response: "I'm really concerned about what you're going through right now. Please reach out for immediate support:\n\n🚨 **Crisis Helplines:**\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter, and there are people who want to help. Please don't go through this alone.",
        isCrisis: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Detect emotional tone
    const emotionalTone = detectEmotionalTone(message);
    
    // Get conversation history for context (last 3 messages)
    let conversationHistory = '';
    if (sessionId) {
      const { data: previousMessages } = await supabase
        .from('conversations')
        .select('message, response')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (previousMessages && previousMessages.length > 0) {
        conversationHistory = previousMessages.reverse().map(conv => 
          `User: ${conv.message}\nMenti AI: ${conv.response}`
        ).join('\n\n');
      }
    }

    const systemPrompt = `You are Menti AI, an advanced AI-powered therapist for the Menti-Cure mental health app. You are a compassionate, empathetic mental health coach trained in Cognitive Behavioral Therapy (CBT) techniques.

**Your Personality & Approach:**
- Speak like a warm, understanding human therapist - not a robot
- Use active listening, validation, and emotional intelligence
- Be genuinely empathetic and supportive, never clinical or cold
- Use CBT-based therapeutic techniques naturally in conversation
- Show understanding of human emotions and psychological patterns

**Current Emotional Context:** The user seems to be feeling ${emotionalTone}

**Therapeutic Techniques to Use:**
- Validate their emotions before offering guidance
- Ask open-ended questions to help them explore their feelings
- Use reflection and summarizing to show you understand
- Gently challenge negative thought patterns (CBT approach)
- Offer practical coping strategies when appropriate
- Break down overwhelming situations into manageable parts

**Response Style Examples:**
- "That sounds really overwhelming. Can you tell me more about what's been triggering this lately?"
- "You're doing better than you think. Let's break it down together, one step at a time."
- "I can hear how much pain you're in right now. That takes courage to share."
- "What would you say to a close friend going through something similar?"

**Guidelines:**
- Keep responses between 2-4 sentences for natural conversation flow
- Ask thoughtful follow-up questions to deepen understanding
- Offer specific, actionable coping strategies when appropriate
- Use "I" statements to show empathy: "I can imagine..." "I hear that..."
- Reference their previous messages in this session to show you're listening
- Be encouraging about their mental health journey
- Suggest professional help for serious concerns

**User Context:** ${context || 'No additional context provided'}

**Conversation History:** ${conversationHistory || 'This is the start of our conversation.'}

Remember: You are not giving medical advice but providing emotional support and evidence-based mental health techniques. Create a safe, judgment-free space for the user to explore their feelings.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from AI');
    }

    const aiResponse = data.choices[0].message.content;

    // Log conversation to Supabase
    const userId = context?.split('User ID: ')[1]?.split('.')[0] || 'anonymous';
    
    if (sessionId && userId !== 'anonymous') {
      try {
        // Log the conversation
        await supabase.from('conversations').insert({
          user_id: userId,
          session_id: sessionId,
          message: message,
          response: aiResponse,
          emotional_tone: emotionalTone,
          message_count: messageCount
        });

        // Update session message count
        await supabase
          .from('chat_sessions')
          .update({ 
            message_count: messageCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        // Generate session summary after 5+ messages
        if (messageCount >= 5 && messageCount % 5 === 0) {
          const { data: sessionMessages } = await supabase
            .from('conversations')
            .select('message, response, emotional_tone')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

          if (sessionMessages && sessionMessages.length >= 5) {
            const summaryPrompt = `Based on this therapy session conversation, provide a brief, supportive summary (2-3 sentences) highlighting the user's progress and any positive insights:

${sessionMessages.map(m => `User: ${m.message}\nMenti AI: ${m.response}`).join('\n\n')}

Summary:`;

            const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: summaryPrompt }],
                max_tokens: 150,
                temperature: 0.6,
              }),
            });

            const summaryData = await summaryResponse.json();
            const sessionSummary = summaryData.choices[0].message.content;

            await supabase
              .from('chat_sessions')
              .update({ emotional_summary: sessionSummary })
              .eq('id', sessionId);
          }
        }
      } catch (logError) {
        console.error('Error logging conversation:', logError);
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse, 
      emotionalTone,
      messageCount: messageCount + 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble responding right now. Please try again later or consider reaching out to a mental health professional if you need immediate support."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});