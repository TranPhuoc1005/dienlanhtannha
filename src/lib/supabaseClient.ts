import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Kiểm tra xem cấu hình Supabase có hợp lệ hay không
export const hasSupabaseConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey !== "your-anon-key-here";

// Khởi tạo Supabase client an toàn
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;
