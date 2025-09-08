$(document).ready(function(){
    
    // Envelope click -> show wedding page
    $("#envelope").on("click", function(){
        const envelope = $(this);

        // Animate flap opening
        envelope.addClass("open");

        // 🎉 Replace confetti with floating hearts
        launchHearts();

        // Wait for flap animation to finish before showing page
        setTimeout(() => {
            $("#landing").fadeOut(500, function(){
                $(this).remove(); // remove landing page
                $("#wedding-page").fadeIn(800);

                // Start countdown
                startCountdown();

                // Play background music
                const music = document.getElementById("weddingMusic");
                music.play().catch(err => console.log("Autoplay blocked", err));
            });
        }, 600); 
    });

    // ❤️ Floating hearts function
    function launchHearts() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = $("<div>").addClass("heart").html("❤");
                $("body").append(heart);

                const size = Math.random() * 20 + 20; // 20px–40px
                const left = Math.random() * window.innerWidth;

                heart.css({
                    left: `${left}px`,
                    fontSize: `${size}px`,
                    color: ["#d46a8c", "#a61e4d", "#f5c6a5", "#ffb6c1"][Math.floor(Math.random() * 4)]
                });

                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }, i * 150);
        }
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
