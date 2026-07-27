const MASCOTS = {
  halt: "assets/mascots/halt.webp",
  angryExplain: "assets/mascots/angry-explain.webp",
  angryChecklist: "assets/mascots/angry-checklist.webp",
  waitWait: "assets/mascots/wait-wait.webp",
  unsatisfied: "assets/mascots/unsatisfied.webp",
  welcome: "assets/mascots/welcome.webp",
  shhh: "assets/mascots/shhh.webp",
};

const ALL_ASSETS = [
  ...Object.values(MASCOTS),
  "assets/love/love-01.webp",
  "assets/love/love-02.webp",
  "assets/love/love-03.webp",
  "assets/love/love-04.webp",
  "assets/love/love-05.webp",
  "assets/love/love-06.webp",
  "assets/celebration.png",
];

const LOVE_BACKGROUNDS = [
  "assets/love/love-01.webp",
  "assets/love/love-02.webp",
  "assets/love/love-03.webp",
  "assets/love/love-04.webp",
  "assets/love/love-05.webp",
  "assets/love/love-06.webp",
];

const LOVE_STEP_MS = 5800;

const MASCOT_SEQUENCE = [
  {
    id: "halt",
    image: MASCOTS.halt,
    speaker: "Security",
    text: "",
    halt: true,
    mood: "dark",
    hold: 2200,
    female: true,
    male: false,
  },
  {
    id: "explain",
    image: MASCOTS.angryExplain,
    speaker: "Security",
    text: "How did you get access here?? Only OUR ESTEEMED CEO MR MAUNGE is allowed here — not common peasants!! What do you want?",
    mood: "dark",
    hold: 5200,
    female: true,
    male: false,
  },
  {
    id: "checklist",
    image: MASCOTS.angryChecklist,
    speaker: "Security",
    text: "Let me check the list…",
    mood: "dark",
    hold: 2800,
    female: true,
    male: false,
    checklist: true,
  },
  {
    id: "denied",
    image: MASCOTS.angryChecklist,
    speaker: "Security",
    text: "You are not here. Mr Maunge only allows ONE person through here… and it’s not you.",
    mood: "dark",
    hold: 4800,
    female: true,
    male: false,
    checklist: true,
    checklistDenied: true,
  },
  {
    id: "intervene",
    image: MASCOTS.waitWait,
    speaker: "Mr Maunge’s Assistant",
    text: "Wait wait wait — you idiot! Who are you talking to like that?? That’s someone very special. Treat her with much respect — it’s HER!!",
    mood: "dark",
    hold: 5800,
    female: false,
    male: true,
    maleEnter: true,
  },
  {
    id: "realize",
    image: MASCOTS.unsatisfied,
    speaker: "Security",
    text: "Ohhhh… so it’s her? Mr Maunge’s so-called princess… oh I see…",
    mood: "dark",
    hold: 5000,
    female: true,
    male: false,
  },
  {
    id: "bright",
    image: MASCOTS.welcome,
    speaker: "Security",
    text: "Hey there — we’ve been expecting you. Sorry for the rude welcoming… there are a lot of fakes, you know. Yeah.",
    mood: "bright",
    hold: 5500,
    female: true,
    male: false,
    brightShift: true,
  },
  {
    id: "welcomeLaura",
    image: MASCOTS.welcome,
    speaker: "Security",
    text: "Welcome in, Laura!! We have been expecting you. Get comfy — Mr Maunge has something to show his so-called princess.",
    mood: "bright",
    hold: 5200,
    female: true,
    male: false,
  },
  {
    id: "shhh",
    image: MASCOTS.shhh,
    speaker: "Security",
    text: "Mr Maunge has something special to show you. Hope you like it…",
    mood: "bright",
    hold: 4500,
    female: true,
    male: false,
    shhh: true,
  },
];

