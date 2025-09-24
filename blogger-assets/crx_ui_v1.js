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

  function byId(id) { return document.getElementById(id); }
  function q(selector, root) { return (root || document).querySelector(selector); }
  function qa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
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
    }
  };

  /* ---------------------------
     Affiliate loader: picks up to 2 random products and renders cards
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
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      const chosen = products.slice(0, Math.min(2, products.length));
      tgt.innerHTML = "";
      chosen.forEach(p => {
        const card = document.createElement("div");
        card.className = "crx_affiliate";
        card.innerHTML = `
        <div class="crx_affiliate">
        <center>
        <br>
 <div style="font-size:12px; ">Product on Amazon<br>*As an Amazon Associate I earn from qualifying purchases.</div>
 <br>
          <img class="crx_affiliate_img" src="${escapeHtml(p.img)}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <div style="flex:1">
            <div class="crx_affiliate_title">${escapeHtml(p.title)}</div>
            <div class="crx_affiliate_desc">${escapeHtml(p.desc)}</div>
            <div style="margin-top:8px;">
              <a class="crx_btn" href="${p.url}" target="_blank" rel="noopener noreferrer">Buy on Amazon</a>
            </div>
            <div style="font-size:12px;color:#666;margin-top:8px;">*As an Amazon Associate I earn from qualifying purchases.</div>
          </div>
          </center>
          </div>
        `;
        tgt.appendChild(card);
      });
    } catch (e) {
      console.error("crx_loadAffiliates:", e);
    }
  };

  /* ---------------------------
     Simple slider loader stub (lazy-load Swiper)
     --------------------------- */
  window.crx_initSlider = async function (containerSelector, options) {
    // containerSelector can be ID or selector
    const container = (typeof containerSelector === "string") ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;
    if (window.Swiper) {
      try { new Swiper(container, options || {}); } catch (e) { console.warn("crx_initSlider init failed", e); }
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
      }).catch(() => console.warn("Swiper load failed"));
    }
    if (window.Swiper) {
      try { new Swiper(container, options || { slidesPerView: 1, spaceBetween: 12 }); } catch (e) { console.warn(e); }
    }
  };

  /* ---------------------------
     Bubble sort visualizer builder
     - crx_createBubbleVisualizer(targetEl, opts)
     - targetEl: element or selector where visualizer will be rendered
     - opts: { numbers: "5,-3,8", mode: "alt"|"ltr"|"rtl", speak: true/false }
     --------------------------- */
  window.crx_createBubbleVisualizer = function (targetEl, opts) {
    // normalize targetEl
    let root;
    if (typeof targetEl === "string") root = document.querySelector(targetEl);
    else root = targetEl instanceof Element ? targetEl : null;
    if (!root) return null;

    opts = opts || {};
    const initialNumbers = opts.numbers || root.getAttribute("data-crx-numbers") || "5,-3,8,1,-4,7";
    const initialMode = opts.mode || root.getAttribute("data-crx-mode") || "ltr";
    const initialSpeak = (typeof opts.speak === "boolean") ? opts.speak : (root.getAttribute("data-crx-speak") !== "false");

    // Build DOM (namespaced classes follow crx_styles_v1.css)
    root.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "crx_visualizer_wrapper";

    // header + controls
    const controls = document.createElement("div");
    controls.className = "crx_controls";
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "8px";
    controls.style.alignItems = "center";

    const label = document.createElement("label");
    label.style.fontWeight = "700";
    label.textContent = "Numbers:";
    controls.appendChild(label);

    const input = document.createElement("input");
    input.className = "crx_input";
    input.type = "text";
    input.value = initialNumbers;
    input.style.minWidth = "260px";
    input.setAttribute("aria-label", "Numbers (comma separated)");
    controls.appendChild(input);

    const createBtn = document.createElement("button");
    createBtn.className = "crx_btn";
    createBtn.style.marginLeft = "4px";
    createBtn.textContent = "Create Boxes";
    controls.appendChild(createBtn);

    const sortBtn = document.createElement("button");
    sortBtn.className = "crx_btn";
    sortBtn.textContent = "Run Bubble Sort";
    controls.appendChild(sortBtn);

    const speakLabel = document.createElement("label");
    speakLabel.style.display = "inline-flex";
    speakLabel.style.alignItems = "center";
    speakLabel.style.gap = "6px";
    const speakToggle = document.createElement("input");
    speakToggle.type = "checkbox";
    speakToggle.checked = initialSpeak;
    speakLabel.appendChild(speakToggle);
    const speakText = document.createElement("span");
    speakText.style.fontWeight = "600";
    speakText.textContent = "Speak";
    speakLabel.appendChild(speakText);
    controls.appendChild(speakLabel);

    const modeLabel = document.createElement("label");
    modeLabel.style.display = "inline-flex";
    modeLabel.style.alignItems = "center";
    modeLabel.style.gap = "6px";
    const modeText = document.createElement("span");
    modeText.style.fontWeight = "600";
    modeText.textContent = "Mode:";
    modeLabel.appendChild(modeText);
    const modeSelect = document.createElement("select");
    modeSelect.className = "crx_input";
    ["ltr", "rtl", "alt"].forEach(v => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = (v === "ltr") ? "Left → Right" : (v === "rtl") ? "Right → Left" : "Alternating";
      modeSelect.appendChild(o);
    });
    modeSelect.value = initialMode;
    modeLabel.appendChild(modeSelect);
    controls.appendChild(modeLabel);

    wrapper.appendChild(controls);

    // legend + counter area
    const legend = document.createElement("div");
    legend.style.display = "flex";
    legend.style.gap = "12px";
    legend.style.alignItems = "center";
    legend.style.marginTop = "10px";
    legend.style.flexWrap = "wrap";

    // small helper to build legend chips
    function chip(color, labelText) {
      const c = document.createElement("div");
      c.style.display = "flex";
      c.style.gap = "8px";
      c.style.alignItems = "center";
      const sw = document.createElement("div");
      sw.style.width = "18px"; sw.style.height = "18px"; sw.style.borderRadius = "4px";
      sw.style.background = color.bg; sw.style.border = color.border;
      c.appendChild(sw);
      const t = document.createElement("div");
      t.style.fontSize = "14px"; t.textContent = labelText;
      c.appendChild(t);
      return c;
    }
    legend.appendChild(chip({ bg: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.45)" }, "Sorted block"));
    legend.appendChild(chip({ bg: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.28)" }, "Unsorted block"));
    legend.appendChild(chip({ bg: "#0b63d4", border: "" }, "Highlight = comparing/swapped"));

    const counter = document.createElement("div");
    counter.style.fontWeight = "700";
    counter.style.color = "#0a2a43";
    counter.textContent = "Sorted: left = 0 • right = 0";
    counter.id = "crx_sorted_counter_" + Math.random().toString(36).slice(2, 8);
    legend.appendChild(counter);

    wrapper.appendChild(legend);

    // visual container
    const container = document.createElement("div");
    container.className = "crx_visual_container";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "240px";
    container.style.border = "2px solid #333";
    container.style.marginTop = "10px";
    container.style.overflowX = "auto";
    container.style.padding = "10px";
    container.style.boxSizing = "border-box";
    container.style.background = "#fafafa";

    // overlays (using classes expected by crx_styles_v1.css)
    const leftOverlay = document.createElement("div");
    leftOverlay.className = "crx_overlay crx_overlay_left";
    leftOverlay.style.display = "none";
    container.appendChild(leftOverlay);

    const rightOverlay = document.createElement("div");
    rightOverlay.className = "crx_overlay crx_overlay_right";
    rightOverlay.style.display = "none";
    container.appendChild(rightOverlay);

    const unsortedOverlay = document.createElement("div");
    unsortedOverlay.className = "crx_overlay crx_overlay_unsorted";
    unsortedOverlay.style.display = "none";
    container.appendChild(unsortedOverlay);

    const spacer = document.createElement("div");
    spacer.className = "crx_spacer";
    container.appendChild(spacer);

    wrapper.appendChild(container);

    // speech bar
    const speechBar = document.createElement("div");
    speechBar.className = "crx_speechbar";
    const speechCurrent = document.createElement("div");
    speechCurrent.className = "crx_speech_current";
    speechCurrent.textContent = "Ready...";
    const speechQueue = document.createElement("div");
    speechQueue.className = "crx_speech_queue";
    speechBar.appendChild(speechCurrent);
    speechBar.appendChild(speechQueue);
    wrapper.appendChild(speechBar);

    // attach wrapper to root
    root.appendChild(wrapper);

    /* ---- internal state for this visualizer instance ---- */
    let boxes = [], values = [];
    let busy = false, needRecenter = false;
    let phraseQueue = [];
    let sortedLeft = 0, sortedRight = 0;

    // timings & layout (expose via opts if needed)
    const spacing = 80;
    const ypos = 60;
    const stageMs = opts.stageMs || 420;
    const swapTotalMs = stageMs * 3;
    const compareMs = opts.compareMs || 900;

    // small helpers
    function computeOffset() {
      const totalWidth = values.length * spacing;
      const containerWidth = container.clientWidth;
      return Math.max(0, (containerWidth - totalWidth) / 2);
    }
    function slotLeft(index) { return computeOffset() + index * spacing; }
    function currentLeftRelToContainer(elem) {
      const rect = elem.getBoundingClientRect();
      const cont = container.getBoundingClientRect();
      return rect.left - cont.left + container.scrollLeft;
    }
    function refreshIndices() { boxes.forEach((b, idx) => { const lbl = b.querySelector(".idx"); if (lbl) lbl.textContent = idx; }); }

    // speech queue UI
    function updateSpeechBarUI() {
      if (phraseQueue.length === 0) { speechCurrent.textContent = "Ready..."; speechQueue.innerHTML = ""; return; }
      speechCurrent.textContent = phraseQueue[0] || "";
      if (phraseQueue.length > 1) {
        const upcoming = phraseQueue.slice(1, 7).map((p, i) => `<span style="display:block; color: rgba(255,255,255,0.9);">${i + 1}. ${escapeHtml(p)}</span>`).join("");
        speechQueue.innerHTML = upcoming;
      } else { speechQueue.innerHTML = ""; }
    }
    function enqueuePhrase(p) { phraseQueue.push(p); updateSpeechBarUI(); }
    function dequeuePhrase() { phraseQueue.shift(); updateSpeechBarUI(); }

    function speakPhraseForDuration(phrase, targetMs) {
      enqueuePhrase(phrase);
      return new Promise(resolve => {
        if (!speakToggle.checked || typeof speechSynthesis === "undefined") {
          setTimeout(() => { dequeuePhrase(); resolve(); }, Math.max(30, targetMs));
          return;
        }
        const words = phrase.trim().split(/\s+/).length || 1;
        const estMsAtRate1 = (words / 3) * 1000;
        let rate = estMsAtRate1 / targetMs;
        if (rate < 0.35) rate = 0.35; if (rate > 2.5) rate = 2.5;
        const u = new SpeechSynthesisUtterance(phrase);
        u.rate = rate;
        const voices = speechSynthesis.getVoices();
        if (voices && voices.length) {
          const v = voices.find(v => /en-|english/i.test(v.name)) || voices[0];
          if (v) u.voice = v;
        }
        u.onend = () => { dequeuePhrase(); resolve(); };
        u.onerror = () => { dequeuePhrase(); resolve(); };
        speechSynthesis.speak(u);
      });
    }

    // visual helpers
    function addHighlight(el) { el.classList.add("crx_highlight"); }
    function removeHighlight(el) { el.classList.remove("crx_highlight"); }

    function commitBoxToSlotWithoutJump(box, targetSlotLeftPx) {
      const curLeft = currentLeftRelToContainer(box);
      const fix = curLeft - targetSlotLeftPx;
      box.style.transition = "none";
      box.style.left = Math.round(targetSlotLeftPx) + "px";
      box.style.transform = `translate(${Math.round(fix)}px, 0px)`;
      void box.offsetWidth;
      box.style.transform = "";
      void box.offsetWidth;
      box.style.transition = "transform 0.35s ease, box-shadow 0.35s ease, left 0.25s ease";
    }

    async function highlightAndSpeakCompare(i, j) {
      if (i < 0 || j < 0 || i >= boxes.length || j >= boxes.length) return;
      const a = boxes[i], b = boxes[j];
      const phrase = `Comparing ${values[i]} and ${values[j]}`;
      addHighlight(a); addHighlight(b);
      const sp = speakPhraseForDuration(phrase, compareMs);
      await delay(compareMs);
      removeHighlight(a); removeHighlight(b);
      await sp;
    }

    async function swapAnimationSpeak(i, j) {
      if (i === j) return;
      const boxA = boxes[i], boxB = boxes[j];
      const valA = values[i], valB = values[j];
      const leftA = slotLeft(i), leftB = slotLeft(j);
      const dAB = leftB - leftA, dBA = leftA - leftB;
      const phrase = `Swapping ${valA} and ${valB}`;
      const speechPromise = speakPhraseForDuration(phrase, swapTotalMs);

      // up
      boxA.style.transition = `transform ${stageMs / 1000}s ease`;
      boxB.style.transition = `transform ${stageMs / 1000}s ease`;
      boxA.style.transform = "translateY(-70px)";
      boxB.style.transform = "translateY(-70px)";
      await delay(stageMs);

      // cross
      boxA.style.transform = `translate(${dAB}px, -70px)`;
      boxB.style.transform = `translate(${dBA}px, -70px)`;
      await delay(stageMs);

      // down
      boxA.style.transform = `translate(${dAB}px, 0px)`;
      boxB.style.transform = `translate(${dBA}px, 0px)`;
      await delay(stageMs);

      await speechPromise;

      const targetLeftA = slotLeft(j);
      const targetLeftB = slotLeft(i);
      commitBoxToSlotWithoutJump(boxA, targetLeftA);
      commitBoxToSlotWithoutJump(boxB, targetLeftB);

      [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
      [values[i], values[j]] = [values[j], values[i]];
      refreshIndices();

      if (needRecenter) { needRecenter = false; recenterBoxes(); }
    }

    function recenterBoxes() {
      if (boxes.length === 0) return;
      if (busy) { needRecenter = true; return; }
      boxes.forEach((box, idx) => { box.style.transition = "none"; box.style.left = Math.round(slotLeft(idx)) + "px"; });
      void container.offsetWidth;
      boxes.forEach(box => { box.style.transition = "transform 0.35s ease, box-shadow 0.35s ease, left 0.25s ease"; });
      updateOverlays();
    }

    // overlays update
    function updateOverlays() {
      const n = values.length;
      if (n === 0) {
        leftOverlay.style.display = "none"; rightOverlay.style.display = "none"; unsortedOverlay.style.display = "none";
        updateCounter();
        return;
      }
      const leftUnsortedIdx = sortedLeft;
      const rightUnsortedIdx = n - 1 - sortedRight;

      if (sortedLeft > 0) {
        const leftPx = slotLeft(0);
        const leftEndPx = slotLeft(sortedLeft - 1) + 56;
        setRect(leftOverlay, leftPx, leftEndPx - leftPx);
      } else leftOverlay.style.display = "none";

      if (sortedRight > 0) {
        const rightStartPx = slotLeft(n - sortedRight);
        const rightEndPx = slotLeft(n - 1) + 56;
        setRect(rightOverlay, rightStartPx, rightEndPx - rightStartPx);
      } else rightOverlay.style.display = "none";

      if (leftUnsortedIdx <= rightUnsortedIdx) {
        const unsLeftPx = slotLeft(leftUnsortedIdx);
        const unsRightPx = slotLeft(rightUnsortedIdx) + 56;
        setRect(unsortedOverlay, unsLeftPx, Math.max(0, unsRightPx - unsLeftPx));
      } else {
        unsortedOverlay.style.display = "none";
      }

      updateCounter();
    }

    function setRect(el, leftPx, widthPx) {
      el.style.left = Math.max(0, leftPx) + "px";
      el.style.width = Math.max(0, widthPx) + "px";
      el.style.display = "block";
    }

    function updateCounter() { counter.textContent = `Sorted: left = ${sortedLeft} • right = ${sortedRight}`; }

    // main bubble sort driver (modes + early exit)
    async function bubbleSort() {
      if (busy) return;
      if (values.length < 2) return;
      busy = true; createBtn.disabled = true; sortBtn.disabled = true;
      const n = values.length;
      let pass = 0;
      let swappedThisPass = true;
      sortedLeft = 0; sortedRight = 0;
      updateOverlays();

      while (pass < n - 1 && swappedThisPass) {
        swappedThisPass = false;
        const mode = modeSelect.value;
        let dir = "ltr";
        if (mode === "ltr") dir = "ltr";
        else if (mode === "rtl") dir = "rtl";
        else if (mode === "alt") dir = (pass % 2 === 0) ? "ltr" : "rtl";

        if (dir === "ltr") {
          for (let i = 0; i < n - 1 - pass; i++) {
            updateOverlays();
            await highlightAndSpeakCompare(i, i + 1);
            if (values[i] > values[i + 1]) { await swapAnimationSpeak(i, i + 1); swappedThisPass = true; }
          }
          sortedRight++;
        } else {
          for (let i = n - 1; i > pass; i--) {
            updateOverlays();
            await highlightAndSpeakCompare(i, i - 1);
            if (values[i - 1] > values[i]) { await swapAnimationSpeak(i - 1, i); swappedThisPass = true; }
          }
          sortedLeft++;
        }

        pass++;
        updateOverlays();
        if (!swappedThisPass) break;
      }

      busy = false; createBtn.disabled = false; sortBtn.disabled = false;
      updateOverlays();
      boxes.forEach(b => addHighlight(b));
      setTimeout(() => boxes.forEach(b => removeHighlight(b)), 600);
      phraseQueue = ["Sorting complete!"]; updateSpeechBarUI();
      setTimeout(() => { phraseQueue = []; updateSpeechBarUI(); }, 1600);
      alert("Sorting complete!");
    }

    // create boxes
    function createBoxes() {
      const raw = input.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
      const parsed = raw.map(s => Number(s)).filter(n => !Number.isNaN(n));
      if (parsed.length === 0) { alert("Enter at least one number"); return; }

      // clear old boxes, keep overlays
      container.querySelectorAll(".crx_box, .crx_spacer").forEach(n => n.remove());
      if (!container.contains(leftOverlay)) container.appendChild(leftOverlay);
      if (!container.contains(rightOverlay)) container.appendChild(rightOverlay);
      if (!container.contains(unsortedOverlay)) container.appendChild(unsortedOverlay);
      const spacer = document.createElement("div"); spacer.className = "crx_spacer"; spacer.style.height = "160px"; container.appendChild(spacer);

      boxes = []; values = [];
      const maxAbs = Math.max(...parsed.map(n => Math.abs(n)));
      parsed.forEach((val, idx) => {
        const mag = Math.abs(val);
        const posBg = numberToColorMagnitude(mag, maxAbs);
        const posText = invertColor(posBg);
        const bg = val >= 0 ? posBg : posText;
        const fg = val >= 0 ? posText : posBg;

        const box = document.createElement("div");
        box.className = "crx_box";
        box.textContent = val;
        box.style.left = slotLeft(idx) + "px";
        box.style.top = ypos + "px";
        box.style.background = rgbToString(bg);
        box.style.color = rgbToString(fg);

        const lbl = document.createElement("div");
        lbl.className = "idx";
        lbl.textContent = idx;
        box.appendChild(lbl);

        container.appendChild(box);
        boxes.push(box);
        values.push(val);
      });

      container.style.minWidth = (parsed.length * spacing + 20) + "px";
      phraseQueue = []; updateSpeechBarUI();
      sortedLeft = 0; sortedRight = 0; recenterBoxes(); updateOverlays();
    }

    // color helpers (copied)
    function numberToColorMagnitude(magnitude, maxAbs) {
      if (maxAbs === 0) return { r: 80, g: 130, b: 220 };
      let t = magnitude / maxAbs;
      return {
        r: Math.round(t * 255),
        g: Math.round((1 - Math.abs(t - 0.5) * 2) * 255),
        b: Math.round((1 - t) * 255)
      };
    }
    function invertColor({ r, g, b }) { return { r: 255 - r, g: 255 - g, b: 255 - b }; }
    function rgbToString({ r, g, b }) { return `rgb(${r},${g},${b})`; }

    // events
    createBtn.addEventListener("click", createBoxes);
    sortBtn.addEventListener("click", bubbleSort);

    // resize handler
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (busy) needRecenter = true; else recenterBoxes(); }, 120);
    });

    // initial render
    input.value = initialNumbers;
    modeSelect.value = initialMode;
    speakToggle.checked = initialSpeak;
    createBoxes();

    // return a small API for this instance
    return {
      root: root,
      createBoxes: createBoxes,
      run: bubbleSort,
      setNumbers: (s) => { input.value = s; },
      setMode: (m) => { modeSelect.value = m; }
    };
  }; // end crx_createBubbleVisualizer

  /* ---------------------------
     Auto-initialize common placeholders on DOMContentLoaded
     Recognized placeholders:
       - [data-crx-widget="affiliate"] -> crx_loadAffiliates
       - [data-crx-widget="bio"] -> crx_bio.html fragment
       - [data-crx-widget="donate"] -> crx_donate.html fragment
       - [data-crx-widget="bubble-visualizer"] -> initialize crx_createBubbleVisualizer on that element
     --------------------------- */
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
        } else if (name === "bubble-visualizer") {
          // if data-crx-inline="true" then don't auto initialize (but we will initialize always)
          const numbers = el.getAttribute("data-crx-numbers") || undefined;
          const mode = el.getAttribute("data-crx-mode") || undefined;
          const speak = el.getAttribute("data-crx-speak");
          const speakBool = (speak === null) ? undefined : (speak === "true" || speak === "1");
          window.crx_createBubbleVisualizer(el, { numbers: numbers, mode: mode, speak: speakBool });
        } else {
          // unknown widget -> try loading fragment if fragment exists
          await window.crx_loadWidget(name, el);
        }
      });
    } catch (e) {
      console.warn("crx widget init error:", e);
    }
  });

})(); // end IIFE
