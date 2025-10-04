/*     crx_ui_v1.js
   CRX UI loader & utilities v1 (UPDATED)
   - Syncs class names with crx_styles_v1.css (affiliate card markup, container prefix)
   - Adds auto copy-button injection for code blocks (.crx_output / pre.crx_output)
   - Improves affiliate card structure to match CSS (.crx_affiliate_card, .crx_affiliate_img_wrap, etc.)
   - Safer DOM access, accessible attributes, and mutation-observer-backed re-initializers
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
  function q(sel, ctx = document) { return (ctx || document).querySelector(sel); }
  function qAll(sel, ctx = document) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------
     Toggle answer (used in MCQ Q/A show-hide)
     --------------------------- */
  window.crx_toggleAnswer = function (id) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = (getComputedStyle(el).display === "none") ? "block" : "none";
    } catch (e) { console.warn("crx_toggleAnswer:", e); }
  };

  /* ---------------------------
     Copy code helper (button calls this)
     btnId: id of button (optional) - used to provide feedback
     codeId: id of target code element (pre, code or .crx_output)
     --------------------------- */
  window.crx_copyCode = async function (btnId, codeId) {
    try {
      const codeEl = document.getElementById(codeId) || document.querySelector(`#${codeId}, .${codeId}`);
      // fallback: if codeId is not an id, try to accept element directly
      const target = (typeof codeEl === "string") ? document.getElementById(codeEl) : codeEl;
      const el = target || document.getElementById(codeId) || q(`#${codeId}`) || q(`.${codeId}`);
      if (!el) return;
      // get text - prefer code/textContent for exactness
      const text = (el.tagName && /^(PRE|CODE|TEXTAREA)$/i.test(el.tagName)) ? (el.textContent || el.innerText) : (el.innerText || el.textContent || "");
      if (!navigator.clipboard) {
        // legacy fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("aria-hidden", "true");
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } else {
        await navigator.clipboard.writeText(text);
      }
      // feedback on button
      if (btnId) {
        const btn = document.getElementById(btnId);
        if (btn) {
          const orig = btn.innerText;
          btn.innerText = "✅ Copied";
          btn.setAttribute("aria-live", "polite");
          setTimeout(() => { btn.innerText = orig; btn.removeAttribute("aria-live"); }, 1200);
        }
      }
    } catch (e) {
      console.warn("crx_copyCode:", e);
    }
  };

  /* ---------------------------
     Auto-add Copy buttons to code blocks (.crx_output or pre.crx_output)
     - places a small button with a unique id
     - button calls window.crx_copyCode(btnId, targetId)
     --------------------------- */
  window.crx_initCopyButtons = function (root = document) {
    try {
      // Select code blocks: prefer elements with class .crx_output or pre.crx_output or pre > code
      const blocks = Array.from((root || document).querySelectorAll('.crx_output, pre.crx_output, .crx_post-body pre, .crx_post-body pre code'));
      blocks.forEach((blk, idx) => {
        // canonicalize to outer container (if code inside pre, use pre)
        let container = blk;
        if (blk.tagName === 'CODE' && blk.parentElement && blk.parentElement.tagName === 'PRE') container = blk.parentElement;
        // avoid duplication
        if (container.querySelector('.crx_copybtn')) return;
        // create unique ids
        const targetId = container.id || ('crx_code_' + Math.random().toString(36).slice(2, 9));
        container.id = targetId;
        const btnId = 'crx_copybtn_' + Math.random().toString(36).slice(2, 9);
        // create button
        const btn = document.createElement('button');
        btn.className = 'crx_copybtn';
        btn.type = 'button';
        btn.id = btnId;
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.innerText = 'Copy';
        // attach click handler
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          try { window.crx_copyCode(btnId, targetId); } catch (e) { console.warn(e); }
        });
        // insert into container (top-right absolute styling assumed in CSS)
        // prefer appending so layout doesn't shift; many designs show the button inside the pre
        container.style.position = container.style.position || 'relative';
        container.appendChild(btn);
      });
    } catch (e) {
      console.warn('crx_initCopyButtons error:', e);
    }
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
      // initialize any copy buttons / dynamic bits inside loaded widget
      window.crx_initCopyButtons(targetEl);
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
     Affiliate loader: improved cards that match CSS classes
     - targetId: id of container element where cards will be appended
     --------------------------- */
  window.crx_loadAffiliates = async function (targetId, opts = {}) {
    const tgt = document.getElementById(targetId);
    if (!tgt) return;
    const url = `${BASE}/crx_affiliates.json`;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("Affiliate JSON fetch failed: " + res.status);
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products.slice() : [];
      if (products.length === 0) { tgt.innerHTML = ""; return; }

      // shuffle products for variety
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }

      // select number to show (default 2)
      const count = Math.max(1, Math.min(opts.count || 2, products.length));
      const chosen = products.slice(0, count);

      // clear target and append disclaimer + list wrapper
      tgt.innerHTML = '';
      // disclaimer (visible)
      const disc = document.createElement('div');
      disc.className = 'crx_affiliate_disclaimer';
      disc.innerHTML = `
        <strong>Affiliate Disclosure:</strong> This post contains affiliate links. If you buy through these links, I may earn a small commission at no extra cost to you.
        <div class="crx_disclaimer_actions"><a href="${BASE}/affiliate-policy.html" target="_blank" rel="noopener">Learn more</a></div>
      `;
      tgt.appendChild(disc);

      const wrap = document.createElement('div');
      wrap.className = 'crx_affiliates_wrap';
      tgt.appendChild(wrap);

      chosen.forEach(p => {
        // normalize fields
        const img = p.img ? escapeHtml(p.img) : (BASE + '/placeholder-120x80.png');
        const title = p.title ? escapeHtml(p.title) : 'Product';
        const desc = p.desc ? escapeHtml(p.desc) : '';
        const urlEsc = p.url ? escapeHtml(p.url) : '#';
        const priceStr = (p.price !== undefined && p.price !== null) ? escapeHtml(String(p.price)) : '';
        const ratingStr = (p.rating !== undefined && p.rating !== null) ? escapeHtml(String(p.rating)) : '';
        const sponsored = p.sponsored ? escapeHtml(p.sponsored) : 'Sponsored';

        // build card element matching CSS
        const card = document.createElement('article');
        card.className = 'crx_affiliate_card';
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', title);

        // inner HTML structured to match CSS selectors
        card.innerHTML = `
          <div class="crx_affiliate_img_wrap" aria-hidden="true">
            <img class="crx_affiliate_img" src="${img}" alt="${title}" loading="lazy" />
          </div>

          <div class="crx_affiliate_content">
            <div style="display:flex;gap:8px;align-items:center;">
              <div class="crx_affiliate_title">${title}</div>
              <div class="crx_aff_small_disclaimer" style="margin-left:auto;font-weight:700">${sponsored}</div>
            </div>
            <div class="crx_affiliate_desc">${desc}</div>

            <div class="crx_affiliate_meta" aria-hidden="true">
              ${ priceStr ? `<div class="crx_affiliate_price">₹${priceStr}</div>` : '' }
              ${ ratingStr ? `<div class="crx_affiliate_rating">★ ${ratingStr}</div>` : '' }
            </div>

            <div class="crx_affiliate_footer" style="font-size:12px;color:#7a4f09;margin-top:8px;">*As an Amazon Associate I earn from qualifying purchases.</div>
          </div>

          <div class="crx_affiliate_cta" style="display:flex;flex-direction:column;gap:8px;min-width:160px;">
            <a class="crx_btn crx_aff_buy" href="${urlEsc}" target="_blank" rel="sponsored noopener noreferrer" aria-label="Buy ${title} on Amazon">Buy on Amazon</a>
            <a class="crx_btn price-link" href="${urlEsc}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} details">View</a>
          </div>
        `;
        wrap.appendChild(card);
      });

      // After insertion, attach any copy buttons inside widgets (if present)
      window.crx_initCopyButtons(wrap);

    } catch (e) {
      console.error("crx_loadAffiliates:", e);
      // error: leave target empty or show minimal note
      tgt.innerHTML = `<div class="crx_card">Affiliates currently unavailable.</div>`;
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
     Mutation observer: watch for dynamically injected widgets & re-init helpers
     --------------------------- */
  (function setupObservers() {
    try {
      if (!window.MutationObserver) return;
      const mo = new MutationObserver((mutations) => {
        // debounce
        if (setupObservers._timer) clearTimeout(setupObservers._timer);
        setupObservers._timer = setTimeout(() => {
          try {
            crx_enhanceCommentButtons();
            // auto-add copy buttons for newly inserted code blocks
            window.crx_initCopyButtons(document);
            // find any [data-crx-widget] that hasn't been handled yet and initialize
            Array.from(document.querySelectorAll('[data-crx-widget]')).forEach(async el => {
              if (el.dataset.crxInitted) return;
              const name = el.getAttribute('data-crx-widget');
              if (!name) return;
              el.dataset.crxInitted = '1';
              if (name === 'affiliate') {
                const id = el.id || ("crx_aff_" + Math.random().toString(36).slice(2, 9));
                el.id = id;
                await window.crx_loadAffiliates(id);
              } else {
                await window.crx_loadWidget(name, el);
              }
            });
          } catch (e) { /* ignore */ }
        }, 160);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      console.warn('crx mutation observer setup failed:', e);
    }
  })();

  /* ---------------------------
     Auto-initialize on DOM ready
     --------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    try {
      // Enhance comment buttons immediately
      crx_enhanceCommentButtons();

      // Auto-init copy buttons for existing code blocks
      window.crx_initCopyButtons(document);

      // Initialize widgets declared with data-crx-widget
      const widgets = document.querySelectorAll("[data-crx-widget]");
      widgets.forEach(async el => {
        // skip if already initialized (mutation observer will handle new ones)
        if (el.dataset.crxInitted) return;
        const name = el.getAttribute("data-crx-widget");
        if (!name) return;
        el.dataset.crxInitted = '1';
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

  /* ---------------------------
     Public helper: create bubble visualizer (lightweight)
     Returns a cleanup function that stops the interval if needed.
     --------------------------- */
  window.crx_createBubbleVisualizer = function (targetSelector, opts = {}) {
    try {
      const mount = document.querySelector(targetSelector);
      if (!mount) return null;
      const bars = Number(opts.bars || 20);
      mount.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'crx_bubbles';
      wrapper.style.display = 'flex';
      wrapper.style.gap = '8px';
      wrapper.style.alignItems = 'end';
      wrapper.style.height = (opts.height || 120) + 'px';
      for (let i = 0; i < bars; i++) {
        const b = document.createElement('div');
        b.className = 'crx_box'; // reuse generic box style from CSS for visualizer blocks
        b.style.width = (opts.barWidth || 10) + 'px';
        b.style.height = (10 + Math.random() * (opts.maxHeight || 100)) + 'px';
        b.style.borderRadius = '8px';
        b.style.background = 'linear-gradient(180deg,var(--crx-primary),var(--crx-accent))';
        b.style.transition = 'height 260ms ease';
        wrapper.appendChild(b);
      }
      mount.appendChild(wrapper);
      const interval = setInterval(() => {
        Array.from(wrapper.children).forEach(ch => ch.style.height = (10 + Math.random() * (opts.maxHeight || 120)) + 'px');
      }, opts.interval || (350 + Math.random() * 400));
      // return cleanup
      return () => clearInterval(interval);
    } catch (e) {
      console.warn('crx_createBubbleVisualizer error:', e);
      return null;
    }
  };

})(); // end IIFE
// End of crx_ui_v1.js