const WIND_LINES = [
  "Oops — must have been the wind 💨",
  "Weird… the page just sneezed.",
  "Nope. Gravity said absolutely not.",
  "That button is shy. Extremely shy.",
  "Try again? Or don’t. The wind has opinions.",
  "Spider-sense says: wrong button, princess.",
  "It slipped! Honest. Scout’s honor.",
  "Somewhere a breeze is laughing at us.",
  "That ‘No’ is doing cardio today.",
  "Plot twist: the wind works for Mr Maunge.",
];

const imageCache = new Map();

function requireAccess() {
  if (sessionStorage.getItem("ch_secret") === "1") return true;
  window.location.href = "login.html";
  return false;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          if (imageCache.has(url)) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            imageCache.set(url, img);
            resolve();
          };
          img.onerror = resolve;
          img.src = url;
        })
    )
  );
}

function spawnParticles(container, count = 28) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${6 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.width = p.style.height = `${2 + Math.random() * 4}px`;
    p.style.opacity = String(0.3 + Math.random() * 0.5);
    container.appendChild(p);
  }
}

function setMascotImage(img, src, enterClass = "enter") {
  if (!img) return;
  img.classList.remove("enter", "exit", "pulse", "enter-right");
  img.hidden = false;
  if (img.dataset.current !== src) {
    img.src = src;
    img.dataset.current = src;
  }
  requestAnimationFrame(() => {
    img.classList.add(enterClass);
  });
}

function hideMascot(img) {
  if (!img) return;
  img.classList.add("exit");
  img.classList.remove("enter", "pulse", "enter-right");
  window.setTimeout(() => {
    img.hidden = true;
    img.classList.remove("exit");
  }, 300);
}

