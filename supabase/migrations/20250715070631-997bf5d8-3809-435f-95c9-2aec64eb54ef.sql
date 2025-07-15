-- Insert dummy therapist data without foreign key constraints
-- We'll create profiles with random UUIDs that don't reference auth.users since this is just demo data

-- Insert dummy therapist profiles for demo purposes
INSERT INTO public.profiles (user_id, role, first_name, last_name, specialty, bio, avatar_url) VALUES
-- Generate stable UUIDs for demo therapists
('11111111-1111-1111-1111-111111111111', 'therapist', 'Dr. Sarah', 'Johnson', 'Anxiety & Depression Specialist', 'Dr. Sarah Johnson has over 10 years of experience in cognitive behavioral therapy and specializes in anxiety and depression treatment. She believes in creating a safe, non-judgmental space for healing.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'),

('22222222-2222-2222-2222-222222222222', 'therapist', 'Dr. Michael', 'Chen', 'Trauma & PTSD Counselor', 'Dr. Michael Chen is a licensed clinical psychologist with expertise in trauma-informed care and EMDR therapy. He has helped hundreds of clients overcome traumatic experiences and build resilience.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face'),

('33333333-3333-3333-3333-333333333333', 'therapist', 'Dr. Emily', 'Rodriguez', 'Relationship & Family Therapist', 'Dr. Emily Rodriguez specializes in couples counseling and family therapy. With a warm, empathetic approach, she helps families navigate communication challenges and strengthen their bonds.', 'https://images.unsplash.com/photo-1594824388787-fddeb2d55eea?w=400&h=400&fit=crop&crop=face'),

('44444444-4444-4444-4444-444444444444', 'therapist', 'Dr. James', 'Thompson', 'Mindfulness & Stress Management', 'Dr. James Thompson combines traditional therapy with mindfulness-based interventions. He specializes in stress management, burnout prevention, and helping clients develop healthy coping mechanisms.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'),

('55555555-5555-5555-5555-555555555555', 'therapist', 'Dr. Lisa', 'Wang', 'Teen & Young Adult Counselor', 'Dr. Lisa Wang has dedicated her career to working with teenagers and young adults. She understands the unique challenges of this age group and uses evidence-based approaches tailored to younger clients.', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face'),

('66666666-6666-6666-6666-666666666666', 'therapist', 'Dr. Robert', 'Davis', 'Addiction & Recovery Specialist', 'Dr. Robert Davis is a board-certified addiction counselor with over 15 years of experience. He provides compassionate, evidence-based treatment for substance abuse and behavioral addictions.', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face')

ON CONFLICT (user_id) DO NOTHING;

-- Insert some dummy mood tracker data with a stable demo user ID
INSERT INTO public.mood_tracker (user_id, mood, anxiety_level, stress_level, sleep_hours, notes, created_at) VALUES
('99999999-9999-9999-9999-999999999999', 'happy', 3, 4, 7.5, 'Feeling good today, had a productive morning', NOW() - INTERVAL '0 days'),
('99999999-9999-9999-9999-999999999999', 'neutral', 5, 6, 6.0, 'Average day, some work stress', NOW() - INTERVAL '1 days'),
('99999999-9999-9999-9999-999999999999', 'very_happy', 2, 3, 8.0, 'Great day! Spent time with friends', NOW() - INTERVAL '2 days'),
('99999999-9999-9999-9999-999999999999', 'sad', 7, 8, 5.5, 'Feeling a bit down, work was overwhelming', NOW() - INTERVAL '3 days'),
('99999999-9999-9999-9999-999999999999', 'happy', 4, 5, 7.0, 'Good workout session helped my mood', NOW() - INTERVAL '4 days'),
('99999999-9999-9999-9999-999999999999', 'neutral', 6, 7, 6.5, 'Okay day, nothing special', NOW() - INTERVAL '5 days'),
('99999999-9999-9999-9999-999999999999', 'very_happy', 1, 2, 8.5, 'Amazing day! Got promoted at work', NOW() - INTERVAL '6 days')

ON CONFLICT (id) DO NOTHING;

-- Insert some dummy daily check-ins
INSERT INTO public.daily_checkins (user_id, status, notes, date) VALUES
('99999999-9999-9999-9999-999999999999', 'great', 'Daily check-in: Feeling energetic and positive', (NOW() - INTERVAL '0 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Daily check-in: Average day, managing stress well', (NOW() - INTERVAL '1 days')::date),
('99999999-9999-9999-9999-999999999999', 'great', 'Daily check-in: Excellent mood and energy', (NOW() - INTERVAL '2 days')::date),
('99999999-9999-9999-9999-999999999999', 'struggling', 'Daily check-in: Having a tough day, need support', (NOW() - INTERVAL '3 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Daily check-in: Better than yesterday', (NOW() - INTERVAL '4 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Daily check-in: Steady mood today', (NOW() - INTERVAL '5 days')::date),
('99999999-9999-9999-9999-999999999999', 'great', 'Daily check-in: Wonderful start to the week', (NOW() - INTERVAL '6 days')::date)

ON CONFLICT (user_id, date) DO NOTHING;