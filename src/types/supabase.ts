
// This file is for your Supabase table types.
// You can generate these types automatically using the Supabase CLI:
// supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/supabase.ts
// For now, we'll use a placeholder.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your tables here once you create them in Supabase
      // Example:
      // lectures: {
      //   Row: {
      //     id: string
      //     user_id: string
      //     created_at: string
      //     youtube_video_id: string
      //     title: string
      //     subject: string
      //     notes: string | null
      //     thumbnail_url: string
      //     video_url: string
      //   }
      //   Insert: {
      //     id?: string
      //     user_id: string // Typically set automatically or from session
      //     created_at?: string
      //     youtube_video_id: string
      //     title: string
      //     subject: string
      //     notes?: string | null
      //     thumbnail_url: string
      //     video_url: string
      //   }
      //   Update: {
      //     id?: string
      //     user_id?: string
      //     created_at?: string
      //     youtube_video_id?: string
      //     title?: string
      //     subject?: string
      //     notes?: string | null
      //     thumbnail_url?: string
      //     video_url?: string
      //   }
      //   Relationships: [
      //     {
      //       foreignKeyName: "lectures_user_id_fkey"
      //       columns: ["user_id"]
      //       referencedRelation: "users" // Supabase auth users table
      //       referencedColumns: ["id"]
      //     }
      //   ]
      // }
      // timestamps: {
      //    Row: {
      //        id: string;
      //        lecture_id: string;
      //        user_id: string; // if timestamps are user-specific within a shared lecture
      //        time: string; 
      //        label: string;
      //        created_at: string;
      //    };
      //    Insert: {
      //        id?: string;
      //        lecture_id: string;
      //        user_id: string;
      //        time: string;
      //        label: string;
      //        created_at?: string;
      //    };
      //    Update: {
      //        id?: string;
      //        lecture_id?: string;
      //        user_id?: string;
      //        time?: string;
      //        label?: string;
      //        created_at?: string;
      //    };
      //    Relationships: [
      //        {
      //           foreignKeyName: "timestamps_lecture_id_fkey";
      //           columns: ["lecture_id"];
      //           referencedRelation: "lectures";
      //           referencedColumns: ["id"];
      //        },
      //        {
      //           foreignKeyName: "timestamps_user_id_fkey";
      //           columns: ["user_id"];
      //           referencedRelation: "users";
      //           referencedColumns: ["id"];
      //        }
      //    ];
      // }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
