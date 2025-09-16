$(document).ready(function(){
    
    // Map click -> play map opening then show wedding page
    $("#openingMap").on("click touchstart", function(e){
        e.preventDefault();
        const map = $(this);
        if(map.hasClass("active")) return; // prevent double trigger
        map.addClass("active");

        // Proceed only after the final name scroll animation finishes
        let transitioned = false;
        const proceed = () => {
            if (transitioned) return;
            transitioned = true;
            $("#landing").fadeOut(600, function(){
                $(this).remove();
                $("#wedding-page").fadeIn(800, function(){
                    // Inject footsteps overlay container
                    if($(".footsteps-overlay").length === 0){
                        $("body").append(`<div class="footsteps-overlay" aria-hidden="true"></div>`);
                    }
                    // Start single walker S-arc
                    startWalkers();

                    // Start countdown
                    startCountdown();

                    // Play background music
                    const music = document.getElementById("weddingMusic");
                    music.play().catch(err => console.log("Autoplay blocked", err));
                });
            });
        };

        const endTarget = map.find('.footsteps-2 .scroll-name')[0];
        if (endTarget) {
            endTarget.addEventListener('animationend', proceed, { once: true });
        }
        // Fallback timeout in case animation events are missed
        setTimeout(proceed, 20000);
    });

// Only 2 footsteps moving left to right across screen
function startWalkers() {
    // =========================
    // Configuration Variables
    // =========================
    const WALKERS = [
        { type: 'human', stride: 40, speed: 1, lateral: 20, name: 'Gerwel' },
        { type: 'human', stride: 35, speed: 1.1, lateral: 20, name: 'Jane' },
        { type: 'dog', stride: 25, speed: 1.2, lateral: 12, name: 'Yuki' },
        { type: 'dog', stride: 23, speed: 1.1, lateral: 12, name: 'Yumi' },
    ];

    const FADE_OUT_TIME = 2000;       // fade duration in ms
    const FOOTPRINT_DURATION = 1000;  // visible duration before fade
    const ANGLE_VARIATION = 10;       // max random angle change
    const ENTRY_MARGIN = 50;          // start off-screen margin
    const STEP_PACE = 1;              // multiplier to stride distance (1 = normal)

    // =========================
    // Overlay container
    // =========================
    let overlay = $(".footsteps-overlay");
    if (overlay.length === 0) {
        $("body").append(`<div class="footsteps-overlay"></div>`);
        overlay = $(".footsteps-overlay");
        overlay.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: -10
        });
    }

    // =========================
    // Initialize walkers
    // =========================
    const walkers = WALKERS.map(cfg => {
        const side = Math.floor(Math.random() * 4); 
        let x, y, angle;
        switch(side) {
            case 0: x = -ENTRY_MARGIN; y = Math.random() * window.innerHeight; angle = Math.random() * 60 - 30; break; // left
            case 1: x = window.innerWidth + ENTRY_MARGIN; y = Math.random() * window.innerHeight; angle = 180 + Math.random() * 60 - 30; break; // right
            case 2: x = Math.random() * window.innerWidth; y = -ENTRY_MARGIN; angle = 90 + Math.random() * 60 - 30; break; // top
            case 3: x = Math.random() * window.innerWidth; y = window.innerHeight + ENTRY_MARGIN; angle = 270 + Math.random() * 60 - 30; break; // bottom
        }

        // Walker container (to hold label)
        const walkerEl = $('<div class="walker"></div>');
        overlay.append(walkerEl);

        // Label (scroll parchment style)
        const label = $('<div class="walker-label"></div>').text(cfg.name || "Unknown");
        walkerEl.append(label);

        return {
            ...cfg,
            x, y, angle,
            lastStepX: null,
            lastStepY: null,
            leftFoot: Math.random() < 0.5,
            el: walkerEl,
            label: label
        };
    });

    // =========================
    // Animate walkers
    // =========================
    function animate() {
        walkers.forEach(w => {
            w.x += Math.cos(w.angle * Math.PI / 180) * w.speed;
            w.y += Math.sin(w.angle * Math.PI / 180) * w.speed;

            // Place footprint if stride reached
            if (w.lastStepX === null || Math.hypot(w.x - w.lastStepX, w.y - w.lastStepY) >= w.stride * STEP_PACE) {
                const rad = w.angle * Math.PI / 180;
                const perpX = Math.cos(rad + Math.PI/2) * (w.leftFoot ? -w.lateral : w.lateral);
                const perpY = Math.sin(rad + Math.PI/2) * (w.leftFoot ? -w.lateral : w.lateral);

                const foot = $('<div class="footprint"></div>')
                    .addClass(w.type)
                    .addClass(w.leftFoot ? 'left' : 'right')
                    .css({
                        left: w.x + perpX + 'px',
                        top: w.y + perpY + 'px',
                        transform: `rotate(${w.angle + 90}deg)`,
                        opacity: 1
                    });

                overlay.append(foot);

                w.leftFoot = !w.leftFoot;
                w.lastStepX = w.x;
                w.lastStepY = w.y;

                // fade out footprint
                setTimeout(() => foot.fadeOut(FADE_OUT_TIME, () => foot.remove()), FOOTPRINT_DURATION);
            }

            // Update walker label position (trails just behind footsteps)
            w.el.css({
                left: w.x + "px",
                top: w.y + "px"
            });

            // Random slight angle change
            if (Math.random() < 0.01) w.angle += (Math.random() - 0.5) * ANGLE_VARIATION;

            // Respawn walker if exits viewport
            if (w.x < -ENTRY_MARGIN || w.x > window.innerWidth + ENTRY_MARGIN ||
                w.y < -ENTRY_MARGIN || w.y > window.innerHeight + ENTRY_MARGIN) {
                
                const side = Math.floor(Math.random() * 4);
                switch(side) {
                    case 0: w.x = -ENTRY_MARGIN; w.y = Math.random() * window.innerHeight; w.angle = Math.random() * 60 - 30; break;
                    case 1: w.x = window.innerWidth + ENTRY_MARGIN; w.y = Math.random() * window.innerHeight; w.angle = 180 + Math.random() * 60 - 30; break;
                    case 2: w.x = Math.random() * window.innerWidth; w.y = -ENTRY_MARGIN; w.angle = 90 + Math.random() * 60 - 30; break;
                    case 3: w.x = Math.random() * window.innerWidth; w.y = window.innerHeight + ENTRY_MARGIN; w.angle = 270 + Math.random() * 60 - 30; break;
                }
                w.lastStepX = null;
                w.lastStepY = null;
                w.leftFoot = Math.random() < 0.5;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}









    // Countdown Timer
    const weddingDate = new Date("2025-12-20T15:00:00+08:00");
    function startCountdown(){
        updateCountdown();
        setInterval(updateCountdown,1000);
    }
    function updateCountdown(){
        const now = new Date();
        let diff = weddingDate - now;
        if(diff <= 0){
            $("#countdown").html("<span>The big day has arrived! 🎉</span>");
            return;
        }
        const days = Math.floor(diff/(1000*60*60*24));
        const hours = Math.floor((diff/(1000*60*60))%24);
        const minutes = Math.floor((diff/(1000*60))%60);
        const seconds = Math.floor((diff/1000)%60);

        // Inject styled countdown
        $("#countdown").html(`
            <div class="time-box">
                <div class="number">${days}</div>
                <div class="label">Days</div>
            </div>
            <div class="time-box">
                <div class="number">${hours}</div>
                <div class="label">Hours</div>
            </div>
            <div class="time-box">
                <div class="number">${minutes}</div>
                <div class="label">Minutes</div>
            </div>
            <div class="time-box">
                <div class="number">${seconds}</div>
                <div class="label">Seconds</div>
            </div>
        `);
    }

    // Scroll animations
    function checkSections(){
        $('.section').each(function(){
            let top = $(this).offset().top;
            let scroll = $(window).scrollTop();
            let windowHeight = $(window).height();
            if(scroll + windowHeight*0.8 > top){
                $(this).addClass('visible');
            }
        });
    }
    $(window).on('scroll resize', checkSections);
    checkSections();

    // Smooth scroll for navbar links without changing URL
    $(".navbar a").on("click", function(e){
        e.preventDefault(); // prevent default jump
        let targetId = $(this).attr("href");
        let targetOffset = $(targetId).offset().top;
        $("html, body").animate({scrollTop: targetOffset - 60}, 800); // 60px offset for navbar
    });

});