function typeDialogue(el, text, speed = 20) {
  return new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    el.textContent = "";
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        window.setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

async function playMascotIntro({ onDone }) {
  const intro = document.getElementById("mascotIntro");
  const female = document.getElementById("mascotFemale");
  const male = document.getElementById("mascotMale");
  const speaker = document.getElementById("mascotSpeaker");
  const line = document.getElementById("mascotLine");
  const haltEl = document.getElementById("mascotHalt");
  const veil = document.getElementById("mascotVeil");
  const bg = document.getElementById("mascotBg");
  const flash = document.getElementById("mascotFlash");

  for (const step of MASCOT_SEQUENCE) {
    intro?.classList.toggle("mood-bright", step.mood === "bright");
    intro?.classList.toggle("mood-dark", step.mood === "dark");
    intro?.classList.toggle("checklist-mode", !!step.checklist);

    if (step.brightShift) {
      flash?.classList.add("flash-on");
      await wait(350);
      flash?.classList.remove("flash-on");
      bg?.classList.add("bright");
      veil?.classList.add("bright");
    }

    haltEl.hidden = !step.halt;
    line.hidden = !!step.halt;
    speaker.hidden = !!step.halt;

    if (step.halt) {
      haltEl.classList.remove("pop");
      setMascotImage(female, step.image);
      male.hidden = true;
      requestAnimationFrame(() => haltEl.classList.add("pop"));
      await wait(step.hold);
      continue;
    }

    if (step.maleEnter) {
      hideMascot(female);
      await wait(150);
      setMascotImage(male, step.image, "enter-right");
      male.classList.add("shake");
      await wait(400);
      male.classList.remove("shake");
    } else if (step.female) {
      hideMascot(male);
      await wait(100);
      setMascotImage(female, step.image);
      if (step.shhh) female.classList.add("shhh-pose");
      else female.classList.remove("shhh-pose");
    }

    speaker.textContent = step.speaker;
    speaker.hidden = false;
    line.hidden = false;

    if (step.checklistDenied) {
      intro?.classList.add("denied-flash");
      await wait(300);
      intro?.classList.remove("denied-flash");
    }

    await typeDialogue(line, step.text);
    await wait(Math.max(700, step.hold - step.text.length * 20));
  }

  intro?.classList.add("done");
  await wait(700);
  onDone();
}

function setLoveBackground(index) {
  const bg = document.getElementById("loveBg");
  const bgNext = document.getElementById("loveBgNext");
  const url = LOVE_BACKGROUNDS[index];
  if (!bg || !url) return;

  if (!bg.style.backgroundImage) {
    bg.style.backgroundImage = `url('${url}')`;
    bg.classList.add("visible");
    return;
  }

  bgNext.style.backgroundImage = `url('${url}')`;
  bgNext.classList.add("visible");
  bg.classList.remove("visible");
  window.setTimeout(() => {
    bg.style.backgroundImage = `url('${url}')`;
    bg.classList.add("visible");
    bgNext.classList.remove("visible");
  }, 900);
}

function setupLoveScroll(onComplete) {
  const section = document.getElementById("loveScroll");
  const cards = [...section.querySelectorAll(".love-card")];
  const bar = document.getElementById("loveBar");
  let step = 0;

  const showStep = (i) => {
    cards.forEach((c, idx) => c.classList.toggle("active", idx === i));
    bar.style.width = `${((i + 1) / cards.length) * 100}%`;
    setLoveBackground(i);
  };

  showStep(0);

  const timer = window.setInterval(() => {
    step += 1;
    if (step >= cards.length) {
      window.clearInterval(timer);
      window.setTimeout(onComplete, 600);
      return;
    }
    showStep(step);
  }, LOVE_STEP_MS);
}

function rectsOverlap(a, b, gap = 24) {
  return !(
    a.right + gap < b.left ||
    a.left - gap > b.right ||
    a.bottom + gap < b.top ||
    a.top - gap > b.bottom
  );
}

function setupProposal() {
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const windMsg = document.getElementById("windMsg");
  let noClicks = 0;

  const moveNo = () => {
    const yesRect = yesBtn.getBoundingClientRect();
    const btnW = noBtn.offsetWidth || 80;
    const btnH = noBtn.offsetHeight || 48;
    const pad = 12;
    const gap = 32;
    const maxW = window.innerWidth - btnW - pad * 2;
    const maxH = window.innerHeight - btnH - pad * 2;

    for (let attempt = 0; attempt < 100; attempt += 1) {
      const x = pad + Math.random() * Math.max(0, maxW);
      const y = pad + Math.random() * Math.max(0, maxH);
      const noRect = {
        left: x,
        top: y,
        right: x + btnW,
        bottom: y + btnH,
      };
      if (!rectsOverlap(noRect, yesRect, gap)) {
        noBtn.style.position = "fixed";
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.transform = "none";
        noBtn.style.zIndex = "1000";
        return;
      }
    }
  };

  const tease = () => {
    noClicks += 1;
    moveNo();
    windMsg.textContent = WIND_LINES[(noClicks - 1) % WIND_LINES.length];
    windMsg.style.opacity = "0";
    requestAnimationFrame(() => {
      windMsg.style.opacity = "1";
    });
  };

  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    tease();
  });

  noBtn.addEventListener("mouseenter", () => {
    if (noClicks > 0) tease();
  });

  yesBtn.addEventListener("click", () => {
    document.getElementById("proposal").hidden = true;
    document.getElementById("celebration").hidden = false;
    launchHearts();
  });

  window.setTimeout(moveNo, 80);
}

function launchHearts() {
  const layer = document.getElementById("hearts");
  if (!layer) return;
  const glyphs = ["♥", "💖", "✨", "🕸", "💗"];
  for (let i = 0; i < 40; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = glyphs[i % glyphs.length];
    h.style.left = `${Math.random() * 100}%`;
    h.style.animationDuration = `${3 + Math.random() * 4}s`;
    h.style.animationDelay = `${Math.random() * 1.5}s`;
    h.style.fontSize = `${1 + Math.random() * 1.6}rem`;
    layer.appendChild(h);
  }
}

function startMainExperience() {
  const world = document.getElementById("secretWorld");
  const love = document.getElementById("loveScroll");
  const proposal = document.getElementById("proposal");

  world.hidden = false;
  love.hidden = false;
  spawnParticles(document.getElementById("particles"));

  setupLoveScroll(() => {
    love.hidden = true;
    proposal.hidden = false;
    setupProposal();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAccess()) return;

  await preloadImages(ALL_ASSETS);

  playMascotIntro({
    onDone: startMainExperience,
  });
});
