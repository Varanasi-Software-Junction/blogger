// 🌼 Programmer’s Picnic — Maha Divine GOD MODE Slideshow

let images = [];
let currentSlide = 0;
let autoSlideInterval = null;

const SLIDE_SHARP_TIME = 6000; // 6 seconds full clarity
const TRANSITION_TIME = 1800;
const TOTAL_TIME = SLIDE_SHARP_TIME + TRANSITION_TIME;

// Elements
const slideImg = document.getElementById("slideImg");
const overlay = document.getElementById("pp-gallery-overlay");
const startScreen = document.getElementById("startScreen");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const photoCounter = document.getElementById("photoCounter");
const musicBtn = document.getElementById("musicBtn");
const petalLayer = document.getElementById("petalLayer");
const fireflyLayer = document.getElementById("fireflyLayer");
const bokehLayer = document.getElementById("bokehLayer");
const captionLine1 = document.getElementById("captionLine1");
const captionLine2 = document.getElementById("captionLine2");

// 🎵 Spiritual background music
const audio = new Audio("Picnic/0.mp3");
audio.loop = true;
audio.volume = 0.6;

// 🌸 GOD MODE particle intensity control
let clarityBoost = false;

// Spiritual quote list (for Option E)
const spiritualQuotes = [
  "Every bug I fixed as a student is now a story I smile about.",
  "Old projects feel like handwritten letters from my younger self.",
  "In programming and in life, the first draft is allowed to be ugly.",
  "Some of my favorite memories are just me, a cheap laptop, and impossible dreams.",
  "Refactoring code taught me I can refactor my life too.",
  "The first time my code ran successfully felt like the universe nodded back at me.",
  "Your future self is quietly hoping you don’t give up today.",
  "Every error message is just a mentor with bad communication skills.",
  "We don’t really delete old code; we just hide our growth inside git history.",
  "The nights you stayed up coding will one day feel like sacred pilgrimages.",
  "Sometimes the bravest thing you can do is run the program again.",
  "You’re not starting from scratch, you’re starting from experience.",
  "The best tutorials I ever had were my own mistakes.",
  "When life feels stuck, remember: even infinite loops can be broken.",
  "One day you’ll miss the time when Hello World was your biggest challenge.",
  "Behind every confident programmer is a search history full of doubts.",
  "Your childhood curiosity is still inside you, it just learned new keyboard shortcuts.",
  "Some bugs are just reminders that you’re trying something you’ve never done before.",
  "The code that embarrasses you today is proof that you’ve grown.",
  "Sometimes ‘deploy’ is less scary than saying what you really feel.",
  "We cache our fears but we can also invalidate them.",
  "Your dreams are not deprecated, just waiting for the next release.",
  "Even the strongest developer started with copy–paste and confusion.",
  "One day you’ll open an old project and realize how far you’ve really come.",
  "The keyboard was my first time machine; it took me to all the futures I imagined.",
  "We version-control code, not people. You’re allowed to change.",
  "Every TODO comment in life is a promise that you still believe in tomorrow.",
  "You are not behind; your path just has custom requirements.",
  "Some friendships feel like pair-programming for the soul.",
  "The same way we handle exceptions in code, we can forgive ourselves in life.",
  "Childhood was just life in sandbox mode.",
  "The first time I pressed Enter on a scary command and nothing broke, I grew a little braver.",
  "Hope is just the human version of lazy loading.",
  "Your passion doesn’t expire; it only waits for better bandwidth.",
  "Some days you optimize performance, some days you just avoid crashing. Both are valid.",
  "We debug code with prints and hearts with conversations.",
  "The projects that never launched still trained your courage.",
  "Your younger self didn’t have your skills, but they had your courage. Honor both.",
  "The same hands that typed ‘I can’t’ also typed your best work.",
  "Every commit says: I was here, I tried, I learned.",
  "The compiler doesn’t care how many times you failed, only what you wrote now.",
  "Simplicity in code and sincerity in life are both hard and worth it.",
  "Sometimes the most powerful feature you can add is rest.",
  "Not all progress shows on the screen; some of it grows quiet and deep inside you.",
  "The bugs you fear at 2 AM will be jokes in a few years.",
  "You don’t outgrow dreams, you just upgrade them.",
  "Every ‘why is this not working’ brought you closer to ‘oh, now I get it’.",
  "The lab, the café, the hostel roof—our first offices were full of stars and wifi drops.",
  "A good childhood memory is like a global constant in your heart.",
  "Life won’t always compile, but that doesn’t mean the story is broken.",
  "Sometimes the repository you need to pull from is your own past courage.",
  "You are the only person who has seen every one of your comebacks.",
  "Failures age like wine; one day they turn into wisdom and stories.",
  "We used to share games and songs; now we share repos—but the love is the same.",
  "The first time someone asked you for help with code, you became a teacher.",
  "Your code may run on silicon, but it was powered by hope and stubbornness.",
  "Growing up feels like moving from print statements to proper logging.",
  "The moments you almost quit became the foundations you stand on now.",
  "Memories are just snapshots in the cloud of your mind—worth backing up often.",
  "A single kind teacher or friend can change your whole architecture.",
  "Don’t compare your chapter one to someone else’s production build.",
  "Your childhood dreams were never silly; they were your earliest user stories.",
  "Even when you feel lost, your heart still remembers the way home.",
  "One person believing in you can feel like switching from 2G to fiber.",
  "You learned loops long before code—waking, trying, failing, trying again.",
  "The first time you solved a problem alone, the world quietly got bigger.",
  "Not all heroes wear capes; some wear cracked spectacles and explain pointers patiently.",
  "It’s okay if today’s commit is small; it still moves the story forward.",
  "The screen once felt bigger than the world; now the world fits inside your screen.",
  "Courage is pressing run even when you’re sure you missed a semicolon.",
  "You owe it to your younger self to at least try.",
  "The best optimization is removing the fear of starting.",
  "One day you’ll miss these messy, half-finished dreams.",
  "Every language you learned—C, Java, Python—was just another way of saying ‘I want to create’.",
  "Silently grinding at a corner desk is its own form of prayer.",
  "The projects that failed taught you how to build a life that won’t.",
  "You are not just debugging code; you’re debugging generational doubt.",
  "Childhood evenings with cheap computers and big hopes were priceless investments.",
  "You learned recursion from life itself: the same lessons repeating until you understood.",
  "Some of the sweetest moments are when an old friend pings you like no time has passed.",
  "The day you realized you could teach others was your real graduation.",
  "We outgrow classrooms but never outgrow learning.",
  "A single working prototype is worth a thousand perfect ideas.",
  "If life were an IDE, your heart is the place where real-time errors show up first.",
  "Every time you chose learning over ego, you leveled up.",
  "The feeling of shipping your first project stays forever in your personal changelog.",
  "You can always rewrite code; you can also rewrite the story you tell yourself.",
  "Past you would be proud of how far you’ve come with so little.",
  "Even when no one was watching, you kept trying. That’s your true resume.",
  "Sometimes the bravest refactor is to walk away from what’s breaking you.",
  "The bugs will not remember you, but the people you helped will.",
  "You learned latency from old internet connections and patience from life.",
  "Growing older is just adding new libraries of wisdom to your mind.",
  "Some of your best ideas were born in small rooms with big dreams.",
  "Your keyboard has heard your doubts, your prayers, and your victories.",
  "Behind every ‘I’ll just try once more’ lives a quiet miracle.",
  "The kid who loved breaking toys is the engineer who loves understanding systems.",
  "You were compiling courage long before you compiled code.",
  "The algorithm of life is simple: try, learn, share, repeat.",
  "The best backup plan is faith in your ability to learn again.",
  "When you teach someone, you let your memories become their shortcuts.",
  "You can’t time-travel back to childhood, but you can protect today’s curiosity.",
  "Every time you choose kindness over cleverness, your heart gets an upgrade.",
  "One day these hard days will be the nostalgia that makes you smile softly.",
  "Your story is still in active development; don’t judge it by a single failed build."
];
//************************************************** */
const progressTooltip = document.createElement("div");
progressTooltip.style.position = "fixed";
progressTooltip.style.padding = "4px 8px";
progressTooltip.style.borderRadius = "8px";
progressTooltip.style.fontSize = "12px";
progressTooltip.style.background = "rgba(90, 40, 0, 0.9)";
progressTooltip.style.color = "#ffe9c4";
progressTooltip.style.pointerEvents = "none";
progressTooltip.style.transform = "translate(-50%, -120%)";
progressTooltip.style.whiteSpace = "nowrap";
progressTooltip.style.zIndex = "1000000";
progressTooltip.style.display = "none";
document.body.appendChild(progressTooltip);
//**************************************** */
// ------------------------------------------------------
// Preload images from hidden DOM container
// ------------------------------------------------------
function preloadImages() {
    const stored = document.querySelectorAll("#picnic-images img");
    stored.forEach((img) => {
        if (img.src) {
            images.push({ src: img.src });
        }
    });
}
preloadImages();

