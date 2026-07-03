const videoIntro = document.getElementById("video-intro");
const introVideo = document.getElementById("intro-video");
const flashTransition = document.getElementById("flash-transition");
const introOverlay = document.getElementById("intro-overlay");

let hasFinishedVideo = false;
let flashStarted = false;
const FLASH_DURATION_MS = 420;
let flashStartedAt = 0;

function closeOverlay() {
  introOverlay.classList.add("hidden");
}

function finishVideoIntro() {
  if (hasFinishedVideo) {
    return;
  }
  hasFinishedVideo = true;
  if (!flashStarted) {
    flashTransition.classList.add("active");
    flashStarted = true;
    flashStartedAt = performance.now();
  }
  const elapsedFlashMs = performance.now() - flashStartedAt;
  const remainingFlashMs = Math.max(0, FLASH_DURATION_MS - elapsedFlashMs);
  setTimeout(() => {
    videoIntro.classList.add("hidden");
    introVideo.pause();
  }, remainingFlashMs);
}

function maybeStartPreEndFlash() {
  if (flashStarted || hasFinishedVideo || !Number.isFinite(introVideo.duration)) {
    return;
  }
  if (introVideo.duration - introVideo.currentTime <= 0.5) {
    flashTransition.classList.add("active");
    flashStarted = true;
    flashStartedAt = performance.now();
  }
}

introVideo.addEventListener("ended", finishVideoIntro);
introVideo.addEventListener("error", finishVideoIntro);
introVideo.addEventListener("loadeddata", () => {
  introVideo.play().catch(() => {
    finishVideoIntro();
  });
});
introVideo.addEventListener("timeupdate", maybeStartPreEndFlash);

// Safety fallback in case autoplay is blocked or video cannot play.
setTimeout(() => {
  if (!hasFinishedVideo) {
    finishVideoIntro();
  }
}, 12000);

introOverlay.addEventListener("click", (event) => {
  if (event.target === introOverlay) {
    closeOverlay();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && hasFinishedVideo && !introOverlay.classList.contains("hidden")) {
    event.preventDefault();
    closeOverlay();
  }
});
