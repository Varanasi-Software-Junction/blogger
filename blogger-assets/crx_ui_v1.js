


/* ===================================
   CRX UI v1 – Full File
   =================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --- Toggle Answer Boxes --- */
  document.addEventListener("click", function (e) {
    if (e.target.matches(".crx_btn_toggle")) {
      const box = e.target.nextElementSibling;
      if (!box) return;
      box.classList.toggle("crx_show");
    }
  });

  /* --- Copy Code Buttons --- */
  document.addEventListener("click", function (e) {
    if (e.target.matches(".crx_btn_copy")) {
      let codeEl = null;
      const card = e.target.closest(".crx_card");
      if (card) codeEl = card.querySelector("code");
      if (!codeEl) return;
      const txt = codeEl.innerText;
      navigator.clipboard?.writeText(txt).then(() => {
        const prev = e.target.innerText;
        e.target.innerText = "Copied ✓";
        setTimeout(() => e.target.innerText = prev, 1400);
      }).catch(() => {
        alert("Copy failed — select and copy manually.");
      });
    }
  });

  /* --- Smooth Scroll for Floating Up/Down Buttons --- */
  document.querySelectorAll(".crx_fab_up").forEach(btn => {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  document.querySelectorAll(".crx_fab_down").forEach(btn => {
    btn.addEventListener("click", () => {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    });
  });

  /* --- Comment Timestamp Formatting --- */
  document.querySelectorAll(".crx_comment_meta[data-ts]").forEach(el => {
    const raw = el.getAttribute("data-ts") || el.textContent || "";
    const parsed = new Date(raw);
    if (!isNaN(parsed.valueOf())) {
      const opts = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      el.textContent = parsed.toLocaleString(undefined, opts);
    }
  });

  /* --- Author Button Toast --- */
  document.addEventListener("click", function (ev) {
    const btn = ev.target.closest(".crx_btn_author");
    if (!btn) return;
    const author = btn.getAttribute("data-author") || btn.textContent || "Unknown Author";
    const toast = document.createElement("div");
    toast.className = "crx_author_toast";
    toast.textContent = "Author: " + author;
    const rect = btn.getBoundingClientRect();
    toast.style.left = (window.scrollX + rect.left) + "px";
    toast.style.top = (window.scrollY + rect.bottom + 8) + "px";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  });
});
       
/* --- End of CRX UI v1 --- */