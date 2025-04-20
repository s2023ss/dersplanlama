import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anonim Anahtar .env dosyasında tanımlanmalıdır.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 