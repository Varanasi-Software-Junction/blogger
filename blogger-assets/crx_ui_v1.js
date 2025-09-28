/* crx_ui_v1.js
   CRX UI loader & utilities v1 (final)
   - Loads widget fragments hosted in blogger-assets/
   - Provides affiliate loader (visible disclaimer + 3D card), toggle/copy helpers
   - Auto-initializes common placeholders
   Host/base:
     https://varanasi-software-junction.github.io/blogger/blogger-assets/crx_ui_v1.js
*/

(function () {
  // BASE URL for hosted assets (remembered)
  const BASE = "https://varanasi-software-junction.github.io/blogger/blogger-assets";

  /* ---------------------------
     Small helpers
     --------------------------- */
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function byId(id) { return document.getElementById(id); }
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* ---------------------------
     Toggle answer visibility helper
     --------------------------- */
  window.crx_toggleAnswer = function (id) {
    try {
      const el = byId(id);
      if (!el) return;
      el.style.display = (getComputedStyle(el).display === "none" || el.style.display === "none") ? "block" : "none";
    } catch (e) { console.warn("crx_toggleAnswer:", e); }
  };

  /* ---------------------------
     Copy-to-clipboard helper
     - btnId optional: swaps button text briefly when copy succeeds
     --------------------------- */
  window.crx_copyCode = async function (btnId, codeId) {
    try {
      const codeEl = byId(codeId);
      if (!codeEl) return;
      const text = codeEl.innerText || codeEl.textContent || "";
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      if (btnId) {
        const btn = byId(btnId);
        if (btn) {
          const orig = btn.innerText;
          btn.innerText = "✅ Copied";
          setTimeout(() => { btn.innerText = orig; }, 1200);
        }
      }
    } catch (e) { console.warn("crx_copyCode:", e); }
  };

  /* ---------------------------
     Load HTML widget fragment (crx_<name>.html) into target element
     --------------------------- */
  window.crx_loadWidget = async function (name, targetEl) {
    if (!name || !targetEl) return;
    const url = `${BASE}/crx_${name}.html`;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("Widget fetch failed: " + res.status);
      const html = await res.text();
      targetEl.innerHTML = html;
    } catch (e) {
      console.error("crx_loadWidget:", e);
    }
  };

  /* ---------------------------
     Affiliate loader
     - targetId: id of container element
     - opts: { showGlobalDisclaimer: true|false, max: 2 }
     Behavior:
       - fetches crx_affiliates.json from BASE
       - shows a prominent disclaimer banner (unless disabled)
       - renders up to opts.max cards (default 2) with 3D edge, title, desc, price, rating, CTA
     --------------------------- */
  window.crx_loadAffiliates = async function (targetId, opts) {
    const tgt = byId(targetId);
    if (!tgt) return;
    opts = opts || {};
    const showGlobalDisclaimer = opts.showGlobalDisclaimer === undefined ? true : !!opts.showGlobalDisclaimer;
    const maxItems = Number(opts.max || 2);

    try {
      const res = await fetch(`${BASE}/crx_affiliates.json`, { cache: "no-cache" });
      if (!res.ok) throw new Error("Affiliate JSON fetch failed: " + res.status);
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products.slice() : [];
      if (!products.length) { tgt.innerHTML = ""; return; }

      // shuffle
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      const chosen = products.slice(0, Math.min(maxItems, products.length));

      // build fragment
      const frag = document.createDocumentFragment();

      // global disclaimer (prominent)
      if (showGlobalDisclaimer) {
        const disc = document.createElement("div");
        disc.className = "crx_affiliate_disclaimer";
        disc.setAttribute("role", "status");
        disc.setAttribute("aria-live", "polite");
        disc.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div style="font-size:15px;color:#7a4100;font-weight:900;">Important disclosure — Amazon Affiliate</div>
            <div style="font-size:13px;color:#6a4b1a;max-width:900px;">
              As an Amazon Associate I earn from qualifying purchases. The product listings below may contain affiliate links.
            </div>
          </div>
          <div class="crx_disclaimer_actions">
            <a href="https://affiliate-program.amazon.in/help/operating/policies" target="_blank" rel="noopener noreferrer">Affiliate policy</a>
          </div>
        `;
        frag.appendChild(disc);
      }

      // grid wrapper
      const wrap = document.createElement("div");
      wrap.className = "crx_affiliates_wrap";
      frag.appendChild(wrap);

      chosen.forEach(p => {
        const title = escapeHtml(p.title || "Product");
        const desc = escapeHtml(p.desc || "");
        const img = escapeHtml(p.img || "");
        const price = (p.price !== undefined && p.price !== null) ? escapeHtml(String(p.price)) : "";
        const rating = (p.rating !== undefined && p.rating !== null) ? Number(p.rating) : null;
        const url = p.url || "#";

        const card = document.createElement("article");
        card.className = "crx_affiliate_card";
        card.setAttribute("role", "article");

        card.innerHTML = `
          <div class="crx_affiliate_img_wrap" aria-hidden="${img ? "false" : "true"}">
            <img class="crx_affiliate_img" src="${img}" alt="${title}" loading="lazy" />
          </div>
          <div class="crx_affiliate_content">
            <div class="crx_affiliate_title" title="${title}">${title}</div>
            <div class="crx_affiliate_desc">${desc}</div>
            <div class="crx_affiliate_meta">
              ${ price ? `<div class="crx_affiliate_price">₹ ${price}</div>` : "" }
              ${ rating ? `<div class="crx_affiliate_rating" aria-label="Rating: ${rating} out of 5">${_renderStars(rating)} <span style="margin-left:6px;font-weight:700;">${rating.toFixed(1)}</span></div>` : "" }
              <div class="crx_affiliate_cta">
                <a class="crx_btn crx_aff_buy" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Buy ${title} on Amazon">Buy on Amazon</a>
              </div>
            </div>
            <div style="margin-top:8px;display:flex;gap:8px;align-items:center;">
              <span class="crx_aff_small_disclaimer">As an Amazon Associate I earn from qualifying purchases.</span>
            </div>
          </div>
        `;

        wrap.appendChild(card);
      });

      // insert to target
      tgt.innerHTML = "";
      tgt.appendChild(frag);

    } catch (e) {
      console.error("crx_loadAffiliates:", e);
      // degrade gracefully: show a small note
      if (tgt) tgt.innerHTML = `<div style="padding:10px;color:#7a4100;font-weight:700;">Affiliate feed unavailable.</div>`;
    }

    // helper: render 5 star svgs
    function _renderStars(r) {
      const filled = Math.round(Math.max(0, Math.min(5, r)));
      let out = "";
      for (let i = 0; i < 5; i++) {
        out += `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .6l3.7 7.4 8.1 1.8-5.6 5.5 1.3 8-7-4.1-7 4.1 1.3-8-5.6-5.5 8.1-1.8z" fill="${i < filled ? '#f6b900' : 'rgba(0,0,0,0.12)'}"/></svg>`;
      }
      return out;
    }
  }; // end crx_loadAffiliates

  /* ---------------------------
     Simple slider initializer (lazy-load Swiper if needed)
     --------------------------- */
  window.crx_initSlider = async function (containerSelector, options) {
    const container = (typeof containerSelector === "string") ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;
    if (window.Swiper) {
      try { new Swiper(container, options || {}); } catch (e) { console.warn("crx_initSlider:", e); }
      return;
    }
    const cssHref = "https://unpkg.com/swiper@8/swiper-bundle.min.css";
    const jsSrc = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = cssHref; document.head.appendChild(l);
    }
    if (!document.querySelector(`script[src="${jsSrc}"]`)) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script"); s.src = jsSrc; s.defer = true; s.onload = resolve; s.onerror = reject; document.body.appendChild(s);
      }).catch(() => console.warn("crx_initSlider: failed loading swiper"));
    }
    if (window.Swiper) {
      try { new Swiper(container, options || { slidesPerView: 1, spaceBetween: 12 }); } catch (e) { console.warn(e); }
    }
  };

  /* ---------------------------
     Bubble visualizer stub
     (kept lightweight — original behaviour preserved elsewhere)
     --------------------------- */
  window.crx_createBubbleVisualizer = function (targetEl, opts) {
    let root;
    if (typeof targetEl === "string") root = document.querySelector(targetEl);
    else root = targetEl instanceof Element ? targetEl : null;
    if (!root) return null;

    opts = opts || {};
    const numbers = opts.numbers || root.getAttribute("data-crx-numbers") || "5,3,8,1,4";
    const speak = typeof opts.speak === "boolean" ? opts.speak : (root.getAttribute("data-crx-speak") !== "false");

    // Simple placeholder UI to avoid breaking pages that expect this widget.
    root.innerHTML = `<div class="crx_visual_container" style="padding:12px;">
      <div style="font-weight:800;color:var(--crx-primary-dark);">Visualizer</div>
      <div style="margin-top:8px;color:var(--crx-muted);font-size:13px;">Numbers: ${escapeHtml(numbers)}</div>
    </div>`;

    return { root: root, numbers: numbers, speak: speak };
  };

  /* ---------------------------
     Auto-initialize widgets on DOMContentLoaded
     Recognized: data-crx-widget="affiliate" | "bio" | "donate" | "bubble-visualizer"
     --------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    try {
      qa("[data-crx-widget]").forEach(async el => {
        const name = el.getAttribute("data-crx-widget");
        if (!name) return;
        if (name === "affiliate") {
          const id = el.id || ("crx_aff_" + Math.random().toString(36).slice(2,9));
          el.id = id;
          // default: show banner + 2 items
          await window.crx_loadAffiliates(id, { showGlobalDisclaimer: true, max: 2 });
        } else if (name === "bio" || name === "donate") {
          await window.crx_loadWidget(name, el);
        } else if (name === "bubble-visualizer") {
          window.crx_createBubbleVisualizer(el);
        } else {
          await window.crx_loadWidget(name, el);
        }
      });
    } catch (e) {
      console.warn("crx widget init error:", e);
    }
  });

  /* Expose BASE for debugging if needed */
  window.__crx_BASE = BASE;

})(); // end IIFE
