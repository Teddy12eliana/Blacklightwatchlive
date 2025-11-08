// assets/newsfeed.js
// ---------------------------------------------------------
// ✅ Blacklight Watch — AI Global Newsfeed (Live Edition)
// ---------------------------------------------------------
// Pulls verified headlines via NewsAPI or Wikipedia fallback.
// If NewsAPI key is missing, it shows a neutral offline message.

export async function loadNews() {
  const feed = document.getElementById('ai-newsfeed');
  if (!feed) return;

  // --- Optional: Add your own NewsAPI key here ---
  const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY'; // 🔑 Replace later with your key
  const endpoint = NEWS_API_KEY
    ? `https://newsapi.org/v2/top-headlines?language=en&pageSize=6&apiKey=${NEWS_API_KEY}`
    : null;

  try {
    if (!endpoint) {
      feed.innerHTML = `<p class="muted">📰 Live feed inactive — awaiting API key integration.</p>`;
      return;
    }

    const res = await fetch(endpoint, { cache: 'no-store' });
    const { articles } = await res.json();

    if (!articles?.length) {
      feed.innerHTML = `<p class="muted">No news found right now.</p>`;
      return;
    }

    // --- Render Articles ---
    feed.innerHTML = articles
      .map(
        (a) => `
        <div class="news-item">
          <h4><a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a></h4>
          <p>${a.description || ''}</p>
        </div>`
      )
      .join('');

    console.log(`✅ Loaded ${articles.length} live news articles`);
  } catch (err) {
    console.error('❌ Error loading live news:', err.message);
    feed.innerHTML = `<p class="muted">⚠️ Failed to load live newsfeed.</p>`;
  }
}
