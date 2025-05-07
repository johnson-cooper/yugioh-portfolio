function render(data) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  data.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

    cardDiv.innerHTML = `
      <div class="card h-100">
        <div class="card-image-wrapper">
          <img src="${card.imageUrl}" class="card-img-top card-image" alt="${card.name}">
        </div>
        <div class="card-body bg-dark">
          <h5 class="card-title">${card.name}</h5>
          <p class="card-text">${card.id}</p>
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="check-${card.id}" ${card.checked ? "checked" : ""}>
            <label class="form-check-label" for="check-${card.id}">Owned</label>
          </div>
          <input type="number" class="form-control quantity-input" min="0" value="${card.quantity}" placeholder="Quantity">
        </div>
      </div>
    `;

    container.appendChild(cardDiv);

    const checkbox = cardDiv.querySelector(".form-check-input");
    const quantityInput = cardDiv.querySelector(".quantity-input");
    const image = cardDiv.querySelector(".card-img-top");
    const imageWrapper = cardDiv.querySelector(".card-image-wrapper");

    function updateCardImageStyle() {
      const quantity = parseInt(quantityInput.value) || 0;
      const isChecked = checkbox.checked;

      imageWrapper.classList.remove("grayscale", "shine");

      if (!isChecked && quantity === 0) {
        imageWrapper.classList.add("grayscale");
      } else if (isChecked && quantity > 0) {
        imageWrapper.classList.add("shine");
      }

      // Call the external counter updater
      updateCounter(); // <-- This will be defined in another script
    }

    checkbox.addEventListener("change", updateCardImageStyle);
    quantityInput.addEventListener("input", updateCardImageStyle);
    image.addEventListener("load", updateCardImageStyle);
    if (image.complete) updateCardImageStyle();
  });

  // After rendering all cards, update once
  updateCounter();
}