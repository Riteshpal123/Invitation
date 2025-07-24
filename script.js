document.addEventListener("DOMContentLoaded", () => {
  // === Elements ===
  const introVideo = document.getElementById('intro-video');
  const introOverlay = document.getElementById('intro-overlay');
  const mainContent = document.getElementById('main-content');
  const playButton = document.getElementById('play-button');
  const bgMusic = document.getElementById('bg-music');
  const highlightVideo = document.getElementById("highlightVideo");

  // === Intro Video Logic ===
  if (playButton && introVideo && introOverlay && mainContent) {
    playButton.addEventListener('click', () => {
      introVideo.play();
      playButton.style.display = 'none';
    });

    introVideo.addEventListener('ended', () => {
      introOverlay.style.display = 'none';
      mainContent.style.display = 'block';

      if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(err => {
          console.warn("Autoplay blocked:", err);
        });
      }
    });
  }

  // === Pause/Resume Music on Highlight Video ===
    if (highlightVideo && bgMusic) {
    const tryPauseMusic = () => {
      try {
        bgMusic.pause();
        console.log("Background music paused.");
      } catch (err) {
        console.warn("Pause failed, muting music instead.", err);
        bgMusic.muted = true;
      }
    };

    const tryPlayMusic = () => {
      try {
        bgMusic.muted = false;
        bgMusic.play().catch(err => console.warn("Autoplay resume blocked", err));
        console.log("Background music resumed.");
      } catch (err) {
        console.warn("Resume failed", err);
      }
    };

    highlightVideo.addEventListener("play", tryPauseMusic);
    highlightVideo.addEventListener("pause", tryPlayMusic);
    highlightVideo.addEventListener("ended", tryPlayMusic);
  }


  // === Auto Pause/Resume BG Music on Tab/App Switch ===
  if (bgMusic && introOverlay) {
    const shouldResume = () => introOverlay.style.display === 'none';

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        bgMusic.pause();
      } else if (shouldResume()) {
        bgMusic.play().catch(() => {});
      }
    });

    window.addEventListener("blur", () => {
      bgMusic.pause();
    });

    window.addEventListener("focus", () => {
      if (shouldResume()) {
        bgMusic.play().catch(() => {});
      }
    });
  }

  // === Countdown Timer ===
  const countdownDate = new Date("August 03, 2025 18:00:00").getTime();
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("timer").innerHTML = "Event Started!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  }, 1000);

  // === RSVP Form ===
  const rsvpForm = document.getElementById("rsvp-form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.name.value.trim();
      if (name) {
        alert(`Thank you, ${name}, for your RSVP!`);
        this.reset();
      } else {
        alert("Please enter your name before submitting.");
      }
    });
  }
});
