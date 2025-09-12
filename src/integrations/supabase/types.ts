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
      artwork: {
        Row: {
          category: Database["public"]["Enums"]["artwork_category"]
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          image_urls: string[] | null
          is_available: boolean | null
          is_featured: boolean | null
          medium: Database["public"]["Enums"]["artwork_medium"] | null
          price: number | null
          style: Database["public"]["Enums"]["artwork_style"] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["artwork_category"]
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          medium?: Database["public"]["Enums"]["artwork_medium"] | null
          price?: number | null
          style?: Database["public"]["Enums"]["artwork_style"] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["artwork_category"]
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          medium?: Database["public"]["Enums"]["artwork_medium"] | null
          price?: number | null
          style?: Database["public"]["Enums"]["artwork_style"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_packages: {
        Row: {
          base_price: number
          category: Database["public"]["Enums"]["artwork_category"]
          created_at: string
          description: string
          id: string
          image_url: string | null
          includes: string[] | null
          is_active: boolean | null
          name: string
          style: Database["public"]["Enums"]["artwork_style"] | null
          turnaround_days: number | null
          updated_at: string
        }
        Insert: {
          base_price: number
          category: Database["public"]["Enums"]["artwork_category"]
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          includes?: string[] | null
          is_active?: boolean | null
          name: string
          style?: Database["public"]["Enums"]["artwork_style"] | null
          turnaround_days?: number | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: Database["public"]["Enums"]["artwork_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          includes?: string[] | null
          is_active?: boolean | null
          name?: string
          style?: Database["public"]["Enums"]["artwork_style"] | null
          turnaround_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      commission_requests: {
        Row: {
          created_at: string
          custom_requirements: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          estimated_price: number | null
          id: string
          notes: string | null
          package_id: string | null
          reference_images: string[] | null
          status: Database["public"]["Enums"]["commission_status"] | null
          updated_at: string
          voice_note_url: string | null
        }
        Insert: {
          created_at?: string
          custom_requirements?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          estimated_price?: number | null
          id?: string
          notes?: string | null
          package_id?: string | null
          reference_images?: string[] | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          updated_at?: string
          voice_note_url?: string | null
        }
        Update: {
          created_at?: string
          custom_requirements?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          estimated_price?: number | null
          id?: string
          notes?: string | null
          package_id?: string | null
          reference_images?: string[] | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          updated_at?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_requests_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "commission_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_bookings: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          notes: string | null
          preferred_time: string | null
          project_description: string | null
          scheduled_datetime: string | null
          status: Database["public"]["Enums"]["consultation_status"] | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          notes?: string | null
          preferred_time?: string | null
          project_description?: string | null
          scheduled_datetime?: string | null
          status?: Database["public"]["Enums"]["consultation_status"] | null
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          notes?: string | null
          preferred_time?: string | null
          project_description?: string | null
          scheduled_datetime?: string | null
          status?: Database["public"]["Enums"]["consultation_status"] | null
          updated_at?: string
          whatsapp_number?: string
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
      artwork_category:
        | "original_painting"
        | "digital_art"
        | "print"
        | "illustration"
      artwork_medium:
        | "oil"
        | "acrylic"
        | "watercolor"
        | "digital"
        | "pencil"
        | "charcoal"
        | "mixed_media"
      artwork_style:
        | "portrait"
        | "landscape"
        | "abstract"
        | "still_life"
        | "contemporary"
        | "realism"
      commission_status: "pending" | "in_progress" | "completed" | "cancelled"
      consultation_status: "requested" | "scheduled" | "completed" | "cancelled"
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
      artwork_category: [
        "original_painting",
        "digital_art",
        "print",
        "illustration",
      ],
      artwork_medium: [
        "oil",
        "acrylic",
        "watercolor",
        "digital",
        "pencil",
        "charcoal",
        "mixed_media",
      ],
      artwork_style: [
        "portrait",
        "landscape",
        "abstract",
        "still_life",
        "contemporary",
        "realism",
      ],
      commission_status: ["pending", "in_progress", "completed", "cancelled"],
      consultation_status: ["requested", "scheduled", "completed", "cancelled"],
    },
  },
} as const
