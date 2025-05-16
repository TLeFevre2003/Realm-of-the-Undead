const ORIGINALTILEWIDTH = 32
const ORIGINALSCREENWIDTH = 256

const PLAYEROFFSET = 8 // the radius of player is 16 so offset is half

export class Camera {
  #pixelWidth;
  #pixelHeight;
  #screenHeight;
  #screenWidth;
  #halfScreenWidth;
  #rightSide;
  #halfScreenHeight;
  #bottomSide;
  canvas;
  #numTilesWide;
  #numTilesTall;
  #Scale;
  #widthOfTile;
  #playerOffset;
  

  // width and height are number of tiles
  constructor(width, height) {

    // Get the 2d context to draw on.
    this.canvas = document.querySelector("#myCanvas").getContext("2d");

    // Set the screens width and height in pixels based on the canvas.
    let canvElm = document.querySelector("#myCanvas");
    this.#screenHeight = canvElm.height;
    this.#screenWidth = canvElm.width;
    
    // Set the number of tiles wide and tall of the map.
    this.#numTilesWide = width;
    this.#numTilesTall = height;

    // Find the pixel size of a tile.
    this.#Scale = this.#screenWidth / ORIGINALSCREENWIDTH // eg 512 / 256 = 2. This is based on 256 being the original width.
    this.#widthOfTile = ORIGINALTILEWIDTH * this.#Scale // 32 is original tile size

    // Find the number of pixels wide and tall the map is.
    this.#pixelWidth = this.#numTilesWide * this.#widthOfTile;
    this.#pixelHeight = this.#numTilesTall * this.#widthOfTile;

    // Find half the screen sizes
    this.#halfScreenWidth = this.#screenWidth / 2;
    this.#rightSide = this.#pixelWidth - this.#halfScreenWidth;

    this.#halfScreenHeight = this.#screenHeight / 2;
    this.#bottomSide = this.#pixelHeight - this.#halfScreenHeight;

    // Find player Offset
    this.#playerOffset = PLAYEROFFSET * this.#Scale
  }

  // gets the x screen position of the player
  getPlayerScreenPositionX(x) {
    if (x < this.#halfScreenWidth) {
      return Math.floor(x) - this.#playerOffset;
    }
    if (x > this.#rightSide) {
      let xpos = this.#halfScreenWidth + (x - this.#rightSide);
      return Math.floor(xpos) - this.#playerOffset;
    }

    return Math.floor(this.#halfScreenWidth) - this.#playerOffset;
  }

  // Gets the y screen position of the player
  getPlayerScreenPositionY(y) {

    if (y < this.#halfScreenHeight) {
      return Math.floor(y) - this.#playerOffset;
    }

    if (y > this.#bottomSide) {
      let ypos = this.#halfScreenHeight + (y - this.#bottomSide);
      return Math.floor(ypos) - this.#playerOffset;
    }

    return Math.floor(this.#halfScreenHeight) - this.#playerOffset;
  }

  // gets the X position that the left column of tiles start drawing on.
  getMapScreenPositionX(playerX) {
    if (playerX < this.#halfScreenWidth) {
      return 0.0;
    }
    if (playerX > this.#rightSide) {
      return 0.0;
    }
    return -1.0 * (playerX % this.#widthOfTile);
  }

  getMapScreenPositionY(playerY) {
    const tileSize = this.#widthOfTile;
    const totalMapHeight = this.#numTilesTall * tileSize;
    const screenHeight = this.#screenHeight;
  
    // Calculate unclamped camera position
    let cameraY = playerY - this.#halfScreenHeight;
  
    // Clamp cameraY so it never scrolls past map bounds
    cameraY = Math.max(0, Math.min(cameraY, totalMapHeight - screenHeight));
  
    // Compute top tile index
    const topTileIndex = Math.floor(cameraY / tileSize);
    const topTilePixelY = topTileIndex * tileSize;
  
    // Smooth offset within tile (always between -tileSize and 0)
    const offset = -(cameraY - topTilePixelY);
  
    return offset;
  }
  
  // Returns the left X index for drawing the map
  getMapXIndex(playerX) {
    if (playerX < this.#halfScreenWidth) {
      return 0;
    }
    let x = Math.floor(playerX / this.#widthOfTile - 4);
    if (x > this.#numTilesWide - 8) {
      x = this.#numTilesWide - 8;
    }
    return x;
  }
// Returns the top Y index for drawing the map
getMapYIndex(playerY) {
  const tileSize = this.#widthOfTile;

  if (playerY < this.#halfScreenHeight) {
    return 0;
  }

  const cameraY = playerY - this.#halfScreenHeight;
  let topTileIndex = Math.floor(cameraY / tileSize);

  const tilesOnScreen = Math.ceil(this.#screenHeight / tileSize);
  const maxTopTileIndex = this.#numTilesTall - tilesOnScreen;

  if (topTileIndex > maxTopTileIndex) {
    topTileIndex = maxTopTileIndex;
  }

  return topTileIndex;
}



  // Gets the screen X position for an item should work for both bullets and zombies.
  getObjectScreenPositionX(playerX, objectX) {
    let playerScreenX = this.getPlayerScreenPositionX(playerX);

    let entityScreenX = playerScreenX - (playerX - objectX);

    return entityScreenX;
  }

  // Gets the screen Y position for an item should work for both bullets and zombies.
  getObjectScreenPositionY(playerY, objectY) {
    let playerScreenY = this.getPlayerScreenPositionY(playerY);

    let entityScreenY = playerScreenY - (playerY - objectY);

    return entityScreenY;
  }

  // returns the canvas so it can be drawn on
  getCanvas() {
    return this.canvas;
  }

  // clears the screen for the next frame
  clearScreen() {
    this.canvas.clearRect(0, 0, this.#screenWidth, this.#screenHeight);
  }

  getTileWidth()
  {
    return this.#widthOfTile
  }

  getScale()
  {
    return this.#Scale
  }

  getScreenWidth()
  {
    return this.#screenWidth
  }

  getScreenHeight()
  {
    return this.#screenHeight
  }
}
