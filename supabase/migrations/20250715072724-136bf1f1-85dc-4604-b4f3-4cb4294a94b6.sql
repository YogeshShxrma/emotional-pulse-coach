-- Insert dummy mood tracker data
INSERT INTO public.mood_tracker (user_id, mood, anxiety_level, stress_level, sleep_hours, notes, created_at) VALUES
('99999999-9999-9999-9999-999999999999', 'happy', 3, 4, 7.5, 'Feeling good today', NOW() - INTERVAL '0 days'),
('99999999-9999-9999-9999-999999999999', 'neutral', 5, 6, 6.0, 'Average day', NOW() - INTERVAL '1 days'),
('99999999-9999-9999-9999-999999999999', 'very_happy', 2, 3, 8.0, 'Great day!', NOW() - INTERVAL '2 days'),
('99999999-9999-9999-9999-999999999999', 'sad', 7, 8, 5.5, 'Tough day', NOW() - INTERVAL '3 days'),
('99999999-9999-9999-9999-999999999999', 'happy', 4, 5, 7.0, 'Good workout', NOW() - INTERVAL '4 days'),
('99999999-9999-9999-9999-999999999999', 'neutral', 6, 7, 6.5, 'Okay day', NOW() - INTERVAL '5 days'),
('99999999-9999-9999-9999-999999999999', 'very_happy', 1, 2, 8.5, 'Amazing day!', NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy daily check-ins
INSERT INTO public.daily_checkins (user_id, status, notes, date) VALUES
('99999999-9999-9999-9999-999999999999', 'great', 'Feeling energetic', (NOW() - INTERVAL '0 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Managing stress well', (NOW() - INTERVAL '1 days')::date),
('99999999-9999-9999-9999-999999999999', 'great', 'Excellent mood', (NOW() - INTERVAL '2 days')::date),
('99999999-9999-9999-9999-999999999999', 'struggling', 'Need support', (NOW() - INTERVAL '3 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Better today', (NOW() - INTERVAL '4 days')::date),
('99999999-9999-9999-9999-999999999999', 'okay', 'Steady mood', (NOW() - INTERVAL '5 days')::date),
('99999999-9999-9999-9999-999999999999', 'great', 'Great start', (NOW() - INTERVAL '6 days')::date)
ON CONFLICT (user_id, date) DO NOTHING;