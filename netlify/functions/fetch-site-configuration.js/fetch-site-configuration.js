// netlify/functions/fetch-site-configuration.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ✅ Securely load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// ✅ Initialize Supabase client once
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function handler() {
  try {
    // ✅ Check for missing environment variables
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('❌ Missing Supabase environment variables. Make sure they are set in Netlify > Site Settings > Environment Variables.');
    }

    // ✅ Query: fetch latest 25 reports
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(25);

    if (error) {
      console.error('Supabase query error:', error.message);
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    // ✅ Successful response
    return {   
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        count: data?.length || 0,
        reports: data,
      }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
