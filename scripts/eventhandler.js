export class EventHandler {
  constructor() {
    this.upKey = "w";
    this.downKey = "s";
    this.leftKey = "a";
    this.rightKey = "d";
    this.reloadkey = "r";
    this.gun1Key = "1";
    this.gun2Key = "2";
    this.spawnZombieKey = "z";
    this.mouseButton = null;
    this.interactKey = "f";
    this.movementSpeed = 1;
    this.pauseKey = "p";
    this.movementInterval = null;
    this.controllerIndex = null;
  }

  // Handles when Keys are pressed
  handleKeyDown(event, player, map, game) {
    let key = event.key;
    if (event.repeat) return; // If the key is being held down and repeating, ignore the event

    switch (key) {
      case this.upKey:
        player.setMoveUpTrue();
        break;
      case this.leftKey:
        player.setMoveLeftTrue();
        break;
      case this.rightKey:
        player.setMoveRightTrue();
        break;
      case this.downKey:
        player.setMoveDownTrue();
        break;
      case this.reloadkey:
        player.reload();
        break;
      case this.gun1Key:
        player.switchActiveGun(1);
        break;
      case this.gun2Key:
        player.switchActiveGun(2);
        break;
      case this.interactKey:
        player.interact(map);
        break;
      case this.pauseKey:
        game.togglePause();
        break;
      default: // Handle unexpected keys
        console.log(`Unrecognized key pressed: ${key}`); // Optional logging
        break;
    }
  }

  // Handles when keys are released
  handleKeyUp(event, player) {
    let key = event.key;
    if (event.repeat) return; // If the key is being held down and repeating, ignore the event

    if (key == this.upKey) {
      player.setMoveUpFalse();
    }

    if (key == this.leftKey) {
      player.setMoveLeftFalse();
    }

    if (key == this.rightKey) {
      player.setMoveRightFalse();
    }

    if (key == this.downKey) {
      player.setMoveDownFalse();
    }
  }

  // Handles When mouse is clicked
  handleClick(event, game) {
    // sets the canvas to rect
    const rect = event.target.getBoundingClientRect();
    // gets the height and width of canvas
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    // gets the mouse position by subtracting the canvas position from the mouse position
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    let camera = game.getCamera()
    let scale = camera.getScale()

    let x = camera.getPlayerScreenPositionX(game.player.getX()) + 8 * scale;
    let y = camera.getPlayerScreenPositionY(game.player.getY()) + 8 * scale;

    let deltaX = mouseX - x;
    let deltaY = mouseY - y;

    let angle = Math.atan2(deltaY, deltaX);

    game.player.shoot(game.bullets, game.getCamera(), angle);
  }

  // Sets the mouse position when it is moved
  setMousePosition(event, player, game) {
    // sets the canvas to rects
    const rect = event.target.getBoundingClientRect();
    // gets the height and width of canvas
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    // gets the mouse position by subtracting the canvas position from the mouse position
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    let camera = game.getCamera()
    let scale = camera.getScale()

    let x = camera.getPlayerScreenPositionX(game.player.getX()) + 8 * scale;
    let y = camera.getPlayerScreenPositionY(game.player.getY()) + 8 * scale;

    // let angle = Math.atan2(deltaY, deltaX);

    let deltaX = mouseX - x;
    let deltaY = mouseY - y;

    player.setDirection(deltaX, deltaY);

    // console.log(mouseX, mouseY);
  }

  // Handle controller connection
  handleGamepadConnected(event) {
    this.controllerIndex = event.gamepad.index;
    console.log(`Gamepad connected at index ${this.controllerIndex}: ${event.gamepad.id}`);
  }

  // Handle controller disconnection
  handleGamepadDisconnected(event) {
    if (this.controllerIndex === event.gamepad.index) {
      this.controllerIndex = null;
    }
    console.log(`Gamepad disconnected from index ${event.gamepad.index}: ${event.gamepad.id}`);
  }

  // Update controller input
  updateGamepadInput(player, map, game) {
    if (this.controllerIndex !== null) {
      const gamepad = navigator.getGamepads()[this.controllerIndex];
      if (gamepad) {
        // Axes
        const leftStickX = gamepad.axes[0]; // Left stick horizontal
        const leftStickY = gamepad.axes[1]; // Left stick vertical
        const rightStickX = gamepad.axes[2]; // Right stick horizontal
        const rightStickY = gamepad.axes[3]; // Right stick vertical

        // Buttons
        const buttonA = gamepad.buttons[0].pressed; // Cross/A
        const buttonB = gamepad.buttons[1].pressed; // Circle/B
        const buttonX = gamepad.buttons[2].pressed; // Square/X
        const buttonY = gamepad.buttons[3].pressed; // Triangle/Y
        const leftBumper = gamepad.buttons[4].pressed; // L1/LB
        const rightBumper = gamepad.buttons[5].pressed; // R1/RB
        const leftTrigger = gamepad.buttons[6].pressed; // L2/LT
        const rightTrigger = gamepad.buttons[7].pressed; // R2/RT
        const selectButton = gamepad.buttons[8].pressed; // Select/Back
        const startButton = gamepad.buttons[9].pressed; // Start
        const leftStickButton = gamepad.buttons[10].pressed; // L3
        const rightStickButton = gamepad.buttons[11].pressed; // R3
        const dpadUp = gamepad.buttons[12].pressed; // D-Pad Up
        const dpadDown = gamepad.buttons[13].pressed; // D-Pad Down
        const dpadLeft = gamepad.buttons[14].pressed; // D-Pad Left
        const dpadRight = gamepad.buttons[15].pressed; // D-Pad Right
        const homeButton = gamepad.buttons[16]?.pressed; // Home button (if present)

        if (rightStickX != 0 || rightStickY != 0)
          {
            player.setDirection(rightStickX, rightStickY);
          }

        // Movement using D-Pad or left stick
        if (dpadUp || leftStickY < -0.5) {
          player.setMoveUpTrue();
        } else {
          player.setMoveUpFalse();
        }

        if (dpadDown || leftStickY > 0.5) {
          player.setMoveDownTrue();
        } else {
          player.setMoveDownFalse();
        }

        if (dpadLeft || leftStickX < -0.5) {
          player.setMoveLeftTrue();
        } else {
          player.setMoveLeftFalse();
        }

        if (dpadRight || leftStickX > 0.5) {
          player.setMoveRightTrue();
        } else {
          player.setMoveRightFalse();
        }

        // Actions
        if (buttonY) { // Reload (Triangle/Y)
          player.reload();
        }

        if (leftBumper) { // Switch to gun 1 (L1/LB)
          player.switchActiveGun(1);
        }

        if (rightBumper) { // Switch to gun 2 (R1/RB)
          player.switchActiveGun(2);
        }

        if (buttonA) { // Interact (Cross/A)
          player.interact(map);
        }

        // Additional placeholders for other buttons and joysticks
        if (buttonB) {
          // Add functionality for Circle/B button
        }

        if (buttonX) {
          // Add functionality for Square/X button
        }

        if (leftTrigger) {
          // Add functionality for L2/LT trigger
        }

        if (rightTrigger) {
          // Add functionality for R2/RT trigger
          let angle = Math.atan2(rightStickY, rightStickX);

          game.player.shoot(game.bullets, game.getCamera(), angle);
        }

        if (selectButton) {
          // Add functionality for Select/Back button
        }

        if (startButton) {
          // Add functionality for Start button
        }

        if (leftStickButton) {
          // Add functionality for L3 button
        }

        if (rightStickButton) {
          // Add functionality for R3 button
        }

        if (homeButton) {
          // Add functionality for Home button (if present)
        }

        // Joystick movement or other functionality using right stick
        if (rightStickX !== 0 || rightStickY !== 0) {
          // Add functionality for right stick movement
        }
      }
    }
  }
}
