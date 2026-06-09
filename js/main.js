/**
 * Scratch-off heart + Add to Calendar (.ics)
 */

const WEDDING = {
  title: "Jason & Rhona — Wedding",
  description: "Join us to celebrate our big day",
  dateStart: { year: 2026, month: 11, day: 11 },
};
const CALENDAR = {
  icsPath: "/jason-rhona-wedding.ics",
  icsFilename: "jason-rhona-wedding.ics",
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatICSDate(y, m, d) {
  return `${y}${pad(m)}${pad(d)}`;
}

function buildICS() {
  const { title, description, dateStart } = WEDDING;
  const startDate = new Date(dateStart.year, dateStart.month - 1, dateStart.day);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const dStart = formatICSDate(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  );
  const dEnd = formatICSDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
  const stamp = formatICSDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SaveTheDate//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:jason-rhona-${dStart}@save-the-date.local`,
    `DTSTAMP:${stamp}T120000Z`,
    `DTSTART;VALUE=DATE:${dStart}`,
    `DTEND;VALUE=DATE:${dEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS() {
  const a = document.createElement("a");
  a.href = CALENDAR.icsPath;
  a.download = CALENDAR.icsFilename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function isMobileDevice() {
  return window.matchMedia("(max-width: 900px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isInAppBrowser() {
  return /(FBAN|FBAV|Messenger|Instagram|Line|Twitter|TikTok|Snapchat|wv)/i.test(navigator.userAgent);
}

function openGoogleCalendar() {
  const { title, description, dateStart } = WEDDING;
  const startDate = new Date(Date.UTC(dateStart.year, dateStart.month - 1, dateStart.day));
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const dates = `${formatICSDate(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth() + 1,
    startDate.getUTCDate()
  )}/${formatICSDate(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, endDate.getUTCDate())}`;

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", dates);
  url.searchParams.set("details", description);

  const popup = window.open(url.toString(), "_blank", "noopener,noreferrer");
  if (!popup) window.location.href = url.toString();
}

function handleAddToCalendar(event) {
  event.preventDefault();

  // In-app browsers (Messenger/Instagram/etc.) often block blob downloads.
  if (isInAppBrowser() || isMobileDevice()) {
    openGoogleCalendar();
    return;
  }

  downloadICS();
}

document.getElementById("addToCalendar")?.addEventListener("click", handleAddToCalendar);

/* ---------- Confetti (after heart reveal) ---------- */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Burst from heart center; stays below .music-fab (z-index).
 */
function fireWeddingConfetti(originEl) {
  if (!originEl) return;

  document.getElementById("confettiOverlay")?.remove();

  const overlay = document.createElement("canvas");
  overlay.id = "confettiOverlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:39;pointer-events:none;width:100%;height:100%;";

  const cdpr = Math.min(window.devicePixelRatio || 1, 2);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  overlay.width = Math.floor(vw * cdpr);
  overlay.height = Math.floor(vh * cdpr);
  document.body.appendChild(overlay);

  const cctx = overlay.getContext("2d");
  if (!cctx) return;

  cctx.scale(cdpr, cdpr);

  const bounds = originEl.getBoundingClientRect();
  const ox = bounds.left + bounds.width / 2;
  const oy = bounds.top + bounds.height / 2;

  const colors = [
    "#6d847c",
    "#8aab9f",
    "#c49aa8",
    "#e8bcc8",
    "#f4e8ec",
    "#dfece8",
    "#f0ddd9",
    "#d4af37",
  ];
  const reduced = prefersReducedMotion();
  const pieces = [];
  const n = reduced ? 72 : 320;
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 1.35;
    /* Slower, wider bloom — inner puff + outer drift */
    const ring = i % 4 === 0 ? 0.72 : 1;
    const speed = reduced ? 2.2 + Math.random() * 5 : (4 + Math.random() * 9) * ring;
    const burstLift = reduced ? -3.5 : -5 - Math.random() * 5;
    const chunky = !reduced && Math.random() < 0.12;
    pieces.push({
      x: ox + (Math.random() - 0.5) * 8,
      y: oy + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + burstLift,
      w: chunky ? 10 + Math.random() * 12 : reduced ? 4 + Math.random() * 5 : 6 + Math.random() * 11,
      h: chunky ? 8 + Math.random() * 10 : reduced ? 3 + Math.random() * 4 : 5 + Math.random() * 9,
      rot: Math.random() * Math.PI * 2,
      vr: reduced ? (Math.random() - 0.5) * 0.14 : (Math.random() - 0.5) * (0.28 + Math.random() * 0.22),
      color: colors[(Math.random() * colors.length) | 0],
    });
  }

  const start = performance.now();
  const duration = reduced ? 2600 : 6200;
  const gravity = reduced ? 0.14 : 0.17;
  const drag = reduced ? 0.994 : 0.991;

  function tick(now) {
    const elapsed = now - start;
    /* Stay vivid longer, then ease out (more dramatic read) */
    const t = Math.min(1, elapsed / duration);
    const fade = Math.pow(Math.max(0, 1 - t), 0.55);

    cctx.clearRect(0, 0, vw, vh);
    cctx.globalAlpha = Math.min(1, fade * 1.08);

    for (const p of pieces) {
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    }

    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      overlay.remove();
    }
  }

  requestAnimationFrame(tick);
}

function startGoldenConfettiRain() {
  document.getElementById("confettiRainOverlay")?.remove();

  const overlay = document.createElement("canvas");
  overlay.id = "confettiRainOverlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:38;pointer-events:none;width:100%;height:100%;";

  const reduced = prefersReducedMotion();
  const cdpr = Math.min(window.devicePixelRatio || 1, 2);
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  function resizeOverlay() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    overlay.width = Math.floor(vw * cdpr);
    overlay.height = Math.floor(vh * cdpr);
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(cdpr, cdpr);
  }

  document.body.appendChild(overlay);
  const cctx = overlay.getContext("2d");
  if (!cctx) return;
  resizeOverlay();
  window.addEventListener("resize", resizeOverlay, { passive: true });

  const colors = ["#b88b2d", "#d1a243", "#e3bc69", "#f4ddb0", "#f7ead0", "#a87920"];
  const pieces = [];
  const maxPieces = reduced ? 180 : 380;
  const spawnPerSecond = reduced ? 36 : 80;
  let spawnCarry = 0;
  let lastNow = performance.now();

  function spawnPiece() {
    pieces.push({
      x: Math.random() * vw,
      y: -20 - Math.random() * 100,
      vy: (reduced ? 84 : 108) + Math.random() * (reduced ? 102 : 162),
      vx: (Math.random() - 0.5) * (reduced ? 66 : 114),
      sway: 0.4 + Math.random() * 1.2,
      size: 3 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * (reduced ? 0.08 : 0.16),
      alpha: 0.42 + Math.random() * 0.45,
      color: colors[(Math.random() * colors.length) | 0],
    });
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    cctx.clearRect(0, 0, vw, vh);

    spawnCarry += spawnPerSecond * dt;
    while (spawnCarry >= 1 && pieces.length < maxPieces) {
      spawnPiece();
      spawnCarry -= 1;
    }

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin((p.y * 0.02) + p.rot) * (14 * p.sway)) * dt;
      p.rot += p.vr;

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.globalAlpha = p.alpha;
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.size * 0.45, -p.size * 0.22, p.size * 0.9, p.size * 0.44);
      cctx.restore();

      if (p.y > vh + 24 || p.x < -30 || p.x > vw + 30) {
        pieces.splice(i, 1);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function playRevealAfterEffects(wrap, hintEl) {
  if (!wrap) return;

  const reduced = prefersReducedMotion();
  wrap.classList.add("heart-wrap--revealed");

  if (!reduced) {
    const ring = document.createElement("span");
    ring.className = "heart-reveal-ring";
    ring.setAttribute("aria-hidden", "true");
    wrap.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
  }

  if (hintEl) {
    hintEl.textContent = "In Tagaytay, Cavite\nFormal invitation to follow";
    hintEl.classList.add("scratch-hint--revealed");
  }
}

/* ---------- Heart-shaped scratch canvas ---------- */

function setupScratchCanvas() {
  const canvas = document.getElementById("scratchCanvas");
  const layer = canvas?.closest(".heart-scratch-layer");
  const wrap = document.getElementById("heartWrap");
  const hint = document.querySelector(".scratch-hint");
  if (!canvas || !layer || !wrap) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const HEART_VIEWBOX_WIDTH = 240;
  const HEART_VIEWBOX_HEIGHT = 210;
  const HEART_PATH_D =
    "M120 202 C106 188 92 175 76 161 C42 131 14 101 14 62 C14 28 39 6 72 6 C94 6 111 17 120 34 C129 17 146 6 168 6 C201 6 226 28 226 62 C226 101 198 131 164 161 C148 175 134 188 120 202Z";

  let confettiCelebrated = false;
  let fullyRevealed = false;
  let rainStarted = false;
  let lastRevealSample = 0;
  let heartPath = null;

  function buildHeartPath() {
    try {
      const p = new Path2D();
      p.addPath(
        new Path2D(HEART_PATH_D),
        new DOMMatrix([
          canvas.width / HEART_VIEWBOX_WIDTH,
          0,
          0,
          canvas.height / HEART_VIEWBOX_HEIGHT,
          0,
          0,
        ])
      );
      heartPath = p;
    } catch {
      heartPath = null;
    }
  }

  function estimateScratchRatio() {
    const w = canvas.width;
    const h = canvas.height;
    if (w < 8 || h < 8) return 0;
    const stride = Math.max(4, Math.round(dpr * 4));
    let cleared = 0;
    let total = 0;
    try {
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += stride) {
        const row = y * w * 4;
        for (let x = 0; x < w; x += stride) {
          if (heartPath && !ctx.isPointInPath(heartPath, x, y)) continue;
          const a = data[row + x * 4 + 3];
          total++;
          if (a < 55) cleared++;
        }
      }
      return total ? cleared / total : 0;
    } catch {
      return 0;
    }
  }

  function revealMessageCompletely() {
    if (fullyRevealed) return;
    fullyRevealed = true;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.globalCompositeOperation = "destination-out";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    canvas.style.pointerEvents = "none";
  }

  function maybeTriggerRevealCelebration() {
    if (confettiCelebrated) return;
    const now = performance.now();
    if (now - lastRevealSample < 280) return;
    lastRevealSample = now;

    requestAnimationFrame(() => {
      if (confettiCelebrated) return;
      if (estimateScratchRatio() >= 0.50) {
        confettiCelebrated = true;
        revealMessageCompletely();
        fireWeddingConfetti(wrap);
        if (!rainStarted) {
          rainStarted = true;
          startGoldenConfettiRain();
        }
        playRevealAfterEffects(wrap, hint);
      }
    });
  }

  function coatingGradient() {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    /* Sage-toned scratch surface */
    g.addColorStop(0, "#3d5242");
    g.addColorStop(0.24, "#6b8670");
    g.addColorStop(0.43, "#c5dbc4");
    g.addColorStop(0.61, "#759278");
    g.addColorStop(1, "#354a3a");
    return g;
  }

  function paintCoating() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = coatingGradient();
    ctx.fillRect(0, 0, w, h);

    /* Glitter specks */
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 950; i++) {
      const s = 0.8 + Math.random() * 1.9;
      ctx.fillStyle = i % 3 === 0 ? "#f4faf4" : i % 2 === 0 ? "#b8cfba" : "#4d6452";
      ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
    ctx.globalAlpha = 1;

    /* Foil sheen streak */
    const streak = ctx.createLinearGradient(0, h * 0.05, w, h * 0.65);
    streak.addColorStop(0, "rgba(232, 244, 232, 0)");
    streak.addColorStop(0.46, "rgba(232, 244, 232, 0.4)");
    streak.addColorStop(0.7, "rgba(232, 244, 232, 0.09)");
    streak.addColorStop(1, "rgba(232, 244, 232, 0)");
    ctx.fillStyle = streak;
    ctx.fillRect(0, 0, w, h);

    /* Edge depth to make foil look embossed */
    const vignette = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, w * 0.78);
    vignette.addColorStop(0, "rgba(45, 62, 48, 0)");
    vignette.addColorStop(1, "rgba(28, 40, 32, 0.38)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    /* No starter holes — text stays hidden until user scratches */
  }

  function readSize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = layer.clientWidth;
    let cssH = layer.clientHeight;
    if (cssW < 2 || cssH < 2) {
      const r = canvas.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
    }
    if (cssW < 2 || cssH < 2) {
      cssW = 240;
      cssH = 210;
    }
    return { cssW, cssH };
  }

  function resize() {
    const { cssW, cssH } = readSize();
    const rw = Math.max(2, Math.floor(cssW * dpr));
    const rh = Math.max(2, Math.floor(cssH * dpr));
    canvas.width = rw;
    canvas.height = rh;
    buildHeartPath();
    paintCoating();
    confettiCelebrated = false;
    fullyRevealed = false;
    lastRevealSample = 0;
    canvas.style.pointerEvents = "auto";
  }

  let drawing = false;

  function scratchAt(clientX, clientY) {
    if (fullyRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    const r = 24 * dpr;
    ctx.filter = "none";
    ctx.globalCompositeOperation = "destination-out";
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(0,0,0,1)");
    grd.addColorStop(0.62, "rgba(0,0,0,0.38)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    maybeTriggerRevealCelebration();
  }

  function onDown(e) {
    if (fullyRevealed) return;
    drawing = true;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    scratchAt(t.clientX, t.clientY);
  }

  function onMove(e) {
    if (!drawing) return;
    if (e.cancelable) e.preventDefault();
    const t = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    scratchAt(t.clientX, t.clientY);
  }

  function onUp() {
    drawing = false;
    maybeTriggerRevealCelebration();
  }

  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  canvas.addEventListener("touchstart", onDown, { passive: false });
  canvas.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => resize());
    ro.observe(layer);
    ro.observe(wrap);
  }

  function kick() {
    requestAnimationFrame(() => requestAnimationFrame(resize));
  }
  kick();
  window.addEventListener("resize", resize);
  window.addEventListener("load", kick);
  if (document.readyState === "complete") kick();
}

setupScratchCanvas();

/**
 * Background: Stephen Sanchez — Until I Found You.
 * Autoplay: HTML autoplay + repeated play() once data is ready.
 * Many browsers still block sound until a user gesture — first pointer/key unlocks playback (e.g. scratching the heart).
 */
function setupBackgroundMusic() {
  const audio = document.getElementById("saveDateMusic");
  const btn = document.getElementById("musicToggle");
  if (!audio || !btn) return;

  audio.volume = 0.7;
  audio.defaultMuted = false;

  function syncUi() {
    const playing = !audio.paused;
    btn.classList.toggle("music-fab--playing", playing);
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      playing ? "Pause music (Until I Found You)" : "Play music: Until I Found You by Stephen Sanchez"
    );
    if (playing) btn.classList.remove("music-fab--needs-tap");
  }

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(syncUi).catch(syncUi);
    } else {
      audio.pause();
      syncUi();
    }
  });

  audio.addEventListener("play", syncUi);
  audio.addEventListener("pause", syncUi);

  function tryPlay() {
    return audio.play().then(syncUi).catch(() => syncUi());
  }

  /* Start as early as possible and again when the file is actually buffered */
  tryPlay();
  audio.addEventListener("loadeddata", () => tryPlay(), { once: true });
  audio.addEventListener("canplay", () => tryPlay(), { once: true });

  function onFullyLoaded() {
    tryPlay();
    window.setTimeout(() => {
      if (audio.paused) {
        btn.classList.add("music-fab--needs-tap");
        syncUi();
      }
    }, 500);
  }

  if (document.readyState === "complete") {
    onFullyLoaded();
  } else {
    window.addEventListener("load", onFullyLoaded, { once: true });
  }

  /* First real gesture anywhere resumes playback without requiring the music button */
  const ac = new AbortController();
  const gestureOpts = { capture: true, passive: true, signal: ac.signal };
  function resumeFromGesture() {
    if (!audio.paused) {
      ac.abort();
      return;
    }
    audio
      .play()
      .then(() => {
        syncUi();
        ac.abort();
      })
      .catch(() => {});
  }
  document.addEventListener("pointerdown", resumeFromGesture, gestureOpts);
  document.addEventListener("keydown", resumeFromGesture, gestureOpts);

  audio.addEventListener("error", () => {
    btn.classList.add("music-fab--needs-tap");
    btn.title = "Could not load audio/until-i-found-you.mp3 — check the filename and folder.";
    syncUi();
  });
}

setupBackgroundMusic();

function setupDelightAnimations() {
  const cardFace = document.querySelector(".card-face");
  if (!cardFace) return;

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  const noTilt =
    prefersReducedMotion() ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 900px)").matches;
  if (noTilt) return;

  const maxTilt = 4.5;
  function onMove(e) {
    const rect = cardFace.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * maxTilt;
    const ry = (px - 0.5) * maxTilt;
    cardFace.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  }

  function resetTilt() {
    cardFace.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  cardFace.addEventListener("pointermove", onMove);
  cardFace.addEventListener("pointerleave", resetTilt);
  cardFace.addEventListener("pointercancel", resetTilt);
}

setupDelightAnimations();
