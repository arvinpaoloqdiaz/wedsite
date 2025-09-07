$(document).ready(function () {
  var envelope = $("#envelope");
  var hint = $(".hint");
  let countdownStarted = false;
  let sealBroken = false; // 🕯 track if seal has already been broken

  // 🎯 Wedding date
  const weddingDate = new Date("2025-12-20T15:00:00+08:00");

  // Insert formatted date into the letter
  $(".date").text(
    weddingDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " • Porac, Pampanga"
  );

  // Countdown logic
  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      $(".countdown").html("<span>The big day has arrived! 🎉</span>");
      return;
    }

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor(
      (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    $(".countdown").html(`
      <div class="time-box"><div class="number">${months}</div><div class="label">Months</div></div>
      <div class="time-box"><div class="number">${days}</div><div class="label">Days</div></div>
      <div class="time-box"><div class="number">${hours}</div><div class="label">Hours</div></div>
      <div class="time-box"><div class="number">${minutes}</div><div class="label">Minutes</div></div>
      <div class="time-box"><div class="number">${seconds}</div><div class="label">Seconds</div></div>
    `);
  }

  // 🎇 Wax Seal Burst
  function burstSealEffect() {
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.45 },
      colors: ["#8b0000", "#4b0000", "#f5e6c8"] // burgundy + gold fragments
    });
  }

  // Envelope toggle
  function toggleEnvelope() {
    if (envelope.hasClass("open")) {
      // Closing envelope
      envelope.removeClass("open").addClass("close");
      // Seal stays broken (do not re-add body.envelope-open)
    } else {
      // Opening envelope
      envelope.removeClass("close").addClass("open");

      // Break the seal only once
      if (!sealBroken) {
        $("body").addClass("envelope-open"); // triggers seal animation
        burstSealEffect();
        sealBroken = true;

        // After animation, remove seal element entirely
        setTimeout(() => {
          $(".seal").remove();
        }, 1000);
      }

      // 🎉 Confetti burst when opening
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Hide the hint after first open
      hint.addClass("hidden");

      // Show countdown only once
      if (!countdownStarted) {
        $(".countdown").addClass("show");
        setInterval(updateCountdown, 1000);
        updateCountdown();
        countdownStarted = true;
      }
    }
  }

  // Envelope click / keyboard
  envelope.on("click", toggleEnvelope);
  envelope.on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleEnvelope();
    }
  });
});
