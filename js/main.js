const BOOKS = [
  { title: "The Quiet Between Pages", author: "M. Ellison", price: "P185", color: "linear-gradient(160deg,#2f4f43,#1a3229)" },
  { title: "Saltwater Letters", author: "J. Moreau", price: "P165", color: "linear-gradient(160deg,#4a6d8c,#2a4258)" },
  { title: "Midnight Atlas", author: "R. Kane", price: "P220", color: "linear-gradient(160deg,#3d2f55,#221a33)" },
  { title: "A Cup of Ordinary Magic", author: "L. Hart", price: "P150", color: "linear-gradient(160deg,#8a5a3c,#5a3824)" },
  { title: "Garden of Soft Thorns", author: "S. Okonkwo", price: "P195", color: "linear-gradient(160deg,#5c6b3a,#354022)" },
  { title: "Windows Facing West", author: "P. Adler", price: "P175", color: "linear-gradient(160deg,#6b3f4a,#3f242c)" },
  { title: "Paper Moons", author: "N. Voss", price: "P140", color: "linear-gradient(160deg,#3f5c6b,#243844)" },
  { title: "The Last Soft Hour", author: "C. Wren", price: "P200", color: "linear-gradient(160deg,#6b5238,#3f2f1f)" },
];

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    window.setTimeout(() => loader.classList.add("hide"), 900);
  }

  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }

  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      glow.classList.add("on");
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    const nameInput = document.getElementById("newsName");
    const emailInput = document.getElementById("newsEmail");
    const consentInput = document.getElementById("newsConsent");
    const success = document.getElementById("newsSuccess");
    const submitBtn = document.getElementById("newsSubmit");

    const validateNewsletter = () => {
      const nameErr = document.getElementById("newsNameError");
      const emailErr = document.getElementById("newsEmailError");
      const consentErr = document.getElementById("newsConsentError");

      const nameOk = (() => {
        const msg = !nameInput.value.trim()
          ? "Please enter your name."
          : nameInput.value.trim().length < 2
            ? "Name must be at least 2 characters."
            : "";
        nameInput.classList.toggle("is-invalid", !!msg);
        nameInput.classList.toggle("is-valid", !msg && nameInput.value.trim());
        if (nameErr) nameErr.textContent = msg;
        return !msg;
      })();

      const emailOk = (() => {
        const val = emailInput.value.trim();
        const msg = !val
          ? "Please enter your email."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
            ? "Please enter a valid email address."
            : "";
        emailInput.classList.toggle("is-invalid", !!msg);
        emailInput.classList.toggle("is-valid", !msg && val);
        if (emailErr) emailErr.textContent = msg;
        return !msg;
      })();

      const consentOk = consentInput.checked;
      if (consentErr) consentErr.textContent = consentOk ? "" : "Please agree to receive updates.";

      return nameOk && emailOk && consentOk;
    };

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateNewsletter()) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Subscribing…";
      window.setTimeout(() => {
        newsletterForm.reset();
        [nameInput, emailInput].forEach((el) => el.classList.remove("is-valid", "is-invalid"));
        success.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Subscribe";
        window.setTimeout(() => {
          success.hidden = true;
        }, 5000);
      }, 700);
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
