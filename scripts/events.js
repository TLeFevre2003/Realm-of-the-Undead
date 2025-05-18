import { Game } from "./game.js";
import { EventHandler } from "./eventhandler.js";
import { Map } from "./map.js";

const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize map
let map = new Map();

// Wait for the map to finish loading before starting the game loop
map.loadMap().then(() => {
  console.log("map loaded");

  const gameInstance = new Game(map); // Create an instance of the Game class
  console.log("Game loaded");

  const eventHandler = new EventHandler();
  console.log("Events loaded");

  
  setInterval(() => {
    gameInstance.gameLoop();
    eventHandler.updateGamepadInput(gameInstance.player, map, gameInstance);
  }, 8.333);

  document.addEventListener("keydown", (event) => {
    eventHandler.handleKeyDown(event, gameInstance.player, map, gameInstance);
  });

  document.addEventListener("keyup", (event) => {
    eventHandler.handleKeyUp(event, gameInstance.player);
  });

  document.querySelector("#myCanvas").addEventListener("mousedown", (event) => {
    eventHandler.handleClick(event, gameInstance);
  });

  document.querySelector("#myCanvas").addEventListener("mousemove", (event) => {
    eventHandler.setMousePosition(event, gameInstance.player, gameInstance);
  });

  document
    .querySelector("#myCanvas")
    .addEventListener("contextmenu", function (event) {
      // Prevent the default right-click menu from appearing
      event.preventDefault();
    });

  window.addEventListener("gamepadconnected", (event) => {
    eventHandler.handleGamepadConnected(event);
  });

  window.addEventListener("gamepaddisconnected", (event) => {
    eventHandler.handleGamepadDisconnected(event);
  });
});
