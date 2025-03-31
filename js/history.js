// history.js

const storageKey = "strainHistory";

// Retrieve saved strains from localStorage
function loadStrains() {
  let history = localStorage.getItem(storageKey);
  if (!history) return [];
  try {
    return JSON.parse(history);
  } catch (e) {
    console.error("Error parsing saved strains:", e);
    return [];
  }
}

// Save strains back to localStorage
function saveStrains(strains) {
  localStorage.setItem(storageKey, JSON.stringify(strains));
}

// Create a strain element for display
function createStrainElement(strain, index) {
  const container = document.createElement("div");
  container.className = "strain-entry";
  container.style.border = "1px solid #444";
  container.style.padding = "1rem";
  container.style.marginBottom = "1rem";
  container.style.borderRadius = "8px";
  
  // Header with strain name (clickable to toggle details)
  const header = document.createElement("h3");
  header.textContent = strain.name
    ? `${strain.name} (Saved on ${new Date(strain.timestamp).toLocaleString()})`
    : `Strain ${index + 1} (Saved on ${new Date(strain.timestamp).toLocaleString()})`;
  header.style.cursor = "pointer";
  container.appendChild(header);
  
  // Details div: starting effects, ingredient chain, final effects, cost, price, profit
  const detailsDiv = document.createElement("div");
  detailsDiv.className = "strain-details";
  detailsDiv.style.display = "none"; // Hidden by default
  const startingEffects = strain.startingEffects && strain.startingEffects.length
    ? strain.startingEffects.join(", ")
    : "N/A";
  const chain = strain.chain && strain.chain.length
    ? strain.chain.join(" → ")
    : "N/A";
  const finalEff = strain.finalEffects && strain.finalEffects.length
    ? strain.finalEffects.join(", ")
    : "N/A";
  
  detailsDiv.innerHTML = `
    <p><strong>Starting Effects:</strong> ${startingEffects}</p>
    <p><strong>Ingredient Chain:</strong> ${chain}</p>
    <p><strong>Final Effects:</strong> ${finalEff}</p>
    <p><strong>Total Cost:</strong> $${strain.totalCost}</p>
    <p><strong>Final Price:</strong> $${strain.finalPrice}</p>
    <p><strong>Total Profit:</strong> $${strain.totalProfit}</p>
  `;
  container.appendChild(detailsDiv);
  
  // Toggle the details when header is clicked
  header.addEventListener("click", () => {
    detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
  });
  
  // Create and append a Delete button with some spacing
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteStrainBtn";
  deleteBtn.setAttribute("data-index", index);
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginTop = "0.5rem";
  container.appendChild(deleteBtn);
  
  return container;
}

// Render the entire strain history onto the page
function renderHistory() {
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = ""; // Clear previous entries
  const strains = loadStrains();
  
  if (strains.length === 0) {
    historyContainer.innerHTML = "<p>No strains saved yet.</p>";
    return;
  }
  
  strains.forEach((strain, index) => {
    const strainElement = createStrainElement(strain, index);
    historyContainer.appendChild(strainElement);
  });
  
  // Attach event listeners for delete buttons
  document.querySelectorAll(".deleteStrainBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-index");
      deleteStrain(idx);
    });
  });
}

// Delete a strain at a given index
function deleteStrain(index) {
  let strains = loadStrains();
  strains.splice(index, 1);
  saveStrains(strains);
  renderHistory();
}

// Event listener for "Clear All History" button
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all saved strains?")) {
    localStorage.removeItem(storageKey);
    renderHistory();
  }
});

// Initialize history display when the page loads
document.addEventListener("DOMContentLoaded", renderHistory);
