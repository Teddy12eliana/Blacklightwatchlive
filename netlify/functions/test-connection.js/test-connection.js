// netlify/functions/test-connection.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ✅ Create Supabase client using secure environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler() {
  try {
    // ✅ Query a single row to test connection
    const { data, error } = await supabase.from('reports').select('*').limit(1);
    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    };
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
