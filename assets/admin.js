const supa = window.supabase;
const msgEl = document.getElementById('postMsg') || document.getElementById('msg');
if(!supa && msgEl){ msgEl.textContent = 'Supabase not configured. Open Settings.'; }
const postBtn = document.getElementById('btnPost') || document.getElementById('btnSubmit');
if(postBtn){
  postBtn.addEventListener('click', async () => {
    const category = document.getElementById('category').value;
    const country = document.getElementById('country').value;
    const source = (document.getElementById('source')?.value) || '';
    const summary = document.getElementById('summary').value;
    if (!category || !country || !summary) {
      if(msgEl) msgEl.textContent = '⚠️ Please fill all fields.';
      return;
    }
    const { error } = await supa.from('reports').insert([{ category, country, source_name: source, summary, verified: true }]);
    if (error) { if(msgEl) msgEl.textContent = '❌ Error: ' + error.message; console.error(error); }
    else { if(msgEl) msgEl.textContent = '✅ Report added.'; document.getElementById('summary').value=''; }
  });
}