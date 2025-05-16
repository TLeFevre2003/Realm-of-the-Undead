export class Bullet {
  #duration;
  posX;
  posY;
  speed = 1;
  angle;
  time = 0;
  alive = true;
  damage;
  camera;

  constructor(duration_in, x, y, angle, damage, speed, camera) {
    this.#duration = duration_in;
    this.posX = x;
    this.posY = y;
    this.angle = angle;
    this.damage = damage;
    this.speed = speed;
    this.camera = camera
  }

  // Returns the bullet damage
  getDamage() {
    if (this.alive) {
      return this.damage;
    }
    return 0;
  }

  // returns the bullet radius
  getRadius() {
    return 1;
  }

  // Returns bullet x position
  getX() {
    return this.posX;
  }

  // Returns bullet y position
  getY() {
    return this.posY;
  }

  // returns bullet X tile
  getTileX(offset = 0) {
    return Math.floor((this.posX + offset) / this.camera.getTileWidth());
  }

  // returns bullet Y tile
  getTileY(offset = 0) {
    return Math.floor((this.posY + offset) / this.camera.getTileWidth());
  }

  // moves the bullet
  move() {
    this.posX += Math.cos(this.angle) * this.speed * this.camera.getScale();
    this.posY += Math.sin(this.angle) * this.speed * this.camera.getScale();
    this.time += 0.15;
    if (this.time > this.#duration) {
      this.alive = false;
    }
  }

  // Returns true until the bullet duration is up or it hits a zombie
  getStatus() {
    return this.alive;
  }

  // Destroy the bullet
  kill() {
    this.alive = false;
  }

  // Draws the bullet
  draw(camera, player) {
    let ctx = camera.getCanvas();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 0.1 * this.camera.getScale();
    ctx.beginPath();

    let x = camera.getObjectScreenPositionX(player.getX(), this.posX);
    let y = camera.getObjectScreenPositionY(player.getY(), this.posY);

    ctx.arc(x, y, 1 * this.camera.getScale(), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke(); // Draw the border
  }
}
