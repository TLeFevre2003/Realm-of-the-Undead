export async function loadTiles() {
  try {
    const response = await fetch("./configs/tiletypes.json");
    const data = await response.json();
    const tiles = data.tiles;

    const container = document.querySelector(".container");
    container.innerHTML = "";

    const categories = {};
    for (const tile of tiles) {
      const type = tile.type || "Other";
      if (!categories[type]) categories[type] = [];
      categories[type].push(tile);
    }

    for (const [category, tiles] of Object.entries(categories)) {
      const tableContainer = document.createElement("div");
      tableContainer.classList.add("table-container");

      const h2 = document.createElement("h2");
      h2.textContent = category;
      tableContainer.appendChild(h2);

      const table = document.createElement("table");
      table.border = 1;

      const headerRow = document.createElement("tr");
      ["Tile", "Id", "Image"].forEach((text) => {
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

        // Id
        const tdId = document.createElement("td");
        tdId.textContent = tile.id || "";
        tr.appendChild(tdId);

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

        // ✅ Add click handler to select tile
        tr.addEventListener("click", () => {
          if (window.map) {
            window.map.selectTileById(tile.id);
          }
        });

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
