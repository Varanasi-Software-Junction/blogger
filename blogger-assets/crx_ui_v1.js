/* crx_ui_v1.js
   CRX UI loader & utilities v1
   - Loads widget fragments hosted in blogger-assets/
   - Provides affiliate loader, toggle/copy helpers
   - Provides crx_createBubbleVisualizer(targetEl, opts)
   Host: https://varanasi-software-junction.github.io/blogger/blogger-assets/crx_ui_v1.js
*/

(function () {
  const BASE = "https://varanasi-software-junction.github.io/blogger/blogger-assets";

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, m =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );
  }

  /* ---------- Toggle / Copy helpers ---------- */
  window.crx_toggleAnswer = function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = (el.style.display === "block") ? "none" : "block";
  };

  window.crx_copyCode = function (btnId, codeId) {
    const codeEl = document.getElementById(codeId);
    if (!codeEl) return;
    const text = codeEl.innerText || codeEl.textContent || "";
    if (!navigator.clipboard) {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
    } else {
      navigator.clipboard.writeText(text);
    }
    const btn = document.getElementById(btnId);
    if (btn) {
      const orig = btn.innerText;
      btn.innerText = "✅ Copied";
      setTimeout(() => btn.innerText = orig, 1200);
    }
  };

  /* ---------- Load HTML widget ---------- */
  window.crx_loadWidget = async function (name, targetEl) {
    if (!name || !targetEl) return;
    try {
      const res = await fetch(`${BASE}/crx_${name}.html`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      targetEl.innerHTML = await res.text();
    } catch (e) { console.error("crx_loadWidget:", e); }
  };

  /* ---------- Affiliate loader ---------- */
  window.crx_loadAffiliates = async function (targetId) {
    const tgt = document.getElementById(targetId);
    if (!tgt) return;
    try {
      const res = await fetch(`${BASE}/crx_affiliates.json`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products.slice() : [];
      if (!products.length) { tgt.innerHTML = ""; return; }
      // shuffle + pick 2
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      const chosen = products.slice(0, Math.min(2, products.length));
      tgt.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "crx_affiliates_wrap";
      chosen.forEach(p => {
        const title = escapeHtml(p.title || "Product");
        const desc = escapeHtml(p.desc || "");
        const img = escapeHtml(p.img || "");
        const price = p.price ? escapeHtml(String(p.price)) : "";
        const rating = p.rating ? Number(p.rating) : null;
        const url = p.url || "#";
        const card = document.createElement("article");
        card.className = "crx_affiliate_card";
        card.innerHTML = `
          <div class="crx_affiliate_img_wrap">
            <img class="crx_affiliate_img" src="${img}" alt="${title}" loading="lazy"/>
          </div>
          <div class="crx_affiliate_content">
            <div class="crx_affiliate_title">${title}</div>
            <div class="crx_affiliate_desc">${desc}</div>
            <div class="crx_affiliate_meta">
              ${price ? `<div class="crx_affiliate_price">₹ ${price}</div>` : ""}
              ${rating ? `<div class="crx_affiliate_rating">${generateStars(rating)} ${rating.toFixed(1)}</div>` : ""}
              <div class="crx_affiliate_cta">
                <a class="crx_btn crx_aff_buy" href="${url}" target="_blank" rel="noopener">Buy on Amazon</a>
              </div>
            </div>
          </div>`;
        wrap.appendChild(card);
      });
      tgt.appendChild(wrap);
    } catch (e) { console.error("crx_loadAffiliates:", e); }

    function generateStars(r) {
      const filled = Math.round(Math.max(0, Math.min(5, r)));
      return Array.from({ length: 5 }, (_, i) =>
        `<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 .6l3.7 7.4 8.1 1.8-5.6 5.5 1.3 8-7-4.1-7 4.1 1.3-8-5.6-5.5 8.1-1.8z" fill="${i < filled ? "#f6b900" : "rgba(0,0,0,0.1)"}"/></svg>`
      ).join("");
    }
  };

  /* ---------- Auto-init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-crx-widget]").forEach(async el => {
      const name = el.getAttribute("data-crx-widget");
      if (name === "affiliate") await window.crx_loadAffiliates(el.id || (el.id = "crx_aff_" + Date.now()));
      else if (name === "bio" || name === "donate") await window.crx_loadWidget(name, el);
    });
  });
})();
