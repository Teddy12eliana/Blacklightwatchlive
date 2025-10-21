const settingsModal = document.getElementById('settingsModal');
const openBtn = document.getElementById('openSettings');
if(openBtn){ openBtn.onclick = ()=> settingsModal.showModal(); }
const saveCfg = document.getElementById('saveCfg');
if(saveCfg){
  saveCfg.onclick = () => {
    const url = document.getElementById('cfgUrl').value.trim();
    const key = document.getElementById('cfgKey').value.trim();
    if(url && key){ localStorage.setItem('sb_url', url); localStorage.setItem('sb_key', key); location.reload(); }
  };
}

async function loadReports(){
  const el = document.getElementById('reports');
  if(!window.supabase || !el){ return; }
  const { data, error } = await supabase.from('reports').select('*').order('created_at',{ascending:false}).limit(10);
  if(error){ el.innerHTML = '<p class="muted">Error loading reports</p>'; return; }
  el.innerHTML = (data||[]).map(r => `
    <div class="item">
      <div class="row"><strong>${r.category}</strong> — <span>${r.country}</span> <span class="pill">${r.verified ? 'Verified' : 'Community'}</span></div>
      <div class="muted">${r.source_name || ''}</div>
      <div>${r.summary || ''}</div>
    </div>
  `).join('') || '<p class="muted">No reports yet.</p>';
  const fres = document.getElementById('freshness');
  if(fres){ fres.textContent = 'Last updated just now'; }
}
loadReports();
setInterval(loadReports, 120000);

window.initMapOnce = () => {
  if(window._mapInit) return;
  window._mapInit = true;
  const div = document.getElementById('map');
  if(!div){ return; }
  div.innerHTML = '<iframe title="map" style="width:100%;height:420px;border:0;border-radius:12px" src="https://www.openstreetmap.org/export/embed.html?bbox=0,-20,60,40&layer=mapnik"></iframe>';
};