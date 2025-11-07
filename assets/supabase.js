// assets/predictions.js
// ---------------------------------------------------------
// ✅ Blacklight Watch - AI Predictions Loader (Final Working Version)
// ---------------------------------------------------------

import supabaseModule from './supabase.js';
const supabase = supabaseModule;

// Utility: Wait for Supabase to be ready
async function waitForSupabase() {
  let attempts = 0;
  while ((!supabase || typeof supabase.from !== 'function') && attempts < 10) {
    console.log('⏳ Waiting for Supabase...');
    await new Promise((r) => setTimeout(r, 600));
    attempts++;
  }
  if (!supabase) throw new Error('Supabase not ready after waiting.');
  return supabase;
}

// Main: Load AI Predictions from Supabase
export async function loadPredictions() {
  try {
    const sb = await waitForSupabase();

    const { data, error } = await sb
      .from('ai_predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Supabase fetch error:', error.message);
      return;
    }

    console.log(`✅ Loaded ${data?.length || 0} predictions`);
    updatePredictionUI(data);
  } catch (err) {
    console.error('❌ Error loading predictions:', err.message);
  }
}

// Update the HTML UI with loaded predictions
function updatePredictionUI(predictions = []) {
  const cards = document.querySelectorAll('.pred-card');
  predictions.forEach((p, i) => {
    const card = cards[i];
    if (!card) return;

    const meter = card.querySelector('.meter span');
    const note = card.querySelector('.pred-note');

    if (meter) meter.style.width = `${p.risk_score || 0}%`;
    if (note) note.textContent = p.prediction || 'No data';
  });

  console.log('✅ Predictions updated in UI');
}
