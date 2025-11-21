
document.addEventListener("DOMContentLoaded", function () {

  const dressImg = document.querySelector(".dress-wrapper img");
  const suitImg  = document.querySelector(".suit-wrapper img");

  // ----------------------------------------------------
  // 1. Preload ALL dress + suit images used in color-box
  // ----------------------------------------------------
  function preloadImages() {
    const dressNames = new Set();
    const suitNames = new Set();

    document.querySelectorAll(".color-box").forEach(box => {
      const dressName = box.getAttribute("data-dress");
      const suitName  = box.getAttribute("data-suit");

      if (dressName) dressNames.add(dressName);
      if (suitName)  suitNames.add(suitName);
    });

    // Add defaults if not already included
    dressNames.add("light_blush");
    suitNames.add("light_blush");

    // Preload dress images
    dressNames.forEach(name => {
      const img = new Image();
      img.src = `./assets/images/dress/${name}.png`;
    });

    // Preload suit images
    suitNames.forEach(name => {
      const img = new Image();
      img.src = `./assets/images/suit/${name}.png`;
    });
  }

  preloadImages();

  // ----------------------------------------------------
  // 2. Initial images
  // ----------------------------------------------------
  dressImg.src = "./assets/images/dress/light_blush.png";
//   dressImg.classList.add("dress-grayscale");

  suitImg.src = "./assets/images/suit/light_blush.png";
//   suitImg.classList.add("suit-grayscale");

  // ----------------------------------------------------
  // 3. Click handler for BOTH suit and dress
  // ----------------------------------------------------
  document.querySelectorAll(".color-box").forEach(box => {
    box.addEventListener("click", () => {

      // ------ Dress update ------
      const dressName = box.getAttribute("data-dress");
      if (dressName) {
        const newDressSrc = `./assets/images/dress/${dressName}.png`;

        dressImg.classList.add("dress-fade");
        setTimeout(() => {
          dressImg.src = newDressSrc;
        //   dressImg.classList.remove("dress-grayscale");

          setTimeout(() => {
            dressImg.classList.remove("dress-fade");
          }, 40);
        }, 250);
      }

      // ------ Suit update ------
      const suitName = box.getAttribute("data-dress");
      if (suitName) {
        const newSuitSrc = `./assets/images/suit/${suitName}.png`;

        suitImg.classList.add("suit-fade");
        setTimeout(() => {
          suitImg.src = newSuitSrc;
        //   suitImg.classList.remove("suit-grayscale");

          setTimeout(() => {
            suitImg.classList.remove("suit-fade");
          }, 40);
        }, 250);
      }

    });
  });
});



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

 // After #wedding-page fadeIn
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible'); // fade in
        } else {
            entry.target.classList.remove('visible'); // fade out
        }
    });
}, observerOptions);

const sections = document.querySelectorAll("#wedding-page .section");
sections.forEach(section => observer.observe(section));



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
music.volume = 0.5; // set initial volume (0.0 to 1.0)
music.play().catch(err => console.log("Autoplay blocked", err));

// Show floating music button
$("#musicToggle").fadeIn().addClass("playing");

// Toggle play/pause on button click
$("#musicToggle").on("click", function() {
    if (music.paused) {
        music.play();
        $(this).find("i")
            .removeClass("bi-volume-mute-fill")
            .addClass("bi-volume-up-fill");
        $(this).addClass("playing"); // pulse when playing
    } else {
        music.pause();
        $(this).find("i")
            .removeClass("bi-volume-up-fill")
            .addClass("bi-volume-mute-fill");
        $(this).removeClass("playing"); // stop pulse when muted
    }
});

// Stop music when page/tab is hidden (mobile fix)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        music.pause();
        $("#musicToggle").find("i").removeClass("bi-volume-up-fill").addClass("bi-volume-mute-fill");
        $("#musicToggle").removeClass("playing");
    }
});

