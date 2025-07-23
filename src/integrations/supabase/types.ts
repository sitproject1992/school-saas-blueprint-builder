<<<<<<< HEAD
=======
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
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          school_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          school_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          school_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_years_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "academic_years_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          class_ids: string[] | null
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_urgent: boolean | null
          published_at: string | null
          school_id: string
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          class_ids?: string[] | null
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_urgent?: boolean | null
          published_at?: string | null
          school_id: string
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          class_ids?: string[] | null
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_urgent?: boolean | null
          published_at?: string | null
          school_id?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "announcements_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string
          date: string
          id: string
          marked_by: string | null
          notes: string | null
          school_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          date: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          school_id?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_import_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_details: Json | null
          failed_imports: number
          file_name: string
          id: string
          import_details: Json | null
          imported_by: string
          school_id: string
          status: string
          successful_imports: number
          total_records: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          failed_imports?: number
          file_name: string
          id?: string
          import_details?: Json | null
          imported_by: string
          school_id: string
          status?: string
          successful_imports?: number
          total_records?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          failed_imports?: number
          file_name?: string
          id?: string
          import_details?: Json | null
          imported_by?: string
          school_id?: string
          status?: string
          successful_imports?: number
          total_records?: number
        }
        Relationships: [
          {
            foreignKeyName: "bulk_import_logs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "bulk_import_logs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number | null
          created_at: string
          grade_level: number | null
          id: string
          name: string
          school_id: string
          section: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          grade_level?: number | null
          id?: string
          name: string
          school_id: string
          section?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          grade_level?: number | null
          id?: string
          name?: string
          school_id?: string
          section?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_id: string
          grade: string | null
          id: string
          marks_obtained: number | null
          max_marks: number | null
          remarks: string | null
          student_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year: string | null
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          name: string
          school_id: string
          start_date: string
          type: Database["public"]["Enums"]["exam_type"]
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          name: string
          school_id: string
          start_date: string
          type: Database["public"]["Enums"]["exam_type"]
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          name?: string
          school_id?: string
          start_date?: string
          type?: Database["public"]["Enums"]["exam_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "exams_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          due_date: string
          fee_structure_id: string
          id: string
          paid_date: string | null
          payment_method: string | null
          receipt_number: string | null
          school_id: string | null
          status: Database["public"]["Enums"]["fee_status"] | null
          student_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          due_date: string
          fee_structure_id: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["fee_status"] | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          due_date?: string
          fee_structure_id?: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["fee_status"] | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "fee_payments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year: string | null
          amount: number
          class_id: string | null
          created_at: string
          due_date: number | null
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          amount: number
          class_id?: string | null
          created_at?: string
          due_date?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          amount?: number
          class_id?: string | null
          created_at?: string
          due_date?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "fee_structures_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      grading_systems: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          scale: Json
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          scale: Json
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          scale?: Json
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grading_systems_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "grading_systems_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "inventory_categories_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          minimum_stock: number | null
          name: string
          quantity: number | null
          school_id: string
          sku: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          minimum_stock?: number | null
          name: string
          quantity?: number | null
          school_id: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          minimum_stock?: number | null
          name?: string
          quantity?: number | null
          school_id?: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "inventory_items_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          movement_type: string
          quantity: number
          reason: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          movement_type: string
          quantity: number
          reason?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          movement_type?: string
          quantity?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          fee_structure_id: string
          id: string
          paid_date: string | null
          school_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          fee_structure_id: string
          id?: string
          paid_date?: string | null
          school_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          fee_structure_id?: string
          id?: string
          paid_date?: string | null
          school_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          actual_date: string | null
          class_id: string
          content: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          notes: string | null
          objectives: string | null
          planned_date: string
          resources: string | null
          school_id: string | null
          subject_id: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          actual_date?: string | null
          class_id: string
          content?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          objectives?: string | null
          planned_date: string
          resources?: string | null
          school_id?: string | null
          subject_id: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          actual_date?: string | null
          class_id?: string
          content?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          objectives?: string | null
          planned_date?: string
          resources?: string | null
          school_id?: string | null
          subject_id?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "lesson_plans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          email_notifications: Json | null
          id: string
          in_app_notifications: Json | null
          school_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: Json | null
          id?: string
          in_app_notifications?: Json | null
          school_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: Json | null
          id?: string
          in_app_notifications?: Json | null
          school_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "notification_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_students: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          parent_id: string
          relationship: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relationship?: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          employee_id: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          school_id: string | null
          student_id: string | null
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          employee_id?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          student_id?: string | null
          updated_at?: string
          user_id: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          employee_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          student_id?: string | null
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      school_admin_accounts: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          locked_until: string | null
          login_attempts: number
          must_change_password: boolean
          password_changed_at: string
          password_hash: string
          phone: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          locked_until?: string | null
          login_attempts?: number
          must_change_password?: boolean
          password_changed_at?: string
          password_hash: string
          phone?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          locked_until?: string | null
          login_attempts?: number
          must_change_password?: boolean
          password_changed_at?: string
          password_hash?: string
          phone?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_admin_accounts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "school_admin_accounts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_admins: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string | null
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_admins_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "school_admins_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          subdomain: string
          subscription_expires_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          theme_color: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          subdomain: string
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          theme_color?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          subdomain?: string
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          theme_color?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      student_fee_structures: {
        Row: {
          created_at: string
          fee_structure_id: string
          id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          fee_structure_id: string
          id?: string
          student_id: string
        }
        Update: {
          created_at?: string
          fee_structure_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_fee_structures_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fee_structures_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string | null
          admission_number: string
          blood_group: string | null
          class_id: string | null
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          medical_conditions: string | null
          profile_id: string
          school_id: string
          updated_at: string
        }
        Insert: {
          admission_date?: string | null
          admission_number: string
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          medical_conditions?: string | null
          profile_id: string
          school_id: string
          updated_at?: string
        }
        Update: {
          admission_date?: string | null
          admission_number?: string
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          medical_conditions?: string | null
          profile_id?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          super_admin_id: string
          target_id: string
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          super_admin_id: string
          target_id: string
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          super_admin_id?: string
          target_id?: string
          target_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      syllabus: {
        Row: {
          academic_year: string | null
          class_id: string
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          school_id: string
          subject_id: string
          title: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          class_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          school_id: string
          subject_id: string
          title: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          class_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          school_id?: string
          subject_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "syllabus_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syllabus_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syllabus_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "syllabus_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syllabus_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          date: string
          id: string
          marked_by: string | null
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          teacher_id: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          teacher_id: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          class_id: string
          created_at: string
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          class_id: string | null
          created_at: string
          experience_years: number | null
          id: string
          is_class_teacher: boolean | null
          joining_date: string | null
          profile_id: string
          qualification: string | null
          salary: number | null
          school_id: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          is_class_teacher?: boolean | null
          joining_date?: string | null
          profile_id: string
          qualification?: string | null
          salary?: number | null
          school_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          is_class_teacher?: boolean | null
          joining_date?: string | null
          profile_id?: string
          qualification?: string | null
          salary?: number | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_dashboard_data"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      school_dashboard_data: {
        Row: {
          absent_today: number | null
          active_fee_structures: number | null
          pending_payments: number | null
          present_today: number | null
          school_id: string | null
          school_name: string | null
          total_classes: number | null
          total_students: number | null
          total_subjects: number | null
          total_teachers: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_default_school_data: {
        Args: { school_id: string }
        Returns: undefined
      }
      create_school_admin_account: {
        Args: {
          p_school_id: string
          p_email: string
          p_password: string
          p_first_name: string
          p_last_name: string
          p_phone?: string
        }
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_school_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_school_admin_password: {
        Args: { p_account_id: string; p_new_password: string }
        Returns: undefined
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "late" | "excused"
      exam_type:
        | "pre_test"
        | "post_test"
        | "weekly"
        | "monthly"
        | "major"
        | "final"
      fee_status: "pending" | "paid" | "overdue" | "cancelled"
      subscription_status: "active" | "inactive" | "suspended" | "cancelled"
      user_role:
        | "super_admin"
        | "school_admin"
        | "teacher"
        | "student"
        | "parent"
        | "accountant"
        | "inventory_manager"
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
      attendance_status: ["present", "absent", "late", "excused"],
      exam_type: [
        "pre_test",
        "post_test",
        "weekly",
        "monthly",
        "major",
        "final",
      ],
      fee_status: ["pending", "paid", "overdue", "cancelled"],
      subscription_status: ["active", "inactive", "suspended", "cancelled"],
      user_role: [
        "super_admin",
        "school_admin",
        "teacher",
        "student",
        "parent",
        "accountant",
        "inventory_manager",
      ],
    },
  },
} as const
>>>>>>> origin/main
