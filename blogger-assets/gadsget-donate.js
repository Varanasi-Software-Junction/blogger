/*!
 gadsget-donate.js — embeddable donate gadget
 - Self-contained: injects CSS + HTML and wires Copy / Share behavior
 - Usage:
   1) Add <div data-gadsget="donate" data-upi="champaksworld-1@hdfcbank" data-alerts="true"></div>
      and include this script (defer) OR
   2) Include this script alone (no container) — will append the widget to document.body
 - Exposes window.gadsgetDonate API
*/

(function () {
  'use strict';

  const DEFAULT_UPI = 'champaksworld-1@hdfcbank';
  const DEFAULT_TITLE = 'Support Learning Sutras';
  const DEFAULT_ALERTS = true;

  // Utility helpers
  function q(sel, ctx = document) { return (ctx || document).querySelector(sel); }
  function qAll(sel, ctx = document) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'style') el.style.cssText = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => { if (c) el.appendChild(c); });
    return el;
  }

  // Inject gadget CSS once
  function injectStyles() {
    if (document.getElementById('gadsget-donate-styles')) return;
    const css = `
/* gadsget-donate styles (scoped) */
.gads-donate-card {
  max-width:560px;
  margin:16px auto;
  background: #fff;
  padding:14px;
  border-radius:12px;
  box-shadow: 0 8px 24px rgba(10,20,50,0.06);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  display:flex;
  gap:12px;
  align-items:flex-start;
}
.gads-donate-qr {
  width:92px; height:92px; border-radius:8px; overflow:hidden; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; border:1px solid rgba(11,94,215,0.06);
  background:linear-gradient(180deg,#fff,#f7fbff);
}
.gads-donate-main { flex:1; min-width:0; }
.gads-donate-title { font-weight:800; color:#084298; font-size:16px; margin-bottom:6px; }
.gads-donate-desc { color:#6b7280; font-size:14px; margin-bottom:10px; }
.gads-upi-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
.gads-upi-label { font-weight:700; }
.gads-upi-box {
  padding:8px 10px; border-radius:8px; border:1px dashed #d0d7e6; background:#fbfcff;
  min-width:160px; word-break:break-all; outline: none;
}
.gads-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; }
.gads-btn {
  padding:8px 12px; border-radius:8px; border:1px solid #cdd6ea; background:#0366d6; color:#fff; cursor:pointer;
  font-size:14px;
}
.gads-btn.secondary { background:#eef3ff; color:#024fa8; border:1px solid #d6e1ff; }
.gads-small { font-size:0.9rem; color:#555; margin-top:8px; }

/* toast */
#gads-toast {
  position: fixed; right: 18px; bottom: 18px; background: rgba(0,0,0,0.85); color: white; padding: 10px 14px;
  border-radius: 8px; font-size: 14px; display: block; opacity: 0; pointer-events: none; z-index: 99999;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25); transition: opacity 220ms ease;
}
#gads-toast.show { opacity: 1; pointer-events: auto; }
`;
    const s = document.createElement('style');
    s.id = 'gadsget-donate-styles';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  // Toast helper
  function makeToast() {
    let t = document.getElementById('gads-toast');
    if (!t) {
      t = createEl('div', { id: 'gads-toast', role: 'status', 'aria-live': 'polite', text: '' });
      document.body.appendChild(t);
    }
    return {
      show(msg, ms = 1500) {
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._t);
        t._t = setTimeout(() => t.classList.remove('show'), ms);
      }
    };
  }

  // Clipboard helper with fallback
  async function copyToClipboard(text) {
    if (!text) return false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fallback */ }
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('aria-hidden', 'true');
      ta.style.position = 'fixed'; ta.style.left = '-9999px'; ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  // Build widget HTML (returns container element)
  function buildWidget(opts = {}) {
    const upi = escapeHtml(opts.upi || DEFAULT_UPI);
    const title = escapeHtml(opts.title || DEFAULT_TITLE);
    // main container
    const card = createEl('div', { class: 'gads-donate-card', role: 'region', 'aria-labelledby': 'gads-title' });
    // QR box (placeholder emoji)
    const qr = createEl('div', { class: 'gads-donate-qr', html: '<span style="font-size:36px">🙏</span>' });
    card.appendChild(qr);

    const main = createEl('div', { class: 'gads-donate-main' });

    const h = createEl('div', { id: 'gads-title', class: 'gads-donate-title', text: title });
    main.appendChild(h);

    const desc = createEl('div', { class: 'gads-donate-desc', text: 'If my tutorials helped you, a small donation keeps them coming.' });
    main.appendChild(desc);

    // UPI row
    const upiRow = createEl('div', { class: 'gads-upi-row' });
    const lbl = createEl('div', { class: 'gads-upi-label', text: 'UPI ID' });
    upiRow.appendChild(lbl);
    const upiBox = createEl('div', { id: 'gads-upi-id', class: 'gads-upi-box', tabindex: '0', 'aria-label': 'UPI ID', html: upi });
    upiRow.appendChild(upiBox);
    main.appendChild(upiRow);

    // actions
    const actions = createEl('div', { class: 'gads-actions' });
    const copyBtn = createEl('button', { id: 'gads-copy-btn', class: 'gads-btn', type: 'button', text: 'Copy UPI' });
    const shareBtn = createEl('button', { id: 'gads-share-btn', class: 'gads-btn secondary', type: 'button', text: 'Share' });
    actions.appendChild(copyBtn);
    actions.appendChild(shareBtn);

    // open donate / qr link (optional)
    if (opts.openLink) {
      const openA = createEl('a', { class: 'gads-open-link', href: opts.openLink, target: '_blank', rel: 'noopener', text: 'Open QR', style: 'display:inline-flex;align-items:center;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid rgba(11,94,215,0.06);color:#084298;text-decoration:none;' });
      actions.appendChild(openA);
    }

    main.appendChild(actions);

    // small note
    main.appendChild(createEl('div', { class: 'gads-small', text: 'Tip: On mobile, use Share to send the UPI ID via messaging apps.' }));

    card.appendChild(main);

    return card;
  }

  // Attach behavior to a widget container element
  function wireWidget(rootEl, opts = {}) {
    const toast = makeToast();
    const upiEl = rootEl.querySelector('#gads-upi-id');
    const copyBtn = rootEl.querySelector('#gads-copy-btn');
    const shareBtn = rootEl.querySelector('#gads-share-btn');

    const upiId = (opts.upi || DEFAULT_UPI).trim();

    async function onCopy() {
      const ok = await copyToClipboard(upiId);
      if (ok) {
        toast.show('UPI ID copied');
        if (opts.alerts) alert(`UPI ID copied to clipboard!\n\n${upiId}`);
      } else {
        toast.show('Copy failed — select and copy manually');
        if (opts.alerts) alert('Copy failed — please select and copy manually.');
      }
      // brief visual feedback: focus the upi box
      try { upiEl.focus(); } catch (e) { /* ignore */ }
    }

    async function onShare() {
      const text = `${opts.title || DEFAULT_TITLE}\n\nSupport Learning Sutras — donate via UPI:\nUPI ID: ${upiId}\n\nThank you! 🙏`;
      if (navigator.share) {
        try {
          await navigator.share({ title: opts.title || DEFAULT_TITLE, text });
          toast.show('Share dialog opened');
          if (opts.alerts) alert('Share dialog opened! You can now share the UPI ID directly.');
          return;
        } catch (e) {
          // fallback
          console.warn('Web Share failed:', e);
        }
      }
      const ok = await copyToClipboard(text);
      if (ok) {
        toast.show('Donation details copied — paste into your app to share');
        if (opts.alerts) alert('Donation details copied to clipboard!\nPaste it into WhatsApp or your payment app.');
      } else {
        toast.show('Unable to share automatically — please copy the UPI ID manually.');
        if (opts.alerts) alert('Unable to share automatically — please copy the UPI ID manually.');
      }
    }

    if (copyBtn) copyBtn.addEventListener('click', onCopy);
    if (shareBtn) shareBtn.addEventListener('click', onShare);

    // accessibility: Enter/Space triggers buttons when focused
    rootEl.addEventListener('keydown', (ev) => {
      const t = ev.target;
      if (!t) return;
      if ((ev.key === 'Enter' || ev.key === ' ') && (t.id === 'gads-copy-btn' || t.id === 'gads-share-btn' || t.id === 'gads-upi-id')) {
        ev.preventDefault();
        if (t.id === 'gads-copy-btn' || t.id === 'gads-upi-id') onCopy();
        else if (t.id === 'gads-share-btn') onShare();
      }
    });

    // expose small API in dataset for external hooking if needed
    rootEl._gadsActions = { copy: onCopy, share: onShare, upi: upiId };
  }

  // Find containers with data-gadsget="donate" and render widget
  function initFromDOM() {
    injectStyles();
    const nodes = qAll('[data-gadsget="donate"]');
    if (nodes.length > 0) {
      nodes.forEach(node => {
        // read configuration from data attributes
        const upi = node.getAttribute('data-upi') || node.dataset.upi || DEFAULT_UPI;
        const title = node.getAttribute('data-title') || node.dataset.title || DEFAULT_TITLE;
        const alertsAttr = node.getAttribute('data-alerts') || node.dataset.alerts;
        const alerts = (alertsAttr === null) ? DEFAULT_ALERTS : String(alertsAttr).toLowerCase() !== 'false';
        const openLink = node.getAttribute('data-open') || node.dataset.open || null;
        // clear node and append widget
        node.innerHTML = '';
        const widget = buildWidget({ upi, title, openLink });
        node.appendChild(widget);
        wireWidget(widget, { upi, title, alerts });
      });
      return true;
    }
    return false;
  }

  // Append to body fallback (if no target present)
  function appendToBodyIfNone() {
    const ok = initFromDOM();
    if (!ok) {
      // append widget at end of body
      injectStyles();
      const wrapper = createEl('div', { style: 'padding:12px;' });
      const widget = buildWidget({ upi: DEFAULT_UPI, title: DEFAULT_TITLE, openLink: null });
      wrapper.appendChild(widget);
      document.body.appendChild(wrapper);
      wireWidget(widget, { upi: DEFAULT_UPI, title: DEFAULT_TITLE, alerts: DEFAULT_ALERTS });
    }
  }

  // Public API
  const API = {
    renderAll: initFromDOM,
    create: function (opts = {}) {
      injectStyles();
      const w = buildWidget(opts);
      if (opts.appendTo) {
        const parent = (typeof opts.appendTo === 'string') ? document.querySelector(opts.appendTo) : opts.appendTo;
        if (parent) parent.appendChild(w);
      }
      wireWidget(w, { upi: opts.upi || DEFAULT_UPI, title: opts.title || DEFAULT_TITLE, alerts: opts.alerts !== false });
      return w;
    },
    copy: async function (selectorOrUpi) {
      // if selector points to widget, call its action; else treat as raw upi string
      const el = (typeof selectorOrUpi === 'string') ? (document.querySelector(selectorOrUpi) || null) : null;
      if (el && el._gadsActions && el._gadsActions.copy) return el._gadsActions.copy();
      // fallback: copy raw string
      return copyToClipboard(selectorOrUpi || DEFAULT_UPI);
    }
  };

  // Expose API
  window.gadsgetDonate = API;

  // Auto-init when script loaded (defer recommended)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appendToBodyIfNone);
  } else {
    appendToBodyIfNone();
  }

})();
