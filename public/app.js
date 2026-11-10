const form = document.querySelector("#wingman-form");
const profile = document.querySelector("#profile");
const message = document.querySelector("#message");
const modeButtons = [...document.querySelectorAll(".mode-button")];
const messageGroup = document.querySelector("#message-group");
const messageLabel = document.querySelector("#message-label");
const messageHint = document.querySelector("#message-hint");
const buttonLabel = document.querySelector("#button-label");
const results = document.querySelector("#results");
const suggestionList = document.querySelector("#suggestion-list");
let currentMode = "opener";
const copy = {
  opener: ["Find my opener", "", "You can remove names and private details."],
  reply: ["Help me reply", "What did they say?", "Remove names and private details before pasting."],
  rewrite: ["Polish my draft", "What would you like to say?", "We’ll keep your meaning and make it sound more natural."],
};

function showError(text) {
  document.querySelector(".error")?.remove();
  const error = document.createElement("p");
  error.className = "error"; error.setAttribute("role", "alert"); error.textContent = text; form.append(error);
}
function setMode(mode) {
  currentMode = mode;
  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle("active", selected); button.setAttribute("aria-pressed", String(selected));
  });
  messageGroup.classList.toggle("hidden", mode === "opener");
  document.querySelector("#profile-group").classList.toggle("hidden", mode === "rewrite");
  messageLabel.textContent = copy[mode][1];
  message.placeholder = mode === "rewrite" ? "Write the message you want to say…" : "Paste the message you’d like help replying to…";
  messageHint.textContent = copy[mode][2]; buttonLabel.textContent = copy[mode][0];
  results.classList.add("hidden"); document.querySelector(".error")?.remove();
}
modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
profile.addEventListener("input", () => { document.querySelector("#profile-count").textContent = `${profile.value.length} / 3,000`; });
message.addEventListener("input", () => { document.querySelector("#message-count").textContent = `${message.value.length} / 3,000`; });

function addSuggestion(text, index) {
  const card = document.createElement("article"); card.className = "suggestion";
  const number = document.createElement("span"); number.className = "suggestion-number"; number.textContent = String(index + 1);
  const body = document.createElement("p"); body.className = "suggestion-text"; body.textContent = text;
  const button = document.createElement("button"); button.className = "copy-button"; button.type = "button"; button.textContent = "Copy";
  button.setAttribute("aria-label", `Copy suggestion ${index + 1}`);
  button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(text); button.textContent = "Copied"; setTimeout(() => { button.textContent = "Copy"; }, 1400); }
    catch { button.textContent = "Select text"; }
  });
  card.append(number, body, button); suggestionList.append(card);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); document.querySelector(".error")?.remove(); results.classList.add("hidden");
  const button = form.querySelector(".generate-button"); button.disabled = true; buttonLabel.textContent = "Finding the right words…";
  try {
    const response = await fetch("/api/suggestions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: currentMode, profile: profile.value, message: message.value, tone: document.querySelector("#tone").value, style: document.querySelector("#style").value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    suggestionList.replaceChildren();
    data.suggestions.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).forEach(addSuggestion);
    results.classList.remove("hidden"); results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) { showError(error.message || "Couldn’t connect. Make sure AMPwingman is running and try again."); }
  finally { button.disabled = false; buttonLabel.textContent = copy[currentMode][0]; }
});
document.querySelector("#clear-button").addEventListener("click", () => { suggestionList.replaceChildren(); results.classList.add("hidden"); });
