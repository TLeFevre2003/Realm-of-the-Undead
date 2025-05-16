import { Store } from "./store.js";
export class UpgradeBench extends Store {
  constructor() {
    super("./assets/floors/workbench.png", 5000, "Upgrade ");
  }
  purchase(player) {
    let playerPoints = player.getPoints();
    let gun = player.getActiveGun();
    let costPoints = gun.getCost();

    if (playerPoints >= costPoints) {
      player.usePoints(costPoints);

      gun.upgrade();
      gun.refillAmmo();
      gun.reload();
      gun.refillAmmo();
    }
  }
  drawUI(camera) {
    let ctx = camera.getCanvas();
    // Set the fill style to semi-transparent green
    let cost = this.getCost();
    ctx.fillStyle = "rgba(1, 1, 200, 0.5)"; // 0.5 alpha value for transparency

    let scale = camera.getScale()

    // Draw a rectangle starting at (x, y) with width and height
    var x = 140 * scale;
    var y = 5 * scale;
    var width = 110 * scale;
    var height = 50 * scale;
    ctx.fillRect(x, y, width, height);

    let name = this.getName();

    ctx.fillStyle = "black";
    let fontSize = 13 * scale
    ctx.font = `${fontSize}px serif`;
    let nametxt = "Buy: " + name;
    ctx.fillText(nametxt, 141 * scale, 20 * scale);

    ctx.fillStyle = "black";
    let costtxt = "Cost: " + cost.toString();
    ctx.fillText(costtxt, 141 * scale, 35 * scale);

    ctx.fillStyle = "black";
    let tip = "Press F to buy";
    ctx.fillText(tip, 141 * scale, 50 * scale);
  }
}
