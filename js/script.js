/**
 * ===================================================================
 * COMBINED & ORGANIZED SCRIPT (jQuery Version)
 * ===================================================================
 * This single file contains all necessary JavaScript, rewritten using jQuery
 * for consistency and code brevity.
 *
 * Structure:
 * 1. Page-Specific Function Definitions (e.g., initHomePage, initEventsPage)
 * 2. Main Document Ready function that calls the appropriate functions based on page identifiers.
 */

// --- 1. PAGE-SPECIFIC INITIALIZATION FUNCTIONS (jQuery Version) ---

/**
 * Initializes functionalities for the Home Page.
 */
function initHomePage($) {
    console.log("Initializing Home Page scripts (jQuery)...");

    const $loader = $('#loader');
    const $mainContent = $('#main-content');

    if ($loader.length) {
        const sound = new Howl({ src: ['audio/om.mp3'], volume: 0.5 });

        const hideLoader = () => {
            $loader.addClass('hidden');
            $mainContent.addClass('visible');
        };

        // Loader hide independent of audio
        setTimeout(hideLoader, 3000);  // 3s পরে hide
        setTimeout(hideLoader, 3000); // Extra fallback: 3s পরে hide

        // Try to play sound
        sound.play().catch(() => {
            console.log('Autoplay blocked. Waiting for user interaction.');
            $('body').one('click touchend', () => {
                sound.play();
            });
        });
    }

    // ========================
    // Nav active class logic
    // ========================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    $('.topbar__nav--desktop a').each(function () {
        const href = $(this).attr('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    $('.bottom-nav__item').each(function () {
        const href = $(this).attr('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    // ========================
    // Section scroll observer
    // ========================
    const $sections = $('.page-section');
    if ($sections.length) {
        const $desktopNavLinks = $('.topbar__nav--desktop a');
        const $bottomNavItems = $('.bottom-nav__item');
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = $(entry.target).attr('id');
                    const activeLinkSelector = `a[href="#${sectionId}"], a[href="${currentPath}#${sectionId}"]`;

                    $desktopNavLinks.removeClass('active');
                    $desktopNavLinks.filter(activeLinkSelector).addClass('active');

                    $bottomNavItems.removeClass('active');
                    $bottomNavItems.filter(activeLinkSelector).addClass('active');
                }
            });
        }, observerOptions);

        $sections.each(function () {
            if ($(this).attr('id')) {
                scrollObserver.observe(this);
            }
        });
    }
}

/**
 * Initializes functionalities for the Events Page.
 * (Countdown, Filtering, and Calendar)
 */
/**
 * Initializes functionalities for the Events Page.
 * (Countdown, Filtering, and the new Enhanced Calendar)
 */
/**
 * Initializes functionalities for the Events Page.
 * This single function handles the countdown timer, event card filtering/searching,
 * and the dynamic event calendar.
 */
