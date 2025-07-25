import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for better TypeScript support
export type Database = {
  // Add your database types here as you create tables
};

// Helper functions for common operations
export const auth = supabase.auth;
export const storage = supabase.storage;