// ------------------------------------------------------
// Helpers for captions
// ------------------------------------------------------
function prettifyFilename(src) {
    try {
        let name = src.split("/").pop().split("?")[0]; // last part, remove query
        name = name.replace(/\.[^/.]+$/, "");          // remove extension
        name = name.replace(/[_-]+/g, " ");            // underscores & dashes to spaces
        name = name.replace(/\s+/g, " ").trim();

        if (!name) return "Programmer’s Picnic Memory";

        // If it's mostly numbers, just call it a memory
        if (/^\d+$/.test(name.replace(/\s/g, ""))) {
            return "Programmer’s Picnic Memory";
        }

        // Capitalize words
        name = name.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        return name;
    } catch {
        return "Programmer’s Picnic Memory";
    }
}

function setCaptionsForCurrentSlide() {
    const src = images[currentSlide]?.src || "";
    const title = prettifyFilename(src);
    const quote = spiritualQuotes[currentSlide % spiritualQuotes.length];

    captionLine1.textContent = title;
    captionLine2.textContent = quote;

    captionLine1.classList.remove("caption-show");
    captionLine2.classList.remove("caption-show");

    // fade in captions a bit after clarity starts
    setTimeout(() => captionLine1.classList.add("caption-show"), 2000);
    setTimeout(() => captionLine2.classList.add("caption-show"), 2600);
}

