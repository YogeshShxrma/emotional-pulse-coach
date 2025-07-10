-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'therapist');

-- Create enum for session status
CREATE TYPE public.session_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for mood levels
CREATE TYPE public.mood_level AS ENUM ('very_sad', 'sad', 'neutral', 'happy', 'very_happy');

-- Create enum for daily check-in status
CREATE TYPE public.checkin_status AS ENUM ('great', 'okay', 'struggling');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  specialty TEXT, -- for therapists
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create mood_tracker table
CREATE TABLE public.mood_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood mood_level NOT NULL,
  notes TEXT,
  sleep_hours DECIMAL(3,1),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create daily_checkins table
CREATE TABLE public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status checkin_status NOT NULL,
  notes TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create user_streaks table
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  last_checkin_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create therapy_sessions table
CREATE TABLE public.therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'video',
  status session_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mood_tracker
CREATE POLICY "Users can view own mood data" ON public.mood_tracker FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood data" ON public.mood_tracker FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood data" ON public.mood_tracker FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for daily_checkins
CREATE POLICY "Users can view own checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.daily_checkins FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_streaks
CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for therapy_sessions
CREATE POLICY "Users can view own sessions" ON public.therapy_sessions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = therapist_id);
CREATE POLICY "Users can insert own sessions" ON public.therapy_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Therapists can update sessions" ON public.therapy_sessions FOR UPDATE USING (auth.uid() = therapist_id OR auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Initialize user streaks
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update streaks
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  last_checkin DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
  total_checkins_val INTEGER;
BEGIN
  -- Get current streak info
  SELECT last_checkin_date, current_streak, longest_streak, total_checkins
  INTO last_checkin, current_streak_val, longest_streak_val, total_checkins_val
  FROM public.user_streaks
  WHERE user_id = user_id_param;
  
  -- Calculate new streak
  IF last_checkin IS NULL OR last_checkin < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Reset streak if more than 1 day gap
    current_streak_val := 1;
  ELSIF last_checkin = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Continue streak
    current_streak_val := current_streak_val + 1;
  ELSE
    -- Same day, no change to streak
    RETURN;
  END IF;
  
  -- Update longest streak if needed
  IF current_streak_val > longest_streak_val THEN
    longest_streak_val := current_streak_val;
  END IF;
  
  -- Update streaks table
  UPDATE public.user_streaks
  SET 
    current_streak = current_streak_val,
    longest_streak = longest_streak_val,
    total_checkins = total_checkins_val + 1,
    last_checkin_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = user_id_param;
  
  -- Award badges
  IF current_streak_val = 7 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name)
    VALUES (user_id_param, '7_day_streak', '7 Day Streak')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  ELSIF current_streak_val = 30 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name)
    VALUES (user_id_param, '30_day_streak', '30 Day Streak')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapy_sessions_updated_at
  BEFORE UPDATE ON public.therapy_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();