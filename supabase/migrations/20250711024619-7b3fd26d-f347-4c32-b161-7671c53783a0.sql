-- Fix missing user_role enum type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'therapist');
    END IF;
END $$;

-- Also ensure other missing enum types exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_level') THEN
        CREATE TYPE public.mood_level AS ENUM ('very_sad', 'sad', 'neutral', 'happy', 'very_happy');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'checkin_status') THEN
        CREATE TYPE public.checkin_status AS ENUM ('great', 'okay', 'struggling');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
        CREATE TYPE public.session_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    END IF;
END $$;