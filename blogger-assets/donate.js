/* donate.js
   Page-specific donate behaviour:
   - Copies UPI ID shown in #upiId
   - Shares donation text using Web Share API or clipboard fallback
   - Shows accessible toast notifications
   - Keyboard accessible (Enter/Space activates buttons)
*/

(function () {
  'use strict';

  const CFG = {
    upiIdSelector: '#upiId',
    copyUpiBtn: '#copyUpi',
    shareBtn: '#shareBtn',
    toastId: 'crx-toast',
    shareTitle: 'Donate to Learning Sutras',
    shareTextTemplate: (upiId) => `Support Learning Sutras — donate via UPI:\nUPI ID: ${upiId}\n\nThank you! 🙏`,
    toastDuration: 1500
  };

  function showToast(msg, ms = CFG.toastDuration) {
    const t = document.getElementById(CFG.toastId);
    if (!t) {
      try { alert(msg); } catch (e) { console.log(msg); }
      return;
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => {
      t.classList.remove('show');
    }, ms);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) { /* fall through */ }
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      ta.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  async function shareDonation(upiId) {
    const title = CFG.shareTitle;
    const text = CFG.shareTextTemplate(upiId);

    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        showToast('Share dialog opened');
        return;
      } catch (err) {
        console.warn('Web Share failed or cancelled:', err);
      }
    }

    const ok = await copyToClipboard(text);
    if (ok) {
      showToast('Donation details copied — paste into your app to share');
    } else {
      try {
        const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
        window.location.href = mailto;
      } catch (e) {
        showToast('Unable to share automatically — please copy the UPI ID manually.');
      }
    }
  }

  function init() {
    const upiEl = document.querySelector(CFG.upiIdSelector);
    const copyBtn = document.querySelector(CFG.copyUpiBtn);
    const shareBtn = document.querySelector(CFG.shareBtn);

    if (!upiEl) {
      console.warn('donate.js: UPI element not found:', CFG.upiIdSelector);
      return;
    }

    const upiId = upiEl.textContent.trim();

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const ok = await copyToClipboard(upiId);
        if (ok) showToast('UPI ID copied');
        else showToast('Copy failed — please select and copy manually');
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        await shareDonation(upiId);
      });
    }

    document.addEventListener('keydown', (ev) => {
      const active = document.activeElement;
      if (!active) return;
      if ((ev.key === 'Enter' || ev.key === ' ') && active.matches && active.matches('button')) {
        ev.preventDefault();
        active.click();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expose for debugging if needed
  window._donate = { copyToClipboard, shareDonation, showToast };
})();
