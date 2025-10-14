export async function loadTiles() {
  try {
    const response = await fetch("./configs/tiletypes.json");
    const data = await response.json();
    const tiles = data.tiles;

    const container = document.querySelector(".container");
    container.innerHTML = ""; // clear existing tables if needed

    // Categorize tiles
    const categories = {};
    for (const tile of tiles) {
      const type = tile.type || "Other";
      if (!categories[type]) categories[type] = [];
      categories[type].push(tile);
    }

    // Create a table for each category
    for (const [category, tiles] of Object.entries(categories)) {
      const tableContainer = document.createElement("div");
      tableContainer.classList.add("table-container");

      const h2 = document.createElement("h2");
      h2.textContent = category;
      tableContainer.appendChild(h2);

      const table = document.createElement("table");
      table.border = 1;

      const headerRow = document.createElement("tr");
      ["Tile", "Key", "Image"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      for (const tile of tiles) {
        const tr = document.createElement("tr");

        // Tile Name
        const tdName = document.createElement("td");
        tdName.textContent = tile.name || tile.type || "tiles";
        tr.appendChild(tdName);

        // Key
        const tdKey = document.createElement("td");
        tdKey.textContent = tile.key || "";
        tr.appendChild(tdKey);

        // Image
        const tdImage = document.createElement("td");
        if (tile.image) {
          const img = document.createElement("img");
          img.src = tile.image;
          img.alt = tile.name || "";
          img.width = 32;
          img.height = 32;
          tdImage.appendChild(img);
        } else {
          tdImage.textContent = "—";
        }
        tr.appendChild(tdImage);

        table.appendChild(tr);
      }

      tableContainer.appendChild(table);
      container.appendChild(tableContainer);
    }
  } catch (error) {
    console.error("Error loading tile data:", error);
  }
}

// Auto-load tiles when script runs
loadTiles();
