const INTRO_LINES = [
  { text: "Ohhhhh… so it’s you…", mood: "doubt", hold: 2600 },
  { text: "Mr Maunge has talked about you…", mood: "doubt", hold: 2800 },
  { text: "Said a lot of things…", mood: "doubt", hold: 2400 },
  { text: "Hmmm…", mood: "doubt", hold: 2000 },
  { text: "Welcome in.", mood: "happy", hold: 2200 },
  { text: "We have been expecting you, Laura!!", mood: "happy", hold: 3000 },
  {
    text: "Get comfy — Mr Maunge has something to show his so-called princess.",
    mood: "happy",
    hold: 3400,
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
  // Soft allow if opened directly while testing locally — still redirect for real surprise flow
  window.location.href = "login.html";
  return false;
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

function playIntro({ onDone }) {
  const box = document.getElementById("introLines");
  const intro = document.getElementById("intro");
  let index = 0;
  let cancelled = false;

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    intro?.classList.add("done");
    window.setTimeout(onDone, 700);
  };

  document.getElementById("skipIntro")?.addEventListener("click", finish);

  const showNext = () => {
    if (cancelled) return;
    if (index >= INTRO_LINES.length) {
      finish();
      return;
    }

    const line = INTRO_LINES[index];
    const el = document.createElement("p");
    el.className = `intro-line ${line.mood}`;
    el.textContent = line.text;
    box.innerHTML = "";
    box.appendChild(el);

    requestAnimationFrame(() => {
      el.classList.add("show");
    });

    window.setTimeout(() => {
      if (cancelled) return;
      el.classList.add("hide");
      el.classList.remove("show");
      window.setTimeout(() => {
        index += 1;
        showNext();
      }, 450);
    }, line.hold);
  };

  showNext();
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

  // Desktop: flee on hover too after first attempt
  noBtn.addEventListener("mouseenter", () => {
    if (noClicks > 0) tease();
  });

  yesBtn.addEventListener("click", () => {
    document.getElementById("proposal").hidden = true;
    const cele = document.getElementById("celebration");
    cele.hidden = false;
    launchHearts();
  });

  // Initial placement beside Yes
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

document.addEventListener("DOMContentLoaded", () => {
  if (!requireAccess()) return;

  const world = document.getElementById("secretWorld");
  const welcome = document.getElementById("welcomeBlock");
  const love = document.getElementById("loveScroll");
  const proposal = document.getElementById("proposal");

  spawnParticles(document.getElementById("particles"));

  playIntro({
    onDone: () => {
      world.hidden = false;
      welcome.hidden = false;
    },
  });

  document.getElementById("beginStory")?.addEventListener("click", () => {
    welcome.hidden = true;
    love.hidden = false;
    setupLoveScroll(() => {
      love.hidden = true;
      proposal.hidden = false;
      setupProposal();
    });
  });
});