function initEventsPage($) {
    console.log("Initializing Events Page scripts (jQuery)...");

    // --- 1. Live Event Countdown Timer ---
    if ($('#countdown-container').length) {
        const nextEventDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).getTime();
        const timer = setInterval(() => {
            const distance = nextEventDate - new Date().getTime();
            if (distance < 0) {
                clearInterval(timer);
                $('#countdown-container').hide();
                $('#live-now-message').show();
                return;
            }
            $('#days').text(String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'));
            $('#hours').text(String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'));
            $('#minutes').text(String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'));
            $('#seconds').text(String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'));
        }, 1000);
    }

    // --- 2. Event Card Filtering and Searching ---
    const $filterButtons = $('.filter-btn');
    const $eventCards = $('.activity-card');
    const $searchInput = $('#event-search-input');

    if ($filterButtons.length && $eventCards.length && $searchInput.length) {

        const filterAndSearchEvents = () => {
            const activeFilter = $('.filter-btn.active').data('filter');
            const searchTerm = $searchInput.val().toLowerCase().trim();

            $eventCards.each(function () {
                const $card = $(this);
                const category = $card.data('category');
                const title = ($card.find('.card-title').text() || '').toLowerCase();
                const description = ($card.find('.card-description').text() || '').toLowerCase();

                const categoryMatch = (activeFilter === 'all' || category === activeFilter);
                const searchMatch = (title.includes(searchTerm) || description.includes(searchTerm));

                if (categoryMatch && searchMatch) {
                    $card.fadeIn(300); // Use a smooth fade-in effect
                } else {
                    $card.fadeOut(300); // Use a smooth fade-out effect
                }
            });
        };

        $filterButtons.on('click', function () {
            $filterButtons.removeClass('active');
            $(this).addClass('active');
            filterAndSearchEvents();
        });

        $searchInput.on('input', filterAndSearchEvents);
    }

    // --- 3. Enhanced Dynamic Event Calendar ---
    if ($('#calendar-days').length) {
        const $monthYearEl = $('#month-year');
        const $daysContainer = $('#calendar-days');
        const $eventFilter = $('#event-type-filter');
        let currentDate = new Date();

        const events = [
            { id: 1, url: 'event-details.html?id=1', date: '2024-12-28', type: 'workshop', title: 'Breathing Workshop' },
            { id: 2, url: 'event-details.html?id=2', date: '2025-01-12', type: 'seminar', title: 'Intro to Vedanta' },
            { id: 3, url: 'event-details.html?id=3', date: '2025-01-20', type: 'live', title: 'Live Q&A' },
            { id: 4, url: 'event-details.html?id=4', date: '2025-02-05', type: 'workshop', title: 'Yoga Harmony' }
        ];

        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const currentFilter = $eventFilter.val();

            $monthYearEl.text(`${currentDate.toLocaleString('default', { month: 'long' })} ${year}`);
            $daysContainer.empty();

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            for (let i = 0; i < firstDayOfMonth; i++) {
                $daysContainer.append('<div class="empty"></div>');
            }

            for (let i = 1; i <= lastDateOfMonth; i++) {
                const $dayEl = $('<div></div>');
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

                const eventOnDay = events.find(e => e.date === dateStr && (currentFilter === 'all' || e.type === currentFilter));

                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    $dayEl.addClass('today');
                }

                if (eventOnDay) {
                    $dayEl.addClass('event-day');
                    const link = $('<a></a>', { href: eventOnDay.url, class: 'date-link' });
                    link.append(`<span class="date-num">${i}</span>`);
                    link.append(`<span class="event-title-text ${eventOnDay.type}">${eventOnDay.title}</span>`);
                    $dayEl.append(link);
                } else {
                    $dayEl.append(`<span class="date-num">${i}</span>`);
                }

                $daysContainer.append($dayEl);
            }
        };

        $('#prev-month').on('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        $('#next-month').on('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
        $eventFilter.on('change', renderCalendar);

        renderCalendar();
    }
}

/**
 * Initializes functionalities for the Event Details Page.
 */
function initEventDetailsPage($) {
    console.log("Initializing Event Details Page scripts (jQuery)...");
    if ($('#detail-timer').length) {
        const eventTargetDate = new Date('Dec 28, 2024 10:00:00').getTime();
        const timer = setInterval(() => {
            const distance = eventTargetDate - new Date().getTime();
            if (distance < 0) {
                clearInterval(timer);
                $('#detail-timer').html("<h4 style='grid-column: 1 / -1;'>Event has started!</h4>");
                return;
            }
            $('#detail-days').text(String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'));
            $('#detail-hours').text(String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'));
            $('#detail-minutes').text(String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'));
            $('#detail-seconds').text(String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'));
        }, 1000);
    }
}

/**
 * Initializes functionalities for the Courses Page.
 * This is the final, robust version for tab filtering that correctly handles display properties.
 */ function initLiveCoursesFilter($) {
    const $liveCoursesSection = $('#live-courses');

    if ($liveCoursesSection.length) {
        const $tabs = $liveCoursesSection.find('.tab-btn');
        const $cards = $liveCoursesSection.find('.course-card');

        $tabs.on('click', function () {
            const $clickedTab = $(this);
            const filterValue = $clickedTab.data('filter');

            $tabs.removeClass('active');
            $clickedTab.addClass('active');

            $cards.each(function () {
                const $card = $(this);
                const cardCategory = $card.data('category');

                const shouldShow = (filterValue === 'all' || cardCategory === filterValue);

                if (shouldShow) {
                    $card.stop(true, true).fadeIn(400);
                } else {
                    $card.stop(true, true).fadeOut(300);
                }
            });
        });

        $tabs.filter('.active').trigger('click');
    }
}

function initRecordedCoursesFilter($) {
    const $recordedCoursesSection = $('#recorded-courses');

    if ($recordedCoursesSection.length) {
        const $tabs = $recordedCoursesSection.find('.tab-btn');
        const $cards = $recordedCoursesSection.find('.recorded-course-card');

        $tabs.on('click', function () {
            const $clickedTab = $(this);
            const filterValue = $clickedTab.data('filter');

            $tabs.removeClass('active');
            $clickedTab.addClass('active');

            $cards.each(function () {
                const $card = $(this);
                const cardCategory = $card.data('category');

                const shouldShow = (filterValue === 'all' || cardCategory === filterValue);

                if (shouldShow) {
                    $card.stop(true, true).fadeIn(400);
                } else {
                    $card.stop(true, true).fadeOut(300);
                }
            });
        });

        $tabs.filter('.active').trigger('click');
    }
}

// DOM Ready
$(document).ready(function () {
    initLiveCoursesFilter($);
    initRecordedCoursesFilter($);
});



/**
 * Initializes functionalities for the Courses Page.
 * This version integrates a Swiper.js slider with the existing tab filtering logic.
 */
function initCoursesPage($) {
    // Ensure both jQuery and Swiper are loaded
    if (typeof $ === 'undefined' || typeof Swiper === 'undefined') {
        console.error("jQuery or Swiper.js is not loaded. Courses page cannot initialize.");
        return;
    }

    console.log("Initializing Courses Page scripts with Swiper (jQuery)...");

    const $liveCoursesSection = $('#live-courses');
    if ($liveCoursesSection.length) {

        // --- 1. Initialize the Swiper Slider for Tabs ---
        const courseTabsSwiper = new Swiper('.course-tabs-swiper', {
            slidesPerView: 'auto',   // স্লাইডগুলো তাদের নিজস্ব প্রস্থ অনুযায়ী প্রদর্শিত হবে
            spaceBetween: 15,        // বাটনগুলোর মধ্যে ফাঁকা জায়গা
            freeMode: true,          // মসৃণভাবে স্ক্রল করার জন্য

            // ডেক্সটপের জন্য নেভিগেশন বাটন
            navigation: {
                nextEl: '.course-tab-next',
                prevEl: '.course-tab-prev',
            },
        });

        // --- 2. Existing Tab Filtering Logic ---
        const $tabs = $liveCoursesSection.find('.tab-btn');
        const $cards = $liveCoursesSection.find('.course-card');

        $tabs.on('click', function () {
            const $clickedTab = $(this);
            const filterValue = $clickedTab.data('filter');

            // বাটনের active ক্লাস আপডেট করা
            $tabs.removeClass('active');
            $clickedTab.addClass('active');

            // ক্লিক করা স্লাইডটিকে ভিউ-এর মধ্যে নিয়ে আসা (UX improvement)
            const slideIndex = $clickedTab.closest('.swiper-slide').index();
            courseTabsSwiper.slideTo(slideIndex);

            // কার্ড ফিল্টার করা
            $cards.each(function () {
                const $card = $(this);
                const cardCategory = $card.data('category');
                const shouldShow = (filterValue === 'all' || cardCategory === filterValue);

                if (shouldShow) {
                    $card.stop(true, true).fadeIn(400);
                } else {
                    $card.stop(true, true).fadeOut(300);
                }
            });
        });

        // পেজ লোড হওয়ার পর ডিফল্ট ফিল্টার চালু করা
        if ($tabs.filter('.active').length) {
            $tabs.filter('.active').trigger('click');
        } else {
            $tabs.first().addClass('active').trigger('click');
        }
    }

    // You can add a similar block for a 'recorded-courses' section if it exists
    // For example: initTabFilter('#recorded-courses');
}

/**
 * Initializes functionalities for the Course Details Page.
 */
/**
 * Initializes functionalities for the Course Details Page.
 * (Accordions, Smooth Scroll, Sticky Footer)
 */
function initCourseDetailsPage($) {
    console.log("Initializing Course Details Page scripts (jQuery)...");

    const debounce = (func, wait) => { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; };

    // --- FIXED: Universal Accordion Logic ---
    // This function will handle any accordion with this structure on any page.
    const initAccordion = (containerSelector) => {
        const $container = $(containerSelector);
        if ($container.length) {
            // Find the accordion headers within the specified container
            const $headers = $container.find('.module-header, .faq-header');

            $headers.on('click', function () {
                const $this = $(this);
                const $parentItem = $this.parent('.module-item, .faq-item');
                const $content = $parentItem.find('.module-content, .faq-content');

                // If the clicked item is already active, just close it.
                if ($parentItem.hasClass('active')) {
                    $parentItem.removeClass('active');
                    $content.slideUp(300);
                    $this.attr('aria-expanded', 'false');
                } else {
                    // Otherwise, close all other items first.
                    $parentItem.siblings('.active')
                        .removeClass('active')
                        .find('.module-content, .faq-content')
                        .slideUp(300);

                    $parentItem.siblings().find('.module-header, .faq-header').attr('aria-expanded', 'false');

                    // Then, open the clicked item.
                    $parentItem.addClass('active');
                    $content.slideDown(300);
                    $this.attr('aria-expanded', 'true');
                }
            });

            // Ensure initially active items are open on page load
            $container.find('.module-item.active, .faq-item.active').each(function () {
                $(this).find('.module-content, .faq-content').show();
            });
        }
    };

    // Initialize for both curriculum and FAQ sections if they exist
    initAccordion('.curriculum-container'); // You may need to add this class to your section
    initAccordion('.faq-container');       // Or just use a common class for all accordion sections

    // Smooth Scroll for Navigation
    $('.course-nav-container a').on('click', function (e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        if ($(targetId).length) {
            $('html, body').animate({
                scrollTop: $(targetId).offset().top - 80 // Offset for sticky header
            }, 800);
        }
    });

    // Sticky Footer Logic
    const $stickyFooter = $('#sticky-footer');
    const $heroSection = $('#course-hero');
    if ($stickyFooter.length && $heroSection.length) {
        $(window).on('scroll', debounce(() => {
            const isPastThreshold = $(window).scrollTop() > $heroSection.outerHeight();
            const isAtBottom = (window.innerHeight + $(window).scrollTop()) >= document.body.offsetHeight - 150;
            $stickyFooter.toggleClass('visible', isPastThreshold && !isAtBottom);
        }, 50));
    }
}
/**
 * Initializes functionalities for the Shop Page.
 */
function initShopPage($) {
    console.log("Initializing Shop Page scripts (jQuery)...");
    if (typeof Swiper === 'undefined') { console.error("Swiper not loaded."); return; }

    new Swiper('.voucher-swiper', { loop: true, effect: 'fade', fadeEffect: { crossFade: true }, speed: 800, autoplay: { delay: 5000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });
    $('.btn-collect').on('click', function () { $(this).text('Collected').addClass('collected').prop('disabled', true); });

    let visibleCount = $('.product-item:visible').length;
    const totalProducts = $('.product-item').length;
    const batchSize = 6;
    const $loadMoreBtn = $('#load-more-btn');

    function updateLoadMoreButton() { $loadMoreBtn.toggle(visibleCount < totalProducts); }

    $loadMoreBtn.on('click', function (e) {
        e.preventDefault();
        $('.product-item.d-none').slice(0, batchSize).removeClass('d-none').each(function () { AOS.refreshHard(this); });
        visibleCount = $('.product-item:visible').length;
        updateLoadMoreButton();
    });

    updateLoadMoreButton();

    $('.btn-add-to-cart').on('click', function (e) { e.preventDefault(); let $badge = $('.notification-badge'); $badge.text(parseInt($badge.text()) + 1); });
    $('#cart-toggle, #mobile-cart-toggle').on('click', (e) => { e.preventDefault(); $('#cart-dropdown').toggleClass('active'); });
    $(document).on('click', (e) => { if (!$(e.target).closest('.cart-icon, .cart-dropdown').length) $('#cart-dropdown').removeClass('active'); });

    $('#product-search-input').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        $('.product-item').each(function () {
            const title = $(this).find('.product-title').text().toLowerCase();
            $(this).toggleClass('d-none', !title.includes(searchTerm));
        });
        visibleCount = $('.product-item:visible').length;
        updateLoadMoreButton();
    });
}

/**
 * Initializes functionalities for the Shop Details Page.
 */
function initShopDetailsPage($) {
    console.log("Initializing Shop Details Page scripts (jQuery)...");
    $('.thumbnail-item').on('click', function () {
        $('#main-product-image').attr('src', $(this).find('img').data('src'));
        $('.thumbnail-item.active').removeClass('active');
        $(this).addClass('active');
    });
    $('#qty-plus').on('click', () => { let $input = $('#quantity'); $input.val(parseInt($input.val()) + 1); });
    $('#qty-minus').on('click', () => { let $input = $('#quantity'); let val = parseInt($input.val()); if (val > 1) $input.val(val - 1); });
    $('.color-option').on('click', function () { $('.color-option.active').removeClass('active'); $(this).addClass('active'); });
}

/**
 * Initializes common components found on most pages.
 */
function initCommonComponents($) {
    console.log("Initializing common components (jQuery)...");

    // Mobile Navigation
    $('#hamburger-toggle').on('click', () => {
        $('#mobile-nav, #nav-overlay').addClass('is-active');
    });
    $('#close-nav-btn, #nav-overlay').on('click', () => {
        $('#mobile-nav, #nav-overlay').removeClass('is-active');
    });

    // Fullscreen Search
    const $searchIcon = $('#search-icon');
    const $fullscreenSearch = $('#fullscreen-search');
    const $searchInput = $('#fullscreen-search-input');

    $searchIcon.on('click', function () {
        $fullscreenSearch.addClass('active');
        $searchIcon.hide();
        setTimeout(() => $searchInput.focus(), 100);
    });

    $('#close-search-btn').on('click', function () {
        $fullscreenSearch.removeClass('active');
        $searchIcon.show();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $fullscreenSearch.hasClass('active')) {
            $fullscreenSearch.removeClass('active');
            $searchIcon.show();
        }
    });



}





// --- 2. MAIN DOCUMENT READY FUNCTION ---
// This is the entry point that delegates to the correct page-specific function.
jQuery(function ($) {

    // Global initializations (run on every page)
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out',
    });
    initCommonComponents($);

    // Page-specific initializations
    // We check for a unique element on each page to decide which function to run.
    if ($('#loader').length) initHomePage($);
    if ($('#countdown-container').length) initEventsPage($);
    if ($('#detail-timer').length) initEventDetailsPage($);
    if ($('.course-page-identifier').length) initCoursesPage($);
    if ($('#course-hero').length) initCourseDetailsPage($);
    if ($('.voucher-swiper').length) initShopPage($);
    if ($('#main-product-image').length) initShopDetailsPage($);

});

$(document).ready(function () {
    const $notificationToggle = $('#notification-toggle');
    const $notificationDropdown = $('#notification-dropdown');

    // Toggle the dropdown
    $notificationToggle.on('click', function (e) {
        e.preventDefault();
        $notificationDropdown.toggleClass('active');
    });

    // Close dropdown if clicked outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.notification-wrapper').length) {
            $notificationDropdown.removeClass('active');
        }
    });
    // blog page 
    // Optional: Mark all as read
    $('.mark-all-read').on('click', function () {
        $('.notification-item').removeClass('unread');
    });

    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        let filterValue = $(this).data('filter');
        let blogItems = $('#blog-grid .blog-post-item');

        if (filterValue === 'all') {
            blogItems.fadeIn(400);
        } else {
            blogItems.hide();
            blogItems.filter(`[data-category="${filterValue}"]`).fadeIn(400);
        }
    });


    // blog detils page 


    // --- ENHANCED & FIXED COMMENT SECTION LOGIC ---

    // 1. Main Comment Form Submission
    $('#comment-form').on('submit', function (e) {
        e.preventDefault();
        let commentText = $('#comment-text').val().trim();
        if (!commentText) {
            alert("Please write a comment before submitting.");
            return;
        }

        const uniqueId = `thread-${new Date().getTime()}`; // Generate a unique ID for the new thread

        const newCommentHtml = `
            <div class="comment-thread" id="${uniqueId}" style="display:none;">
                <div class="comment-item">
                    <img src="https://i.pravatar.cc/150?u=${uniqueId}" alt="Guest User" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author-name">Guest User</span>
                            <span class="comment-time">Just now</span>
                        </div>
                        <div class="comment-body">
                            <p>${$('<div/>').text(commentText).html()}</p>
                        </div>
                        <div class="comment-actions">
                            <button class="btn-love"><i class="bi bi-heart"></i> Love <span class="love-count">0</span></button>
                            <button class="btn-reply"><i class="bi bi-reply-fill"></i> Reply</button>
                        </div>
                    </div>
                </div>
                <div class="reply-form-container"></div>
            </div>`;

        $(newCommentHtml).appendTo('.comment-list').slideDown();
        $(this)[0].reset();
    });

    // Use event delegation for dynamically added elements
    $('.comment-list').on('click', '.btn-love', function () {
        const $this = $(this);
        const $loveIcon = $this.find('i');
        const $loveCountSpan = $this.find('.love-count');
        let count = parseInt($loveCountSpan.text());

        $this.toggleClass('loved');

        if ($this.hasClass('loved')) {
            $loveIcon.removeClass('bi-heart').addClass('bi-heart-fill');
            $loveCountSpan.text(count + 1);
        } else {
            $loveIcon.removeClass('bi-heart-fill').addClass('bi-heart');
            $loveCountSpan.text(count - 1);
        }
    });

    // 2. FIXED Reply Button Click Logic
    $('.comment-list').on('click', '.btn-reply', function () {
        const $thisButton = $(this);
        const $parentCommentItem = $thisButton.closest('.comment-item');
        const $replyFormContainer = $parentCommentItem.siblings('.reply-form-container');
        const authorToReply = $parentCommentItem.find('.comment-author-name').first().text();

        // Close all OTHER reply forms before opening/toggling the new one
        $('.reply-form-container').not($replyFormContainer).slideUp(function () {
            $(this).empty(); // Remove form from other containers to reset them
        });

        // Toggle or create the form for the CURRENT target
        if ($replyFormContainer.children().length > 0) {
            $replyFormContainer.slideToggle(300);
        } else {
            const replyFormHtml = `
                <form class="reply-form mt-3">
                    <div class="d-flex align-items-start">
                        <img src="https://i.pravatar.cc/150?u=guest" alt="Your Avatar" class="comment-avatar me-3" style="width:35px; height:35px;">
                        <div class="w-100">
                             <textarea class="form-control form-control-sm" rows="2" placeholder="Replying to ${authorToReply}..." required></textarea>
                             <button type="submit" class="btn btn-sm btn-submit-comment mt-2">Post Reply</button>
                        </div>
                    </div>
                </form>`;
            $replyFormContainer.html(replyFormHtml).slideDown(300);
            $replyFormContainer.find('textarea').focus();
        }
    });

    // 3. FIXED Reply Form Submission Logic
    $('.comment-list').on('submit', '.reply-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $textarea = $form.find('textarea');
        const replyText = $textarea.val().trim();
        if (!replyText) return;

        // Correctly find the parent thread and its replies container
        const $parentThread = $form.closest('.comment-thread');
        const authorToReply = $parentThread.find('.comment-author-name').first().text();
        let $repliesContainer = $parentThread.children('.comment-replies');

        // If a replies container doesn't exist yet for this thread, create it
        if ($repliesContainer.length === 0) {
            $repliesContainer = $('<div class="comment-replies"></div>').appendTo($parentThread);
        }

        const uniqueId = `thread-${new Date().getTime()}`; // Unique ID for the new reply thread

        const newReplyHtml = `
            <div class="comment-thread reply-thread" id="${uniqueId}" style="display:none;">
                <div class="comment-item reply-item">
                    <img src="https://i.pravatar.cc/150?u=${uniqueId}" alt="Guest User" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author-name">Guest User</span>
                            <span class="comment-time">Just now</span>
                        </div>
                        <div class="comment-body">
                            <p class="replying-to"><i class="bi bi-arrow-return-right"></i> Replying to ${authorToReply}</p>
                            <p>${$('<div/>').text(replyText).html()}</p>
                        </div>
                        <div class="comment-actions">
                            <button class="btn-love"><i class="bi bi-heart"></i> Love <span class="love-count">0</span></button>
                            <button class="btn-reply"><i class="bi bi-reply-fill"></i> Reply</button>
                        </div>
                    </div>
                </div>
                <div class="reply-form-container"></div>
            </div>`;

        $(newReplyHtml).appendTo($repliesContainer).slideDown();

        // Remove the form after submitting
        $form.parent().slideUp(function () {
            $(this).empty();
        });
    });


});



