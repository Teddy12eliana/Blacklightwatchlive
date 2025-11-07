// assets/supabase.js
// ---------------------------------------------------------
// ✅ Blacklight Watch Supabase Integration (Stable Version)
// ---------------------------------------------------------
// Works seamlessly with Netlify live environment variables
// or local .env builds via Vite. Includes async protection
// to ensure envs load before Supabase initializes.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ✅ Helper to read environment variables (from Netlify or HTML)
const readEnv = (name) =>
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    Object.prototype.hasOwnProperty.call(import.meta.env, name) &&
    import.meta.env[name]) ||
  (typeof window !== 'undefined' && window[name]) ||
  '';

// ✅ Asynchronous Supabase initialization (safe load)
let supabase = null;

(async () => {
  try {
    // Wait for Netlify env injection if available
    if (window.__envPromise) await window.__envPromise;

    const SUPABASE_URL = readEnv('VITE_SUPABASE_URL');
    const SUPABASE_KEY = readEnv('VITE_SUPABASE_ANON_KEY');

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ Supabase not initialized — missing env vars.');
      return;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase initialized:', SUPABASE_URL);
  } catch (err) {
    console.error('❌ Error initializing Supabase:', err);
  }
})();

// ---------------------------------------------------------
// ✅ Fetch Reports (used by index.html)
// ---------------------------------------------------------
export async function fetchReports() {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase not ready yet, waiting...');
      await new Promise((r) => setTimeout(r, 1200));
    }

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
