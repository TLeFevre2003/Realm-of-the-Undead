import { Pit } from "./pit.js";
import { Wall } from "./wall.js";
import { AmmoCrate } from "./ammocrate.js";
import { HealthCrate } from "./healthcrate.js";
import { MysteryBox } from "./mysterybox.js";
import { Tarp } from "./tarp.js";
import { Water } from "./water.js";
import { UpgradeBench } from "./upgradebench.js";
import { Floor } from "./floor.js";
import { Gun } from "./gun.js";
import { GunShop } from "./gunshop.js";
import { Camera } from "./camera.js";

class mapEditor {
  #path = "./assets/maps/newmapformat.txt";
  #tileConfigPath = "./configs/tiletypes.json";
  #tiles = {};
  #mapArray = [];
  #textMap;
  #width;
  #height;
  #tileX = 0;
  #tileY = 0;
  #selectedTile;
  #selectedId;

  constructor() {
    this.#selectedId = "3";
  }

  async loadTilesFromJson() {
    try {
      // Load all the json data as objects
      const response = await fetch(this.#tileConfigPath);
      const data = await response.json();

      // Loop through each tile
      for (const t of data.tiles) {
        let tileInstance = null;

        switch (t.type) {
          case "Wall":
            tileInstance = new Wall(t.image);
            break;
          case "Floor":
            tileInstance = new Floor(t.image);
            break;
          case "Water":
            tileInstance = new Water();
            break;
          case "Pit":
            tileInstance = new Pit();
            break;
          case "Tarp":
            tileInstance = new Tarp(t.image);
            break;
          case "AmmoCrate":
            tileInstance = new AmmoCrate();
            break;
          case "HealthCrate":
            tileInstance = new HealthCrate();
            break;
          case "MysteryBox":
            tileInstance = new MysteryBox();
            break;
          case "UpgradeBench":
            tileInstance = new UpgradeBench();
            break;
          case "GunShop":
            tileInstance = new GunShop(
              t.image,
              t.price,
              new Gun(t.gun),
              t.gunType
            );
            break;
          default:
            console.warn(`Unknown tile type: ${t.type}`);
            continue;
        }

        // Save tile to dictionary, key as the dictionary key
        this.#tiles[t.id] = tileInstance;
      }

      this.#selectedTile = this.#tiles[this.#selectedId];
      console.log("Tiles loaded successfully.");
    } catch (error) {
      console.error("Error loading tile types:", error);
    }
  }

  // Loads the map, use await to load synchronoulsy
  async loadMap() {
    // Use try to catch errors.
    try {
      // Fetch the map
      const response = await fetch(this.#path);

      // Read the response as plain text
      const text = await response.text();
      // Split each row of the map by the new line character
      const rows = text.trim().split("\n");

      // Split each row into the individual character plit by commas.
      this.#textMap = rows.map((r) => r.split(","));

      // Find the height and widths of the map
      this.#height = this.#textMap.length;
      this.#width = this.#textMap[0].length;

      // Goes through each character in the 2d array, replacing each character with the corresponding tile key.
      // If there is none found, replace with the default floor tile.
      this.#mapArray = this.#textMap.map((row) =>
        row.map((char) => this.#tiles[char] || this.#tiles["l"])
      );

      console.log("Map loaded.");
    } catch (error) {
      console.error("Error loading map:", error);
    }
  }

  drawMap() {
    const ctx = document.querySelector("#myCanvas").getContext("2d");
    const camera = new Camera(this.#width, this.#height);

    ctx.clearRect(0, 0, 1000, 500);

    for (let i = 0; i < this.#width; i++) {
      for (let j = 0; j < this.#height; j++) {
        const x_index = this.#tileX + i;
        const y_index = this.#tileY + j;
        const x_pos = (x_index - this.#tileX) * 32;
        const y_pos = (y_index - this.#tileY) * 32;

        if (x_index < this.#width && y_index < this.#height) {
          const tile = this.#mapArray[y_index][x_index];
          tile.draw(x_pos, y_pos, camera, 32);
        }
      }
    }
  }

  handleKey(event) {
    const key = event.key;
    if (event.repeat) return;

    if (key === "ArrowUp" && this.#tileY > 0) this.#tileY--;
    else if (key === "ArrowDown") this.#tileY++;
    else if (key === "ArrowLeft" && this.#tileX > 0) this.#tileX--;
    else if (key === "ArrowRight") this.#tileX++;

    if (this.#tiles[key]) {
      this.#selectedTile = this.#tiles[key];
      this.#selectedId = key;
      console.log("Selected tile:", key);
    }

    this.drawMap();
  }

  click(event) {
    const rect = event.target.getBoundingClientRect();
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const selectedTileX = Math.floor(mouseX / 32) + this.#tileX;
    const selectedTileY = Math.floor(mouseY / 32) + this.#tileY;

    this.#mapArray[selectedTileY][selectedTileX] = this.#selectedTile;
    this.#textMap[selectedTileY][selectedTileX] = this.#selectedId;

    this.drawMap();
  }

  rightClickTileSelect(event) {
    const rect = event.target.getBoundingClientRect();
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const selectedTileX = Math.floor(mouseX / 32) + this.#tileX;
    const selectedTileY = Math.floor(mouseY / 32) + this.#tileY;

    this.#selectedId = this.#textMap[selectedTileY][selectedTileX];
    this.#selectedTile = this.#mapArray[selectedTileY][selectedTileX];
  }

  selectTileById(tileId) {
    if (this.#tiles[tileId]) {
      this.#selectedId = tileId;
      this.#selectedTile = this.#tiles[tileId];
      console.log(`Selected tile from UI: ${tileId}`);
    } else {
      console.warn(`Tile ID ${tileId} not found.`);
    }
  }

  writeMap() {
    const rows = this.#textMap.map((row) => row.join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/plain" });

    // Save the blob to a file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt"; // Set the filename as needed
    link.click();

    URL.revokeObjectURL(link.href);
  }
}

// ==========================
//  INITIALIZATION LOGIC
// ==========================
let map = new mapEditor();

(async () => {
  await map.loadTilesFromJson();
  await map.loadMap();

  console.log("Map editor fully initialized.");

  document.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key))
      event.preventDefault();
    map.handleKey(event);
  });

  const canvas = document.querySelector("#myCanvas");
  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) map.click(event);
  });
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    map.rightClickTileSelect(event);
  });

  document.querySelector("#saveMapBtn").addEventListener("click", () => {
    map.writeMap();
  });

  map.drawMap();

  // ✅ Make the map globally accessible
  window.map = map;
})();
