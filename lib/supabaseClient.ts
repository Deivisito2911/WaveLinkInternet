// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Creamos un cliente "singleton" para usar en el lado del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)