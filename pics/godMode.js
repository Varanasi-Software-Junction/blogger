/* ============================================================
   Programmer’s Picnic – TEMPLE + LOTUS + FLOWERS GOD MODE
   Full spiritual engine (Option A)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // ---------- CORE DOM ELEMENTS ----------
    const startScreen = document.getElementById("startScreen");
    const overlay = document.getElementById("pp-gallery-overlay");
    const slideImg = document.getElementById("slideImg");
    const captionLine1 = document.getElementById("captionLine1");
    const captionLine2 = document.getElementById("captionLine2");
    const musicBtn = document.getElementById("musicBtn");

    const petalLayer = document.getElementById("petalLayer");
    const fireflyLayer = document.getElementById("fireflyLayer");
    const bokehLayer = document.getElementById("bokehLayer");
    const polaroid = document.querySelector(".polaroid");

    // ---------- IMAGE LIST ----------
    let imgs = Array.from(document.querySelectorAll("#picnic-images img"));

    if (!imgs || imgs.length === 0) {
        console.error("GOD MODE: No images found inside #picnic-images. Add <img src='Picnic/...'> tags.");
        if (startScreen) startScreen.style.display = "none";
        return;
    }

    // ---------- LOTUS CONSTANTS ----------
    const LOTUS_SVG = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Indian_Pink_Lotus.svg/512px-Indian_Pink_Lotus.svg.png";
    const LOTUS_GOLD = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Golden_lotus.svg/512px-Golden_lotus.svg.png";

    // ============================================================
    //  DYNAMIC CSS INJECTION (Lotus + Flowers)
    // ============================================================
    (function addDynamicCSS() {
        const css = `
        .templeFlower {
            position: absolute;
            will-change: transform, opacity;
            transition: opacity 2s linear;
            user-select: none;
            pointer-events: none;
        }
        .lotusWheel {
            position: absolute;
            width: 160px;
            height: 160px;
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.12;
            pointer-events: none;
            filter: blur(2px);
        }
        .lotusBurst {
            position: absolute;
            width: 240px;
            height: 240px;
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            opacity: 0;
            filter: blur(1px);
        }
        .lotusTap {
            position: absolute;
            width: 120px;
            height: 120px;
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            opacity: 0;
        }`;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    })();

    // ============================================================
    //  OM GLOW BEHIND POLAROID
    // ============================================================
    if (polaroid) {
        const omGlow = document.createElement("div");
        omGlow.style.position = "absolute";
        omGlow.style.inset = "10%";
        omGlow.style.borderRadius = "20px";
        omGlow.style.background = "radial-gradient(circle, rgba(255,220,160,0.45), rgba(255,170,90,0.1), transparent)";
        omGlow.style.display = "flex";
        omGlow.style.alignItems = "center";
        omGlow.style.justifyContent = "center";
        omGlow.style.fontSize = "64px";
        omGlow.style.color = "rgba(150,80,20,0.16)";
        omGlow.style.zIndex = "4";
        omGlow.style.pointerEvents = "none";
        omGlow.textContent = "ॐ";
        polaroid.style.position = "relative";
        polaroid.insertBefore(omGlow, slideImg);
    }

    // ============================================================
    //  ADVANCED RANDOMIZATION
    // ============================================================
    function advancedShuffle(nodes) {
        const arr = nodes.slice();
        let lastSrc = sessionStorage.getItem("pp_last_start_src") || null;

        // Fisher–Yates
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        // Avoid same start as last time if possible
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

    // ============================================================
    //  CAPTION ENGINE (Tech + Spiritual)
    // ============================================================
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

    // ============================================================
    //  ADAPTIVE CAPTION COLOR
    // ============================================================
    function adjustCaptionColor(imgElement) {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const w = imgElement.naturalWidth;
            const h = imgElement.naturalHeight;
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

            const brightness = (r + g + b) / (3 * total); // 0..255

            if (brightness < 90) {
                captionLine1.style.color = "#ffdd99";
                captionLine2.style.color = "#ffecca";
            } else if (brightness < 170) {
                captionLine1.style.color = "#5a2d00";
                captionLine2.style.color = "#7a3d00";
            } else {
                captionLine1.style.color = "#3d1a00";
                captionLine2.style.color = "#4d2000";
            }
        } catch (e) {
            console.warn("Brightness check failed:", e);
        }
    }

    // ============================================================
    //  PARTICLES – FLOWERS, FIREFLIES, BOKEH, BIG LOTUS
    // ============================================================
    const flowerEmojis = ["🌸", "🌼", "💮", "🪷"];

    // Falling flowers
    function spawnFlower() {
        if (!petalLayer) return;
        const f = document.createElement("div");
        f.className = "templeFlower";
        f.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

        const size = 28 + Math.random() * 28;
        f.style.fontSize = size + "px";
        f.style.left = Math.random() * window.innerWidth + "px";
        f.style.top = "-60px";
        f.style.opacity = (0.4 + Math.random() * 0.4).toString();
        f.style.filter = "blur(0.5px)";

        petalLayer.appendChild(f);

        const fallDuration = 9000 + Math.random() * 6000;
        const driftX = (Math.random() - 0.5) * 140;
        const rotateStart = Math.random() * 40 - 20;
        const rotateEnd = rotateStart + (Math.random() * 80 - 40);

        f.animate(
            [
                { transform: `translate(0,0) rotate(${rotateStart}deg)` },
                { transform: `translate(${driftX}px, ${window.innerHeight + 120}px) rotate(${rotateEnd}deg)` }
            ],
            { duration: fallDuration, easing: "ease-in-out", fill: "forwards" }
        );

        setTimeout(() => f.remove(), fallDuration + 200);
    }
    setInterval(spawnFlower, 1600);

    // Fireflies
    function spawnFirefly() {
        if (!fireflyLayer) return;
        const f = document.createElement("div");
        f.style.position = "absolute";
        f.style.width = "8px";
        f.style.height = "8px";
        f.style.borderRadius = "50%";
        f.style.background = "radial-gradient(circle, #fff8c0, transparent)";
        f.style.opacity = "0.35";
        f.style.left = Math.random() * window.innerWidth + "px";
        f.style.top = Math.random() * window.innerHeight + "px";
        fireflyLayer.appendChild(f);

        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 90;

        f.animate(
            [
                { transform: "translate(0,0)", opacity: 0.2 },
                { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.55 }
            ],
            { duration: 7000, easing: "ease-in-out", fill: "forwards" }
        );

        setTimeout(() => f.remove(), 7000);
    }
    setInterval(spawnFirefly, 2300);

    // Bokeh
    function spawnBokeh() {
        if (!bokehLayer) return;
        const b = document.createElement("div");
        b.style.position = "absolute";
        b.style.width = "90px";
        b.style.height = "90px";
        b.style.borderRadius = "50%";
        b.style.background = "radial-gradient(circle, rgba(255,200,150,0.28), transparent)";
        b.style.filter = "blur(9px)";
        b.style.left = Math.random() * window.innerWidth + "px";
        b.style.top = Math.random() * window.innerHeight + "px";
        b.style.opacity = "0.22";
        bokehLayer.appendChild(b);

        b.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.4)" }],
            { duration: 16000, easing: "ease-in-out", fill: "forwards" }
        );

        setTimeout(() => b.remove(), 16000);
    }
    setInterval(spawnBokeh, 2800);

    // Big rare falling lotus
    function spawnBigLotus() {
        if (!petalLayer) return;
        const l = document.createElement("div");
        l.textContent = "🪷";
        l.style.position = "absolute";
        l.style.fontSize = (50 + Math.random() * 40) + "px";
        l.style.left = Math.random() * window.innerWidth + "px";
        l.style.top = "-80px";
        l.style.opacity = "0.55";
        petalLayer.appendChild(l);

        const duration = 13000 + Math.random() * 5000;

        l.animate(
            [
                { transform: "translateY(0px)" },
                { transform: `translateY(${window.innerHeight + 100}px)` }
            ],
            { duration, easing: "ease-out", fill: "forwards" }
        );

        setTimeout(() => l.remove(), duration + 200);
    }
    setInterval(spawnBigLotus, 9000);

    // ============================================================
    //  LOTUS WHEELS IN BACKGROUND
    // ============================================================
    function spawnLotusWheel() {
        if (!overlay) return;
        const wheel = document.createElement("div");
        wheel.className = "lotusWheel";
        wheel.style.backgroundImage = `url(${LOTUS_SVG})`;

        const size = 140 + Math.random() * 120;
        wheel.style.width = size + "px";
        wheel.style.height = size + "px";

        wheel.style.left = Math.random() * window.innerWidth + "px";
        wheel.style.top = Math.random() * window.innerHeight + "px";

        overlay.appendChild(wheel);

        wheel.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(360deg)" }
            ],
            {
                duration: 32000 + Math.random() * 20000,
                iterations: Infinity,
                easing: "linear"
            }
        );
    }
    setInterval(spawnLotusWheel, 12000);

    // ============================================================
    //  AURA BLOOM + LOTUS BURST ON SLIDE CHANGE
    // ============================================================
    function triggerAuraBloom() {
        if (!overlay) return;
        const bloom = document.createElement("div");
        bloom.style.position = "absolute";
        bloom.style.inset = "0";
        bloom.style.background = "radial-gradient(circle, rgba(255,230,180,0.5), transparent 60%)";
        bloom.style.pointerEvents = "none";
        bloom.style.opacity = "0";
        bloom.style.zIndex = "5";
        overlay.appendChild(bloom);

        bloom.animate(
            [
                { opacity: 0, transform: "scale(0.8)" },
                { opacity: 0.5, transform: "scale(1.0)" },
                { opacity: 0, transform: "scale(1.2)" }
            ],
            { duration: 900, easing: "ease-out", fill: "forwards" }
        );

        setTimeout(() => bloom.remove(), 950);
    }

    function triggerLotusBurst() {
        if (!overlay) return;
        const burst = document.createElement("div");
        burst.className = "lotusBurst";
        burst.style.backgroundImage = `url(${LOTUS_GOLD})`;
        burst.style.left = "50%";
        burst.style.top = "50%";
        burst.style.transform = "translate(-50%, -50%) scale(0.4)";
        burst.style.zIndex = "7";
        overlay.appendChild(burst);

        burst.animate(
            [
                { opacity: 0, transform: "translate(-50%, -50%) scale(0.4)" },
                { opacity: 0.4, transform: "translate(-50%, -50%) scale(1.4)" },
                { opacity: 0, transform: "translate(-50%, -50%) scale(1.9)" }
            ],
            { duration: 900, easing: "ease-out", fill: "forwards" }
        );

        setTimeout(() => burst.remove(), 950);
    }

    // ============================================================
    //  BLESSING MODE – every 10th slide
    // ============================================================
    const blessings = [
        "शुभम् भवतु",
        "मङ्गलं भवतु",
        "सर्वे भवन्तु सुखिनः",
        "ॐ शान्तिः शान्तिः शान्तिः"
    ];

    const blessingBox = document.createElement("div");
    blessingBox.style.position = "absolute";
    blessingBox.style.top = "10%";
    blessingBox.style.width = "100%";
    blessingBox.style.textAlign = "center";
    blessingBox.style.fontSize = "32px";
    blessingBox.style.color = "rgba(90,30,0,0.94)";
    blessingBox.style.textShadow = "0 0 12px rgba(255,240,200,0.9)";
    blessingBox.style.opacity = "0";
    blessingBox.style.zIndex = "8";
    blessingBox.style.pointerEvents = "none";
    blessingBox.style.fontWeight = "600";
    overlay.appendChild(blessingBox);

    function showBlessing(index) {
        const slideNumber = index + 1;
        if (slideNumber % 10 !== 0) return;
        const msg = blessings[Math.floor(Math.random() * blessings.length)];
        blessingBox.textContent = msg;
        blessingBox.style.transition = "opacity 0.4s ease";
        blessingBox.style.opacity = "1";
        setTimeout(() => blessingBox.style.opacity = "0", 1400);
    }

    // ============================================================
    //  LOTUS TAP BLOSSOM
    // ============================================================
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            const lotus = document.createElement("div");
            lotus.className = "lotusTap";
            lotus.style.backgroundImage = `url(${LOTUS_SVG})`;
            lotus.style.left = (e.clientX - 60) + "px";
            lotus.style.top = (e.clientY - 60) + "px";
            lotus.style.opacity = "0";
            lotus.style.zIndex = "9";
            document.body.appendChild(lotus);

            lotus.animate(
                [
                    { opacity: 0, transform: "scale(0.5)" },
                    { opacity: 0.6, transform: "scale(1.2)" },
                    { opacity: 0, transform: "scale(1.8)" }
                ],
                { duration: 1200, easing: "ease-out", fill: "forwards" }
            );

            setTimeout(() => lotus.remove(), 1300);
        });
    }

    // ============================================================
    //  MUSIC + WHISPER CHANT ENGINE
    // ============================================================
    let mainAudio = null;
    let whisperAudio = null;
    let musicOn = false;

    function ensureAudios() {
        if (!mainAudio) {
            mainAudio = new Audio(
                "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lee_Rosevere/Ambient_Classical/Lee_Rosevere_-_11_-_Meditation_Impromptu_01.mp3"
            );
            mainAudio.loop = true;
            mainAudio.volume = 0.45;
        }
        if (!whisperAudio) {
            whisperAudio = new Audio(
                "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Monk_Turner__Fascinoma/Real_Faith/Monk_Turner__Fascinoma_-_01_-_Om_Sai_Ram.mp3"
            );
            whisperAudio.loop = true;
            whisperAudio.volume = 0.22;
        }
    }

    function setMusicState(on) {
        musicOn = on;
        ensureAudios();
        if (musicOn) {
            mainAudio.play().catch(e => console.warn("Main audio blocked:", e));
            whisperAudio.play().catch(e => console.warn("Whisper audio blocked:", e));
            musicBtn.textContent = "🔇 Sound Off";
        } else {
            mainAudio.pause();
            whisperAudio.pause();
            musicBtn.textContent = "🎵 Sound On";
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            setMusicState(!musicOn);
        });
    }

    // ============================================================
    //  SLIDESHOW ENGINE
    // ============================================================
    let currentIndex = 0;

    function showSlide(index) {
        if (imgs.length === 0) return;

        if (index >= imgs.length) index = 0;
        if (index < 0) index = imgs.length - 1;

        const imgObj = imgs[index];
        if (!imgObj) return;

        currentIndex = index;
        slideImg.style.opacity = "0";

        setTimeout(() => {
            slideImg.src = imgObj.src;
            slideImg.style.opacity = "1";

            triggerAuraBloom();
            triggerLotusBurst();
            setCaption(index);
            showBlessing(index);

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

    // ============================================================
    //  START SCREEN LOGIC
    // ============================================================
    function begin() {
        if (startScreen) {
            startScreen.style.opacity = "0";
            startScreen.style.pointerEvents = "none";
            setTimeout(() => {
                if (startScreen.parentNode) startScreen.parentNode.removeChild(startScreen);
            }, 900);
        }
        startSlideshow();
        ensureAudios();
        setMusicState(true); // start with sound ON after first user interaction / auto-start
    }

    if (startScreen) {
        startScreen.addEventListener("click", begin);
    }

    // Auto-start after 8 seconds
    setTimeout(() => {
        if (document.body.contains(startScreen)) begin();
    }, 8000);
});
