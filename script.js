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
    const WEDDING_DATE = new Date('2026-12-12T14:30:00');

    const cdDaysEls    = document.querySelectorAll('.cd-days');
    const cdHoursEls   = document.querySelectorAll('.cd-hours');
    const cdMinutesEls = document.querySelectorAll('.cd-minutes');
    const cdSecondsEls = document.querySelectorAll('.cd-seconds');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now  = new Date();
        const diff = WEDDING_DATE - now;

        if (diff <= 0) {
            cdDaysEls.forEach(el => el.textContent = '00');
            cdHoursEls.forEach(el => el.textContent = '00');
            cdMinutesEls.forEach(el => el.textContent = '00');
            cdSecondsEls.forEach(el => el.textContent = '00');
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days    = Math.floor(totalSeconds / 86400);
        const hours   = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600)  / 60);
        const seconds = totalSeconds % 60;

        cdDaysEls.forEach(el => el.textContent = pad(days));
        cdHoursEls.forEach(el => el.textContent = pad(hours));
        cdMinutesEls.forEach(el => el.textContent = pad(minutes));
        cdSecondsEls.forEach(el => el.textContent = pad(seconds));
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

        const heroVideo = document.getElementById('hero-video');
        if (heroVideo) {
            heroVideo.play().catch(e => console.log("Video auto-play prevented:", e));
        }

        const bgMusic = document.getElementById('bg-music');
        const audioControls = document.getElementById('audio-controls');
        const audioVisualizer = document.getElementById('audio-visualizer');
        const iconPause = document.getElementById('icon-pause');
        const iconPlay = document.getElementById('icon-play');
        
        if (bgMusic) {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                if (audioVisualizer) audioVisualizer.classList.remove('is-paused');
            }).catch(e => {
                console.log("Audio auto-play prevented:", e);
                if (iconPause) iconPause.classList.add('hidden');
                if (iconPlay) iconPlay.classList.remove('hidden');
                if (audioVisualizer) audioVisualizer.classList.add('is-paused');
            });
        }
        if (audioControls) {
            audioControls.classList.remove('opacity-0', 'pointer-events-none');
        }

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

    // Hide nav countdown while hero section is visible
    const navCountdownWrapper = document.getElementById('nav-countdown-wrapper');
    const heroSection = document.getElementById('hero');

    if (navCountdownWrapper && heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero is intersecting, hide the nav countdown; show it once hero is out of view
                if (entry.isIntersecting) {
                    navCountdownWrapper.style.opacity = '0';
                    navCountdownWrapper.style.pointerEvents = 'none';
                } else {
                    navCountdownWrapper.style.opacity = '1';
                    navCountdownWrapper.style.pointerEvents = 'none';
                }
            });
        }, { threshold: 0.1 });

        heroObserver.observe(heroSection);
    }

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

        // Animation assets: balanced mix of floral petals/leaves & non-floral elements
        const petalImages = [
            'assets/background/animation/floral-petal-01.webp',
            'assets/background/animation/floral-petal-02.webp',
            'assets/background/animation/floral-petal-03.webp',
            'assets/background/animation/floral-petal-04.webp',
            'assets/background/animation/floral-leaf-01.webp',
            'assets/background/animation/floral-leaf-02.webp',
            'assets/background/animation/floral-leaf-03.webp',
            'assets/background/animation/floral-leaf-04.webp',
            'assets/background/animation/non-floral-leaf-01.webp',
            'assets/background/animation/non-floral-leaf-02.webp',
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

    // ============================================================
    //  9b. Beige Landing Petals  (?landing=beige)
    // ============================================================
    function initLandingPetals() {
        const canvas = document.getElementById('landing-petals-canvas');
        if (!canvas) return;

        const PETAL_COLORS = [
            'rgba(178,194,182,0.65)',
            'rgba(245,238,220,0.70)',
            'rgba(182,187,181,0.55)',
            'rgba(125,145,130,0.45)',
            'rgba(255,255,255,0.50)',
        ];

        function spawnPetal() {
            const p = document.createElement('div');
            p.className = 'landing-petal';
            const size  = 6 + Math.random() * 10;
            const left  = Math.random() * 100;
            const dur   = 10 + Math.random() * 18;
            const delay = Math.random() * 20;
            const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            const rot   = Math.random() * 360;
            p.style.cssText = [
                `left: ${left}%`,
                `width: ${size}px`,
                `height: ${size * 1.4}px`,
                `background: ${color}`,
                `animation-duration: ${dur}s`,
                `animation-delay: -${delay}s`,
                `border-radius: ${Math.random() > 0.5 ? '80% 20% 80% 20%' : '50% 80% 20% 80%'}`,
                `transform: rotate(${rot}deg)`,
            ].join(';');
            canvas.appendChild(p);
        }

        for (let i = 0; i < 28; i++) spawnPetal();
    }

    initLandingPetals();

    // ============================================================
    //  10. Dress Code Dynamic Background
    // ============================================================

    const dressCodeSection = document.getElementById('dress-code');
    const dressCodeBgText = document.getElementById('dress-code-bg-text');
    const colorCircles = document.querySelectorAll('.color-circle');

    if (dressCodeSection && colorCircles.length > 0) {
        colorCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                const color = circle.style.background || circle.style.backgroundColor;
                const colorName = circle.getAttribute('title');
                
                // Manage active border states
                colorCircles.forEach(c => {
                    c.classList.remove('border-dusty-blue', 'scale-110');
                    c.classList.add('border-white');
                });
                circle.classList.remove('border-white');
                circle.classList.add('border-dusty-blue', 'scale-110');

                dressCodeSection.style.backgroundColor = color;
                
                if (dressCodeBgText) {
                    dressCodeBgText.textContent = colorName;
                }
                
                // All current palette colors are light, so always use default (non-dark) styling
                dressCodeSection.classList.remove('is-dark');
            });
        });
    }

    // ============================================================
    //  (RSVP Form Logic removed)
    // ============================================================

    // ============================================================
    //  9. Prenup Gallery Swiper
    // ============================================================
    // Cloudinary URLs with auto-format, auto-quality, and scaled to 1200px max-width for fast loading and crisp zoom
    const galleryImages = [
        "assets/placeholder/prenup_gallery_01.jpg",
        "assets/placeholder/prenup_gallery_02.jpg",
        "assets/placeholder/prenup_gallery_03.jpg",
        "assets/placeholder/prenup_gallery_04.jpg"
    ];

    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && typeof Swiper !== 'undefined') {
        galleryImages.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide elegant-card p-1 cursor-pointer';
            slide.innerHTML = `
                <div class="w-full h-full rounded-[14px] overflow-hidden">
                    <img src="${src}" alt="Prenup Photo" loading="lazy" class="w-full h-full object-cover">
                </div>
            `;
            galleryContainer.appendChild(slide);
        });

        const gallerySwiper = new Swiper('.gallery-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            lazyPreloadPrevNext: 2, // Preloads adjacent images for smooth swiping
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });

        // Photo Zoom Modal Logic
        const photoModal = document.getElementById('photoModal');
        const modalImg = document.getElementById('modalImg');
        const closePhotoModal = document.getElementById('closePhotoModal');

        if (photoModal && modalImg && closePhotoModal) {
            // Open modal on slide click
            const slides = galleryContainer.querySelectorAll('.swiper-slide img');
            slides.forEach(img => {
                img.addEventListener('click', () => {
                    gallerySwiper.autoplay.stop(); // Stop autoplay
                    modalImg.src = img.src;
                    photoModal.classList.remove('hidden');
                    // Small delay to allow display block to apply before animating opacity
                    setTimeout(() => {
                        photoModal.classList.remove('opacity-0');
                        modalImg.classList.remove('scale-95');
                        modalImg.classList.add('scale-100');
                    }, 10);
                });
            });

            // Close modal function
            const closeModal = () => {
                photoModal.classList.add('opacity-0');
                modalImg.classList.remove('scale-100');
                modalImg.classList.add('scale-95');
                setTimeout(() => {
                    photoModal.classList.add('hidden');
                    modalImg.src = "";
                    gallerySwiper.autoplay.start(); // Resume autoplay
                }, 300);
            };

            closePhotoModal.addEventListener('click', closeModal);
            photoModal.addEventListener('click', (e) => {
                if (e.target === photoModal) closeModal();
            });
        }
    }

    // ============================================================
    //  10. Location Details Modal
    // ============================================================
    const locationModal = document.getElementById('locationModal');
    const locationModalContent = document.getElementById('locationModalContent');
    const closeLocationModal = document.getElementById('closeLocationModal');
    const locationImg = document.getElementById('locationImg');
    const locationTitle = document.getElementById('locationTitle');
    const locationDesc = document.getElementById('locationDesc');
    const locationQr = document.getElementById('locationQr');
    const locationLink = document.getElementById('locationLink');

    const cardCeremony = document.getElementById('cardCeremony');
    const cardReception = document.getElementById('cardReception');

    const locations = {
        ceremony: {
            title: "The Ceremony",
            desc: "Our Lady of Mt. Carmel Chapel<br>Sitio Mathay, Balanga City, Bataan",
            img: "assets/church-street-view.jpg",
            qr: "assets/church-qr.svg",
            link: "https://maps.app.goo.gl/abRtN67DGkbcr3bm8"
        },
        reception: {
            title: "The Reception",
            desc: "Palm Garden Pavilion, La Vista Inland Resort<br>Bataan",
            img: "assets/reception-street-view.jpg",
            qr: "assets/reception-qr.svg",
            link: "https://maps.app.goo.gl/3TNXKBd8pCrGbfMg7"
        }
    };

    function openLocationModal(type) {
        const data = locations[type];
        if (!data) return;

        locationTitle.innerText = data.title;
        locationDesc.innerHTML = data.desc;
        locationImg.src = data.img;
        locationQr.src = data.qr;
        
        if (locationLink) {
            locationLink.href = data.link;
        }

        locationModal.classList.remove('hidden');
        setTimeout(() => {
            locationModal.classList.remove('opacity-0');
            locationModalContent.classList.remove('scale-95');
            locationModalContent.classList.add('scale-100');
        }, 10);
    }

    function closeLocModal() {
        locationModal.classList.add('opacity-0');
        locationModalContent.classList.remove('scale-100');
        locationModalContent.classList.add('scale-95');
        setTimeout(() => {
            locationModal.classList.add('hidden');
        }, 300);
    }

    if (locationModal && closeLocationModal) {
        if (cardCeremony) cardCeremony.addEventListener('click', () => openLocationModal('ceremony'));
        if (cardReception) cardReception.addEventListener('click', () => openLocationModal('reception'));
        
        closeLocationModal.addEventListener('click', closeLocModal);
        locationModal.addEventListener('click', (e) => {
            if (e.target === locationModal) closeLocModal();
        });
    }

    // ============================================================
    //  11. Audio Controls
    // ============================================================
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeToggleBtn = document.getElementById('volume-toggle-btn');
    const volumeContainer = document.getElementById('volume-container');

    if (bgMusic && playPauseBtn && volumeSlider) {
        const audioVisualizer = document.getElementById('audio-visualizer');

        playPauseBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                if (iconPause) iconPause.classList.remove('hidden');
                if (iconPlay) iconPlay.classList.add('hidden');
                if (audioVisualizer) audioVisualizer.classList.remove('is-paused');
            } else {
                bgMusic.pause();
                if (iconPause) iconPause.classList.add('hidden');
                if (iconPlay) iconPlay.classList.remove('hidden');
                if (audioVisualizer) audioVisualizer.classList.add('is-paused');
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            bgMusic.volume = e.target.value;
        });
        
        if (volumeToggleBtn && volumeContainer) {
            volumeToggleBtn.addEventListener('click', () => {
                if (volumeContainer.classList.contains('w-0')) {
                    volumeContainer.classList.remove('w-0', 'opacity-0', 'px-0');
                    volumeContainer.classList.add('w-32', 'opacity-100', 'px-4');
                } else {
                    volumeContainer.classList.add('w-0', 'opacity-0', 'px-0');
                    volumeContainer.classList.remove('w-32', 'opacity-100', 'px-4');
                }
            });
        }
    }

});
