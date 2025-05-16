import { Entity } from "./entity.js";
import { astar } from "./astar.js";

export class Zombie extends Entity {
  #damage;
  #SFX;
  radius = 6;
  alive = true;
  cooldown = 10;
  wait = 0;
  #pathFindFrame;
  #frameNumber = 0;
  #total_frames = 0;
  #last_path;

  constructor(
    damage_in,
    sprite_in,
    health_in,
    max_health_in,
    speed_in,
    x,
    y,
    xbound_in,
    ybound_in,
    frames_in,
    total_frames_in,
    camera
  ) {
    super(
      sprite_in,
      health_in,
      max_health_in,
      speed_in,
      x,
      y,
      xbound_in,
      ybound_in,
      camera
    );
    this.#damage = damage_in;
    this.#pathFindFrame = frames_in;
    this.#total_frames = total_frames_in;
  }

  getDamage() {
    if (this.wait == 0) {
      this.wait += 1;
      return this.#damage;
    }
    this.wait += 1;
    if (this.wait == this.cooldown) {
      this.wait = 0;
    }

    return 0;
  }
  getStatus() {
    return this.getHealth() > 0;
  }

  // Draws the zombie
  draw(camera, player) {
    // get the canvas to draw on
    let ctx = camera.getCanvas();

    // get the map positions of player and zombie, this is separate from the screen position
    let playerX = player.getX();
    let playerY = player.getY();
    let zombX = this.getX();
    let zombY = this.getY();

    // find the screen position to draw the zombie on
    let screenPositionX = Math.floor(
      camera.getObjectScreenPositionX(playerX, zombX)
    );
    let screenPositionY = Math.floor(
      camera.getObjectScreenPositionY(playerY, zombY)
    );

    const scale = camera.getScale()

    // Only draw if the zombie is visible on the canvas
    if (
      screenPositionX <= camera.getScreenWidth() &&
      screenPositionY <= camera.getScreenHeight() &&
      screenPositionX >= -16 * scale &&
      screenPositionY >= -16 * scale
    ) {
      const zombieSprite = this.getSprite();
      

      const zombieWidth = zombieSprite.width * scale;
      const zombieHeight = zombieSprite.height * scale;

      ctx.drawImage(this.getSprite(), screenPositionX, screenPositionY, zombieWidth, zombieHeight);

      // get zombie health
      let maxHealth = this.getMaxHealth();
      let health = this.getHealth();
      // draw only if zombie is damaged
      // draw only if zombie is damaged
      if (health != maxHealth) {
        // Dimensions
        const barWidth = 12 * scale;
        const barHeight = 2 * scale;
        const offsetX = 2 * scale;
        const offsetY = -2 * scale;

        // Calculate health percentage
        const healthPercent = health / maxHealth;
        const healthFillWidth = barWidth * healthPercent;

        // Draw red background (missing health)
        ctx.fillStyle = "red";
        ctx.fillRect(screenPositionX + offsetX, screenPositionY + offsetY, barWidth, barHeight);

        // Draw green foreground (current health)
        ctx.fillStyle = "limegreen";
        ctx.fillRect(screenPositionX + offsetX, screenPositionY + offsetY, healthFillWidth, barHeight);

        // Draw border
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(screenPositionX + offsetX, screenPositionY + offsetY, barWidth, barHeight);
      }

    }
  }

  pathfind(player, map, cache) {
    // a simple form of movement as a placeholder
    if (this.#frameNumber == this.#total_frames) {
      this.#frameNumber = 0;
    } else {
      this.#frameNumber++;
    }

    let astar_frame = false;
    if (this.#frameNumber == this.#pathFindFrame) {
      astar_frame = true;
    }

    let zombTileX = this.getTileX(4);
    let zombTileY = this.getTileY(5);

    let playerTileX = player.getTileX(4);
    let playerTileY = player.getTileY(5);
    
    let close = false;

    if ((Math.abs(player.getX() - this.getX()) < 5 && Math.abs(player.getY() - this.getY()) < 5) || (zombTileX == playerTileX && zombTileY == playerTileY))
    {
      astar_frame = false;
      close = true;
    }

    let graph = map.getPathFindingMap();

    let path = null;
    
    if (astar_frame == true)
    {
      path = astar(zombTileX, zombTileY, playerTileX, playerTileY, graph,Infinity, cache);
    }
    else
    {
      let cacheKey = `${zombTileX},${zombTileY},${playerTileX},${playerTileY}`;
      path = cache[cacheKey];

      if (close)
      {
        path = null;
      } else if (path == null && close == false)
      {
        return;
      }



    }

    this.#last_path = path;
    if (path) {
      const nextStep = path;

      if (nextStep.x > zombTileX) {
        this.setMoveLeftFalse();
        this.setMoveRightTrue();
      } else if (nextStep.x < zombTileX) {
        this.setMoveRightFalse();
        this.setMoveLeftTrue();
      } else {
        this.setMoveRightFalse();
        this.setMoveLeftFalse();
      }

      if (nextStep.y > zombTileY) {
        this.setMoveUpFalse();
        this.setMoveDownTrue();
      } else if (nextStep.y < zombTileY) {
        this.setMoveUpTrue();
        this.setMoveDownFalse();
      } else {
        this.setMoveUpFalse();
        this.setMoveDownFalse();
      }
    } else {
      let diff_y = this.getY() - player.getY();
      let diff_x = this.getX() - player.getX();

      if (diff_x > 1) {
        this.setMoveLeftTrue();
        this.setMoveRightFalse();
      } else if (diff_x < -1) {
        this.setMoveRightTrue();
        this.setMoveLeftFalse();
      }

      if (diff_y > 1) {
        this.setMoveUpTrue();
        this.setMoveDownFalse();
      } else if (diff_y < -1) {
        this.setMoveUpFalse();
        this.setMoveDownTrue();
      }
    }
  }
}
