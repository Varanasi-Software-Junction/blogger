/* ============================================================
   Programmer’s Picnic – SPIRITUAL MEDITATION ENGINE (Final)
   Option A: Full Spiritual Animations (soft)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    // ----- DOM ELEMENTS -----
    const startScreen = document.getElementById("startScreen");
    const overlay = document.getElementById("pp-gallery-overlay");
    const slideImg = document.getElementById("slideImg");
    const captionLine1 = document.getElementById("captionLine1");
    const captionLine2 = document.getElementById("captionLine2");
    const musicBtn = document.getElementById("musicBtn");

    const petalLayer = document.getElementById("petalLayer");
    const fireflyLayer = document.getElementById("fireflyLayer");
    const bokehLayer = document.getElementById("bokehLayer");

    // ----- COLLECT IMAGES -----
    let imgs = Array.from(document.querySelectorAll("#picnic-images img"));

    if (!imgs || imgs.length === 0) {
        console.error("GOD MODE: No images found in #picnic-images");
        return;
    }

    /* ============================================================
       ADVANCED RANDOMIZATION
       ============================================================ */
    function advancedShuffle(nodes) {
        const arr = nodes.slice();
        let lastSrc = sessionStorage.getItem("pp_last_start_src") || null;

        // Fisher–Yates
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        // Avoid same starting image
        if (lastSrc && arr.length > 1 && arr[0].src === lastSrc) {
            [arr[0], arr[1]] = [arr[1], arr[0]];
        }

        sessionStorage.setItem("pp_last_start_src", arr[0].src);
        return arr;
    }

    imgs = advancedShuffle(imgs);
    let cycleCount = 0;

    function reshuffleAfterLoop() {
        cycleCount++;
        if (cycleCount >= imgs.length) {
            imgs = advancedShuffle(imgs);
            cycleCount = 0;
        }
    }

    /* ============================================================
       CAPTION ENGINE
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

    imgs.forEach((img, i) => {
        img.alt = `${techLines[i % techLines.length]} — ${mantraLines[i % mantraLines.length]}`;
    });

    function setCaption(index) {
        captionLine1.textContent = techLines[index % techLines.length];
        captionLine2.textContent = mantraLines[index % mantraLines.length];
    }

    /* ============================================================
       ADAPTIVE CAPTION COLOR
       ============================================================ */
    function adjustCaptionColor(imgElement) {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const w = imgElement.naturalWidth, h = imgElement.naturalHeight;
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

            const brightness = (r + g + b) / (3 * total);

            if (brightness < 0.35) {
                captionLine1.style.color = "#ffdd99";
                captionLine2.style.color = "#ffecca";
            }
            else if (brightness < 0.65) {
                captionLine1.style.color = "#5a2d00";
                captionLine2.style.color = "#7a3d00";
            }
            else {
                captionLine1.style.color = "#3d1a00";
                captionLine2.style.color = "#4d2000";
            }

        } catch (e) {
            console.warn("Brightness check failed:", e);
        }
    }

    /* ============================================================
       SPIRITUAL PARTICLE GENERATORS (SOFT MODE)
       ============================================================ */

    // 🌸 Petals (slow + sparse)
    function spawnPetal() {
        const p = document.createElement("div");
        p.style.position = "absolute";
        p.style.width = "20px";
        p.style.height = "20px";
        p.style.background = "#ffc7d2";
        p.style.borderRadius = "60% 40% 70% 30%";
        p.style.opacity = "0.25";
        p.style.left = Math.random() * window.innerWidth + "px";
        p.style.top = "-40px";
        p.style.filter = "blur(0.6px)";
        p.style.transition = "transform 12s linear, opacity 12s linear";
        petalLayer.appendChild(p);

        setTimeout(() => {
            p.style.transform = `translateY(${window.innerHeight + 60}px) rotate(240deg)`;
            p.style.opacity = "0";
        }, 50);

        setTimeout(() => p.remove(), 12000);
    }

    setInterval(spawnPetal, 1600);



    // 🔆 Fireflies
    function spawnFirefly() {
        const f = document.createElement("div");
        f.style.position = "absolute";
        f.style.width = "8px";
        f.style.height = "8px";
        f.style.borderRadius = "50%";
        f.style.background = "radial-gradient(circle, #fff8c0, transparent)";
        f.style.opacity = "0.4";
        f.style.left = Math.random() * window.innerWidth + "px";
        f.style.top = Math.random() * window.innerHeight + "px";
        fireflyLayer.appendChild(f);

        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 80;

        f.animate([
            { transform: "translate(0,0)", opacity: 0.2 },
            { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.5 }
        ], { duration: 6000, easing: "ease-in-out", fill: "forwards" });

        setTimeout(() => f.remove(), 6000);
    }

    setInterval(spawnFirefly, 2000);



    // 🔮 Bokeh (soft glowing circles)
    function spawnBokeh() {
        const b = document.createElement("div");
        b.style.position = "absolute";
        b.style.width = "90px";
        b.style.height = "90px";
        b.style.borderRadius = "50%";
        b.style.background = "radial-gradient(circle, rgba(255,200,150,0.35), transparent)";
        b.style.filter = "blur(10px)";
        b.style.left = Math.random() * window.innerWidth + "px";
        b.style.top = Math.random() * window.innerHeight + "px";
        b.style.opacity = "0.25";
        bokehLayer.appendChild(b);

        b.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.4)" }
        ], {
            duration: 14000,
            easing: "ease-in-out",
            fill: "forwards"
        });

        setTimeout(() => b.remove(), 14000);
    }

    setInterval(spawnBokeh, 2600);



    /* ============================================================
       MUSIC ENGINE
       ============================================================ */
    let audio = null;
    let musicOn = false;

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
        if (musicOn) audio.play();
        else audio.pause();
    });

    /* ============================================================
       SLIDESHOW ENGINE
       ============================================================ */

    let currentIndex = 0;

    function showSlide(index) {
        if (imgs.length === 0) return;

        if (index >= imgs.length) index = 0;
        if (index < 0) index = imgs.length - 1;

        const imageObj = imgs[index];
        if (!imageObj) return;

        currentIndex = index;

        slideImg.style.opacity = "0";

        setTimeout(() => {
            slideImg.src = imageObj.src;
            slideImg.style.opacity = "1";

            setCaption(index);

            slideImg.onload = () => adjustCaptionColor(slideImg);

        }, 300);
    }

    function nextSlide() {
        currentIndex++;

        if (currentIndex >= imgs.length) {
            reshuffleAfterLoop();
            currentIndex = 0;
        }

        showSlide(currentIndex);
    }

    function startSlideshow() {
        overlay.style.display = "flex";
        showSlide(currentIndex);

        setInterval(nextSlide, 7000);
    }

    /* ============================================================
       START SCREEN LOGIC
       ============================================================ */
    function begin() {
        startScreen.style.opacity = "0";
        startScreen.style.pointerEvents = "none";

        setTimeout(() => startScreen.remove(), 800);

        startSlideshow();

        if (audio && !musicOn) {
            musicOn = true;
            musicBtn.textContent = "🔇 Music Off";
            audio.play().catch(err => console.warn("Audio autoplay blocked:", err));
        }
    }

    startScreen.addEventListener("click", begin);

    setTimeout(() => {
        if (document.body.contains(startScreen)) begin();
    }, 8000);

});
