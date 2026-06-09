const input = document.getElementById("nameInput");
const message = document.getElementById("message");
const cookieValue = document.getElementById("cookieValue");

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

function saveCookie() {
  const value = input.value.trim();

  if (!value) {
    updateStatus("Digite um nome antes de salvar o cookie.", "error");
    return;
  }

  setCookie("demoUser", value, 7);
  updateStatus(
    `Cookie salvo com sucesso para ${value}. Ele expira em 7 dias.`,
    "success",
  );
  showCurrentCookie();
}

function readCookie() {
  const value = getCookie("demoUser");

  if (!value) {
    updateStatus("Nenhum cookie encontrado. Salve um nome primeiro.", "error");
    showCurrentCookie();
    return;
  }

  updateStatus(`Cookie lido com sucesso: ${value}`, "success");
  showCurrentCookie();
}

function deleteCookie() {
  eraseCookie("demoUser");
  updateStatus("Cookie apagado do navegador.", "error");
  showCurrentCookie();
}

showCurrentCookie();

document.getElementById("saveBtn").addEventListener("click", saveCookie);
document.getElementById("readBtn").addEventListener("click", readCookie);
document.getElementById("deleteBtn").addEventListener("click", deleteCookie);
