import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = https://YOUR_REAL_PROJECT_URL.supabase.co
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZWpzZnFqd2ZmdHFteGVlZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk1NjAsImV4cCI6MjA3NjIwNTU2MH0.oHNyR8aMtS5oLfDWQq2Q3gTjHdIWuG9omHK0SGRFX_k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabase;
