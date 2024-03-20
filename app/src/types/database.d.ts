export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      division: {
        Row: {
          created_at: string
          id: string
          kabinet_id: string
          name: string | null
          type: Database["public"]["Enums"]["DivisionType"]
        }
        Insert: {
          created_at?: string
          id?: string
          kabinet_id: string
          name?: string | null
          type: Database["public"]["Enums"]["DivisionType"]
        }
        Update: {
          created_at?: string
          id?: string
          kabinet_id?: string
          name?: string | null
          type?: Database["public"]["Enums"]["DivisionType"]
        }
        Relationships: [
          {
            foreignKeyName: "public_division_kabinet_id_fkey"
            columns: ["kabinet_id"]
            isOneToOne: false
            referencedRelation: "kabinet"
            referencedColumns: ["id"]
          },
        ]
      }
      division_user: {
        Row: {
          created_at: string
          division_id: string
          division_user_type: Database["public"]["Enums"]["DivisionUserType"]
          id: string
          kabinet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          division_id: string
          division_user_type?: Database["public"]["Enums"]["DivisionUserType"]
          id?: string
          kabinet_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          division_id?: string
          division_user_type?: Database["public"]["Enums"]["DivisionUserType"]
          id?: string
          kabinet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_division_user_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "division"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_division_user_kabinet_id_fkey"
            columns: ["kabinet_id"]
            isOneToOne: false
            referencedRelation: "kabinet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_division_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kabinet: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          image: string | null
          isActive: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          id: string
          image?: string | null
          isActive?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          isActive?: boolean
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          setting: Database["public"]["Enums"]["Settings"]
          value: Json
        }
        Insert: {
          setting: Database["public"]["Enums"]["Settings"]
          value: Json
        }
        Update: {
          setting?: Database["public"]["Enums"]["Settings"]
          value?: Json
        }
        Relationships: []
      }
      user_role: {
        Row: {
          role: Database["public"]["Enums"]["Role"][] | null
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["Role"][] | null
          user_id?: string
        }
        Update: {
          role?: Database["public"]["Enums"]["Role"][] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      DivisionType: "ketua" | "sekretaris" | "bendahara" | "MPA" | "divisi"
      DivisionUserType: "ketua" | "anggota"
      Role: "ADMIN" | "BPH" | "STUDENT"
      Settings:
        | "signup_is_enabled"
        | "signup_default_role"
        | "signup_default_status"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

