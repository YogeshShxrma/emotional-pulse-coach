-- Insert dummy therapist profiles for demo purposes
INSERT INTO public.profiles (user_id, role, first_name, last_name, specialty, bio, avatar_url) VALUES
-- Dummy therapist 1
(gen_random_uuid(), 'therapist', 'Dr. Sarah', 'Johnson', 'Anxiety & Depression Specialist', 'Dr. Sarah Johnson has over 10 years of experience in cognitive behavioral therapy and specializes in anxiety and depression treatment. She believes in creating a safe, non-judgmental space for healing.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'),

-- Dummy therapist 2
(gen_random_uuid(), 'therapist', 'Dr. Michael', 'Chen', 'Trauma & PTSD Counselor', 'Dr. Michael Chen is a licensed clinical psychologist with expertise in trauma-informed care and EMDR therapy. He has helped hundreds of clients overcome traumatic experiences and build resilience.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face'),

-- Dummy therapist 3
(gen_random_uuid(), 'therapist', 'Dr. Emily', 'Rodriguez', 'Relationship & Family Therapist', 'Dr. Emily Rodriguez specializes in couples counseling and family therapy. With a warm, empathetic approach, she helps families navigate communication challenges and strengthen their bonds.', 'https://images.unsplash.com/photo-1594824388787-fddeb2d55eea?w=400&h=400&fit=crop&crop=face'),

-- Dummy therapist 4
(gen_random_uuid(), 'therapist', 'Dr. James', 'Thompson', 'Mindfulness & Stress Management', 'Dr. James Thompson combines traditional therapy with mindfulness-based interventions. He specializes in stress management, burnout prevention, and helping clients develop healthy coping mechanisms.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'),

-- Dummy therapist 5
(gen_random_uuid(), 'therapist', 'Dr. Lisa', 'Wang', 'Teen & Young Adult Counselor', 'Dr. Lisa Wang has dedicated her career to working with teenagers and young adults. She understands the unique challenges of this age group and uses evidence-based approaches tailored to younger clients.', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face'),

-- Dummy therapist 6
(gen_random_uuid(), 'therapist', 'Dr. Robert', 'Davis', 'Addiction & Recovery Specialist', 'Dr. Robert Davis is a board-certified addiction counselor with over 15 years of experience. He provides compassionate, evidence-based treatment for substance abuse and behavioral addictions.', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face');

-- Insert some dummy therapy sessions for demo
WITH therapist_ids AS (
  SELECT user_id FROM public.profiles WHERE role = 'therapist' LIMIT 3
),
dummy_user AS (
  SELECT gen_random_uuid() as user_id
)
INSERT INTO public.therapy_sessions (user_id, therapist_id, session_date, session_type, status, notes)
SELECT 
  dummy_user.user_id,
  therapist_ids.user_id,
  NOW() + INTERVAL '7 days',
  'video',
  'pending',
  'Initial consultation session'
FROM dummy_user, therapist_ids
LIMIT 3;

-- Insert some dummy mood tracker data
WITH dummy_user AS (
  SELECT gen_random_uuid() as user_id
)
INSERT INTO public.mood_tracker (user_id, mood, anxiety_level, stress_level, sleep_hours, notes, created_at)
SELECT 
  dummy_user.user_id,
  (ARRAY['very_happy', 'happy', 'neutral', 'sad', 'very_sad'])[floor(random() * 5 + 1)]::mood_level,
  floor(random() * 10 + 1)::integer,
  floor(random() * 10 + 1)::integer,
  6 + random() * 4,
  'Feeling ' || (ARRAY['great', 'okay', 'stressed', 'anxious', 'peaceful'])[floor(random() * 5 + 1)],
  NOW() - INTERVAL '1 day' * generate_series(0, 6)
FROM dummy_user, generate_series(0, 6);

-- Insert some dummy daily check-ins
WITH dummy_user AS (
  SELECT gen_random_uuid() as user_id
)
INSERT INTO public.daily_checkins (user_id, status, notes, date)
SELECT 
  dummy_user.user_id,
  (ARRAY['great', 'okay', 'struggling'])[floor(random() * 3 + 1)]::checkin_status,
  'Daily check-in for ' || (NOW() - INTERVAL '1 day' * generate_series(0, 6))::date,
  (NOW() - INTERVAL '1 day' * generate_series(0, 6))::date
FROM dummy_user, generate_series(0, 6);