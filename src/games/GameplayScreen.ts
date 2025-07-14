import { BaseScreen } from "./BaseScreen";
import * as PIXI from "pixi.js";
import { Ground } from "./objects/Ground";
import { Character } from "./objects/Character";

export class GameplayScreen extends BaseScreen {
  app: PIXI.Application;
  character: Character;
  bg: Ground;
  handleInputBound(event: KeyboardEvent): void;

  constructor(app: PIXI.Application) {
    super();
    this.app = app; // Store the PIXI application instance

    this.handleInputBound = this.handleInput.bind(this); // Bind the input handler

    this.initBackground();
    this.initCharacter();
    this.initEvents();
  }

  initBackground() {
    const bg = new Ground();
    this.bg = bg; // Store the background reference
    this.addChild(bg);
  }

  initCharacter() {
    // const characterTexture = PIXI.Assets.get("bunny"); // Load your character texture
    // const character = new PIXI.Sprite({
    //   texture: characterTexture,
    // });
    // character.anchor.set(0.5);
    // character.x = GameConstants.WIDTH / 2; // Center the character
    // character.y = GameConstants.HEIGHT / 2; // Center the character

    const character = new Character();
    this.character = character; // Store the character reference
    this.addChild(character);
  }

  initEvents() {
    this.eventMode = "static";

    window.addEventListener("keydown", this.handleInputBound);
    window.addEventListener("keyup", this.handleInputBound);
  }

  handleInput(event: KeyboardEvent): void {
    // Handle keyboard input for character movement
    console.log("Input event:", event.key);
    if (this.character) {
      this.character.handleInput(event);
    }
  }

  pause() {
    if (!this.app.ticker.started) {
      return;
    }
    this.app.ticker.stop(); // Stop the PIXI application ticker
    console.log("Game paused");
  }

  resume() {
    if (this.app.ticker.started) {
      return;
    }
    this.app.ticker.start(); // Start the PIXI application ticker
    console.log("Game resumed");
  }

  public update(_delta: number) {
    // Custom update logic for the gameplay screen
    // This method will be called every frame by the PIXI application
    this.children.forEach((child) => {
      child.update(_delta);
    });
  }

  destroy(options?: PIXI.DestroyOptions): void {
    super.destroy(options);
    this.eventMode = "none"; // Disable event handling

    window.removeEventListener("keydown", this.handleInputBound);
    window.removeEventListener("keyup", this.handleInputBound);

    console.log("GameplayScreen destroyed");
  }
}
