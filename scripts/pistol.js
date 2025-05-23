import { Gun } from "./gun.js";

export class Pistol extends Gun {
  #duration;

  constructor(camera) {
    super(
      50,
      "1911",
      25,
      10,
      1,
      "temp",
      "temp",
      "assets/guns/pistol_left.png",
      "assets/guns/pistol_right.png",
      0.05,
      12,
      3,
      1,
      1,
      camera
    );
  }
}