// Optional: Stop music on page unload
window.addEventListener("beforeunload", () => {
    music.pause();
});

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
        $("wedding-page-bg").append(`<div class="footsteps-overlay"></div>`);
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
    // $(window).on('scroll resize', checkSections);
    // checkSections();

    // Smooth scroll for navbar links without changing URL
    $(".navbar a").on("click", function(e){
        e.preventDefault(); // prevent default jump
        let targetId = $(this).attr("href");
        let targetOffset = $(targetId).offset().top;
        $("html, body").animate({scrollTop: targetOffset - 60}, 800); // 60px offset for navbar
    });

});
document.addEventListener("DOMContentLoaded", function () {
    
  let activeTooltip = null;

  // Initialize all tooltips except the proposal one
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]:not(.proposal_dateandtime)')
  );
  tooltipTriggerList.forEach(function (el) {
    const tooltip = new bootstrap.Tooltip(el, {
      trigger: 'hover click',
      placement: 'auto', // default for other tooltips
    });

    el.addEventListener("click", function () {
      if (activeTooltip && activeTooltip !== tooltip) {
        activeTooltip.hide();
      }
      activeTooltip = tooltip;
    });
  });

  // Hide tooltip if clicking outside
  document.addEventListener("click", function (event) {
    if (activeTooltip && !event.target.closest('[data-bs-toggle="tooltip"]')) {
      activeTooltip.hide();
      activeTooltip = null;
    }
  });

  // Initialize only the proposal tooltip
  const proposalTooltipEl = document.querySelector('.proposal_dateandtime');
  if (proposalTooltipEl) {
    new bootstrap.Tooltip(proposalTooltipEl, {
      trigger: 'hover click',
      placement: 'top', // always top
      popperConfig: {
        modifiers: [
          {
            name: 'preventOverflow',
            options: { padding: 8 }
          }
        ]
      }
    });
  }
});
const faqs = [
  {
    question: "CAN I BRING A GUEST/PLUS ONE?",
    answer: "As we hope to keep our celebration intimate and meaningful, kindly refer to your invitation code to know the number of seats reserved for you. We appreciate your understanding that we can accommodate only the guests reflected in your code."
  },
  {
    question: "CAN I BRING MY CHILD?",
    answer: "We adore your little ones; however, our celebration will be an adult-only affair. We kindly hope you can take this opportunity to enjoy a relaxing evening to yourselves."
  },
  {
    question: "IS PARKING AVAILABLE AT THE CHURCH AND VENUE?",
    answer: "Absolutely! Both the ceremony and reception venues offer plenty of parking, ensuring a smooth and stress-free arrival for all our guests."
  },
  {
    question: "IS THERE PUBLIC TRANSPORTATION FROM THE CHURCH TO THE RECEPTION?",
    answer: "Shuttle service will be available from the church to the reception following the ceremony. The vehicle color and plate number will be announced soon for your convenience."
  },
  {
  question: "HOW DO I RSVP?",
  answer: `
    Simply enter your unique invitation code on RSVP tab available on this website. Your name will appear automatically once verified. You may optionally add your email and contact number, then select your response.<br><br>
    If you RSVP <strong>Yes</strong>, a QR code will be generated just for you. This will be used for registration at the wedding reception and give you access to different booths we've prepared with love for our guests while waiting for the program. <br><br>
    If you RSVP <strong>No</strong>, we would truly appreciate knowing as soon as possible, so we can plan the celebration with care and thoughtfulness for everyone attending.
  `
    },
    {
    question: "WHEN IS THE RSVP DEADLINE?",
    answer: "Kindly submit your RSVP on or before <strong>December 06, 2025</strong>, at <strong>7:00PM</strong>. If your plans change and you are unable to attend after confirming, we kindly ask that you notify us as soon as possible. This will help us accommodate other guests and make the necessary arrangements for a smooth and enjoyable celebration."
  },
  {
    question: "WHO CAN WE CONTACT FOR QUESTIONS OR CONCERNS?",
    answer: `For any questions or concerns, you may reach out to our wedding coordinator. Kindly contact Ms. Melanie Santos through:<br>
Mobile number/Viber/Whatsapp: +63 917 532 5105
<br>
Facebook: <a href="facebook.com/IamLanie22" target="_blank">Melanie Santos</a>
`
  },
   {
    question: "DO THE COUPLE HAVE A SPECIAL NOTE?",
    answer: "Yes. The couple warmly requests that all guests stay until the end of the program. Every detail has been prepared with love and care for this special day, and they sincerely hope to see everyone through to the send-off."
  },


];

// Populate the FAQ container
const container = document.getElementById('faq-container');

faqs.forEach((faq, index) => {
  const item = document.createElement('div');
  item.classList.add('faq-item');

  // Question wrapper
  const questionWrapper = document.createElement('div');
  questionWrapper.classList.add('faq-question-wrapper');

  const question = document.createElement('div');
  question.classList.add('faq-question-container');
  question.innerHTML = `<span class="faq-label q">Q</span><span class="faq-question">${faq.question}</span>`;

  questionWrapper.appendChild(question);

  // Answer wrapper
  const answerWrapper = document.createElement('div');
  answerWrapper.classList.add('faq-answer-wrapper');

  const answer = document.createElement('div');
  answer.classList.add('faq-answer-container');
  answer.innerHTML = `<span class="faq-answer">${faq.answer}</span><span class="faq-label a">A</span>`;

  answerWrapper.appendChild(answer);

  // Toggle open/close on question click
  question.addEventListener('click', () => {
    item.classList.toggle('open');
  });

  // Append wrappers to FAQ item
  item.appendChild(questionWrapper);
  item.appendChild(answerWrapper);

  // Append FAQ item to container
  container.appendChild(item);
});


