// script.js

// home js 
// --- COMBINED & OPTIMIZED JAVASCRIPT ---
document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. LOADER & AUDIO LOGIC
     */
    const loader = document.getElementById('loader');
    if (loader) {
        // Initialize the sound with Howler.js
        const sound = new Howl({
            src: ['audio/om.mp3'], // IMPORTANT: Make sure this path is correct!
            volume: 0.5,
        });

        // This function will be called if the browser blocks autoplay.
        sound.on('playerror', () => {
            console.log('Autoplay was blocked. Waiting for user interaction.');
            // Create a one-time event listener for the first click/tap.
            const playOnFirstInteraction = () => {
                sound.play();
            };
            document.body.addEventListener('click', playOnFirstInteraction, {
                once: true
            });
            document.body.addEventListener('touchend', playOnFirstInteraction, {
                once: true
            });
        });

        window.addEventListener('load', () => {
            sound.play(); // Attempt to play on load
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 3500);
        });
    }

    /**
     * 2. ANIMATE ON SCROLL (AOS) INITIALIZATION
     */
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });

    /**
     * 3. TOPBAR & MOBILE NAVIGATION TOGGLES
     */
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const closeNavBtn = document.getElementById('close-nav-btn');

    const openMenu = () => {
        if (mobileNav && navOverlay) {
            mobileNav.classList.add('is-active');
            navOverlay.classList.add('is-active');
        }
    };

    const closeMenu = () => {
        if (mobileNav && navOverlay) {
            mobileNav.classList.remove('is-active');
            navOverlay.classList.remove('is-active');
        }
    };

    if (hamburgerToggle) hamburgerToggle.addEventListener('click', openMenu);
    if (closeNavBtn) closeNavBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    /**
     * 4. ACTIVE NAV LINK ON SCROLL (Intersection Observer)
     */
    const sections = document.querySelectorAll('.page-section');
    // const desktopNavLinks = document.querySelectorAll('.topbar__nav--desktop a');
    const bottomNavItems = document.querySelectorAll('.bottom-nav__item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                desktopNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                bottomNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) {
            scrollObserver.observe(section);
        }
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

// course  js 
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });

    // --- Recorded Courses Tab Filtering Logic ---
    const recordedTabsContainer = document.querySelector('.recorded-course-tabs');
    const recordedCoursesGrid = document.getElementById('recorded-courses-grid');
    const recordedCourseCards = recordedCoursesGrid ? recordedCoursesGrid.querySelectorAll('.recorded-course-card') : [];

    if (recordedTabsContainer) {
        recordedTabsContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-btn');
            if (!clickedTab) return;

            // Update active tab state
            recordedTabsContainer.querySelector('.active').classList.remove('active');
            clickedTab.classList.add('active');

            const filter = clickedTab.dataset.filter;

            // Filter recorded course cards
            recordedCourseCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });

        // Trigger initial filter for recorded courses on page load
        const initialRecordedFilter = recordedTabsContainer.querySelector('.tab-btn.active').dataset.filter;
        recordedCourseCards.forEach(card => {
            if (initialRecordedFilter !== 'all' && card.dataset.category !== initialRecordedFilter) {
                card.classList.add('hide');
            } else {
                card.classList.remove('hide');
            }
        });
    }

    // --- Live Courses Tab Filtering Logic ---
    const liveTabs = document.querySelectorAll('#live-courses .course-tabs .tab-btn'); // Specific selector
    const liveCourseCards = document.querySelectorAll('#live-courses .course-card');

    liveTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            liveTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            // Filter live course cards
            liveCourseCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || filter === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Trigger initial filter for live courses on page load
    const initialLiveTab = document.querySelector('#live-courses .course-tabs .tab-btn.active');
    if (initialLiveTab) {
        const initialLiveFilter = initialLiveTab.dataset.filter;
        liveCourseCards.forEach(card => {
            if (initialLiveFilter !== 'all' && card.dataset.category !== initialLiveFilter) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        });
    }
});

