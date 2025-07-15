-- Create table for storing user mental states and preferences from chat interactions
CREATE TABLE IF NOT EXISTS public.user_mental_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  mood VARCHAR(20) NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 1,
  keywords TEXT[],
  emotions TEXT[],
  communication_style VARCHAR(20) DEFAULT 'supportive',
  preferred_activities TEXT[],
  coping_mechanisms TEXT[],
  triggers TEXT[],
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_mental_states ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mental states" 
ON public.user_mental_states 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert mental states" 
ON public.user_mental_states 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own mental states" 
ON public.user_mental_states 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_user_mental_states_user_id ON public.user_mental_states(user_id);
CREATE INDEX idx_user_mental_states_session_id ON public.user_mental_states(session_id);
CREATE INDEX idx_user_mental_states_recorded_at ON public.user_mental_states(recorded_at);

-- Add triggers for updated_at
CREATE TRIGGER update_user_mental_states_updated_at
BEFORE UPDATE ON public.user_mental_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();