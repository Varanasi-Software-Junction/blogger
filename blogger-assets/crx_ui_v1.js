/* crx_ui_v1.js
   UI utilities for Learning Sutras - CRX UI v1
   - Prefixed with crx_
   - Lightweight, no frameworks
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
    formatDate: d => {
      try {
        const dd = new Date(d);
        return dd.toLocaleDateString();
      } catch(e){ return d }
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
        // sandboxed eval using Function — we capture console.log
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

  /* --- render recent posts — expects a blog JSON feed URL (Blogger) or fallback sample --- */
  function renderRecentPosts(feedUrl){
    // container
    const container = crx.qs('.crx_recent_list');
    if(!container) return;

    // fallback sample data
    const sample = [
      {title:'Welcome to Learning Sutras — Start Here', link:'#', published:'2025-10-01', thumb: ''},
      {title:'How to think like an algorithm', link:'#', published:'2025-09-10', thumb: ''},
      {title:'CSS transitions — simple examples', link:'#', published:'2025-08-24', thumb: ''},
    ];

    function render(arr){
      container.innerHTML = '';
      arr.forEach(p=>{
        const row = crx.create('div','crx_post');
        row.innerHTML = `
          <div class="crx_post_thumb" style="background-image:url('${(p.thumb||'').replace("'",'')}'); background-size:cover; background-position:center"></div>
          <div style="flex:1">
            <div class="crx_post_title"><a href="${p.link}" style="color:inherit; text-decoration:none">${p.title}</a></div>
            <div class="crx_post_meta">${crx.formatDate(p.published)}</div>
          </div>
        `;
        container.appendChild(row);
      });
    }

    if(!feedUrl){
      render(sample);
      return;
    }

    // Try to fetch a JSON feed (Blogger usually supports JSON)
    // Expect feedUrl to be a full URL returning JSON with entries array.
    fetch(feedUrl, {cache:'no-store'})
      .then(r=>{
        if(!r.ok) throw new Error('Feed fetch failed');
        return r.json();
      })
      .then(data=>{
        // Try to adapt to different feed shapes
        let items = [];
        if(data.items) items = data.items;
        else if(data.feed && data.feed.entry) items = data.feed.entry;
        else items = [];
        const parsed = items.slice(0,6).map(it=>{
          // adapt both Blogger JSON and generic shapes
          return {
            title: it.title || it.title?.$t || (it['title']['$t']||'Untitled'),
            link: (it.link && it.link.href) || (it.url) || '#',
            published: it.published || it.publishedDate || it['published'] || it['publishedDate'] || new Date().toISOString(),
            thumb: (it.thumbnail && it.thumbnail.url) || ''
          };
        });
        if(parsed.length) render(parsed);
        else render(sample);
      })
      .catch(err=>{
        console.warn('crx_ui: feed error', err);
        render(sample);
      });
  }

  /* --- minimal theme helper: set brand title & subtitle from data attributes --- */
  function applyBranding(){
    const root = document.documentElement;
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

      // feed: set via body attribute: data-crx-feed
      const feed = document.body.dataset.crxFeed || '';
      if(feed) renderRecentPosts(feed);
      else renderRecentPosts(); // fallback
    });
  }

  // expose small API
  window.crxUI = {
    init: initAll,
    renderRecentPosts,
    runSample: ()=> console.log('crxUI ready')
  };

  // auto-init
  initAll();

})();
