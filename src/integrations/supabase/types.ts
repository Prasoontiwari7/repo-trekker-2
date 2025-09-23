export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      anomalies: {
        Row: {
          checked_at: string | null
          flags: Json | null
          id: string
          resolved: boolean | null
          score: number
          tourist_id: string | null
        }
        Insert: {
          checked_at?: string | null
          flags?: Json | null
          id?: string
          resolved?: boolean | null
          score: number
          tourist_id?: string | null
        }
        Update: {
          checked_at?: string | null
          flags?: Json | null
          id?: string
          resolved?: boolean | null
          score?: number
          tourist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_ids: {
        Row: {
          created_at: string | null
          id: string
          kyc_hash: string
          record_hash: string
          tx_hash: string | null
          user_id: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kyc_hash: string
          record_hash: string
          tx_hash?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kyc_hash?: string
          record_hash?: string
          tx_hash?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_ids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      geofence_events: {
        Row: {
          created_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          geofence_id: string | null
          id: string
          tourist_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          geofence_id?: string | null
          id?: string
          tourist_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          geofence_id?: string | null
          id?: string
          tourist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "geofence_events_geofence_id_fkey"
            columns: ["geofence_id"]
            isOneToOne: false
            referencedRelation: "geofences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geofence_events_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      geofences: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          polygon_geojson: Json
          zone_type: Database["public"]["Enums"]["zone_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          polygon_geojson: Json
          zone_type?: Database["public"]["Enums"]["zone_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          polygon_geojson?: Json
          zone_type?: Database["public"]["Enums"]["zone_type"]
        }
        Relationships: [
          {
            foreignKeyName: "geofences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      global_chat: {
        Row: {
          country_tag: string | null
          created_at: string | null
          id: string
          message: string
          user_id: string | null
          username: string
        }
        Insert: {
          country_tag?: string | null
          created_at?: string | null
          id?: string
          message: string
          user_id?: string | null
          username: string
        }
        Update: {
          country_tag?: string | null
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "global_chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lat: number
          level: Database["public"]["Enums"]["incident_level"]
          lng: number
          status: Database["public"]["Enums"]["incident_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lat: number
          level?: Database["public"]["Enums"]["incident_level"]
          lng: number
          status?: Database["public"]["Enums"]["incident_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lat?: number
          level?: Database["public"]["Enums"]["incident_level"]
          lng?: number
          status?: Database["public"]["Enums"]["incident_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          accuracy: number | null
          id: string
          lat: number
          lng: number
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          id?: string
          lat: number
          lng: number
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          id?: string
          lat?: number
          lng?: number
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          place_id: string
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          place_id: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          place_id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: Database["public"]["Enums"]["support_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: Database["public"]["Enums"]["support_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: Database["public"]["Enums"]["support_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string | null
          id: string
          name: string
          photo_url: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          photo_url?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_type: "entry" | "exit" | "violation"
      incident_level: "low" | "medium" | "high" | "critical"
      incident_status: "open" | "in_progress" | "resolved" | "closed"
      support_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "tourist" | "admin" | "police" | "team-leader"
      zone_type: "safe" | "warning" | "restricted" | "emergency"
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
      event_type: ["entry", "exit", "violation"],
      incident_level: ["low", "medium", "high", "critical"],
      incident_status: ["open", "in_progress", "resolved", "closed"],
      support_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["tourist", "admin", "police", "team-leader"],
      zone_type: ["safe", "warning", "restricted", "emergency"],
    },
  },
} as const
