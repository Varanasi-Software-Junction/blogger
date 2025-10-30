/* crx_ui_v1.js (patched)
   Robust feed parsing for Blogger JSON (feed.entry) and items[] shapes.
   - Replaces previous renderRecentPosts implementation
   - Keeps crx_ prefix and small helper utilities
*/

(function windowCRX(){
  'use strict';

  const crx = {
    qs: (s, root=document)=> root.querySelector(s),
    qsa: (s, root=document)=> Array.from(root.querySelectorAll(s)),
    on: (el, ev, fn)=> el && el.addEventListener(ev, fn),
    create: (tag, cls)=> {
      const e = document.createElement(tag);
      if(cls) e.className = cls;
      return e;
    },
    // safe accessor for possible nested $t fields
    textOf: function(x){
      if(!x) return '';
      if(typeof x === 'string') return x;
      if(x.hasOwnProperty('$t')) return String(x['$t']);
      if(x.hasOwnProperty('text')) return String(x.text);
      if(x.rendered) return String(x.rendered);
      return String(x);
    },
    // try common thumbnail locations
    thumbOf: function(entry){
      // 1) media$thumbnail.url
      if(entry && entry['media$thumbnail'] && entry['media$thumbnail'].url) return entry['media$thumbnail'].url;
      // 2) media.thumbnail or thumbnail
      if(entry && entry.media && entry.media.thumbnail && entry.media.thumbnail.url) return entry.media.thumbnail.url;
      // 3) items with thumbnail property
      if(entry && entry.thumbnail && entry.thumbnail.url) return entry.thumbnail.url;
      // 4) content or summary HTML — try to extract first <img src="">
      const htmlFields = ['content','summary','content.$t','summary.$t'];
      for(const k of htmlFields){
        let h = entry[k];
        if(!h && typeof entry === 'object' && entry.content && entry.content['$t']) h = entry.content['$t'];
        if(!h && typeof h === 'object' && h['$t']) h = h['$t'];
        if(!h && typeof h === 'string') {
          const m = h.match(/<img[^>]+src=["']([^"']+)["']/i);
          if(m) return m[1];
        }
      }
      return '';
    },
    // date extractor that handles nested $t and fallbacks
    dateOf: function(entry){
      // common shapes:
      // entry.published.$t OR entry.published OR entry.publishedDate OR entry.publishedTime OR entry['published']
      const cand = (
        (entry && entry.published && entry.published.$t) ||
        entry.published ||
        entry.publishedDate ||
        entry.publishedTime ||
        (entry && entry['published'] && entry['published']['$t']) ||
        (entry && entry.updated && entry.updated.$t) ||
        (entry && entry.updated) ||
        (entry && entry['updated'] && entry['updated']['$t']) ||
        ''
      );
      return String(cand || '');
    },
    formatDate: function(d){
      if(!d) return '';
      // Some feeds provide ISO strings already; some provide "$t" values with timezone.
      // Try Date parsing; if invalid, return original trimmed string
      try {
        const s = String(d).trim();
        const parsed = new Date(s);
        if(!isNaN(parsed.getTime())) {
          // format as user-local short date
          return parsed.toLocaleDateString();
        }
        // sometimes Blogger returns like "2025-10-01T10:00:00.000+05:30" which Date handles; if not, try removing timezone colon
        const alt = s.replace(/([+-]\d{2}):?(\d{2})$/, '$1$2');
        const p2 = new Date(alt);
        if(!isNaN(p2.getTime())) return p2.toLocaleDateString();
        // last resort: show original (trim to first 20 chars)
        return s.split('T')[0] || s.slice(0,20);
      } catch(e){
        return String(d).slice(0,20);
      }
    }
  };

  /* --- menu / smooth scroll --- */
  function initSmoothLinks(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', function(e){
        const tgt = document.querySelector(this.getAttribute('href'));
        if(tgt){ e.preventDefault(); tgt.scrollIntoView({behavior:'smooth', block:'start'}); }
      });
    });
  }

  /* --- run mini code: only JS console style + safe sandboxed eval --- */
  function initMiniRunner(){
    const runBtn = crx.qs('.crx_code_run');
    const input = crx.qs('.crx_code_input');
    const out = crx.qs('.crx_code_output');

    if(!runBtn || !input) return;

    runBtn.addEventListener('click', ()=>{
      const src = input.value || '';
      try {
        const logs = [];
        const _console = { log: (...a)=> logs.push(a.map(x=>String(x)).join(' ')) };
        const fn = new Function('console', '"use strict";\n' + src);
        fn(_console);
        out.textContent = logs.join('\n') || 'Execution finished (no logs).';
      } catch(err){
        out.textContent = 'Error: ' + err.message;
      }
    });
  }

  /* --- render recent posts — robust to Blogger feed.entry and items[] shapes --- */
  function renderRecentPosts(feedUrl){
    const container = crx.qs('.crx_recent_list');
    if(!container) return;

    const sample = [
      {title:'Welcome to Learning Sutras — Start Here---Champak Roy', link:'#', published:'2025-10-01', thumb: ''},
      {title:'How to think like an algorithm', link:'#', published:'2025-09-10', thumb: ''},
      {title:'CSS transitions — simple examples', link:'#', published:'2025-08-24', thumb: ''},
    ];

    function buildAndRender(entries){
      container.innerHTML = '';
      if(!entries || !entries.length){
        // no entries — render fallback
        entries = sample;
      }
      entries.forEach(p=>{
        const row = crx.create('div','crx_post');
        const thumbStyle = p.thumb ? `background-image:url('${p.thumb.replace(/'/g,"\\'")}'); background-size:cover; background-position:center` : '';
        row.innerHTML = `
          <div class="crx_post_thumb" style="${thumbStyle}"></div>
          <div style="flex:1">
            <div class="crx_post_title"><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></div>
            <div class="crx_post_meta">${p.published}</div>
          </div>
        `;
        container.appendChild(row);
      });
    }

    if(!feedUrl){
      console.log('crx_ui: no feed URL, using sample data');
      buildAndRender(sample);
      return;
    }
console.log('crx_ui: fetching feed', feedUrl);
    fetch(feedUrl, {cache:'no-store'})
      .then(r=>{
        if(!r.ok) throw new Error('Feed fetch failed: ' + r.status);
        return r.json();
      })
      .then(data=>{
        let items = [];
        // Blogger: feed.entry
        if(data && data.feed && Array.isArray(data.feed.entry)) {
          items = data.feed.entry;
        // Some feeds: items (Google API style)
        } else if(data && Array.isArray(data.items)) {
          items = data.items;
        // Some feeds: data.entries
        } else if(data && Array.isArray(data.entries)) {
          items = data.entries;
        } else {
          // Unknown shape — try to find an array inside
          for(const k in data){
            if(Array.isArray(data[k]) && data[k].length) {
              items = data[k];
              break;
            }
          }
        }

        // normalize to {title, link, published, thumb}
        const parsed = items.slice(0,6).map(it=>{
          // Title
          const title = crx.textOf(it.title) || crx.textOf(it['title']) || 'Untitled';

          // Link: Blogger uses array 'link' with objects having rel and href
          let link = '#';
          try {
            if(it.link && Array.isArray(it.link)){
              const alt = it.link.find(l => l.rel === 'alternate') || it.link.find(l => l.rel === 'self') || it.link[0];
              if(alt && alt.href) link = alt.href;
            } else if(it.url) link = it.url;
            else if(it.alternate && it.alternate.href) link = it.alternate.href;
            else if(it.link && typeof it.link === 'string') link = it.link;
            else if(it['link'] && it['link']['href']) link = it['link']['href'];
            else if(it.id && typeof it.id === 'string') link = it.id;
          } catch(e){ /* ignore */ }

          // Published
          const rawDate = crx.dateOf(it) || crx.textOf(it.published) || crx.textOf(it.publishedDate) || '';
          const published = crx.formatDate(rawDate) || (rawDate ? rawDate.slice(0,10) : '');

          // Thumbnail
          const thumb = crx.thumbOf(it) || '';

          return { title: title, link: link, published: published, thumb: thumb };
        });

        buildAndRender(parsed);
      })
      .catch(err=>{
        console.warn('crx_ui: feed error', err);
        // fallback sample
        buildAndRender(sample);
      });
  }

  /* --- minimal theme helper: set brand title & subtitle from data attributes --- */
  function applyBranding(){
    const bannerTitle = crx.qs('[data-crx-blog-title]');
    const bannerSub = crx.qs('[data-crx-blog-sub]');
    if(bannerTitle) bannerTitle.textContent = document.body.dataset.crxTitle || 'Learning Sutras';
    if(bannerSub) bannerSub.textContent = document.body.dataset.crxSub || 'Threads of wisdom in code';
  }

  /* --- whatsapp click --- */
  function initWhatsApp(){
    const w = crx.qs('.crx_whatsapp');
    if(!w) return;
    w.addEventListener('click', ()=>{
      const number = w.dataset.number || '';
      const text = encodeURIComponent(w.dataset.text || 'Hello Champak, I want to learn!');
      if(number) window.open(`https://wa.me/${number}?text=${text}`, '_blank');
      else window.open(`https://web.whatsapp.com/`, '_blank');
    });
  }

  /* --- init all --- */
  function initAll(){
    document.addEventListener('DOMContentLoaded', ()=>{
      initSmoothLinks();
      initMiniRunner();
      applyBranding();
      initWhatsApp();

      const feed = document.body.dataset.crxFeed || '';
      renderRecentPosts(feed);
    });
  }

  // expose small API
  window.crxUI = {
    init: initAll,
    renderRecentPosts,
    runSample: ()=> console.log('crxUI ready (patched)')
  };

  // auto-init
  initAll();

})();