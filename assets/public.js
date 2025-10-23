// 🧠 Settings modal logic
const settingsModal = document.getElementById('settingsModal');
const openBtn = document.getElementById('openSettings');
if (openBtn) {
  openBtn.onclick = () => settingsModal.showModal();
}
const saveCfg = document.getElementById('saveCfg');
if (saveCfg) {
  saveCfg.onclick = () => {
    const url = document.getElementById('cfgUrl').value.trim();
    const key = document.getElementById('cfgKey').value.trim();
    if (url && key) {
      localStorage.setItem('sb_url', url);
      localStorage.setItem('sb_key', key);
      location.reload();
    }
  };
}

// ✅ Wait for Supabase to be ready
async function waitForSupabase() {
  for (let i = 0; i < 20; i++) {
    if (window.supabase && typeof supabase.from === 'function') return true;
    await new Promise(r => setTimeout(r, 250));
  }
  console.error("Supabase client failed to initialize.");
  return false;
}

// 🚀 Load reports from Supabase
async function loadReports() {
  const el = document.getElementById('reports');
  if (!el) return;

  const ready = await waitForSupabase();
  if (!ready) {
    el.innerHTML = '<p class="muted">Supabase not initialized.</p>';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading reports:', error);
      el.innerHTML = '<p class="muted">Error loading reports.</p>';
      return;
    }

    if (!data || data.length === 0) {
      el.innerHTML = '<p class="muted">No reports yet.</p>';
      return;
    }

    el.innerHTML = data
      .map(
        r => `
      <div class="item">
        <div class="row"><strong>${r.category}</strong> — <span>${r.country}</span> <span class="pill">${r.verified ? 'Verified' : 'Community'}</span></div>
        <div class="muted">${r.source_name || ''}</div>
        <div>${r.summary || ''}</div>
      </div>`
      )
      .join('');

    const fres = document.getElementById('freshness');
    if (fres) fres.textContent = 'Last updated just now';
  } catch (err) {
    console.error('Exception loading reports:', err);
    el.innerHTML = '<p class="muted">Unexpected error loading reports.</p>';
  }
}

// 🕒 Refresh reports every 2 minutes
loadReports();
setInterval(loadReports, 120000);

// 🗺️ Initialize map
window.initMapOnce = () => {
  if (window._mapInit) return;
  window._mapInit = true;
  const div = document.getElementById('map');
  if (!div) return;
  div.innerHTML =
    '<iframe title="map" style="width:100%;height:420px;border:0;border-radius:12px" src="https://www.openstreetmap.org/export/embed.html?bbox=0,-20,60,40&layer=mapnik"></iframe>';
};
