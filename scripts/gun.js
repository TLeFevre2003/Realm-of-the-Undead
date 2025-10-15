import { Bullet } from "./bullet.js";

export class Gun {
  // --- Var ---

  #current_ammo; // int
  #loaded_ammo;
  #max_loaded_ammo;
  #max_ammo; // int
  #name; // str
  #damage; // int
  #bullet_duration; // double
  #bullet_count; // int - the amount of bullets spawned when fire button clicked
  #bullet_accuracy; // the lower this is the more accurate
  #fire_sfx; // filepath
  #reload_sfx; // filepath
  #sprite_left;
  #sprite_right; // filepath
  #posX;
  #posY;
  #muzzle_dist_left;
  #muzzle_dist_right;
  #bullet_speed;
  #cost = 5000;
  #upgrade = 0;
  #audio = new Audio("./assets/GunShoot.mp3");

  camera;

  #cooldown = 20;
  #cooldown_timer = 0;

  constructor(filename, camera) {
    this.camera = camera;
    this.#sprite_left = new Image();
    this.#sprite_right = new Image();

    // Start loading immediately, but don't make constructor async
    this.#loadConfig(filename);
  }

  async #loadConfig(filename) {
    try {
      console.log(
        `Loading gun config: ./configs/weaponconfigs/${filename}.json`
      );
      const response = await fetch(`./configs/weaponconfigs/${filename}.json`);
      const data = await response.json();

      this.#name = data.name;
      this.#max_ammo = data.max_ammo;
      this.#current_ammo = data.max_ammo;
      this.#damage = data.damage;
      this.#bullet_duration = data.bullet_duration;
      this.#bullet_count = data.bullet_count;
      this.#bullet_accuracy = data.accuracy;
      this.#max_loaded_ammo = data.loaded_ammo;
      this.#loaded_ammo = data.loaded_ammo;
      this.#muzzle_dist_left = data.muzzle_dist_left;
      this.#muzzle_dist_right = data.muzzle_dist_right;
      this.#bullet_speed = data.bullet_speed;
      this.#fire_sfx = data.fire_sfx;
      this.#reload_sfx = data.reload_sfx;
      this.#cost = data.cost ?? this.#cost;
      this.#cooldown = data.cooldown ?? this.#cooldown;

      this.#audio = new Audio(this.#fire_sfx);

      this.#sprite_left.src = data.sprite_left;
      this.#sprite_right.src = data.sprite_right;

      this.isLoaded = true; // mark loaded
      console.log(`Gun ${this.#name} loaded successfully.`);
    } catch (err) {
      console.error(`Failed to load gun config: ${filename}`, err);
    }
  }

  // Return the Gun X tile
  getTileX() {
    return Math.floor(this.#posX / this.camera.getTileWidth());
  }

  // Return the Gun Y tile
  getTileY() {
    return Math.floor(this.#posY / this.camera.getTileWidth());
  }
  getCost() {
    return this.#cost;
  }
  upgrade() {
    this.#max_ammo *= 2;
    this.#damage *= 1.3;
    this.#bullet_duration *= 1.1;
  }

  // --- methods ---

  // --getters--
  getName() {
    return this.#name;
  }

  getDamage() {
    return this.#damage;
  }

  getBulletDuration() {
    return this.#bullet_duration;
  }

  getBulletCount() {
    return this.#bullet_count;
  }
  getFireSfx() {
    return this.#fire_sfx;
  }

  getReloadSfx() {
    return this.#reload_sfx;
  }

  getSpriteLeft() {
    return this.#sprite_left;
  }
  getSpriteRight() {
    return this.#sprite_right;
  }

  getAmmo() {
    return this.#current_ammo;
  }
  getMaxAmmo() {
    return this.#max_ammo;
  }

  // --setters--
  removeAmmo(casing) {
    casing -= this.#current_ammo;
  }

  refillAmmo() {
    this.#current_ammo = this.#max_ammo;
  }

  reload() {
    const ammoDifference = this.#max_loaded_ammo - this.#loaded_ammo;

    if (this.#current_ammo > 0) {
      if (ammoDifference > 0) {
        this.#loaded_ammo += Math.min(ammoDifference, this.#current_ammo);
        this.#current_ammo -= Math.min(ammoDifference, this.#current_ammo);
      }
    }
  }

  updateCoolDown() {
    this.#cooldown_timer += 1;
  }

  // Shoots the gun
  shoot(bullets, player, camera, angle) {
    // Calculate the angle between the shooter and the mouse position

    if (this.#loaded_ammo > 0 && this.#cooldown_timer >= this.#cooldown) {
      // Create an Audio object with an M4A file
      this.#cooldown_timer = 0;
      // Play the sound
      this.#audio.pause();
      this.#audio.currentTime = 0;
      this.#audio.play();

      this.#loaded_ammo -= 1;

      for (let i = 0; i < this.#bullet_count; i++) {
        let angle_offset =
          Math.random() * (this.#bullet_accuracy + this.#bullet_accuracy) -
          this.#bullet_accuracy;

        let bullet;

        bullet = new Bullet(
          10,
          player.getX() + 8 * this.camera.getScale(),
          player.getY() + 8 * this.camera.getScale(),
          angle + angle_offset,
          this.#damage,
          this.#bullet_speed,
          this.camera
        );

        // Create a new bullet object with the calculated angle

        // Push the bullet into the bullets array
        let xindex = this.getTileX();
        let yindex = this.getTileY();

        console.log("X index: " + xindex);
        console.log("Y index: " + yindex);

        bullets[xindex][yindex].push(bullet);
      }
    }
  }

  // updates the gun position
  updatePos(player, camera) {
    this.#posX = player.getX() - 4;
    this.#posY = player.getY() + 4;
  }

  // Draws the gun and displays how much ammo it has
  draw(player, camera) {
    let x = camera.getObjectScreenPositionX(player.getX(), this.#posX);
    let y = camera.getObjectScreenPositionY(player.getY(), this.#posY);

    let playerx = camera.getPlayerScreenPositionX(player.getX());

    let scale = camera.getScale();

    let ctx = camera.getCanvas();

    // gets the mouses' x position relitive to the player
    let direction = player.getDirectionX(playerx);

    // x-3,y for facing and aiming left
    // x+18,y for facing and aiming right
    //changes the gun sprite and position based on the direction given by whereIsMouseX

    // ctx.drawImage(this.#sprite_left, x - 5, y + 2); Commented out so only the gun UI is drawn because gun is now drawn with player.

    let fontSize = 10 * scale;
    ctx.font = `${fontSize}px serif`;

    // ctx.font = "10px serif";
    let ammoCount =
      this.#loaded_ammo.toString() + "  " + this.#current_ammo.toString();

    // Draw black border for name text
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2; // Adjust the border thickness as needed
    ctx.strokeText(this.#name, 220 * scale, 110 * scale);

    // Draw white fill for name text
    ctx.fillStyle = "white";
    ctx.fillText(this.#name, 220 * scale, 110 * scale);

    // Draw black border for ammo count text
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2; // Adjust the border thickness as needed
    ctx.strokeText(ammoCount, 220 * scale, 120 * scale);

    // Draw white fill for ammo count text
    ctx.fillStyle = "white";
    ctx.fillText(ammoCount, 220 * scale, 120 * scale);
  }
}
