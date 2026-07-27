const BOOKS = [
  { title: "The Quiet Between Pages", author: "M. Ellison", price: "$18", color: "linear-gradient(160deg,#2f4f43,#1a3229)" },
  { title: "Saltwater Letters", author: "J. Moreau", price: "$16", color: "linear-gradient(160deg,#4a6d8c,#2a4258)" },
  { title: "Midnight Atlas", author: "R. Kane", price: "$22", color: "linear-gradient(160deg,#3d2f55,#221a33)" },
  { title: "A Cup of Ordinary Magic", author: "L. Hart", price: "$15", color: "linear-gradient(160deg,#8a5a3c,#5a3824)" },
  { title: "Garden of Soft Thorns", author: "S. Okonkwo", price: "$19", color: "linear-gradient(160deg,#5c6b3a,#354022)" },
  { title: "Windows Facing West", author: "P. Adler", price: "$17", color: "linear-gradient(160deg,#6b3f4a,#3f242c)" },
  { title: "Paper Moons", author: "N. Voss", price: "$14", color: "linear-gradient(160deg,#3f5c6b,#243844)" },
  { title: "The Last Soft Hour", author: "C. Wren", price: "$20", color: "linear-gradient(160deg,#6b5238,#3f2f1f)" },
];

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    window.setTimeout(() => loader.classList.add("hide"), 900);
  }

  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      glow.classList.add("on");
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  }

  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => mobileNav.classList.toggle("open"));
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileNav.classList.remove("open"));
    });
  }

  const grid = document.getElementById("bookGrid");
  if (grid) {
    grid.innerHTML = BOOKS.map(
      (b) => `
      <article class="book reveal" style="background:${b.color}">
        <h3 class="book-title">${b.title}</h3>
        <div class="book-meta">
          <div>${b.author}</div>
          <div class="book-price">${b.price}</div>
        </div>
      </article>`
    ).join("");
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animateCount = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
    };

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }
});