// ------------------------------------------------------
// GOD MODE: Fireflies / glowing particles & bokeh
// ------------------------------------------------------
function spawnPetals() {
    if (!clarityBoost) return;

    // 1–3 petals per tick
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        const isMarigold = Math.random() < 0.5; // Both, as you chose
        const el = document.createElement("div");
        el.className = isMarigold ? "marigold" : "petal";

        const startX = Math.random() * window.innerWidth;
        el.style.left = startX + "px";
        el.style.top = "-40px";

        const delay = Math.random() * 2;
        el.style.animationDelay = `${delay}s`;

        petalLayer.appendChild(el);
        setTimeout(() => el.remove(), 9000);
    }
}

function spawnFireflies() {
    if (!clarityBoost) return;

    const dot = document.createElement("div");
    const size = Math.random() * 8 + 4;
    dot.className = "godParticle";
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    dot.style.top = Math.random() * window.innerHeight + "px";
    dot.style.left = Math.random() * window.innerWidth + "px";
    dot.style.background = "radial-gradient(circle, rgba(255,255,220,0.9), rgba(255,200,120,0.1))";
    dot.style.boxShadow = "0 0 16px rgba(255,230,160,0.9)";
    dot.style.zIndex = 5;

    fireflyLayer.appendChild(dot);
    setTimeout(() => dot.remove(), 2600);
}

function spawnBokeh() {
    if (!clarityBoost) return;

    const orb = document.createElement("div");
    const size = Math.random() * 120 + 60;
    orb.className = "bokehOrb";
    orb.style.width = size + "px";
    orb.style.height = size + "px";
    orb.style.top = Math.random() * window.innerHeight + "px";
    orb.style.left = Math.random() * window.innerWidth + "px";
    orb.style.zIndex = 4;

    bokehLayer.appendChild(orb);
    setTimeout(() => orb.remove(), 4200);
}

// Timers for particles
setInterval(spawnPetals, 800);
setInterval(spawnFireflies, 300);
setInterval(spawnBokeh, 1700);

// ------------------------------------------------------
// GOD MODE: Ken Burns zoom / pan
// ------------------------------------------------------
let zoomDirection = 1;

function applyKenBurns() {
    if (!clarityBoost) {
        slideImg.style.transform = "scale(1) translate(0,0)";
        return;
    }

    zoomDirection *= -1;

    const zoomVal = zoomDirection > 0 ? 1.08 : 1.12;
    const translateX = Math.random() * 24 - 12; // ±12px
    const translateY = Math.random() * 24 - 12;

    slideImg.style.transition = "transform 7s ease-in-out";
    slideImg.style.transform = `scale(${zoomVal}) translate(${translateX}px, ${translateY}px)`;
}

