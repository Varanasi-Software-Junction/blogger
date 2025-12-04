/*  FABULOUS IMAGE SHOW – ULTIMATE EDITION (All 5 Features)
 *  -------------------------------------------------------
 *  Enhancements included:
 *  1. Zoom animation
 *  2. Captions (from ALT or filename)
 *  3. Randomized slideshow order
 *  4. Background music (looped, soft)
 *  5. Slide progress bar
 *  + Auto-start after 15 seconds
 */

(function () {

    // Collect all images
    let imgs = Array.from(document.querySelectorAll("img"));
    if (imgs.length === 0) return;

    // RANDOMIZE order
    imgs = imgs.sort(() => Math.random() - 0.5);

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "pp-gallery-overlay";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 999999;
        backdrop-filter: blur(8px);
    `;

    // Background music
    const music = new Audio(
        "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kevin_MacLeod/Calming/KEVIN_MACLEOD_-_CALMING.mp3"
    );
    music.loop = true;
    music.volume = 0.35;

    // Main image with zoom animation
    const slideImg = document.createElement("img");
    slideImg.id = "pp-slide-img";
    slideImg.style.cssText = `
        max-width: 90%;
        max-height: 75%;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.6s ease, transform 0.8s ease;
    `;

    // Caption box
    const caption = document.createElement("div");
    caption.style.cssText = `
        margin-top: 15px;
        color: #ffd;
        font-size: 22px;
        font-family: system-ui, sans-serif;
        text-shadow: 0 0 10px black;
    `;

    // Progress bar container
    const progressBox = document.createElement("div");
    progressBox.style.cssText = `
        width: 80%;
        height: 6px;
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
        margin-top: 18px;
        overflow: hidden;
    `;

    // Actual progress bar
    const progressFill = document.createElement("div");
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: #ffca28;
        transition: width 4s linear;
    `;
    progressBox.appendChild(progressFill);

    // Navigation buttons
    const navBtn = `
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 42px;
        color: white;
        cursor: pointer;
        padding: 20px;
        user-select: none;
        text-shadow: 0 0 8px black;
        transition: 0.3s;
    `;

    const prevBtn = document.createElement("div");
    prevBtn.innerHTML = "&#10094;";
    prevBtn.style.cssText = navBtn + "left: 30px;";

    const nextBtn = document.createElement("div");
    nextBtn.innerHTML = "&#10095;";
    nextBtn.style.cssText = navBtn + "right: 30px;";

    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 48px;
        color: white;
        cursor: pointer;
        user-select: none;
    `;

    overlay.appendChild(slideImg);
    overlay.appendChild(caption);
    overlay.appendChild(progressBox);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    let currentIndex = 0;
    let autoPlayInterval = null;

    function getCaptionText(img) {
        if (img.alt && img.alt.trim() !== "") return img.alt.trim();
        try {
            return img.src.split("/").pop();
        } catch {
            return "Image";
        }
    }

    function showSlide(index) {
        if (index < 0) index = imgs.length - 1;
        if (index >= imgs.length) index = 0;
        currentIndex = index;

        slideImg.style.opacity = 0;
        slideImg.style.transform = "scale(0.9)";
        progressFill.style.width = "0%";

        setTimeout(() => {
            slideImg.src = imgs[currentIndex].src;
            caption.textContent = getCaptionText(imgs[currentIndex]);

            slideImg.style.opacity = 1;
            slideImg.style.transform = "scale(1)";

            progressFill.style.width = "100%";
        }, 100);
    }

    function openGallery(index) {
        overlay.style.display = "flex";
        music.play().catch(() => {}); // avoid autoplay block
        showSlide(index);
        startAutoPlay();
    }

    function closeGallery() {
        overlay.style.display = "none";
        stopAutoPlay();
        music.pause();
    }

    function nextSlide() { showSlide(currentIndex + 1); }
    function prevSlide() { showSlide(currentIndex - 1); }

    // Auto-play every 4 seconds
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    // Click any image to open gallery
    imgs.forEach((img, idx) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openGallery(idx));
    });

    // Buttons
    nextBtn.onclick = nextSlide;
    prevBtn.onclick = prevSlide;
    closeBtn.onclick = closeGallery;

    // Keyboard support
    document.addEventListener("keydown", (e) => {
        if (overlay.style.display === "flex") {
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "Escape") closeGallery();
        }
    });

    // ★ AUTO-START AFTER 15 SECONDS
    setTimeout(() => {
        if (overlay.style.display === "none") {
            openGallery(0);
        }
    }, 15000);

})();
