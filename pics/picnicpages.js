// 🌼 Programmer’s Picnic — Spiritual Slideshow JS

let images = [];
let currentSlide = 0;
let autoSlideInterval = null;

const SLIDE_SHARP_TIME = 6000; // fully sharp time (6 sec)
const TRANSITION_TIME = 1800; // fade-in/out
const TOTAL_TIME = SLIDE_SHARP_TIME + TRANSITION_TIME; // per slide

const slideImg = document.getElementById("slideImg");
const overlay = document.getElementById("pp-gallery-overlay");
const startScreen = document.getElementById("startScreen");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const photoCounter = document.getElementById("photoCounter");

const musicBtn = document.getElementById("musicBtn");

// Add soundtrack (royalty-free spiritual meditation)
const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5e47d8ae45.mp3?filename=meditation-110624.mp3");
audio.loop = true;
audio.volume = 0.65;


// Load images from DOM storage
function preloadImages() {
    const stored = document.querySelectorAll("#picnic-images img");
    stored.forEach(img => {
        if (img.src) images.push({ src: img.src });
    });
}

preloadImages();


// Show slide with clarity transition
function showSlide() {

    if (images.length === 0) return;

    slideImg.style.opacity = 0;
    slideImg.classList.remove("sharp");

    photoCounter.textContent = `${currentSlide + 1} / ${images.length}`;

    slideImg.onload = () => {

        setTimeout(() => slideImg.style.opacity = 1, 200);

        setTimeout(() => {
            slideImg.classList.add("sharp");
        }, 1800);

        setTimeout(() => {
            slideImg.classList.remove("sharp");
        }, SLIDE_SHARP_TIME);

        updateProgress();
    };

    slideImg.src = images[currentSlide].src;
}


// Navigation
function nextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    showSlide();
}
function prevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    showSlide();
}


// Auto Slide Loop
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, TOTAL_TIME);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}


// Clickable Progress Bar
function updateProgress() {
    let width = 0;
    const step = 100 / (SLIDE_SHARP_TIME / 100);

    const interval = setInterval(() => {
        width += step;
        if (width >= 100) clearInterval(interval);
        progressBar.style.width = width + "%";
    }, 100);
}

progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    currentSlide = Math.floor((x / rect.width) * images.length);
    stopAutoSlide();
    showSlide();
    startAutoSlide();
});


// Start Screen Tap
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


// Music Toggle
function tryPlayMusic() {
    audio.play().catch(() => {
        // will auto–play after user gesture
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


// Controls
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


// Initial Setup
if (images.length > 0) {
    slideImg.src = images[0].src;
}