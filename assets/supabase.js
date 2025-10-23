import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wpejsfqjwfftqmxee.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZWpzZnFqd2ZmdHFteGVlZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzM0NTQsImV4cCI6MjA3Njc0OTQ1NH0.i-Zrfr9povPEhMOwGOp-DMZdOVdi-l4tFX7V24M1gs0';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Debug
window.supabase = supabase;
console.log('✅ Supabase initialized:', SUPABASE_URL);
