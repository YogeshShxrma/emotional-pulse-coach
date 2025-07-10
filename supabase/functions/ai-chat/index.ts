import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    const systemPrompt = `You are MentiCure AI, a compassionate mental health support chatbot. Your role is to:

1. Provide emotional support and encouragement
2. Offer evidence-based coping strategies and techniques
3. Suggest mindfulness and breathing exercises
4. Help users identify patterns in their mood and emotions
5. Encourage professional help when appropriate
6. Be empathetic, non-judgmental, and supportive

IMPORTANT: You are NOT a replacement for professional therapy or medical advice. Always encourage users to seek professional help for serious mental health concerns.

Guidelines:
- Keep responses warm, supportive, and personalized
- Offer practical, actionable advice
- Ask follow-up questions to better understand the user's situation
- Be encouraging about their mental health journey
- If someone expresses thoughts of self-harm, immediately encourage them to contact a crisis helpline

Context about user: ${context || 'No additional context provided'}`;

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
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from AI');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
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