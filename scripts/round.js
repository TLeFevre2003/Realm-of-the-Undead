import { Zombie } from "./zombie.js";

export class Round {
  speedModifier = 1.05;
  countModifier = 1.2;
  damageModifier = 1.05;
  healthModifier = 1.05;
  #camera;


  // Temporally changing zombnumber from 20 to 1 for testing purposes
  zombNumber = 20;
  zombDamage = 1;
  zombHealth = 50;
  zombSpeed = 0.3;

  currentRound = 1;

  CurrentAliveZombies = 0;

  constructor(camera) 
  {
    this.#camera = camera
  }

  // Return true if the round is over, and increments the round number
  endRound() {
    if (this.CurrentAliveZombies == 0) {
      this.currentRound++;
    }
    return this.CurrentAliveZombies == 0;
  }

  // Spawn the next round
  spawnRound(zombies, xbound, ybound, map) {
    // this.#zombies[3][3].push(new Zombie(2, "./assets/zombie_fem.png", "direction_in", 100, 100, .3));

    let scale = this.#camera.getScale()
    let tileWidth = this.#camera.getTileWidth()

    let count = 0;
    let frames = Math.floor((this.zombNumber * this.countModifier ** (this.currentRound - 1)) / 1);
    let current_frame = 0;
    while (
      count <
      this.zombNumber * this.countModifier ** (this.currentRound - 1)
    ) {
      let zombieXpos = Math.floor(Math.random() * (xbound * tileWidth - 5 * scale));
      let zombieYpos = Math.floor(Math.random() * (ybound * tileWidth - 5 * scale));

      let zombieTileX = Math.floor(zombieXpos / tileWidth);
      let zombieTileY = Math.floor(zombieYpos / tileWidth);

      zombieXpos = zombieTileX * tileWidth + 2 + Math.floor(Math.random() * 25);
      zombieYpos = zombieTileY * tileWidth + 2 + Math.floor(Math.random() * 25);

      var path = this.getRandomString("one", "two");

      let img_path = "./assets/player/player.png";

      if (map.getWalkthrough(zombieTileX, zombieTileY)) {
        zombies[zombieTileX][zombieTileY].push(
          new Zombie(
            this.zombDamage * this.damageModifier ** (this.currentRound - 1),
            img_path,
            this.zombHealth * this.healthModifier ** (this.currentRound - 1),
            this.zombHealth * this.healthModifier ** (this.currentRound - 1),
            this.zombSpeed * this.speedModifier ** (this.currentRound - 1),
            zombieXpos,
            zombieYpos,
            xbound,
            ybound,
            current_frame,
            frames,
            this.#camera
          )
        );

        this.CurrentAliveZombies++;
        count++;

        if (current_frame == frames) {
          current_frame = 0;
        } else {
          current_frame++;
        }
      }
    }

    console.log(this.CurrentAliveZombies);
  }

  // When called remove 1 from current zombie count
  killZombie() {
    this.CurrentAliveZombies--;
  }

  // Draw the round number
  draw(camera) {
    // console.log("Current zombies "+ this.CurrentAliveZombies )

    let scale = camera.getScale()

    let ctx = camera.getCanvas();
    let fontSize = 13 * scale
    ctx.font = `${fontSize}px serif`;
    let roundtxt = "Round: " + this.currentRound.toString();

    // Draw black border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3; // Adjust the border thickness as needed
    ctx.strokeText(roundtxt, 5 * scale, 120 * scale);

    // Draw white fill
    ctx.fillStyle = "white";
    ctx.fillText(roundtxt, 5 * scale, 120 * scale);
  }

  drawGameOver(camera) {
    let ctx = camera.getCanvas();
    ctx.fillStyle = "Red";
    ctx.font = "25px serif";
    let roundtxt = "Game Over";
    ctx.fillText(roundtxt, 5, 120);
  }

  // Picks a random string so we can randomize the zombie image
  getRandomString(string1, string2) {
    var randomNumber = Math.random();
    if (randomNumber < 0.5) {
      return string1;
    } else {
      return string2;
    }
  }
}
