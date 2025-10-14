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
  #path = "./assets/newmap.txt";
  #mapArray = [];
  #textMap;
  #width;
  #height;
  #tileX = 0;
  #tileY = 0;

  // All tile instances
  #tiles = {};

  #selectedTile;
  #selectedChar;

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

    this.#selectedChar = "3";
    this.#selectedTile = this.#tiles["3"];
  }

  async loadMap() {
    try {
      const response = await fetch(this.#path);
      const text = await response.text();
      const rows = text.trim().split("\n");
      this.#textMap = rows.map((r) => r.split(","));
      this.#height = this.#textMap.length;
      this.#width = this.#textMap[0].length;

      // Replace characters with tiles
      this.#mapArray = this.#textMap.map((row) =>
        row.map((char) => this.#tiles[char] || this.#tiles["l"])
      );

      console.log("Map loaded:", this.#mapArray);
    } catch (error) {
      console.error("Error loading map:", error);
    }
  }

  drawMap() {
    let ctx = document.querySelector("#myCanvas").getContext("2d");
    let camera = new Camera(this.#width, this.#height);
    ctx.clearRect(0, 0, 1000, 500);
    for (let i = 0; i < this.#width; i++) {
      for (let j = 0; j < this.#height; j++) {
        let x_index = this.#tileX + i;
        let y_index = this.#tileY + j;
        let x_pos = (x_index - this.#tileX) * 32;
        let y_pos = (y_index - this.#tileY) * 32;
        if (x_index < this.#width && y_index < this.#height) {
          let tile = this.#mapArray[y_index][x_index];
          tile.draw(x_pos, y_pos, camera, 32);
        }
      }
    }
  }

  handleKey(event) {
    const key = event.key;
    if (event.repeat) return;

    // movement
    if (key === "ArrowUp" && this.#tileY > 0) this.#tileY--;
    else if (key === "ArrowDown") this.#tileY++;
    else if (key === "ArrowLeft" && this.#tileX > 0) this.#tileX--;
    else if (key === "ArrowRight") this.#tileX++;

    // tile selection via dictionary
    if (this.#tiles[key]) {
      this.#selectedTile = this.#tiles[key];
      this.#selectedChar = key;
      console.log("Selected tile:", key);
    }

    this.drawMap();
  }

  click(event) {
    // sets the canvas to rect
    const rect = event.target.getBoundingClientRect();
    // gets the height and width of canvas
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    // gets the mouse position by subtracting the canvas position from the mouse position
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    let selectedTileX = Math.floor(mouseX / 32) + this.#tileX;
    let selectedTileY = Math.floor(mouseY / 32) + this.#tileY;

    console.log("Clicked tile: " + selectedTileX + " " + selectedTileY);

    this.#mapArray[selectedTileY][selectedTileX] = this.#selectedTile;

    this.#textMap[selectedTileY][selectedTileX] = this.#selectedChar;

    map.drawMap();

    console.log(this.#textMap);
    console.log(this.#selectedChar);
  }

  rightClickTileSelect(event) {
    // sets the canvas to rect
    const rect = event.target.getBoundingClientRect();
    // gets the height and width of canvas
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    // gets the mouse position by subtracting the canvas position from the mouse position
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    let selectedTileX = Math.floor(mouseX / 32) + this.#tileX;
    let selectedTileY = Math.floor(mouseY / 32) + this.#tileY;

    console.log("Clicked tile: " + selectedTileX + " " + selectedTileY);
    console.log(this.#selectedChar);
    console.log(this.#textMap[selectedTileY][selectedTileX]);

    this.#selectedChar = this.#textMap[selectedTileY][selectedTileX];

    console.log(this.#selectedChar);
    this.#selectedTile = this.#mapArray[selectedTileY][selectedTileX];
  }
}

let map = new mapEditor();

map.loadMap().then(() => {
  console.log("map loaded");

  console.log("Game loaded");

  // Makes sure arrow keys dont scroll down the web page
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    map.handleKey(event);
  });

  document.querySelector("#myCanvas").addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      // Your custom code for handling the left-click event
      map.click(event);
    }
  });

  document
    .querySelector("#myCanvas")
    .addEventListener("contextmenu", function (event) {
      // Prevent the default right-click menu from appearing
      event.preventDefault();

      console.log("Right click");
      map.rightClickTileSelect(event);
    });

  map.drawMap();

  document.querySelector("#saveMapBtn").addEventListener("click", () => {
    map.writeMap();
  });
});
