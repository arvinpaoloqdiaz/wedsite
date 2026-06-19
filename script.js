/**
 * script.js
 * Main JavaScript for the Rey & Jona Wedding Website.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    //  DOM References
    // ============================================================
    const loadingScreen   = document.getElementById('loading-screen');
    const landing         = document.getElementById('landing');
    const mainContent     = document.getElementById('main-content');
    const enterBtn        = document.getElementById('enter-btn');
    const navbar          = document.getElementById('navbar');

    const mobileMenuBtn      = document.getElementById('mobile-menu-btn');
    const mobileMenuClose    = document.getElementById('mobile-menu-close');
    const mobileMenu         = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileLinks        = document.querySelectorAll('.mobile-nav-link');

    // ============================================================
    //  1. Initialise Lucide Icons
    // ============================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ============================================================
    //  2. Countdown Timer  (target: 2026-12-05 14:30 local)
    // ============================================================
    const WEDDING_DATE = new Date('2026-12-05T14:30:00');

    const cdDays    = document.getElementById('cd-days');
    const cdHours   = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now  = new Date();
        const diff = WEDDING_DATE - now;

        if (diff <= 0) {
            if (cdDays)    cdDays.textContent    = '00';
            if (cdHours)   cdHours.textContent   = '00';
            if (cdMinutes) cdMinutes.textContent = '00';
            if (cdSeconds) cdSeconds.textContent = '00';
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days    = Math.floor(totalSeconds / 86400);
        const hours   = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600)  / 60);
        const seconds = totalSeconds % 60;

        if (cdDays)    cdDays.textContent    = pad(days);
        if (cdHours)   cdHours.textContent   = pad(hours);
        if (cdMinutes) cdMinutes.textContent = pad(minutes);
        if (cdSeconds) cdSeconds.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================================
    //  3. Loading Screen
    // ============================================================
    const LOADER_DURATION = 1500; // ms to show loader before fading

    if (landing)     landing.style.display     = 'none';
    if (mainContent) mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        dismissLoader();
    }, LOADER_DURATION);

    function dismissLoader() {
        if (!loadingScreen) return;

        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
                loadingScreen.classList.add('is-hidden');
                if (landing) {
                    landing.style.display = '';
                    revealLanding();
                }
            }
        });
    }

    // ============================================================
    //  4. Landing Page — Entrance Animations
    // ============================================================
    function revealLanding() {
        document.body.style.overflow = 'hidden';

        gsap.set('.landing__content',  { opacity: 0, y: 32 });
        gsap.set('.landing__flower',   { opacity: 0, scale: 0.82 });

        const tl = gsap.timeline({ delay: 0.1 });

        tl.from('.landing__bg', {
            opacity: 0,
            duration: 1.1,
            ease: 'power2.out'
        });

        tl.to('.landing__flower', {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            stagger: { each: 0.12, from: 'start' }
        }, '-=0.7');

        tl.to('.landing__content', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');
    }

    // ============================================================
    //  5. Landing → Main Content Transition
    // ============================================================
    function transitionToMain() {
        if (!enterBtn || enterBtn.disabled) return;
        enterBtn.disabled = true;
        landing.classList.add('is-leaving');

        const exitTl = gsap.timeline({
            onComplete: () => {
                landing.style.display = 'none';
                document.body.style.overflowY = 'auto';

                if (mainContent) {
                    mainContent.style.display = '';
                    mainContent.classList.add('is-visible');

                    gsap.fromTo(mainContent,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.1,
                            ease: 'power3.out',
                            clearProps: 'transform',
                            onStart: () => { 
                                mainContent.style.visibility = 'visible'; 
                                ScrollTrigger.refresh();
                            }
                        }
                    );
                }
            }
        });

        exitTl.to('.landing__content', {
            opacity: 0, y: -28,
            duration: 0.55,
            ease: 'power2.in'
        });
        exitTl.to('.landing__flower', {
            opacity: 0, scale: 0.85,
            duration: 0.55,
            ease: 'power2.in',
            stagger: 0.07
        }, '-=0.35');
        exitTl.to('.landing__bg', {
            opacity: 0,
            duration: 0.75,
            ease: 'power2.inOut'
        }, '-=0.35');
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', transitionToMain);
    }

    // ============================================================
    //  6. Smart Sticky Navbar & Scroll Spy
    // ============================================================
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
            navbar.classList.remove('navbar--transparent');
        } else {
            navbar.classList.add('navbar--transparent');
            navbar.classList.remove('navbar--scrolled');
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    const scrollSpySections = document.querySelectorAll('section[id]');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    scrollSpySections.forEach(section => spyObserver.observe(section));

    // ============================================================
    //  7. Mobile Menu
    // ============================================================
    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        mobileMenuBackdrop.classList.remove('hidden');
        gsap.to(mobileMenuBackdrop, { opacity: 1, duration: 0.3 });
        gsap.to(mobileMenu, { x: '0%', duration: 0.45, ease: 'power3.out' });
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        gsap.to(mobileMenuBackdrop, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => mobileMenuBackdrop.classList.add('hidden')
        });
        gsap.to(mobileMenu, { x: '100%', duration: 0.38, ease: 'power3.in' });
    }

    if (mobileMenuBtn)      mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose)    mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ============================================================
    //  8. Scroll Reveal (IntersectionObserver)
    // ============================================================
    const revealElements = document.querySelectorAll('.elegant-card, .section-monogram, h2, h3, .grid > div');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'all' // Remove GSAP inline styles after
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        // Only apply to elements not in hero/landing
        if (!el.closest('#hero') && !el.closest('#landing')) {
            gsap.set(el, { opacity: 0, y: 30 });
            revealObserver.observe(el);
        }
    });

    // ============================================================
    //  9. Floating Petals / Leaves
    // ============================================================
    function initFloatingPetals() {
        const container = document.getElementById('petals-container');
        if (!container) return;

        const petalImages = [
            'assets/bud-1.png', 'assets/flower-1.png', 'assets/flower-2.png',
            'assets/flower-3.png', 'assets/flower-4.png', 'assets/flower-5.png',
            'assets/leaf-1.png', 'assets/sprig-1.png', 'assets/sprig-2.png',
            'assets/sprig-3.png', 'assets/sprig-4.png', 'assets/sprig-5.png',
            'assets/sprig-6.png'
        ];

        const maxPetals = 12; // Reduced slightly for minimal elegant feel
        for (let i = 0; i < maxPetals; i++) {
            createPetal(container, petalImages, true);
        }
    }

    function createPetal(container, images, isInitial = false) {
        const img = document.createElement('img');
        img.src = images[Math.floor(Math.random() * images.length)];
        img.className = 'floating-petal absolute pointer-events-none opacity-40 mix-blend-multiply';

        const size = gsap.utils.random(14, 28);
        img.style.width  = `${size}px`;
        img.style.height = 'auto';
        container.appendChild(img);

        const startX = gsap.utils.random(0, window.innerWidth);
        const startY = isInitial ? gsap.utils.random(-100, window.innerHeight) : -50;
        const dur    = gsap.utils.random(15, 25);
        const delay  = isInitial ? 0 : gsap.utils.random(0, 6);
        const opac   = gsap.utils.random(0.15, 0.4);

        gsap.set(img, {
            x: startX, y: startY,
            opacity: opac,
            rotation: gsap.utils.random(0, 360)
        });

        gsap.to(img, {
            y: window.innerHeight + 60,
            x: startX + gsap.utils.random(-100, 100),
            rotation: '+=360',
            duration: dur,
            delay: delay,
            ease: 'none',
            onComplete: () => {
                img.remove();
                createPetal(container, images, false);
            }
        });
    }

    initFloatingPetals();
});
