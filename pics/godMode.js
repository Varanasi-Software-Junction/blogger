// Programmer's Picnic – Ultra Magic GOD MODE Engine
// -------------------------------------------------
// This script powers:
// - Start screen → slideshow
// - Divine saffron aurora + god rays
// - Petal rain, fireflies, bokeh lights
// - Memory orb
// - Ripples on tap
// - Quotes, captions, progress bar
// - Auto-play slideshow
// - Simple music playlist (you can replace URLs)

// ============ CONFIG ============

// Replace these with your own MP3 URLs (recommended: bansuri / tanpura / soft tabla)
const MUSIC_TRACKS = [
    // Example placeholders – put your own files here in your repo:
    // "music/bansuri1.mp3",
    // "music/bansuri2.mp3",
    // "music/tanpura1.mp3"
];

// Slideshow timing (ms)
const SLIDE_DURATION = 7000;

// Particle spawn rates (ms)
const PETAL_INTERVAL = 350;
const FIREFLY_INTERVAL = 900;
const BOKEH_INTERVAL = 1200;

// ============ UTILS ============

function $(id) {
    return document.getElementById(id);
}

// Inject extra CSS for particles & extra effects that weren't in Part 1
(function injectExtraCSS() {
    const css = `
  .petal {
    position: absolute;
    width: 22px;
    height: 22px;
    background: #ffc1d6;
    border-radius: 60% 40% 70% 30%;
    opacity: 0.85;
    filter: blur(0.4px);
    animation: petalFall 7s linear forwards;
  }
  @keyframes petalFall {
    0% {
      transform: translateY(-40px) translateX(0) rotate(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(110vh) translateX(-40px) rotate(360deg) scale(0.6);
      opacity: 0;
    }
  }

  .firefly {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #fff, rgba(255,255,255,0));
    border-radius: 50%;
    animation: fireflyFly 6s linear forwards;
    opacity: 0.9;
  }
  @keyframes fireflyFly {
    0%   { transform: translate(0,0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    50%  { transform: translate(40px, -80px) scale(1.4); opacity: 1; }
    100% { transform: translate(-20px, -160px) scale(1); opacity: 0; }
  }

  .bokeh {
    position: absolute;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(255,210,150,0.45), transparent);
    border-radius: 50%;
    filter: blur(8px);
    animation: bokehDrift 14s ease-in-out forwards;
  }
  @keyframes bokehDrift {
    0%   { transform: translate(0,0) scale(1); opacity: 0.2; }
    30%  { opacity: 0.6; }
    50%  { transform: translate(40px,-30px) scale(1.4); opacity: 0.8; }
    100% { transform: translate(-30px,20px) scale(1.1); opacity: 0; }
  }

  .kenburns {
    animation: zoomSlide 8s ease forwards;
  }
  @keyframes zoomSlide {
    0%   { transform: scale(1); }
    100% { transform: scale(1.08); }
  }

  .pageFlip {
    animation: pageFlip 1.2s ease forwards;
  }
  @keyframes pageFlip {
    0%   { transform: perspective(800px) rotateY(-90deg); opacity: 0; }
    60%  { transform: perspective(800px) rotateY(20deg); opacity: 1; }
    100% { transform: perspective(800px) rotateY(0deg); }
  }
  `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
})();

// ============ MAIN ENGINE ============

