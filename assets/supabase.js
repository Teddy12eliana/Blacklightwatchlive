// assets/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Helper: read from Vite env (when present) or from window-injected vars
const readEnv = (name) =>
  (typeof import.meta !== 'undefined' &&
   import.meta.env &&
   Object.prototype.hasOwnProperty.call(import.meta.env, name) &&
   import.meta.env[name]) ||
  (typeof window !== 'undefined' && window[name]) ||
  '';

// ⬅️ Use your NEW project URL below as the only fallback (no secrets in code)
const SUPABASE_URL =
  readEnv('VITE_SUPABASE_URL') ||
  'https://cfdgliylbyozaajfpyhe.supabase.co'; // <-- new URL

// ⛔ No hardcoded key fallback. Must come from env.
const SUPABASE_KEY = readEnv('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');
}

// Create client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Optional: debug
window.supabase = supabase;
console.log('✅ Supabase initialized:', SUPABASE_URL);
