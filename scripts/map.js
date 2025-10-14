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
import { Sniper } from "./sniper.js";
import { Rifle } from "./rifle.js";
import { Shotgun } from "./shotgun.js";
import { Gun } from "./gun.js";

export class Map {
  #path = "./assets/newmap.txt";
  #mapArray = [];
  #width;
  #height;
  #pixelWidth;
  #pixelHeight;
  // All tile instances
  #tiles = {};

  #pathfindingMap = [];

  constructor() {
    this.#tiles = {
      // fences
      3: new Wall("./assets/fence/fence_right.png"),
      4: new Wall("./assets/fence/fence_left.png"),
      5: new Wall("./assets/fence/fence_bottom.png"),
      6: new Wall("./assets/fence/fence_top.png"),
      7: new Wall("./assets/fence/fence_corner_bottom_left.png"),
      8: new Wall("./assets/fence/fence_corner_bottom_right.png"),
      9: new Wall("./assets/fence/fence_corner_top_left.png"),
      0: new Wall("./assets/fence/fence_corner_top_right.png"),

      // house walls
      "-": new Wall("./assets/walls/houseWall_4_corner.png"),
      "=": new Wall("./assets/walls/houseWall_corner_NE.png"),
      q: new Wall("./assets/walls/houseWall_corner_NW.png"),
      w: new Wall("./assets/walls/houseWall_corner_SE.png"),
      e: new Wall("./assets/walls/houseWall_corner_SW.png"),
      r: new Wall("./assets/walls/houseWall_EW.png"),
      t: new Wall("./assets/walls/houseWall_NS.png"),
      y: new Wall("./assets/walls/houseWall_t_down.png"),
      u: new Wall("./assets/walls/houseWall_t_left.png"),
      i: new Wall("./assets/walls/housewall_t_right.png"),
      o: new Wall("./assets/walls/houseWall_t_up.png"),

      // stone walls
      p: new Wall("./assets/walls/stonewall_4_corner.png"),
      "[": new Wall("./assets/walls/stonewall_corner_NE.png"),
      "]": new Wall("./assets/walls/stonewall_corner_NW.png"),
      "\\": new Wall("./assets/walls/stonewall_corner_SE.png"),
      a: new Wall("./assets/walls/stonewall_corner_SW.png"),
      s: new Wall("./assets/walls/stonewall_EW.png"),
      d: new Wall("./assets/walls/stonewall_NS.png"),
      f: new Wall("./assets/walls/stonewall_t_down.png"),
      g: new Wall("./assets/walls/stonewall_t_left.png"),
      h: new Wall("./assets/walls/stonewall_t_right.png"),
      j: new Wall("./assets/walls/stonewall_t_up.png"),

      // cabin walls
      x: new Wall("./assets/walls/cabinWall_corner_NE.png"),
      c: new Wall("./assets/walls/cabinWall_corner_NW.png"),
      v: new Wall("./assets/walls/cabinWall_corner_SE.png"),
      b: new Wall("./assets/walls/cabinWall_corner_SW.png"),
      n: new Wall("./assets/walls/cabinWall_EW.png"),
      m: new Wall("./assets/walls/cabinWall_NS.png"),

      // floors
      l: new Floor("./assets/floors/green_grass.png"),
      ";": new Floor("./assets/floors/woodfloor.png"),
      ".": new Floor("./assets/floors/bridgefloor_top.png"),
      "/": new Floor("./assets/floors/bridgefloor_bottom.png"),

      // special
      W: new Water(),
      P: new Pit(),
      A: new AmmoCrate(),
      H: new HealthCrate(),
      M: new MysteryBox(),
      U: new UpgradeBench(),

      // tarps
      z: new Tarp("./assets/tarp/tarp_top_right.png"),
      "`": new Tarp("./assets/tarp/tarp_top_left.png"),
      1: new Tarp("./assets/tarp/tarp_bottom_right.png"),
      2: new Tarp("./assets/tarp/tarp_bottom_left.png"),

      // gun shops
      R: new GunShop(
        "./assets/floors/woodfloor.png",
        1000,
        new Gun("test"),
        "rifle"
      ),
      S: new GunShop(
        "./assets/floors/woodfloor.png",
        1250,
        new Gun("test"),
        "sniper"
      ),
      G: new GunShop(
        "./assets/floors/green_grass.png",
        1500,
        new Gun("test"),
        "shotgun"
      ),
    };
  }

  // Loads the map from a text file using dictionary lookup
  loadMap() {
    return new Promise((resolve, reject) => {
      fetch(this.#path)
        .then((response) => response.text())
        .then((data) => {
          const rows = data.trim().split("\n");
          this.#mapArray = rows.map((row) => row.split(","));
          this.#height = this.#mapArray.length;
          this.#width = this.#height > 0 ? this.#mapArray[0].length : 0;

          console.log("Raw Map Array:", this.#mapArray);
          console.log("Width:", this.#width, "Height:", this.#height);

          // Replace map characters with tile instances
          for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
              const char = this.#mapArray[y][x];
              const tile = this.#tiles[char];
              this.#mapArray[y][x] = tile || this.#tiles["l"]; // default to grass
            }
          }

          // Build pathfinding map (0 = walkable, 1 = blocked)
          this.#pathfindingMap = Array.from({ length: this.#width }, (_, x) =>
            Array.from({ length: this.#height }, (_, y) =>
              this.getWalkthrough(x, y) ? 0 : 1
            )
          );

          console.log("Map Array After Replacement:", this.#mapArray);
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

  getIsWater(x, y) {
    return this.#mapArray[y][x].isWater();
  }

  getPathFindingMap() {
    // 0 zombie can walk through, 1 it cannot
    return this.#pathfindingMap;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  // Returns true if you can walk through the tile
  getWalkthrough(x, y) {
    return this.#mapArray[y][x].canWalkThrough();
  }

  // Returns true if you can shoot through the tile
  getShootthrough(x, y) {
    return this.#mapArray[y][x].canShootThrough();
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
