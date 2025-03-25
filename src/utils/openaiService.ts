
// OpenAI GPT-4 API integration
import { toast } from "@/hooks/use-toast";

const DEFAULT_API_KEY = "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";

// Store API key securely (in a real app, this should be on the server)
let apiKey = localStorage.getItem('openai-api-key') || DEFAULT_API_KEY;

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('openai-api-key', key);
  return !!key;
};

export const getApiKey = () => {
  return apiKey;
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    toast({
      title: "AI Response Error",
      description: error instanceof Error ? error.message : "Failed to get AI response",
      variant: "destructive"
    });
    throw error;
  }
};
