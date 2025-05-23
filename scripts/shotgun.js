import { Gun } from "./gun.js";

export class Shotgun extends Gun {
  #duration;

  constructor(camera) {
    super(
      60,
      "Shotgun",
      60,
      10,
      3,
      "temp",
      "temp",
      "assets/guns/shotgun_left.png",
      "assets/guns/shotgun_right.png",
      0.32,
      12,
      1,
      3,
      1,
      camera
    );
  }
}
