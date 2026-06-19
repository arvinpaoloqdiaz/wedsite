/**
 * script.js
 * Main JavaScript file for wedding website interactivity, animations, and transitions.
 * 
 * Powered by GSAP (GreenSock Animation Platform) for smooth, premium-grade animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const landing = document.getElementById('landing');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // ========================================
    //  1. Initialize Libraries
    // ========================================
    
    // Render Lucide icons for details dashboard
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ========================================
    //  2. Landing Page — Entrance Animations
    // ========================================

    // Set initial off-screen / transparent states
    gsap.set('.landing__content', { opacity: 0, y: 30 });
    gsap.set('.landing__flower', { opacity: 0, scale: 0.85 });

    // Entrance timeline
    const introTimeline = gsap.timeline({ delay: 0.3 });

    // Fade-in landing background texture
    introTimeline.from('.landing__bg', {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    });

    // Bloom flowers in from corners and edges
    introTimeline.to('.landing__flower', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.2)',
        stagger: {
            each: 0.12,
            from: 'start'
        }
    }, '-=0.8');

    // Reveal landing central text card
    introTimeline.to('.landing__content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6');


    // ========================================
    //  3. Landing → Main Content Transition
    // ========================================

    function transitionToMain() {
        // Prevent double click during fade
        enterBtn.disabled = true;
        landing.classList.add('is-leaving');

        // Main transition exit timeline
        const exitTimeline = gsap.timeline({
            onComplete: () => {
                // Remove landing layout from document flow
                landing.style.display = 'none';
                document.body.style.overflowY = 'auto'; // restore vertical scrollbar

                // Make main content visible
                mainContent.classList.add('is-visible');

                // Fade-in animation for main layout
                gsap.fromTo(mainContent, 
                    { opacity: 0, y: 25 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 1.2, 
                        ease: 'power3.out',
                        onStart: () => {
                            mainContent.style.visibility = 'visible';
                        }
                    }
                );
            }
        });

        // 3.1. Fade out card content
        exitTimeline.to('.landing__content', {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: 'power2.in'
        });

        // 3.2. Bloom-out exit for corner flowers
        exitTimeline.to('.landing__flower', {
            opacity: 0,
            scale: 0.85,
            duration: 0.6,
            ease: 'power2.in',
            stagger: 0.08
        }, '-=0.4');

        // 3.3. Fade out background
        exitTimeline.to('.landing__bg', {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.4');
    }

    // Connect entrance click
    if (enterBtn) {
        enterBtn.addEventListener('click', transitionToMain);

        // Accessibility controls
        enterBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                transitionToMain();
            }
        });
    }


    // ========================================
    //  4. Mobile Menu Interactivity (GSAP)
    // ========================================

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        
        // Show backdrop blur block
        mobileMenuBackdrop.classList.remove('hidden');
        gsap.to(mobileMenuBackdrop, { opacity: 1, duration: 0.3 });
        
        // Slide drawer in from the right edge
        gsap.to(mobileMenu, { x: '0%', duration: 0.5, ease: 'power3.out' });
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuBackdrop) return;
        
        // Fade out backdrop and hide it when finished
        gsap.to(mobileMenuBackdrop, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => mobileMenuBackdrop.classList.add('hidden') 
        });
        
        // Slide drawer out to the right
        gsap.to(mobileMenu, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }

    // Menu event listeners
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    
    // Close menu when a link is clicked (enables scrolling smoothly)
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });


    // ========================================
    //  5. Scroll Reveal Animation
    // ========================================
    
    // Target sections inside sections-wrapper to prevent hiding landing elements
    const sections = document.querySelectorAll('.sections-wrapper > section');
    const observerOptions = {
        threshold: 0.05 // Trigger early when section enters view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });


    // ========================================
    //  6. Floating Petals / Leaves Particle Effect
    // ========================================
    
    function initFloatingPetals() {
        const container = document.getElementById('petals-container');
        if (!container) return;

        // Leaf/floral images in assets folder
        const petalImages = [
            'assets/bud-1.png',
            'assets/flower-1.png',
            'assets/flower-2.png',
            'assets/flower-3.png',
            'assets/flower-4.png',
            'assets/flower-5.png',
            'assets/leaf-1.png',
            'assets/sprig-1.png',
            'assets/sprig-2.png',
            'assets/sprig-3.png',
            'assets/sprig-4.png',
            'assets/sprig-5.png',
            'assets/sprig-6.png'
        ];

        const maxPetals = 16; // Subtle particle count to ensure high performance
        
        // Spawn initial particles scattered across the screen
        for (let i = 0; i < maxPetals; i++) {
            createPetal(container, petalImages, true);
        }
    }

    function createPetal(container, images, isInitial = false) {
        const img = document.createElement('img');
        const randomSrc = images[Math.floor(Math.random() * images.length)];
        img.src = randomSrc;
        img.className = 'floating-petal';
        
        // Random size between 12px and 26px for depth perspective
        const size = gsap.utils.random(12, 26);
        img.style.width = `${size}px`;
        img.style.height = 'auto';
        
        container.appendChild(img);

        // Horizontal positioning
        const startX = gsap.utils.random(0, window.innerWidth);
        // Vertical positioning (if initial load, spawn anywhere vertically, else spawn above top)
        const startY = isInitial ? gsap.utils.random(-100, window.innerHeight) : -50;
        
        const duration = gsap.utils.random(10, 18);
        const delay = isInitial ? 0 : gsap.utils.random(0, 5);
        const opacity = gsap.utils.random(0.25, 0.65);
        
        gsap.set(img, {
            x: startX,
            y: startY,
            opacity: opacity,
            rotation: gsap.utils.random(0, 360),
            rotationX: gsap.utils.random(0, 360),
            rotationY: gsap.utils.random(0, 360)
        });

        // GPU-accelerated float, drift and rotate animation
        gsap.to(img, {
            y: window.innerHeight + 50,
            x: startX + gsap.utils.random(-120, 120), // sway drift left/right
            rotation: '+=360',
            rotationX: '+=180',
            rotationY: '+=360',
            duration: duration,
            delay: delay,
            ease: 'none',
            onComplete: () => {
                img.remove(); // garbage collection
                createPetal(container, images, false); // spawn fresh leaf at top
            }
        });
    }

    // Start floating particles
    initFloatingPetals();

    // ========================================
    //  7. RSVP Iframe Handler
    // ========================================
    const rsvpIframe = document.getElementById('rsvp-iframe');
    const rsvpComingSoon = document.getElementById('rsvp-coming-soon');
    
    // Set RSVP form link here (e.g., Google Forms embed URL).
    // Set to "no", empty string, or "#" to display the "Coming Soon" placeholder card.
    const rsvpUrl = "no"; 

    if (rsvpIframe && rsvpComingSoon) {
        if (rsvpUrl && rsvpUrl !== 'no' && rsvpUrl !== '#' && rsvpUrl.trim() !== '') {
            rsvpIframe.src = rsvpUrl;
            rsvpIframe.classList.remove('hidden');
            rsvpComingSoon.classList.add('hidden');
        } else {
            rsvpIframe.classList.add('hidden');
            rsvpComingSoon.classList.remove('hidden');
        }
    }

    console.log("Wedding website scripts and particles initialized.");
});
