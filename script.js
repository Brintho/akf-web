// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Loader Logic with Audio ---
    const loader = document.getElementById('loader');

    // Initialize Howler.js for the Om chant
    const sound = new Howl({
        src: ['om.mp3'], // <-- Make sure this path is correct!
        volume: 0.5,
        autoplay: false, // Autoplay is often blocked, we'll play on load event
    });

    // On window load (ensures all assets are loaded)
    window.addEventListener('load', () => {
        // Attempt to play sound (might be blocked by browser until user interaction)
        sound.play();

        // Hide the loader after a delay
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 3500); // Should be slightly less than CSS animation time
    });


    // --- 2. Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,      // Animation duration in ms
        offset: 100,        // Offset (in px) from the original trigger point
        once: true,         // Whether animation should happen only once
        easing: 'ease-in-out',
    });


    // --- 3. Active Nav Link on Scroll (using Intersection Observer) ---
    const sections = document.querySelectorAll('.page-section, .full-screen-section');
    const navItems = document.querySelectorAll('#bottom-nav .nav-item');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.4 // 40% of the section must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('active'));

                // Get the ID of the intersecting section
                const sectionId = entry.target.id;

                // Find the corresponding nav item and add the active class
                const activeNavItem = document.querySelector(`#bottom-nav a[href="#${sectionId}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener("load", function () {
        const audio = document.getElementById("omAudio");
        const playAudio = () => {
            audio.play().catch(() => {
                console.log("Autoplay blocked. Waiting for user interaction.");
                document.body.addEventListener("click", () => audio.play(), { once: true });
            });
        };
        playAudio();
    });

});
// Optional fallback if autoplay is blocked


// --- Navigation Active State on Scroll (Works for both Desktop and Mobile) ---
// 