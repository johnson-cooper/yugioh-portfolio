function updateCounter() {
  const counterEl = document.getElementById("set-counter");
  const checkboxes = document.querySelectorAll("#card-container .form-check-input");
  const total = checkboxes.length;
  const owned = Array.from(checkboxes).filter(cb => cb.checked).length;

  counterEl.textContent = `${owned}/${total} cards owned`;
}