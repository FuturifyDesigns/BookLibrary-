const SECRET_TOKENS = ["laura", "resego", "adei", "abbey"];

const PRELOAD_ASSETS = [
  "assets/mascots/halt.webp",
  "assets/mascots/angry-explain.webp",
  "assets/mascots/angry-checklist.webp",
  "assets/mascots/wait-wait.webp",
  "assets/mascots/unsatisfied.webp",
  "assets/mascots/welcome.webp",
  "assets/mascots/shhh.webp",
  "assets/love/love-01.webp",
  "assets/love/love-02.webp",
  "assets/love/love-03.webp",
  "assets/love/love-04.webp",
  "assets/love/love-05.webp",
  "assets/love/love-06.webp",
  "assets/celebration.png",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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
  if (parts.some((p) => SECRET_TOKENS.includes(p))) return true;

  const wordSet = new Set(parts);
  if (SECRET_TOKENS.some((t) => wordSet.has(t))) return true;

  const compact = parts.join("");
  return SECRET_TOKENS.some((t) => compact.includes(t));
}

function firstName(name) {
  const n = normalizeName(name);
  if (!n) return "there";
  return n.split(" ")[0].replace(/^\w/, (c) => c.toUpperCase());
}

function setFieldState(input, errorEl, message) {
  if (!input) return false;
  const valid = !message;
  input.classList.toggle("is-invalid", !valid);
  input.classList.toggle("is-valid", valid && input.value.trim().length > 0);
  if (errorEl) errorEl.textContent = message || "";
  return valid;
}

function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your full name.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) return "Name can only contain letters and spaces.";
  return "";
}

function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your email address.";
  if (!EMAIL_RE.test(trimmed)) return "Please enter a valid email address.";
  return "";
}

function validatePassword(value) {
  if (!value) return "Please enter your password.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!PASSWORD_RE.test(value)) return "Use at least one letter and one number.";
  return "";
}

function validateConfirm(password, confirm) {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
}

function preloadAssets(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
        })
    )
  );
}

function handleAuth(name) {
  if (isLaura(name)) {
    sessionStorage.setItem("ch_secret", "1");
    sessionStorage.setItem("ch_guest", name.trim());
    const overlay = document.getElementById("gateOverlay");
    if (overlay) overlay.hidden = false;
    preloadAssets(PRELOAD_ASSETS).then(() => {
      window.location.href = "secret.html";
    });
    return;
  }

  const modal = document.getElementById("welcomeModal");
  const msg = document.getElementById("welcomeMsg");
  if (msg) {
    msg.textContent = `Welcome, ${firstName(name)}. Your account is active — continue browsing our collection.`;
  }
  if (modal) modal.hidden = false;
}

function validateSignupForm() {
  const name = document.getElementById("signupName");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirm = document.getElementById("signupConfirm");
  const terms = document.getElementById("signupTerms");

  const nameOk = setFieldState(name, document.getElementById("signupNameError"), validateName(name?.value || ""));
  const emailOk = setFieldState(email, document.getElementById("signupEmailError"), validateEmail(email?.value || ""));
  const passOk = setFieldState(password, document.getElementById("signupPasswordError"), validatePassword(password?.value || ""));
  const confirmOk = setFieldState(confirm, document.getElementById("signupConfirmError"), validateConfirm(password?.value || "", confirm?.value || ""));

  const termsError = document.getElementById("signupTermsError");
  const termsOk = terms?.checked;
  if (termsError) termsError.textContent = termsOk ? "" : "You must agree to the terms to continue.";

  return nameOk && emailOk && passOk && confirmOk && termsOk;
}

function bindLiveValidation(input, validateFn, errorId) {
  if (!input) return;
  const errorEl = document.getElementById(errorId);
  input.addEventListener("blur", () => {
    setFieldState(input, errorEl, validateFn(input.value));
  });
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) {
      setFieldState(input, errorEl, validateFn(input.value));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;

  preloadAssets(PRELOAD_ASSETS);

  bindLiveValidation(document.getElementById("signupName"), validateName, "signupNameError");
  bindLiveValidation(document.getElementById("signupEmail"), validateEmail, "signupEmailError");
  bindLiveValidation(document.getElementById("signupPassword"), validatePassword, "signupPasswordError");
  bindLiveValidation(document.getElementById("signupConfirm"), (v) => {
    const pw = document.getElementById("signupPassword")?.value || "";
    return validateConfirm(pw, v);
  }, "signupConfirmError");

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    const name = document.getElementById("signupName")?.value || "";
    const btn = document.getElementById("signupSubmit");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Creating account…";
    }
    window.setTimeout(() => {
      handleAuth(name);
      if (btn && !isLaura(name)) {
        btn.disabled = false;
        btn.textContent = "Create account";
      }
    }, 800);
  });
});
