// donate.js
(function () {
  'use strict';

  // ======= Configuration =======
  // WhatsApp/phone used for fallback share. (Your saved number)
  const WA_PHONE = '919335874326'; // use as +91-9335874326

  // Message template used for sharing (uses {UPI} token)
  const SHARE_TEMPLATE = (upi) =>
    `Support Learning Sutras\nUPI: ${upi}\nThank you! 🙏\nContact: +91-9335874326`;

  // ======= Helpers =======
  const el = (sel) => document.querySelector(sel);
  const upiEl = el('#upiId');
  const copyBtn = el('#copyUpi');
  const shareBtn = el('#shareBtn');
  const toast = el('#crx-toast');

  function showToast(msg, timeout = 2200) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.classList.remove('show');
    }, timeout);
  }

  function sanitizeUpiText(raw) {
    if (!raw) return '';
    // Trim whitespace
    let s = raw.trim();
    // Common mistakes: stray commas, periods, spaces — try to repair:
    // If user used something like "name-1.,hdfc" -> try to replace commas/periods with nothing
    s = s.replace(/[,\s]+/g, ''); // remove spaces and commas between parts
    // If they wrote with - instead of @, try to replace - with @ for bank handle patterns
    // But don't aggressively replace hyphens that may belong; only if it looks like a UPI handle without @
    if (!s.includes('@') && s.includes('-')) {
      s = s.replace(/-/g, '@');
    }
    // final sanity: remove accidental trailing punctuation
    s = s.replace(/^[^\w@.-]+|[^\w@.-]+$/g, '');
    return s;
  }

  async function copyToClipboard(text) {
    if (!text) throw new Error('Nothing to copy');
    // Prefer modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Fallback using temporary textarea & execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('Copy failed');
  }

  function openWhatsAppShare(text) {
    // WhatsApp has two usable URLs:
    // - https://wa.me/<number>?text=<encoded> (works across mobile and desktop)
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${WA_PHONE}?text=${encoded}`;
    // Open in new tab/window
    window.open(url, '_blank', 'noopener');
  }

  async function handleCopyClick(e) {
    try {
      const raw = upiEl ? upiEl.textContent || upiEl.innerText || '' : '';
      const upi = sanitizeUpiText(raw);
      if (!upi) {
        showToast('UPI ID not found', 2300);
        return;
      }
      await copyToClipboard(upi);
      showToast('UPI copied to clipboard');
      // For a11y: also set focus briefly back to the upi element
      if (upiEl) upiEl.focus();
    } catch (err) {
      console.error('Copy error:', err);
      showToast('Could not copy — try long-press on mobile');
    }
  }

  async function handleShareClick(e) {
    try {
      const raw = upiEl ? upiEl.textContent || upiEl.innerText || '' : '';
      const upi = sanitizeUpiText(raw);
      if (!upi) {
        showToast('UPI ID not found', 2300);
        return;
      }
      const message = SHARE_TEMPLATE(upi);

      // Use Web Share API when available (mobile/modern browsers)
      if (navigator.share) {
        // navigator.share expects at least title or text. Some browsers accept url.
        await navigator.share({
          title: 'Support Learning Sutras',
          text: message
        });
        showToast('Share sheet opened');
        return;
      }

      // Fallback: copy to clipboard + open WhatsApp with prefilled message
      try {
        await copyToClipboard(message);
        showToast('Message copied — opening WhatsApp');
      } catch (err) {
        // if copy fails, we still attempt WhatsApp
        showToast('Opening WhatsApp to share');
      }

      openWhatsAppShare(message);
    } catch (err) {
      console.error('Share error:', err);
      showToast('Could not share — try copying manually');
    }
  }

  // Allow pressing Enter/Space on the upi element to copy (accessibility)
  function handleUpiKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyBtn && copyBtn.click();
    }
  }

  // ======= Init =======
  function init() {
    if (!upiEl) {
      console.warn('donate.js: #upiId not found');
      return;
    }
    if (copyBtn) copyBtn.addEventListener('click', handleCopyClick);
    if (shareBtn) shareBtn.addEventListener('click', handleShareClick);
    upiEl.addEventListener('keydown', handleUpiKey);

    // Make sure upi container is focusable for keyboard users (already tabindex=0 in markup)
    if (!upiEl.hasAttribute('tabindex')) {
      upiEl.setAttribute('tabindex', '0');
    }

    // If the upi box contains suspicious characters, add a little hint in console
    const raw = (upiEl.textContent || '').trim();
    if (raw && /[,\s]{1,}|[.]{1,}/.test(raw) && !raw.includes('@')) {
      console.info(
        'donate.js: UPI text may contain stray characters. Consider using a clean UPI like "name@bank". Script will attempt to sanitize.'
      );
    }
  }

  // Run on DOMContentLoaded if document not ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
  