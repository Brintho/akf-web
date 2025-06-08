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
    // const navItems = document.querySelectorAll('#bottom-nav .nav-item');

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

// Basic script for AOS initialization
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });
});



// Event page js 
document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });

    /**
     * 1. Live Event Countdown Timer
     */
    const initializeCountdown = (targetDate) => {
        const countdownContainer = document.getElementById('countdown-container');
        const liveMessageContainer = document.getElementById('live-now-message');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!countdownContainer) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                countdownContainer.classList.add('hidden');
                liveMessageContainer.classList.remove('hidden');
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    };
    // UPDATED: Set target date to 5 days from now for easy testing.
    const nextEventDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
    initializeCountdown(nextEventDate);

    /**
     * 2. Event Filtering and Searching
     */
    const setupEventFilters = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('event-search-input');
        const eventCards = document.querySelectorAll('.activity-card');

        if (filterButtons.length === 0) return;

        const filterAndSearchEvents = () => {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            const searchTerm = searchInput.value.toLowerCase().trim();

            eventCards.forEach(card => {
                const category = card.dataset.category;
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                const categoryMatch = activeFilter === 'all' || category === activeFilter;
                const searchMatch = title.includes(searchTerm) || description.includes(searchTerm);

                if (categoryMatch && searchMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterAndSearchEvents();
            });
        });
        searchInput.addEventListener('input', filterAndSearchEvents);
    };
    setupEventFilters();

    /**
     * 3. Dynamic Event Calendar (Clickable Version with Titles)
     */
    const setupEventCalendar = () => {
        const monthYearEl = document.getElementById('month-year');
        const daysContainer = document.getElementById('calendar-days');
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const eventFilter = document.getElementById('event-type-filter');

        if (!monthYearEl) return;

        // UPDATED: Event data now includes a URL and a shorter title for the calendar.
        const events = [{
            id: 1,
            url: 'event-details.html?id=1',
            date: '2024-12-28',
            type: 'workshop',
            title: 'Breathing Workshop'
        }, {
            id: 2,
            url: 'event-details.html?id=2',
            date: '2025-01-12',
            type: 'seminar',
            title: 'Intro to Vedanta'
        }, {
            id: 3,
            url: 'event-details.html?id=3',
            date: '2025-01-20',
            type: 'live',
            title: 'Live Q&A'
        }, {
            id: 4,
            url: 'event-details.html?id=4',
            date: '2025-02-05',
            type: 'workshop',
            title: 'Yoga Harmony'
        }];

        let currentDate = new Date();

        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const currentFilter = eventFilter.value;

            monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
            daysContainer.innerHTML = '';

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            for (let i = 0; i < firstDayOfMonth; i++) {
                daysContainer.innerHTML += `<div class="empty"></div>`;
            }

            for (let i = 1; i <= lastDateOfMonth; i++) {
                const dayEl = document.createElement('div');
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const eventOnDay = events.find(e => e.date === dateStr);

                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayEl.classList.add('today');
                }

                if (eventOnDay && (currentFilter === 'all' || eventOnDay.type === currentFilter)) {
                    dayEl.classList.add('event-day');
                    dayEl.innerHTML = `
                                        <a href="${eventOnDay.url}" class="date-link">
                                            <span class="date-num">${i}</span>
                                            <span class="event-title-text ${eventOnDay.type}">${eventOnDay.title}</span>
                                        </a>
                                    `;
                } else {
                    dayEl.innerHTML = `<span class="date-num">${i}</span>`;
                }

                daysContainer.appendChild(dayEl);
            }
        };

        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        eventFilter.addEventListener('change', renderCalendar);
        renderCalendar();
    };
    setupEventCalendar();
});


// event-details.js

document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });

    /**
     * Countdown Timer for the Details Page
     */
    const initializeDetailCountdown = (targetDate) => {
        const daysEl = document.getElementById('detail-days');
        const hoursEl = document.getElementById('detail-hours');
        const minutesEl = document.getElementById('detail-minutes');
        const secondsEl = document.getElementById('detail-seconds');

        // Exit if elements don't exist on this page
        if (!daysEl) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('detail-timer').innerHTML = "<h4 style='grid-column: 1 / -1;'>Event has started!</h4>";
                return;
            }

            daysEl.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            hoursEl.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            minutesEl.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            secondsEl.textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    };

    // Set the target date for THIS specific event.
    // In a real app, this date would be passed from the server.
    const eventTargetDate = new Date('Dec 28, 2024 10:00:00').getTime();
    initializeDetailCountdown(eventTargetDate);

});

