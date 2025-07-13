import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  throw new Error('Supabase URL, anon key, or service key is not defined in environment variables.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)
