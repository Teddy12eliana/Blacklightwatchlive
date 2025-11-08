// assets/newsfeed.js
// ---------------------------------------------------------
// ✅ Blacklight Watch — AI Global Newsfeed (Auto + Archive)
// ---------------------------------------------------------
// Fetches live global news every 10 minutes and stores them
// in Supabase as a permanent AI news archive.
// ---------------------------------------------------------

import { supabase } from './supabase.js'; // ✅ Use your same client

const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY'; // 🔑 Replace when ready
const NEWS_ENDPOINT = `https://newsapi.org/v2/top-headlines?language=en&pageSize=6&apiKey=${NEWS_API_KEY}`;

// === MAIN FUNCTION ===
export async function loadNews() {
  const feed = document.getElementById('ai-newsfeed');
  if (!feed) return;

  try {
    const liveArticles = await fetchLiveNews();
    if (liveArticles?.length) {
      await saveNewsToSupabase(liveArticles);
      renderNews(liveArticles);
      console.log(`✅ Displayed ${liveArticles.length} live articles`);
    } else {
      const cached = await fetchNewsFromSupabase();
      renderNews(cached);
      console.log(`🗂 Loaded ${cached.length} cached articles`);
    }
  } catch (err) {
    console.error('❌ Error loading AI newsfeed:', err.message);
    feed.innerHTML = `<p class="muted">⚠️ Failed to load live newsfeed.</p>`;
  }
}

// === FETCH FROM NEWS API ===
async function fetchLiveNews() {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
    console.warn('⚠️ No NewsAPI key — skipping live fetch');
    return [];
  }
  const res = await fetch(NEWS_ENDPOINT, { cache: 'no-store' });
  const { articles } = await res.json();
  return (
    articles?.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name || 'Unknown',
      published_at: a.publishedAt || new Date().toISOString(),
    })) || []
  );
}

// === SAVE TO SUPABASE ===
async function saveNewsToSupabase(articles) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('ai_news').upsert(
      articles.map((a) => ({
        title: a.title,
        summary: a.description,
        url: a.url,
        source: a.source,
        published_at: a.published_at,
      })),
      { onConflict: ['url'] }
    );
    if (error) console.warn('⚠️ Error saving news to Supabase:', error.message);
    else console.log('🧠 Synced news archive to Supabase.');
  } catch (err) {
    console.error('❌ Supabase save error:', err.message);
  }
}

// === FETCH FROM SUPABASE (ARCHIVE) ===
async function fetchNewsFromSupabase() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    console.error('❌ Error loading news from Supabase:', err.message);
    return [];
  }
}

// === DISPLAY NEWS IN HTML ===
function renderNews(articles = []) {
  const feed = document.getElementById('ai-newsfeed');
  if (!feed) return;

  if (!articles.length) {
    feed.innerHTML = `<p class="muted">No news found right now.</p>`;
    return;
  }

  feed.innerHTML = articles
    .map(
      (a) => `
      <div class="news-item">
        <h4><a href="${a.url}" target="_blank">${a.title}</a></h4>
        <p>${a.summary || a.description || ''}</p>
        <small class="muted">${a.source} • ${new Date(
        a.published_at
      ).toLocaleString()}</small>
      </div>`
    )
    .join('');
}

// === AUTO REFRESH (EVERY 10 MINUTES) ===
setInterval(loadNews, 10 * 60 * 1000);