// course datails js 
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 50,
        once: true,
        easing: 'ease-in-out',
    });

    // Debounce utility for scroll events
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Accordion Logic for Curriculum
    const moduleHeaders = document.querySelectorAll('.module-header');
    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentlyActiveItem = document.querySelector('.module-item.active');
            const clickedItem = header.parentElement;
            const content = clickedItem.querySelector('.module-content');

            if (currentlyActiveItem && currentlyActiveItem !== clickedItem) {
                currentlyActiveItem.classList.remove('active');
                currentlyActiveItem.querySelector('.module-content').style.maxHeight = 0;
                currentlyActiveItem.querySelector('.module-header').setAttribute('aria-expanded', 'false');
            }

            clickedItem.classList.toggle('active');
            header.setAttribute('aria-expanded', clickedItem.classList.contains('active'));
            content.style.maxHeight = clickedItem.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        });
    });

    // Accordion Logic for FAQs
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            const clickedItem = header.parentElement;
            const content = clickedItem.querySelector('.faq-content');

            if (currentlyActive && currentlyActive !== clickedItem) {
                currentlyActive.classList.remove('active');
                currentlyActive.querySelector('.faq-content').style.maxHeight = 0;
                currentlyActive.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
            }

            clickedItem.classList.toggle('active');
            header.setAttribute('aria-expanded', clickedItem.classList.contains('active'));
            content.style.maxHeight = clickedItem.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        });
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('.course-nav-container a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sticky Footer Logic
    const stickyFooter = document.getElementById('sticky-footer');
    const heroSection = document.getElementById('course-hero');
    if (stickyFooter && heroSection) {
        window.addEventListener('scroll', debounce(() => {
            const isPastThreshold = window.scrollY > heroSection.offsetHeight;
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150;
            stickyFooter.classList.toggle('visible', isPastThreshold && !isAtBottom);
        }, 50));
    }
});

// shop js
$(document).ready(function () {
    // Initialize AOS with softer settings
    AOS.init({
        duration: 900, // Longer duration for smoother effect
        once: true,
        offset: 80, // Trigger animation a bit sooner
        easing: 'ease-in-out-cubic', // A more refined easing function
    });

    // Voucher Swiper with FADE effect for a soft feel
    const voucherSwiper = new Swiper('.voucher-swiper', {
        loop: true,
        effect: 'fade', // Use fade effect
        fadeEffect: {
            crossFade: true
        },
        speed: 800, // Control fade speed
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Voucher "Collect" Button Logic
    $('.btn-collect').on('click', function () {
        $(this).text('Collected').addClass('collected').prop('disabled', true);
    });

    // Load More Products Logic
    let visibleCount = 6; // Initial number of visible products
    const totalProducts = $('.product-item').length;
    const batchSize = 6; // Number of products to load per click

    function updateLoadMoreButton() {
        if (visibleCount >= totalProducts) {
            $('#load-more-btn').hide();
        } else {
            $('#load-more-btn').show();
        }
    }

    $('#load-more-btn').on('click', function (e) {
        e.preventDefault();
        const hiddenProducts = $('.product-item.d-none');
        const productsToShow = hiddenProducts.slice(0, batchSize);

        if (productsToShow.length > 0) {
            productsToShow.removeClass('d-none');
            visibleCount += productsToShow.length;
            AOS.refresh(); // Refresh AOS to animate newly visible items
            updateLoadMoreButton();
        }
    });

    // Initial check for load more button visibility
    updateLoadMoreButton();

    // Add to Cart Logic
    $('.btn-add-to-cart').on('click', function (e) {
        e.preventDefault();
        let badge = $('.notification-badge');
        let count = parseInt(badge.text());
        badge.text(count + 1);
    });

    // Cart Toggle
    $('#cart-toggle, #mobile-cart-toggle').on('click', function (e) {
        e.preventDefault();
        $('#cart-dropdown').toggleClass('active');
    });

    // Close cart dropdown when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.cart-icon, .cart-dropdown').length) {
            $('#cart-dropdown').removeClass('active');
        }
    });

    // Search Functionality
    $('#product-search-input').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        $('.product-item').each(function () {
            const title = $(this).find('.product-title').text().toLowerCase();
            if (title.includes(searchTerm)) {
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
        updateLoadMoreButton(); // Update load more button visibility
    });
});
// shop js end

// shop details js
$(document).ready(function () {

    // 1. Image Gallery Logic
    $('.thumbnail-item').on('click', function () {
        let newImageSrc = $(this).find('img').data('src');
        $('#main-product-image').attr('src', newImageSrc);

        $('.thumbnail-item').removeClass('active');
        $(this).addClass('active');
    });

    // 2. Quantity Selector Logic
    $('#qty-plus').on('click', function () {
        let qtyInput = $('#quantity');
        let currentVal = parseInt(qtyInput.val());
        if (!isNaN(currentVal)) {
            qtyInput.val(currentVal + 1);
        }
    });

    $('#qty-minus').on('click', function () {
        let qtyInput = $('#quantity');
        let currentVal = parseInt(qtyInput.val());
        if (!isNaN(currentVal) && currentVal > 1) {
            qtyInput.val(currentVal - 1);
        }
    });

    // 3. Color Variant Logic
    $('.color-option').on('click', function () {
        $('.color-option').removeClass('active');
        $(this).addClass('active');
        // You can add logic here to get the selected color, e.g.,
        // let selectedColor = $(this).data('color');
        // console.log("Selected Color:", selectedColor);
    });

});
// shop details js end