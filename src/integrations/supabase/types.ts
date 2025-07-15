export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          created_at: string
          emotional_summary: string | null
          id: string
          message_count: number | null
          session_end: string | null
          session_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_summary?: string | null
          id?: string
          message_count?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_summary?: string | null
          id?: string
          message_count?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          emotional_tone: string | null
          id: string
          message: string
          message_count: number | null
          response: string
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_tone?: string | null
          id?: string
          message: string
          message_count?: number | null
          response: string
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_tone?: string | null
          id?: string
          message?: string
          message_count?: number | null
          response?: string
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["checkin_status"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["checkin_status"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["checkin_status"]
          user_id?: string
        }
        Relationships: []
      }
      mood_tracker: {
        Row: {
          anxiety_level: number | null
          created_at: string | null
          id: string
          mood: Database["public"]["Enums"]["mood_level"]
          notes: string | null
          sleep_hours: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          anxiety_level?: number | null
          created_at?: string | null
          id?: string
          mood: Database["public"]["Enums"]["mood_level"]
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          anxiety_level?: number | null
          created_at?: string | null
          id?: string
          mood?: Database["public"]["Enums"]["mood_level"]
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialty: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialty?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialty?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapy_sessions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          session_date: string
          session_type: string
          status: Database["public"]["Enums"]["session_status"]
          therapist_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date: string
          session_type?: string
          status?: Database["public"]["Enums"]["session_status"]
          therapist_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          session_type?: string
          status?: Database["public"]["Enums"]["session_status"]
          therapist_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mental_states: {
        Row: {
          communication_style: string | null
          coping_mechanisms: string[] | null
          created_at: string
          emotions: string[] | null
          id: string
          intensity: number
          keywords: string[] | null
          mood: string
          preferred_activities: string[] | null
          recorded_at: string
          session_id: string | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          coping_mechanisms?: string[] | null
          created_at?: string
          emotions?: string[] | null
          id?: string
          intensity?: number
          keywords?: string[] | null
          mood: string
          preferred_activities?: string[] | null
          recorded_at?: string
          session_id?: string | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          communication_style?: string | null
          coping_mechanisms?: string[] | null
          created_at?: string
          emotions?: string[] | null
          id?: string
          intensity?: number
          keywords?: string[] | null
          mood?: string
          preferred_activities?: string[] | null
          recorded_at?: string
          session_id?: string | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_checkin_date: string | null
          longest_streak: number | null
          total_checkins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number | null
          total_checkins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number | null
          total_checkins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_streak: {
        Args: { user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      checkin_status: "great" | "okay" | "struggling"
      mood_level: "very_sad" | "sad" | "neutral" | "happy" | "very_happy"
      session_status: "pending" | "confirmed" | "cancelled" | "completed"
      user_role: "user" | "therapist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      checkin_status: ["great", "okay", "struggling"],
      mood_level: ["very_sad", "sad", "neutral", "happy", "very_happy"],
      session_status: ["pending", "confirmed", "cancelled", "completed"],
      user_role: ["user", "therapist"],
    },
  },
} as const
