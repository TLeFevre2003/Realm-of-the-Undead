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
    ybound_in,
    camera
  ) {
    super(
      sprite_in,
      health_in,
      max_health_in,
      speed_in,
      1800,
      2000,
      xbound_in,
      ybound_in,
      camera
    );
    this.#gun1 = new Pistol(camera);
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

    let speed = this.#speed * this.camera.getScale()

    if (this.isMovingUp()) {
      movementY -= speed
    }
    if (this.isMovingDown()) {
      movementY += speed;
    }
    if (this.isMovingLeft()) {
      movementX -= speed;
    }
    if (this.isMovingRight()) {
      movementX += speed;
    }

    this.moveBy(movementX, movementY, map);
  }

  draw(camera) {
    let ctx = camera.getCanvas();
    let scale = camera.getScale();
    
    let mapPositionX = camera.getPlayerScreenPositionX(this.getX());
    let mapPositionY = camera.getPlayerScreenPositionY(this.getY());
    
    const angle = this.#angle + Math.PI / 2;
    const playerSprite = this.getSprite();
    const playerWidth = playerSprite.width * scale;
    const playerHeight = playerSprite.height * scale;
    
    // Save the current state
    ctx.save();
    
    // Move the context to the player's **scaled** center position
    ctx.translate(mapPositionX + playerWidth / 2, mapPositionY + playerHeight / 2);
    
    // Rotate the context
    ctx.rotate(angle);
    
    // Draw the player image, centered, and scaled
    ctx.drawImage(
      playerSprite,
      -playerWidth / 2, // x offset
      -playerHeight / 2, // y offset
      playerWidth,       // scaled width
      playerHeight       // scaled height
    );
    
    // Restore the context to its original state
    ctx.restore();    

    // Draw the health bars and points text
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = "black";
    ctx.rect(5 * scale, 5 * scale, this.getMaxHealth() * scale / 3, 5 * scale);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = "red";
    ctx.rect(5 * scale, 5 * scale, this.getHealth() * scale / 3, 5 * scale);
    ctx.fill();

    let fontSize = 13 * scale

    ctx.font = `${fontSize}px serif`;
    let pointsstr = this.points.toString() + " points";

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3; 
    ctx.strokeText(pointsstr, 5 * scale, 100 * scale);

    ctx.fillStyle = "white";
    ctx.fillText(pointsstr, 5 * scale, 100 * scale);


    // Draw the circle pointer
    // Calculate x and y components of offset for pointer
    let halfPi = Math.PI / 2 // Add half pi to the angle because the drawing angle of player is offset from the unit circle
    let xComponent = Math.cos(angle+halfPi) * 20 * scale
    let yComponent = Math.sin(angle+halfPi) * 20 * scale

    // console.log(angle)

    let circlePositionX = (mapPositionX + playerWidth / 2) - xComponent
    let circlePositionY = (mapPositionY + playerHeight / 2) - yComponent

    ctx.lineWidth = 1 * scale; 
    ctx.beginPath();
    ctx.arc(circlePositionX, circlePositionY, 1 * scale, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
