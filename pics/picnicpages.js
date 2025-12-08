// 🌼 Programmer’s Picnic — GOD MODE Slideshow

let images = [];
let currentSlide = 0;
let autoSlideInterval = null;

const SLIDE_SHARP_TIME = 6000;
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
const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5e47d8ae45.mp3?filename=meditation-110624.mp3");
audio.loop = true;
audio.volume = 0.6;


// 🌸 Fireflies & Petals — dynamic particles
let clarityBoost = false;

function spawnParticles() {
    if (!clarityBoost) return;

    const particle = document.createElement("div");
    particle.className = "godParticle";

    Object.assign(particle.style, {
        position: "absolute",
        width: "10px",
        height: "10px",
        background: "rgba(255,220,160,0.8)",
        borderRadius: "50%",
        pointerEvents: "none",
        top: Math.random() * innerHeight + "px",
        left: Math.random() * innerWidth + "px",
        filter: "blur(2px)"
    });

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 2500);
}
setInterval(spawnParticles, 200);


// Load hidden images
function preloadImages() {
    const stored = document.querySelectorAll("#picnic-images img");
    stored.forEach((img) => {
        if (img.src) images.push({ src: img.src });
    });
}
preloadImages();


// 🌀 GOD MODE: Ken Burns Zoom + Focus
let zoomDirection = 1;

function applyKenBurns() {
    if (!clarityBoost) {
        slideImg.style.transform = "scale(1) translate(0,0)";
        return;
    }

    zoomDirection *= -1;
    const zoomVal = zoomDirection > 0 ? 1.08 : 1.12;
    const translateX = Math.random() * 20 - 10;
    const translateY = Math.random() * 20 - 10;

    slideImg.style.transition = "transform 7s ease-in-out";
    slideImg.style.transform = `scale(${zoomVal}) translate(${translateX}px, ${translateY}px)`;
}


// Show slide
function showSlide() {
    if (images.length === 0) return;

    clarityBoost = false;
    slideImg.style.opacity = 0;
    slideImg.style.zIndex = 6;
    slideImg.classList.remove("sharp");
    slideImg.style.transform = "scale(1)";

    photoCounter.textContent = `${currentSlide + 1} / ${images.length}`;

    slideImg.onload = () => {

        setTimeout(() => slideImg.style.opacity = 1, 200);

        setTimeout(() => {
            clarityBoost = true;
            slideImg.classList.add("sharp");
            slideImg.style.zIndex = 999999;
            applyKenBurns();
        }, 1800);

        setTimeout(() => {
            clarityBoost = false;
            slideImg.classList.remove("sharp");
            slideImg.style.zIndex = 6;
            slideImg.style.transform = "scale(1)";
        }, SLIDE_SHARP_TIME);

        updateProgress();
    };

    slideImg.src = images[currentSlide].src;
}


// Nav
function nextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    showSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    showSlide();
}


// Auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, TOTAL_TIME);
}
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}


// Progress Bar
function updateProgress() {
    const percent = (currentSlide / (images.length - 1)) * 100;
    progressBar.style.width = percent + "%";
}

progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    currentSlide = Math.round(percent * (images.length - 1));

    stopAutoSlide();
    showSlide();
    startAutoSlide();
});


// Start screen → overlay
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


// Music
function tryPlayMusic() {
    audio.play().catch(() => {});
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


// Buttons
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


// 🖐 Mobile Swipe Navigation
let touchStartX = 0;
overlay.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].clientX);
overlay.addEventListener("touchend", e => {
    let x = e.changedTouches[0].clientX;
    if (x - touchStartX > 50) prevSlide();
    if (touchStartX - x > 50) nextSlide();
});


// Pause on hover/touch
overlay.addEventListener("mouseover", stopAutoSlide);
overlay.addEventListener("mouseout", startAutoSlide);
overlay.addEventListener("touchstart", stopAutoSlide);
overlay.addEventListener("touchend", startAutoSlide);


// Init
if (images.length > 0) slideImg.src = images[0].src;