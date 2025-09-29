/* crx_ui_v1.js
   CRX UI loader & utilities v1
   - Loads widget fragments hosted in blogger-assets/
   - Provides affiliate loader, toggle/copy helpers
   - Provides crx_createBubbleVisualizer(targetEl, opts)
   Host: https://varanasi-software-junction.github.io/blogger/blogger-assets/crx_ui_v1.js
*/

(function () {
  const BASE = "https://varanasi-software-junction.github.io/blogger/blogger-assets";

  /* ---------------------------
     Small helpers
     --------------------------- */
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ---------------------------
     Simple UI helpers
     --------------------------- */
  window.crx_toggleAnswer = function (id) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = (el.style.display === "block") ? "none" : "block";
    } catch (e) { console.warn("crx_toggleAnswer:", e); }
  };

  window.crx_copyCode = function (btnId, codeId) {
    try {
      const codeEl = document.getElementById(codeId);
      if (!codeEl) return;
      const text = codeEl.innerText || codeEl.textContent || "";
      if (!navigator.clipboard) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
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
    } catch (e) { console.warn("crx_copyCode:", e); }
  };

  /* ---------------------------
     Fetch & insert widget fragment (crx_<name>.html)
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
      // Fallback: minimal donate widget if crx_donate.html fails
      if (name === "donate") {
        const fallback = `
          <div class="crx_donate_card" style="display:flex;gap:12px;align-items:center;padding:12px;border:1px solid rgba(11,94,215,0.06);border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(11,94,215,0.06);">
            <div class="crx_donate_qr" style="width:100px;height:100px;border:1px solid rgba(11,94,215,0.06);border-radius:8px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:40px;">🙏</span>
            </div>
            <div style="flex:1;">
              <div class="crx_donate_title" style="font-weight:800;color:#084298;font-size:16px;">Support Learning Sutras</div>
              <div class="crx_donate_desc" style="color:#6b7280;margin-top:6px;font-size:14px;">If my tutorials helped you, a small donation keeps them coming.</div>
              <div class="crx_action_row" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
                <button class="crx_preset">₹50</button>
                <button class="crx_preset">₹100</button>
                <a class="crx_open_qr" href="${BASE}/crx_donate.html" target="_blank" rel="noopener">Open QR</a>
              </div>
              <div class="crx_donate_smallprint" style="font-size:12px;color:#6b7280;margin-top:6px;">Thanks — Champak Roy</div>
            </div>
          </div>
        `;
        targetEl.innerHTML = fallback;
      }
    }
  };

  /* ---------------------------
     Affiliate loader: improved cards
     --------------------------- */
  window.crx_loadAffiliates = async function (targetId) {
    const tgt = document.getElementById(targetId);
    if (!tgt) return;
    const url = `${BASE}/crx_affiliates.json`;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("Affiliate JSON fetch failed: " + res.status);
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products.slice() : [];
      if (products.length === 0) { tgt.innerHTML = ""; return; }
      // shuffle
      const NOFPRODUCTSINDISPLAY = 3;
      if (products.length < NOFPRODUCTSINDISPLAY) {
        NOFPRODUCTSINDISPLAY = products.length;
      }
      for (let i = 0; i <= NOFPRODUCTSINDISPLAY - 1; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      const chosen = products.slice(0, Math.min(2, products.length));
      tgt.innerHTML = "";

      chosen.forEach(p => {
        const card = document.createElement("div");
        card.className = "crx_affiliate";

        const priceHtml = p.price ? `<div class="crx_affiliate_price">₹${escapeHtml(String(p.price))}</div>` : '';
        const ratingHtml = (p.rating && !isNaN(Number(p.rating))) ? `<div class="crx_affiliate_rating">★ ${escapeHtml(String(p.rating))}</div>` : '';
        const sponsored = p.sponsored ? escapeHtml(p.sponsored) : 'Sponsored';

        card.innerHTML = `
          <div class="crx_affiliate_badge">${sponsored}</div>
          <div style="display:flex;align-items:center;justify-content:center;">
            <img class="crx_affiliate_img" src="${escapeHtml(p.img)}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </div>
          <div class="crx_affiliate_content">
            <div class="crx_affiliate_title">${escapeHtml(p.title)}</div>
            <div class="crx_affiliate_desc">${escapeHtml(p.desc || '')}</div>
            <div class="crx_affiliate_meta">
              ${priceHtml}
              ${ratingHtml}
            </div>
            <div class="crx_affiliate_footer">*As an Amazon Associate I earn from qualifying purchases.</div>
          </div>
          <div class="crx_affiliate_cta">
            <a class="crx_btn buy" href="${escapeHtml(p.url)}" target="_blank" rel="sponsored noopener noreferrer">Buy on Amazon</a>
            <a class="crx_btn price-link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">View</a>
          </div>
        `;
        tgt.appendChild(card);
      });
    } catch (e) {
      console.error("crx_loadAffiliates:", e);
    }
  };

  /* ---------------------------
     Enhance "Post a Comment" links
     --------------------------- */
  function crx_enhanceCommentButtons() {
    try {
      const selectors = [
        '#comments a.comment-reply',
        '#comments a.comment-link',
        '#comments a[href*="comment"]',
        '.comments .comment-actions a',
        '.post-comment-link',
        '#comment-post-message a',
        '#comments a'
      ];
      const anchors = Array.from(new Set(selectors.flatMap(s => Array.from(document.querySelectorAll(s)))));
      anchors.forEach(a => {
        if (!a || a.closest('.crx-comment-enhanced')) return;
        const text = (a.textContent || a.innerText || '').trim();
        if (!text) return;
        a.classList.add('crx_btn', 'crx_accent', 'crx_comment_btn');
        if (!a.getAttribute('role')) a.setAttribute('role', 'button');
        if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', text);
        const hasIcon = Array.from(a.childNodes).some(n =>
          (n.nodeType === Node.TEXT_NODE && (n.textContent || '').includes('✍')) ||
          (n.nodeType === Node.ELEMENT_NODE && n.classList && n.classList.contains('crx-comment-icon'))
        );
        if (!hasIcon) {
          const icon = document.createElement('span');
          icon.className = 'crx-comment-icon';
          icon.textContent = '✍️';
          icon.style.marginRight = '8px';
          icon.style.display = 'inline-block';
          a.insertBefore(icon, a.firstChild);
        }
        const commentsBlock = a.closest('.comment-thread, .comments, #comments, .widget[id*="comments"]');
        if (commentsBlock) {
          let wrapper = commentsBlock.querySelector('.crx-comment-cta-wrap');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'crx-comment-cta-wrap';
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'center';
            wrapper.style.margin = '8px 0';
            const heading = commentsBlock.querySelector('h2,h3,.comments-title,.comment-count,.comments-header');
            if (heading && heading.parentNode === commentsBlock) {
              heading.insertAdjacentElement('afterend', wrapper);
            } else {
              commentsBlock.insertBefore(wrapper, commentsBlock.firstChild);
            }
          }
          if (!wrapper.contains(a)) wrapper.appendChild(a);
          a.classList.add('crx-comment-enhanced');
        }
      });
    } catch (e) { console.warn('crx_enhanceCommentButtons error:', e); }
  }

  /* ---------------------------
     Auto-initialize on DOM ready
     --------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    try { crx_enhanceCommentButtons(); } catch (e) { }
    if (window.MutationObserver) {
      const obs = new MutationObserver(() => {
        if (crx_enhanceCommentButtons._timer) clearTimeout(crx_enhanceCommentButtons._timer);
        crx_enhanceCommentButtons._timer = setTimeout(() => crx_enhanceCommentButtons(), 140);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    try {
      const widgets = document.querySelectorAll("[data-crx-widget]");
      widgets.forEach(async el => {
        const name = el.getAttribute("data-crx-widget");
        if (!name) return;
        if (name === "affiliate") {
          const id = el.id || ("crx_aff_" + Math.random().toString(36).slice(2, 9));
          el.id = id;
          await window.crx_loadAffiliates(id);
        } else if (name === "bio" || name === "donate") {
          await window.crx_loadWidget(name, el);
        } else {
          await window.crx_loadWidget(name, el);
        }
      });
    } catch (e) {
      console.warn("crx widget init error:", e);
    }
  });

})(); // end IIFE
// End of crx_ui_v1.js