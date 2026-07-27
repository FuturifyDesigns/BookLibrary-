const MASCOTS = {
  halt: "assets/mascots/halt.png",
  angryExplain: "assets/mascots/angry-explain.png",
  angryChecklist: "assets/mascots/angry-checklist.png",
  waitWait: "assets/mascots/wait-wait.png",
  unsatisfied: "assets/mascots/unsatisfied.png",
  welcome: "assets/mascots/welcome.png",
  shhh: "assets/mascots/shhh.png",
};

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
    hold: 1800,
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

function requireAccess() {
  if (sessionStorage.getItem("ch_secret") === "1") return true;
  window.location.href = "login.html";
  return false;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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
  img.classList.remove("enter", "exit", "pulse");
  img.hidden = false;
  img.src = src;
  requestAnimationFrame(() => {
    img.classList.add(enterClass);
  });
}

function hideMascot(img) {
  if (!img) return;
  img.classList.add("exit");
  img.classList.remove("enter", "pulse");
  window.setTimeout(() => {
    img.hidden = true;
    img.classList.remove("exit");
  }, 450);
}

function typeDialogue(el, text, speed = 22) {
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
  const checklist = document.getElementById("checklistOverlay");
  const scanLine = document.getElementById("scanLine");
  const deniedLine = document.getElementById("deniedLine");

  let cancelled = false;

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    intro?.classList.add("done");
    window.setTimeout(onDone, 800);
  };

  document.getElementById("skipIntro")?.addEventListener("click", finish);

  for (const step of MASCOT_SEQUENCE) {
    if (cancelled) break;

    intro?.classList.toggle("mood-bright", step.mood === "bright");
    intro?.classList.toggle("mood-dark", step.mood === "dark");

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
      await wait(200);
      setMascotImage(male, step.image, "enter-right");
      male.classList.add("shake");
      await wait(400);
      male.classList.remove("shake");
    } else if (step.female) {
      hideMascot(male);
      await wait(step.male ? 0 : 150);
      setMascotImage(female, step.image);
      if (step.shhh) female.classList.add("shhh-pose");
      else female.classList.remove("shhh-pose");
    }

    speaker.textContent = step.speaker;
    speaker.hidden = false;
    line.hidden = false;

    if (step.checklist) {
      checklist.hidden = false;
      scanLine.hidden = false;
      deniedLine.hidden = true;
      scanLine.classList.add("scanning-active");
    }

    if (step.checklistDenied) {
      scanLine.hidden = true;
      deniedLine.hidden = false;
      checklist?.classList.add("denied-flash");
      await wait(300);
      checklist?.classList.remove("denied-flash");
    }

    await typeDialogue(line, step.text);
    await wait(Math.max(800, step.hold - step.text.length * 22));

    if (step.id === "denied") {
      checklist.hidden = true;
    }
  }

  if (!cancelled) finish();
}

function setupLoveScroll(onComplete) {
  const section = document.getElementById("loveScroll");
  const cards = [...section.querySelectorAll(".love-card")];
  const bar = document.getElementById("loveBar");
  const prev = document.getElementById("prevLove");
  const next = document.getElementById("nextLove");
  let step = 0;

  const render = () => {
    cards.forEach((c, i) => c.classList.toggle("active", i === step));
    bar.style.width = `${((step + 1) / cards.length) * 100}%`;
    prev.disabled = step === 0;
    next.textContent = step === cards.length - 1 ? "One last thing…" : "Continue";
  };

  prev.addEventListener("click", () => {
    if (step > 0) {
      step -= 1;
      render();
    }
  });

  next.addEventListener("click", () => {
    if (step < cards.length - 1) {
      step += 1;
      render();
    } else {
      onComplete();
    }
  });

  render();
}

function setupProposal() {
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const windMsg = document.getElementById("windMsg");
  const actions = document.getElementById("proposalActions");
  let noClicks = 0;

  const moveNo = () => {
    const bounds = actions.getBoundingClientRect();
    const btnW = noBtn.offsetWidth || 80;
    const btnH = noBtn.offsetHeight || 48;
    const pad = 8;
    const maxX = Math.max(pad, bounds.width - btnW - pad);
    const maxY = Math.max(pad, bounds.height - btnH - pad);
    const x = pad + Math.random() * maxX;
    const y = pad + Math.random() * maxY;
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = "translate(0, 0)";
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
    const cele = document.getElementById("celebration");
    cele.hidden = false;
    launchHearts();
  });

  window.setTimeout(() => {
    noBtn.style.left = "68%";
    noBtn.style.top = "50%";
    noBtn.style.transform = "translate(-50%, -50%)";
  }, 50);
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

document.addEventListener("DOMContentLoaded", () => {
  if (!requireAccess()) return;

  playMascotIntro({
    onDone: startMainExperience,
  });
});
