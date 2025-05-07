export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          specialty_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          specialty_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          specialty_id?: string
          appointment_date?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      doctor_availability: {
        Row: {
          id: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          specialty_id: string | null
          bio: string | null
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          specialty_id?: string | null
          bio?: string | null
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          specialty_id?: string | null
          bio?: string | null
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          birth_date: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      specialties: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
