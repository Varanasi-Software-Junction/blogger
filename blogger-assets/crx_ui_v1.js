/* crx_ui_v1.js
   UI helpers + widget loader v1
   Host at: https://varanasi-software-junction.github.io/blogger/crx_ui_v1.js
   NOTE: this file expects files (crx_affiliates.json, crx_bio.html, crx_donate.html)
         to be in same repo root.
*/

(function(){
  const BASE = "https://varanasi-software-junction.github.io/blogger";

  /* --------------------------
     Utility helpers
     --------------------------*/
  window.crx_toggleAnswer = function(id){
    try {
      const el = document.getElementById(id);
      if(!el) return;
      el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    } catch(e){ console.warn("crx_toggleAnswer:", e); }
  };

  window.crx_copyCode = function(btnId, codeId){
    try {
      const codeEl = document.getElementById(codeId);
      if(!codeEl) return;
      const text = codeEl.innerText || codeEl.textContent;
      if(!navigator.clipboard) {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } else {
        navigator.clipboard.writeText(text);
      }
      const btn = document.getElementById(btnId);
      if(btn){
        const orig = btn.innerText;
        btn.innerText = "✅ Copied";
        setTimeout(()=> btn.innerText = orig, 1400);
      }
    } catch(e){ console.warn("crx_copyCode:", e); }
  };

  /* --------------------------
     Load a static HTML fragment into element
     fragmentName -> crx_<name>.html
     --------------------------*/
  window.crx_loadWidget = async function(name, targetEl){
    if(!name || !targetEl) return;
    const url = `${BASE}/crx_${name}.html`;
    try {
      const res = await fetch(url, {cache: "no-cache"});
      if(!res.ok) throw new Error("Widget fetch failed: " + res.status);
      const html = await res.text();
      targetEl.innerHTML = html;
    } catch(e){
      console.error("crx_loadWidget:", e);
    }
  };

  /* --------------------------
     Load 2 random affiliates into targetId
     expects crx_affiliates.json with { products: [...] }
     --------------------------*/
  window.crx_loadAffiliates = async function(targetId){
    const tgt = document.getElementById(targetId);
    if(!tgt) return;
    const url = `${BASE}/crx_affiliates.json`;
    try {
      const res = await fetch(url, {cache: "no-cache"});
      if(!res.ok) throw new Error("Affiliate JSON fetch failed");
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products.slice() : [];
      if(products.length === 0){
        tgt.innerHTML = "";
        return;
      }
      // shuffle and pick 2
      for(let i = products.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      const chosen = products.slice(0, Math.min(2, products.length));
      tgt.innerHTML = "";
      chosen.forEach(p => {
        const card = document.createElement('div');
        card.className = 'crx_affiliate';
        card.innerHTML = `
          <img class="crx_affiliate_img" src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <div style="flex:1">
            <div class="crx_affiliate_title">${escapeHtml(p.title)}</div>
            <div class="crx_affiliate_desc">${escapeHtml(p.desc)}</div>
            <div style="margin-top:8px;">
              <a class="crx_btn" href="${p.url}" target="_blank" rel="noopener noreferrer">Buy on Amazon</a>
            </div>
            <div style="font-size:12px;color:#666;margin-top:8px;">*As an Amazon Associate I earn from qualifying purchases.</div>
          </div>
        `;
        tgt.appendChild(card);
      });
    } catch(e){
      console.error("crx_loadAffiliates:", e);
    }
  };

  /* --------------------------
     Simple slider init stub
     If you want Swiper, include it and call this with container id.
     This function lazy-loads Swiper from CDN if not present.
     --------------------------*/
  window.crx_initSlider = async function(containerId, options){
    const container = document.getElementById(containerId);
    if(!container) return;
    // If Swiper already loaded, init quickly (user to implement)
    if(window.Swiper) {
      try { new Swiper(container, options || {}); } catch(e){/*ignore*/ }
      return;
    }
    // Lazy-load Swiper CSS & JS
    const cssHref = "https://unpkg.com/swiper@8/swiper-bundle.min.css";
    const jsSrc = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
    if(!document.querySelector(`link[href="${cssHref}"]`)){
      const l = document.createElement('link');
      l.rel = "stylesheet";
      l.href = cssHref;
      document.head.appendChild(l);
    }
    if(!document.querySelector(`script[src="${jsSrc}"]`)){
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = jsSrc;
        s.defer = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      }).catch(()=>{ console.warn("Swiper load failed"); });
    }
    // Initialize (basic init; customize as needed)
    if(window.Swiper){
      try { new Swiper(container, options || { slidesPerView: 1, spaceBetween: 12 }); } catch(e){/*ignore*/ }
    }
  };

  /* --------------------------
     Find placeholders and load widgets automatically
     Recognizes data-crx-widget attributes.
     - affiliate -> loads affiliates into element id if present
     - bio, donate -> loads fragment crx_bio.html and crx_donate.html
     --------------------------*/
  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }
  window.escapeHtml = escapeHtml;

  document.addEventListener('DOMContentLoaded', function(){
    try {
      // widgets
      const widgets = document.querySelectorAll('[data-crx-widget]');
      widgets.forEach(async el => {
        const name = el.getAttribute('data-crx-widget');
        if(!name) return;
        if(name === 'affiliate') {
          // if id present, pass id to loader; otherwise create one
          const id = el.id || ('crx_aff_' + Math.random().toString(36).slice(2,9));
          el.id = id;
          await crx_loadAffiliates(id);
        } else {
          // load fragment crx_<name>.html into this element
          await crx_loadWidget(name, el);
        }
      });
    } catch(e){ console.warn("crx init:", e); }
  });

})();