document.addEventListener("DOMContentLoaded", () => {
    const startScreen = $("startScreen");
    const musicBtn = $("musicBtn");
    const overlay = $("pp-gallery-overlay");
    const petalLayer = $("petalLayer");
    const fireflyLayer = $("fireflyLayer");
    const bokehLayer = $("bokehLayer");
    const memoryOrb = $("memoryOrb");
    const slideImg = $("slideImg");
    const captionBox = $("captionBox");
    const quoteBox = $("quoteBox");
    const progressBarContainer = $("progressBarContainer");
    const progressBar = $("progressBar");

    const imgs = Array.from(document.querySelectorAll("#picnic-images img"));
    if (!imgs.length) {
        console.warn("No images found in #picnic-images");
        return;
    }

    // State
    let currentIndex = 0;
    let autoTimer = null;
    let slideshowStarted = false;

    // Music state
    let musicPlaying = false;
    let currentTrackIndex = 0;
    let currentAudio = null;

    // Quotes
    const quotes = [
        "✨ Every smile tells a story.",
        "🌼 Moments that stay forever.",
        "💛 Together is the best place to be.",
        "🌿 Joy grows when shared.",
        "📸 One click, a thousand memories.",
        "🌞 Warm hearts, bright minds.",
        "💫 The magic of togetherness."
    ];

    function showRandomQuote() {
        if (!quoteBox) return;
        quoteBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        quoteBox.style.animation = "none";
        // force reflow
        void quoteBox.offsetWidth;
        quoteBox.style.animation = "quoteFade 5s ease";
    }

    // ========== MUSIC ENGINE ==========

    function loadAndPlayTrack(index) {
        if (!MUSIC_TRACKS.length) return; // no music configured
        if (index >= MUSIC_TRACKS.length) index = 0;
        if (index < 0) index = MUSIC_TRACKS.length - 1;
        currentTrackIndex = index;

        if (currentAudio) {
            currentAudio.pause();
        }

        const audio = new Audio(MUSIC_TRACKS[currentTrackIndex]);
        audio.volume = 0.6;
        audio.loop = false;

        audio.addEventListener("ended", () => {
            // Move to next track automatically
            loadAndPlayTrack(currentTrackIndex + 1);
            if (!musicPlaying) {
                // user turned music off meanwhile
                audio.pause();
            }
        });

        currentAudio = audio;
        if (musicPlaying) {
            currentAudio.play().catch(err => {
                console.warn("Autoplay blocked or failed:", err);
            });
        }
    }

    function toggleMusic() {
        if (!MUSIC_TRACKS.length) {
            alert("No music tracks configured yet.\nEdit MUSIC_TRACKS in godMode.js and add your MP3 files.");
            return;
        }

        musicPlaying = !musicPlaying;
        musicBtn.textContent = musicPlaying ? "⏸ Pause Music" : "🎵 Music";

        if (musicPlaying) {
            if (!currentAudio) {
                loadAndPlayTrack(0);
            } else {
                currentAudio.play().catch(err => console.warn("Play failed:", err));
            }
        } else {
            if (currentAudio) currentAudio.pause();
        }
    }

    musicBtn.addEventListener("click", toggleMusic);

    // After first user interaction (start), if tracks exist, start music
    function startMusicIfConfigured() {
        if (!MUSIC_TRACKS.length) return;
        musicPlaying = true;
        musicBtn.textContent = "⏸ Pause Music";
        if (!currentAudio) {
            loadAndPlayTrack(0);
        } else {
            currentAudio.play().catch(err => console.warn("Play failed:", err));
        }
    }

    // ========== PARTICLES ==========

    function spawnPetal() {
        const el = document.createElement("div");
        el.className = "petal";
        el.style.left = Math.random() * window.innerWidth + "px";
        el.style.top = "-40px";
        petalLayer.appendChild(el);
        setTimeout(() => el.remove(), 7000);
    }

    function spawnFirefly() {
        const el = document.createElement("div");
        el.className = "firefly";
        el.style.left = Math.random() * window.innerWidth + "px";
        el.style.top = Math.random() * window.innerHeight + "px";
        fireflyLayer.appendChild(el);
        setTimeout(() => el.remove(), 6000);
    }

    function spawnBokeh() {
        const el = document.createElement("div");
        el.className = "bokeh";
        el.style.left = Math.random() * window.innerWidth + "px";
        el.style.top = Math.random() * window.innerHeight + "px";
        bokehLayer.appendChild(el);
        setTimeout(() => el.remove(), 14000);
    }

    setInterval(spawnPetal, PETAL_INTERVAL);
    setInterval(spawnFirefly, FIREFLY_INTERVAL);
    setInterval(spawnBokeh, BOKEH_INTERVAL);

    // ========== RIPPLE ON TAP ==========

    function createRipple(x, y) {
        const r = document.createElement("div");
        r.className = "ripple";
        r.style.left = x + "px";
        r.style.top = y + "px";
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 1000);
    }

    // ========== PARALLAX (subtle) ==========

    // Move aurora / rays / orb slightly with mouse
    const aurora = $("aurora");
    const godRays = $("godRays");

    function handleParallax(e) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const x = (e.clientX - w / 2) / w; // -0.5 to 0.5
        const y = (e.clientY - h / 2) / h;

        if (aurora) {
            aurora.style.transform = `translate(${x * 40}px, ${y * 30}px) scale(1.1)`;
        }
        if (godRays) {
            godRays.style.transform = `rotate(${x * 20}deg)`;
        }
        if (memoryOrb) {
            memoryOrb.style.transform = `translate(${120 + x * 80}px, ${-150 + y * 60}px)`;
        }
    }

    overlay.addEventListener("mousemove", handleParallax);

    // ========== SLIDESHOW ==========

    function updateProgressBar() {
        if (!progressBar) return;
        const pct = ((currentIndex + 1) / imgs.length) * 100;
        progressBar.style.width = pct + "%";
    }

    function showSlide(index) {
        if (index < 0) index = imgs.length - 1;
        if (index >= imgs.length) index = 0;
        currentIndex = index;

        const imgObj = imgs[currentIndex];

        // Trigger "curtain" via simple opacity: fade out, change, fade in
        slideImg.style.opacity = 0;
        captionBox.style.opacity = 0;

        setTimeout(() => {
            slideImg.src = imgObj.src;
            slideImg.alt = imgObj.alt || "";

            // Remove old animation classes, re-add
            slideImg.className = "";
            slideImg.id = "slideImg"; // preserve id
            slideImg.classList.add("kenburns", "pageFlip");

            captionBox.textContent = imgObj.alt || "";
            captionBox.style.animation = "none";
            void captionBox.offsetWidth;
            captionBox.style.animation = "captionFade 2s ease forwards";

            showRandomQuote();
            slideImg.style.opacity = 1;
            captionBox.style.opacity = 1;
            updateProgressBar();
        }, 280);
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoTimer = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoPlay() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    function openSlideshow() {
        if (slideshowStarted) return;
        slideshowStarted = true;

        overlay.style.display = "flex";
        progressBarContainer.style.display = "block";
        showSlide(0);
        startAutoPlay();
        startMusicIfConfigured();
    }

    function closeSlideshow() {
        overlay.style.display = "none";
        progressBarContainer.style.display = "none";
        stopAutoPlay();
        if (currentAudio) {
            currentAudio.pause();
        }
        musicPlaying = false;
        musicBtn.textContent = "🎵 Music";
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!slideshowStarted || overlay.style.display !== "flex") return;
        if (e.key === "ArrowRight") {
            nextSlide();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "Escape") {
            closeSlideshow();
        }
    });

    // Overlay click → ripple + next slide (but ignore click on music button)
    overlay.addEventListener("click", (e) => {
        if (e.target === musicBtn) return;
        createRipple(e.clientX, e.clientY);
        nextSlide();
    });

    // ========== START SCREEN LOGIC ==========

    function startNow() {
        if (!startScreen) return;
        startScreen.style.animation = "fadeOut 1s forwards";
        setTimeout(() => {
            if (startScreen && startScreen.parentNode) {
                startScreen.parentNode.removeChild(startScreen);
            }
        }, 900);
        openSlideshow();
    }

    startScreen.addEventListener("click", startNow);

    // Auto-start after 8 seconds if user doesn't tap
    setTimeout(() => {
        if (document.body.contains(startScreen)) {
            startNow();
        }
    }, 8000);
});
