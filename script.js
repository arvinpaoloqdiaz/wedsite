/**
 * script.js
 * Main JavaScript file for interactivity and animations.
 * 
 * Powered by GSAP (GreenSock Animation Platform) for smooth, lightweight animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    const landing = document.getElementById('landing');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');

    // ========================================
    //  Landing Page — Entrance Animations
    // ========================================

    // Initial states (hidden before animation)
    gsap.set('.landing__content', { opacity: 0, y: 30 });
    gsap.set('.landing__flower', { opacity: 0, scale: 0.85 });

    // Staggered reveal timeline
    const introTimeline = gsap.timeline({ delay: 0.3 });

    // Fade in the background
    introTimeline.from('.landing__bg', {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    });

    // Animate flowers in with a gentle bloom
    introTimeline.to('.landing__flower', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: {
            each: 0.15,
            from: 'start'
        }
    }, '-=0.6');

    // Reveal center content
    introTimeline.to('.landing__content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5');


    // ========================================
    //  Landing → Main Content Transition
    // ========================================

    function transitionToMain() {
        // Prevent double-clicks
        enterBtn.disabled = true;
        landing.classList.add('is-leaving');

        // Create exit timeline
        const exitTimeline = gsap.timeline({
            onComplete: () => {
                // Remove landing from DOM flow
                landing.style.display = 'none';
                document.body.style.overflow = '';

                // Show main content
                mainContent.classList.add('is-visible');

                // Fade in main content
                gsap.fromTo(mainContent, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 1, 
                        ease: 'power2.out',
                        onStart: () => {
                            mainContent.style.visibility = 'visible';
                        }
                    }
                );
            }
        });

        // Fade out center content first
        exitTimeline.to('.landing__content', {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: 'power2.in'
        });

        // Then fade out flowers
        exitTimeline.to('.landing__flower', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.in',
            stagger: 0.08
        }, '-=0.3');

        // Finally fade out the background
        exitTimeline.to('.landing__bg', {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.3');
    }

    // Click to enter
    enterBtn.addEventListener('click', transitionToMain);

    // Keyboard accessibility — Enter or Space
    enterBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            transitionToMain();
        }
    });

    console.log("Wedding website initialized successfully.");
});