// ------------------------------------------------------
// Main slide display logic
// ------------------------------------------------------
function showSlide() {
    if (images.length === 0) return;

    clarityBoost = false;
    slideImg.style.opacity = 0;
    slideImg.style.zIndex = 6; // base
    slideImg.classList.remove("sharp");
    slideImg.style.transform = "scale(1) translate(0,0)";
    captionLine1.classList.remove("caption-show");
    captionLine2.classList.remove("caption-show");

    photoCounter.textContent = `${currentSlide + 1} / ${images.length}`;

    slideImg.onload = () => {
        // Fade-in blurred
        setTimeout(() => {
            slideImg.style.opacity = 1;
        }, 200);

        // Enter clarity phase
        setTimeout(() => {
            clarityBoost = true;
            slideImg.classList.add("sharp");
            slideImg.style.zIndex = 999999; // top during clarity
            applyKenBurns();
            setCaptionsForCurrentSlide();
        }, 700);

        // Exit clarity
        setTimeout(() => {
            clarityBoost = false;
            slideImg.classList.remove("sharp");
            slideImg.style.zIndex = 6;
            slideImg.style.transform = "scale(1) translate(0,0)";
            captionLine1.classList.remove("caption-show");
            captionLine2.classList.remove("caption-show");
        }, SLIDE_SHARP_TIME);

        updateProgress();
    };

    slideImg.src = images[currentSlide].src;
}

// ------------------------------------------------------
// Navigation
// ------------------------------------------------------
function nextSlide() {
    if (images.length === 0) return;
    currentSlide = (currentSlide + 1) % images.length;
    showSlide();
}

function prevSlide() {
    if (images.length === 0) return;
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    showSlide();
}

// ------------------------------------------------------
// Auto slide
// ------------------------------------------------------
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, TOTAL_TIME);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// ------------------------------------------------------
// Progress bar based on image number
// ------------------------------------------------------
function updateProgress() {
    if (images.length <= 1) {
        progressBar.style.width = "100%";
        return;
    }
    const percent = (currentSlide / (images.length - 1)) * 100;
    progressBar.style.width = percent + "%";
}

progressContainer.addEventListener("click", (e) => {
    if (images.length === 0) return;

    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    currentSlide = Math.round(percent * (images.length - 1));

    stopAutoSlide();
    showSlide();
    startAutoSlide();
});

// ------------------------------------------------------
// Start screen → overlay
// ------------------------------------------------------
startScreen.addEventListener("click", () => {
    startScreen.style.opacity = "0";

    setTimeout(() => {
        startScreen.style.display = "none";
        overlay.style.display = "flex";
        showSlide();
        startAutoSlide();
        tryPlayMusic();
    }, 900);
});

// ------------------------------------------------------
// Music
// ------------------------------------------------------
function tryPlayMusic() {
    audio.play().catch(() => {
        // Some browsers require explicit click; user can use the button.
    });
}

musicBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        musicBtn.textContent = "🔊 Playing";
    } else {
        audio.pause();
        musicBtn.textContent = "🎵 Music";
    }
});

// ------------------------------------------------------
// Buttons
// ------------------------------------------------------
document.getElementById("nextBtn").addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

// ------------------------------------------------------
// Mobile swipe navigation
// ------------------------------------------------------
let touchStartX = 0;
overlay.addEventListener("touchstart", (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

overlay.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    const x = e.changedTouches[0].clientX;
    const diff = x - touchStartX;

    if (diff > 50) {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    } else if (diff < -50) {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    }
}, { passive: true });

// ------------------------------------------------------
// Pause on hover / touch
// ------------------------------------------------------
overlay.addEventListener("mouseover", () => {
    stopAutoSlide();
});

overlay.addEventListener("mouseout", () => {
    startAutoSlide();
});

overlay.addEventListener("touchstart", () => {
    stopAutoSlide();
}, { passive: true });

overlay.addEventListener("touchend", () => {
    startAutoSlide();
}, { passive: true });

// ------------------------------------------------------
// Initial placeholder
// ------------------------------------------------------
if (images.length > 0) {
    slideImg.src = images[0].src;
}
