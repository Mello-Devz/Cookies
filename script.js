const input = document.getElementById("nameInput");
const message = document.getElementById("message");
const cookieValue = document.getElementById("cookieValue");
const lastNameValue = document.getElementById("lastNameValue");
const visitCountValue = document.getElementById("visitCountValue");
const lastVisitValue = document.getElementById("lastVisitValue");
const themeToggle = document.getElementById("themeToggle");

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ").reduce((acc, item) => {
    const [key, val] = item.split("=");
    acc[key] = decodeURIComponent(val || "");
    return acc;
  }, {});

  return cookies[name] || null;
}

function eraseCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function setJsonCookie(name, value, days) {
  setCookie(name, JSON.stringify(value), days);
}

function getJsonCookie(name) {
  const raw = getCookie(name);
  return raw ? JSON.parse(raw) : null;
}

function updateStatus(text, tone = "info") {
  message.textContent = text;
  message.style.borderColor =
    tone === "success"
      ? "rgba(74, 222, 128, 0.35)"
      : tone === "error"
        ? "rgba(248, 113, 113, 0.35)"
        : "rgba(148, 163, 184, 0.18)";
}

function showCurrentCookie() {
  const currentValue = getCookie("demoUser");
  cookieValue.textContent = currentValue ? currentValue : "(vazio)";
}

function updateCookieSummary() {
  const lastName = getCookie("lastName") || "—";
  const analytics = getJsonCookie("analytics") || { visits: 0, lastVisit: "Nenhum acesso registrado" };

  lastNameValue.textContent = lastName;
  visitCountValue.textContent = String(analytics.visits || 0);
  lastVisitValue.textContent = analytics.lastVisit || "Nenhum acesso registrado";
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === "light" ? "🌙 Tema escuro" : "☀️ Tema claro";
}

function saveThemePreference(theme) {
  setCookie("themePreference", theme, 30);
  localStorage.setItem("themePreference", theme);
}

function loadThemePreference() {
  const savedTheme =
    getCookie("themePreference") || localStorage.getItem("themePreference") || "dark";
  applyTheme(savedTheme);
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  saveThemePreference(nextTheme);
}

function saveCookie() {
  const value = input.value.trim();

  if (!value) {
    updateStatus("Digite um nome antes de salvar o cookie.", "error");
    return;
  }

  const now = new Date().toLocaleString("pt-BR");
  const analytics = getJsonCookie("analytics") || { visits: 0, lastVisit: "Ainda não houve acesso" };

  analytics.visits += 1;
  analytics.lastVisit = now;

  setCookie("demoUser", value, 7);
  setCookie("lastName", value, 30);
  setJsonCookie("analytics", analytics, 30);

  updateStatus(
    `Cookie salvo com sucesso para ${value}. Ele expira em 7 dias e o histórico foi atualizado.`,
    "success",
  );
  showCurrentCookie();
  updateCookieSummary();
}

function readCookie() {
  const value = getCookie("demoUser");

  if (!value) {
    updateStatus("Nenhum cookie encontrado. Salve um nome primeiro.", "error");
    showCurrentCookie();
    updateCookieSummary();
    return;
  }

  const analytics = getJsonCookie("analytics") || { visits: 0, lastVisit: "Ainda não houve acesso" };
  updateStatus(
    `Cookie lido com sucesso: ${value}. Você já fez ${analytics.visits} registros de uso neste navegador.`,
    "success",
  );
  showCurrentCookie();
  updateCookieSummary();
}

function deleteCookie() {
  eraseCookie("demoUser");
  eraseCookie("lastName");
  eraseCookie("analytics");
  updateStatus("Cookies de uso apagados do navegador.", "error");
  showCurrentCookie();
  updateCookieSummary();
}

showCurrentCookie();
updateCookieSummary();
loadThemePreference();

document.getElementById("saveBtn").addEventListener("click", saveCookie);
document.getElementById("readBtn").addEventListener("click", readCookie);
document.getElementById("deleteBtn").addEventListener("click", deleteCookie);
themeToggle.addEventListener("click", toggleTheme);
