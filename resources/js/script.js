const container = document.getElementById("card-container");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const setSelector = document.getElementById("set-selector");

// Returns current set key (e.g. "lob" or "mrd")
function getCurrentSetKey() {
  return setSelector.value;
}

// Load data from Neutralino storage, fallback to default set JSON
async function loadStoredData() {
  const currentSet = getCurrentSetKey();
  const storageKey = `cardsData-${currentSet}`;

  try {
    const raw = await Neutralino.storage.getData(storageKey);
    const storedData = JSON.parse(raw);
    const defaultData = await loadDefaultData(currentSet);

    // Merge imageUrl into stored data if missing
    const updatedData = storedData.map(storedCard => {
      const defaultCard = defaultData.find(c => c.id === storedCard.id);
      return {
        ...storedCard,
        imageUrl: storedCard.imageUrl || (defaultCard ? defaultCard.imageUrl : "")
      };
    });

    return updatedData;
  } catch {
    return loadDefaultData(currentSet);
  }
}

// Load default data from cards/{set}.json
async function loadDefaultData(setKey) {
  const res = await fetch(`${setKey}.json`);
  const data = await res.json();

  return data.map(card => ({
    name: card.name,
    id: card.id,
    imageUrl: card.imageUrl,
    checked: card.checked || false,
    quantity: card.quantity || 0
  }));
}

// Save data to Neutralino storage, exclude imageUrl
async function saveData(cards) {
  const currentSet = getCurrentSetKey();
  const storageKey = `cardsData-${currentSet}`;

  const dataToSave = cards.map(({ imageUrl, ...rest }) => rest);

  try {
    await Neutralino.storage.setData(storageKey, JSON.stringify(dataToSave));
    
  } catch (e) {
    console.error("Failed to save:", e);
    alert("Failed to save data.");
  }
}

function getCardDataFromDOM() {
  const cards = document.querySelectorAll("#card-container .card");
  return Array.from(cards).map(cardEl => {
    const titleEl = cardEl.querySelector(".card-title");
    const idEl = cardEl.querySelector(".card-text");
    const imageEl = cardEl.querySelector("img");
    const checkboxEl = cardEl.querySelector(".form-check-input");
    const quantityEl = cardEl.querySelector(".quantity-input");

    return {
      name: titleEl?.textContent.trim() || "",
      id: idEl?.textContent.trim() || "",
      imageUrl: imageEl?.src || "",
      checked: checkboxEl?.checked || false,
      quantity: parseInt(quantityEl?.value) || 0
    };
  });
}

// Save and Load buttons
saveButton.addEventListener("click", async () => {
  const data = getCardDataFromDOM();
  await saveData(data);
});

loadButton.addEventListener("click", async () => {
  const data = await loadStoredData();
  render(data);
});

// Reload cards when changing set
setSelector.addEventListener("change", async () => {
  const data = await loadStoredData();
  render(data);
});

// Initial load
Neutralino.init();
loadStoredData().then(render);