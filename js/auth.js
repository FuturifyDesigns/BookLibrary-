const SECRET_TOKENS = ["laura", "resego", "adei", "abbey"];

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLaura(name) {
  const normalized = normalizeName(name);
  if (!normalized) return false;

  const parts = normalized.split(" ");
  // Any single name part matches a known token
  if (parts.some((p) => SECRET_TOKENS.includes(p))) return true;

  // Full string contains any token as a whole word
  const wordSet = new Set(parts);
  if (SECRET_TOKENS.some((t) => wordSet.has(t))) return true;

  // Concatenated permutations without spaces (e.g. lauraabbey)
  const compact = parts.join("");
  return SECRET_TOKENS.some((t) => compact.includes(t));
}

function firstName(name) {
  const n = normalizeName(name);
  if (!n) return "friend";
  return n.split(" ")[0].replace(/^\w/, (c) => c.toUpperCase());
}

function handleAuth(name) {
  if (isLaura(name)) {
    sessionStorage.setItem("ch_secret", "1");
    sessionStorage.setItem("ch_guest", name.trim());
    const overlay = document.getElementById("gateOverlay");
    if (overlay) overlay.hidden = false;
    window.setTimeout(() => {
      window.location.href = "secret.html";
    }, 1400);
    return;
  }

  const modal = document.getElementById("welcomeModal");
  const msg = document.getElementById("welcomeMsg");
  if (msg) {
    msg.textContent = `Welcome to the bookstore, ${firstName(name)}. Continue shopping — the shelves are waiting.`;
  }
  if (modal) modal.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      loginForm.classList.toggle("active", target === "login");
      signupForm.classList.toggle("active", target === "signup");
    });
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("loginName")?.value || "";
    handleAuth(name);
  });

  signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName")?.value || "";
    handleAuth(name);
  });
});
