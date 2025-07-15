-- Remove foreign key constraints temporarily for demo data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.mood_tracker DROP CONSTRAINT IF EXISTS mood_tracker_user_id_fkey;
ALTER TABLE public.daily_checkins DROP CONSTRAINT IF EXISTS daily_checkins_user_id_fkey;
ALTER TABLE public.therapy_sessions DROP CONSTRAINT IF EXISTS therapy_sessions_user_id_fkey;
ALTER TABLE public.therapy_sessions DROP CONSTRAINT IF EXISTS therapy_sessions_therapist_id_fkey;

-- Insert dummy therapist profiles
INSERT INTO public.profiles (user_id, role, first_name, last_name, specialty, bio, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'therapist', 'Dr. Sarah', 'Johnson', 'Anxiety & Depression', 'Specializes in anxiety and depression treatment with CBT approach.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'),
('22222222-2222-2222-2222-222222222222', 'therapist', 'Dr. Michael', 'Chen', 'Trauma & PTSD', 'Expert in trauma-informed care and EMDR therapy.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'),
('33333333-3333-3333-3333-333333333333', 'therapist', 'Dr. Emily', 'Rodriguez', 'Family Therapy', 'Specializes in couples and family counseling.', 'https://images.unsplash.com/photo-1594824388787-fddeb2d55eea?w=400'),
('44444444-4444-4444-4444-444444444444', 'therapist', 'Dr. James', 'Thompson', 'Mindfulness', 'Combines therapy with mindfulness-based interventions.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'),
('55555555-5555-5555-5555-555555555555', 'therapist', 'Dr. Lisa', 'Wang', 'Teen Counseling', 'Dedicated to working with teenagers and young adults.', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400'),
('66666666-6666-6666-6666-666666666666', 'therapist', 'Dr. Robert', 'Davis', 'Addiction Recovery', 'Board-certified addiction counselor with 15+ years experience.', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400')
ON CONFLICT (user_id) DO NOTHING;