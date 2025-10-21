(function() {
  const defaults = { url: "https://wpejsfqjwfftqmxee.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZWpzZnFqd2ZmdHFteGVlZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk1NjAsImV4cCI6MjA3NjIwNTU2MH0.oHNyR8aMtS5oLfDWQq2Q3gTjHdIWuG9omHK0SGRFX_k" };
  const cfg = {
    url: localStorage.getItem('sb_url') || defaults.url,
    key: localStorage.getItem('sb_key') || defaults.key
  };
  const badge = document.getElementById('supabaseBadge');
  if(!cfg.url || !cfg.key) {
    if(badge) badge.textContent = 'Missing Supabase config';
    window.supabase = null;
    return;
  }
  window.supabase = window.supabase || supabase.createClient(cfg.url, cfg.key);
  if(badge) badge.textContent = 'Connected to Supabase';
})();