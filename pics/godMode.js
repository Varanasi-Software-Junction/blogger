/* ============================================================
   Programmer’s Picnic – GOD MODE Meditation Engine (Safe Version)
   - Two-line technical + spiritual captions (Option B)
   - Advanced randomization
   - Adaptive caption color
   - Soft fade only
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // ----- CORE ELEMENTS -----
    const startScreen = document.getElementById("startScreen");
    const overlay = document.getElementById("pp-gallery-overlay");
    const slideImg = document.getElementById("slideImg");
    const captionLine1 = document.getElementById("captionLine1");
    const captionLine2 = document.getElementById("captionLine2");
    const musicBtn = document.getElementById("musicBtn");

    // ----- COLLECT IMAGES FROM HIDDEN CONTAINER -----
    let imgs = Array.from(document.querySelectorAll("#picnic-images img"));

    if (!imgs || imgs.length === 0) {
        console.error("GOD MODE: No images found inside #picnic-images. Add <img src=\"Picnic/..\"> tags.");
        if (startScreen) startScreen.style.display = "none";
        return;
    }

    /* ============================================================
       ADVANCED RANDOMIZATION (Safe, loop-aware)
       ============================================================ */

    function advancedShuffle(nodes) {
        const arr = nodes.slice(); // clone
        let lastSrc = sessionStorage.getItem("pp_last_start_src") || null;

        // simple Fisher–Yates
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        // ensure first image is not same as last start, if possible
        if (lastSrc && arr.length > 1 && arr[0].src === lastSrc) {
            [arr[0], arr[1]] = [arr[1], arr[0]];
        }

        sessionStorage.setItem("pp_last_start_src", arr[0].src);
        return arr;
    }

    function shuffleAndResetStart() {
        if (!imgs || imgs.length === 0) return;
        imgs = advancedShuffle(imgs);
        currentIndex = 0;
    }

    imgs = advancedShuffle(imgs); // initial shuffle

    /* ============================================================
       CAPTION ENGINE (Technical + Spiritual Mantras)
       ============================================================ */

    const techLines = [
        "Where logic met laughter and new ideas were compiled.",
        "A joyful commit to lifelong learning.",
        "The architecture of tomorrow begins with these smiles.",
        "Smiles that executed perfectly without errors.",
        "Thinking in algorithms, living with heart.",
        "A snapshot of creativity running in parallel.",
        "Threads of friendship and knowledge synchronized beautifully.",
        "Inspired minds processing dreams into reality.",
        "The source code of future achievements begins here.",
        "Optimizing life one joyful iteration at a time.",
        "Debugging fear, compiling courage.",
        "A perfect runtime of curiosity and connection.",
        "Energy loading… next version of ourselves emerging.",
        "A golden moment stored in lifelong memory banks.",
        "Where inspiration was declared and initialized.",
        "Friends, focus, and a future full of potential.",
        "Moments like these define our internal architecture.",
        "Compiled emotions, committed friendships.",
        "The compiler of life approved this moment: No errors found."
    ];

    const mantraLines = [
        "Growing like code, one iteration at a time.",
        "Every moment pushes the next version of us forward.",
        "Joy is the most powerful algorithm.",
        "Inner clarity is the ultimate debugging tool.",
        "We rise, refactor, and evolve.",
        "Breathe in focus, breathe out distraction.",
        "Learning is a spiritual upgrade.",
        "Harmony loads when the mind is still.",
        "Patience is the cleanest syntax.",
        "Your journey is running exactly as intended.",
        "This moment is a checkpoint—save the progress.",
        "Flow like logic, shine like light.",
        "Small steps… exponential growth.",
        "The universe is compiling something beautiful.",
        "Your inner framework strengthens every day.",
        "Presence is the greatest superpower.",
        "Your heart is the master function.",
        "Let gratitude be your root program.",
        "A calm mind executes the best solutions."
    ];

    // Auto-assign alt for SEO + accessibility
    imgs.forEach((img, i) => {
        const line1 = techLines[i % techLines.length];
        const line2 = mantraLines[i % mantraLines.length];
        img.alt = `${line1} — ${line2}`;
    });

    function setCaption(index) {
        captionLine1.textContent = techLines[index % techLines.length];
        captionLine2.textContent = mantraLines[index % mantraLines.length];
    }

    /* ============================================================
       AUTO TEXT COLOR BASED ON IMAGE BRIGHTNESS
       ============================================================ */

    function adjustCaptionColor(imgElement) {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // handle not-loaded images safely
            const w = imgElement.naturalWidth || imgElement.width;
            const h = imgElement.naturalHeight || imgElement.height;
            if (!w || !h) return;

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(imgElement, 0, 0, w, h);

            const data = ctx.getImageData(0, 0, w, h).data;
            let r = 0, g = 0, b = 0;
            const total = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            r /= total;
            g /= total;
            b /= total;

            const brightness = (r + g + b) / 3;

            if (brightness < 90) {
                // dark image → bright text
                captionLine1.style.color = "#ffdd99";
                captionLine2.style.color = "#ffecca";
            } else if (brightness < 170) {
                // medium
                captionLine1.style.color = "#5a2d00";
                captionLine2.style.color = "#7a3d00";
            } else {
                // bright → deep brown
                captionLine1.style.color = "#3d1a00";
                captionLine2.style.color = "#4d2000";
            }
        } catch (e) {
            console.warn("Could not analyze image brightness:", e);
        }
    }

    /* ============================================================
       MUSIC ENGINE
       ============================================================ */

    let audio = null;
    let musicOn = false;

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (!audio) {
                audio = new Audio(
                    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lee_Rosevere/Ambient_Classical/Lee_Rosevere_-_11_-_Meditation_Impromptu_01.mp3"
                );
                audio.loop = true;
                audio.volume = 0.5;
            }

            musicOn = !musicOn;
            musicBtn.textContent = musicOn ? "🔇 Music Off" : "🎵 Music";

            if (musicOn) audio.play().catch(err => console.warn("Audio play blocked:", err));
            else audio.pause();
        });
    }

    /* ============================================================
       SLIDESHOW ENGINE
       ============================================================ */

    let currentIndex = 0;
    let intervalId = null;

    function showSlide(index) {
        if (!imgs || imgs.length === 0) {
            console.error("GOD MODE: No images available in slideshow.");
            return;
        }

        if (index >= imgs.length) index = 0;
        if (index < 0) index = imgs.length - 1;

        const imgObj = imgs[index];
        if (!imgObj) {
            console.error("GOD MODE: Image at index", index, "is undefined.");
            return;
        }

        currentIndex = index;

        slideImg.style.opacity = "0";

        setTimeout(() => {
            slideImg.src = imgObj.src;
            slideImg.style.opacity = "1";

            setCaption(index);

            slideImg.onload = () => {
                adjustCaptionColor(slideImg);
            };
        }, 300);
    }

    function nextSlide() {
        if (!imgs || imgs.length === 0) return;

        // Re-shuffle when we reach end of current order
        if (currentIndex >= imgs.length - 1) {
            shuffleAndResetStart();
        } else {
            currentIndex++;
        }

        showSlide(currentIndex);
    }

    function startSlideshow() {
        if (!overlay) return;

        overlay.style.display = "flex";
        showSlide(currentIndex);

        intervalId = setInterval(nextSlide, 7000);
    }

    /* ============================================================
       START SCREEN LOGIC
       ============================================================ */

    function startNow() {
        if (startScreen) {
            startScreen.style.opacity = "0";
            startScreen.style.pointerEvents = "none";
            setTimeout(() => {
                if (startScreen.parentNode) startScreen.parentNode.removeChild(startScreen);
            }, 800);
        }

        startSlideshow();

        // Try auto-start music once there is a user gesture
        if (audio && !musicOn) {
            musicOn = true;
            if (musicBtn) musicBtn.textContent = "🔇 Music Off";
            audio.play().catch(err => console.warn("Audio autoplay blocked:", err));
        }
    }

    if (startScreen) {
        startScreen.addEventListener("click", startNow);
    }

    // Auto-start after 8 seconds if user doesn't tap
    setTimeout(() => {
        if (document.body.contains(startScreen)) {
            startNow();
        }
    }, 8000);
});
