import { Entity } from "./entity.js";
import { Pistol } from "./pistol.js";
import { Shotgun } from "./shotgun.js";
import { Rifle } from "./rifle.js";

export class Player extends Entity {
  #mouseY;
  #mouseX;
  #gun1;
  #gun2;
  activegun;
  #speed = 0.7;
  points = 0;
  #angle = 0;

  constructor(
    gun1_in,
    gun2_in,
    sprite_in,
    direction_in,
    health_in,
    max_health_in,
    speed_in,
    xbound_in,
    ybound_in
  ) {
    super(
      sprite_in,
      health_in,
      max_health_in,
      speed_in,
      1080,
      520,
      xbound_in,
      ybound_in
    );
    this.#gun1 = new Pistol();
    this.activegun = this.#gun1;
  }

  setDirection(x, y) {
    this.#mouseX = x;
    this.#mouseY = y;
    this.#angle = Math.atan2(y, x); // Calculate angle in radians
  }

  addpoints(added) {
    this.points += added;
  }

  getActiveGun() {
    return this.activegun;
  }

  getmouseX() {
    return this.#mouseX;
  }

  getmouseY() {
    return this.#mouseY;
  }

  reload() {
    this.activegun.reload();
  }

  dropGun() {
    if (this.activegun == this.#gun1) {
      this.#gun1 = null;
      this.activegun = this.#gun2;
    } else if (this.activegun == this.#gun2) {
      this.#gun2 = null;
      this.activegun = this.#gun1;
    }
  }

  equipWeapon(gun) {
    if (this.#gun1 == null) {
      this.#gun1 = gun;
      this.activegun = this.#gun1;
    } else if (this.#gun2 == null) {
      this.#gun2 = gun;
      this.activegun = this.#gun2;
    } else {
      if (this.activegun == this.#gun1) {
        this.#gun1 = gun;
        this.activegun = this.#gun1;
      } else if (this.activegun == this.#gun2) {
        this.#gun2 = gun;
        this.activegun = this.#gun2;
      }
    }
  }

  interact(map) {
    let tile = map.getMapArray()[this.getTileY(5)][this.getTileX(5)];

    if (tile.isInteractable()) {
      tile.purchase(this);
    }
  }

  getPoints() {
    return this.points;
  }

  usePoints(points) {
    this.points -= points;
  }

  switchActiveGun(value) {
    switch (value) {
      case 1:
        if (this.#gun1 != null) {
          this.activegun = this.#gun1;
        }
        break;
      case 2:
        if (this.#gun2 != null) {
          this.activegun = this.#gun2;
        }
        break;
    }
  }

  shoot(bullets, camera, angle) {
    if (this.activegun == null) {
      return;
    }

    this.#angle = angle;

    this.activegun.shoot(bullets, this, camera, angle);
  }

  getDirectionX(camPosX) {
    camPosX += 7;
    if (this.#mouseX > 0) {
      return "right";
    } else if (this.#mouseX < 0) {
      return "left";
    } else {
      return "right";
    }
  }

  getDirectionY(canPosY) {
    if (this.#mouseY < canPosY) {
      return "above";
    } else if (this.#mouseY > canPosY) {
      return "below";
    }
  }

  move(map) {
    let movementX = 0;
    let movementY = 0;

    if (this.isMovingUp()) {
      movementY -= this.#speed;
    }
    if (this.isMovingDown()) {
      movementY += this.#speed;
    }
    if (this.isMovingLeft()) {
      movementX -= this.#speed;
    }
    if (this.isMovingRight()) {
      movementX += this.#speed;
    }

    this.moveBy(movementX, movementY, map);
  }

  draw(camera) {
    let ctx = camera.getCanvas();

    let mapPositionX = camera.getPlayerScreenPositionX(this.getX());
    let mapPositionY = camera.getPlayerScreenPositionY(this.getY());

    const angle = this.#angle + Math.PI / 2; // Adjust angle by subtracting 90 degrees (π/2 radians)
    const playerSprite = this.getSprite();
    const playerWidth = playerSprite.width;
    const playerHeight = playerSprite.height;

    // Save the current state
    ctx.save();

    // Move the context to the player's position, taking into account the player's size
    ctx.translate(mapPositionX + playerWidth / 2, mapPositionY + playerHeight / 2);

    // Rotate the context
    ctx.rotate(angle);

    // Draw the player image, offset by the width/height to center it
    ctx.drawImage(playerSprite, -playerWidth / 2, -playerHeight / 2);

    // Restore the context to its original state
    ctx.restore();

    // Draw the health bars and points text
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = "black";
    ctx.rect(5, 5, this.getMaxHealth() / 3, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = "red";
    ctx.rect(5, 5, this.getHealth() / 3, 5);
    ctx.fill();

    ctx.font = "13px serif";
    let pointsstr = this.points.toString() + " points";

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3; 
    ctx.strokeText(pointsstr, 5, 100);

    ctx.fillStyle = "white";
    ctx.fillText(pointsstr, 5, 100);
  }
}
