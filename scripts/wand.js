import { Gun } from "./gun.js";

export class Wand extends Gun {
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
      "assets/guns/Inferno.png",
      "assets/guns/Inferno.png",
      0.05,
      12,
      3,
      1,
      1,
      camera
    );
  }
}
