// assets/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ✅ TEMPORARY TEST — add this block right under the import
const testUrl = 'https://cfdgliylbyozaajfpyhe.supabase.co';
const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZGdsaXlsYnlvemFhamZweWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzczNjMsImV4cCI6MjA3NjkxMzM2M30.tHJLV1TJkdhp-63Fe9RBIuyB1G5JGHZ3TmrxBRzdmjA'; // ⬅️ paste your actual anon key (from Supabase API settings)

console.log('🧪 Testing direct connection...');
const supabaseTest = createClient(testUrl, testKey);
supabaseTest.from('reports').select('*').then(console.log);

// ✅ Helper to read environment variables (from Netlify or injected in HTML)
const readEnv = (name) =>
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    Object.prototype.hasOwnProperty.call(import.meta.env, name) &&
    import.meta.env[name]) ||
  (typeof window !== 'undefined' && window[name]) ||
  '';

// ✅ Load Supabase URL and Key (from environment)
const SUPABASE_URL = readEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = readEnv('VITE_SUPABASE_ANON_KEY');

// ✅ Check environment setup
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase not initialized — missing env vars.');
} else {
  console.log('✅ Supabase initialized:', SUPABASE_URL);
}

// ✅ Create Supabase client (the real one)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Fetch reports (used by index.html)
export async function fetchReports() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Supabase query error:', error.message);
      return [];
    }

    console.log(`✅ Loaded ${data?.length || 0} reports`);
    return data || [];
  } catch (err) {
    console.error('❌ Failed to fetch reports:', err.message);
    return [];
  }
}
