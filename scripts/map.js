import { Pit } from "./pit.js";
import { Wall } from "./wall.js";
import { AmmoCrate } from "./ammocrate.js";
import { HealthCrate } from "./healthcrate.js";
import { MysteryBox } from "./mysterybox.js";
import { Tarp } from "./tarp.js";
import { Water } from "./water.js";
import { UpgradeBench } from "./upgradebench.js";
import { Floor } from "./floor.js";
import { GunShop } from "./gunshop.js";
import { Gun } from "./gun.js";

export class Map {
  #path = "./assets/maps/newmapformat.txt";
  #mapArray = [];
  #width;
  #height;
  #tiles = {};
  #pathfindingMap = [];

  constructor() {
    // Constructor no longer manually defines tiles
  }

  // Load tiles from JSON
  async loadTiles(jsonPath = "./configs/tiletypes.json") {
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();

      console.log("Map data");
      console.log(data);

      data.tiles.forEach((tileDef) => {
        const id = tileDef.id;
        const type = tileDef.type;
        const img = tileDef.image;
        const price = tileDef.price;
        const gun = tileDef.gun;
        const gunType = tileDef.gunType;

        switch (type) {
          case "Wall":
          case "CabinWall":
            this.#tiles[id] = new Wall(img);
            break;
          case "Floor":
            this.#tiles[id] = new Floor(img);
            break;
          case "Water":
            this.#tiles[id] = new Water();
            break;
          case "Pit":
            this.#tiles[id] = new Pit();
            break;
          case "AmmoCrate":
            this.#tiles[id] = new AmmoCrate();
            break;
          case "HealthCrate":
            this.#tiles[id] = new HealthCrate();
            break;
          case "MysteryBox":
            this.#tiles[id] = new MysteryBox();
            break;
          case "UpgradeBench":
            this.#tiles[id] = new UpgradeBench();
            break;
          case "Tarp":
            this.#tiles[id] = new Tarp(img);
            break;
          case "GunShop":
            this.#tiles[id] = new GunShop(img, price, new Gun(gun), gunType);
            break;
          default:
            console.warn(`Unknown tile type: ${type}`);
        }
      });

      console.log("Tiles loaded dynamically:", this.#tiles);
    } catch (err) {
      console.error("Error loading tile data:", err);
    }
  }

  // Loads the map from a text file using dictionary lookup
  async loadMap() {
    await this.loadTiles(); // Ensure tiles are loaded first

    return new Promise((resolve, reject) => {
      fetch(this.#path)
        .then((response) => response.text())
        .then((data) => {
          const rows = data.trim().split("\n");
          this.#mapArray = rows.map((row) => row.split(","));
          this.#height = this.#mapArray.length;
          this.#width = this.#height > 0 ? this.#mapArray[0].length : 0;

          // Replace map characters with tile instances
          for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
              const char = this.#mapArray[y][x];
              const tile = this.#tiles[char];
              this.#mapArray[y][x] = tile || this.#tiles["1"]; // default to grass
            }
          }

          // Build pathfinding map (0 = walkable, 1 = blocked)
          this.#pathfindingMap = Array.from({ length: this.#width }, (_, x) =>
            Array.from({ length: this.#height }, (_, y) =>
              this.getWalkthrough(x, y) ? 0 : 1
            )
          );

          console.log("Map loaded with tiles:", this.#mapArray);
          resolve();
        })
        .catch((error) => {
          console.error("Error reading the map file:", error);
          reject(error);
        });
    });
  }

  getMapArray() {
    return this.#mapArray;
  }

  getIsShop(x, y) {
    return this.#mapArray[y][x].isStore();
  }

  getIsWater(x, y) {
    return this.#mapArray[y][x].isWater();
  }

  getPathFindingMap() {
    return this.#pathfindingMap;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  getWalkthrough(x, y) {
    return this.#mapArray[y][x].canWalkThrough();
  }

  getShootthrough(x, y) {
    return this.#mapArray[y][x].canShootThrough();
  }

  drawTileUI(camera, player) {
    let tileX = player.getTileX(5);
    let tileY = player.getTileY(5);
    let tile = this.#mapArray[tileY][tileX];
    if (tile.isInteractable(tileX, tileY)) {
      tile.drawUI(camera);
      let cost = tile.getCost();
      // console.log(cost)
    }
  }

  // Draws the visible section of the map
  draw(player, camera) {
    let ctx = camera.getCanvas();

    let tileWidth = camera.getTileWidth();

    let playerX = player.getX();
    let playerY = player.getY();

    // Gets the x and y values where the top left tile starts drawing
    let x = camera.getMapScreenPositionX(playerX);
    let y = camera.getMapScreenPositionY(playerY);

    // gets the top left tile index
    let xindex = camera.getMapXIndex(playerX);
    let yindex = camera.getMapYIndex(playerY);

    x = Math.floor(x);
    y = Math.floor(y);

    let tilesToDrawY = camera.getTilesYOnScreen();

    console.log("Draw Y tiles: " + tilesToDrawY);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < tilesToDrawY; j++) {
        let x_index = xindex + i;
        let y_index = yindex + j;
        let x_pos = x + i * tileWidth;
        let y_pos = y + j * tileWidth;
        if (x_index < this.#width && y_index < this.#height) {
          let tile = this.#mapArray[y_index][x_index];
          tile.draw(x_pos, y_pos, camera, tileWidth);
        }
      }
    }
  }
}
