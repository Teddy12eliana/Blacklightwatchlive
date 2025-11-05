// assets/predictions.js
import { supabase } from './supabase.js';

function setMeter(key, pct, note) {
  const bar = document.querySelector(`.meter[data-key="${key}"] span`);
  const noteEl = document.querySelector(
    `.pred-note[data-key="${key.replace('_risk','_note')
      .replace('_sentiment','_note')
      .replace('_signal','_note')}"]`
  );
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, Number(pct) || 0))}%`;
  if (noteEl && note) noteEl.textContent = note;
}

export async function loadPredictions() {
  try {
    // latest prediction
    const { data: preds, error: perr } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!perr && preds?.length) {
      const p = preds[0];
      setMeter('conflict_risk', p.conflict_risk_pct, p.conflict_note || '—');
      setMeter('health_risk', p.health_risk_pct, p.health_note || '—');
      setMeter('economy_sentiment', p.economy_sentiment_pct, p.economy_note || '—');
    }

    // latest investor signal
    const { data: inv, error: ierr } = await supabase
      .from('investor_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!ierr && inv?.length) {
      const i = inv[0];
      setMeter('investor_signal', i.signal_strength_pct, i.summary || '—');
    }
  } catch (e) {
    console.error('❌ loadPredictions failed:', e.message);
  }
}
