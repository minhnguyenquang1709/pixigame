import { BaseScreen } from "./BaseScreen";
import * as PIXI from "pixi.js";
import { Ground } from "./objects/Ground";
import { Character } from "./objects/Character";
import { InputSystemLogger } from "../utils/logger";

export class GameplayScreen extends BaseScreen {
  app: PIXI.Application;
  character: Character;
  bg: Ground;

  constructor(app: PIXI.Application) {
    super();
    this.app = app; // Store the PIXI application instance

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

    window.addEventListener("keydown", this.handleInput.bind(this));
    window.addEventListener("keyup", this.handleInput.bind(this));
  }

  handleInput(event: KeyboardEvent): void {
    // Handle keyboard input for character movement
    if (this.character) {
      this.character.handleInput(event);
    }
  }

  pause() {
    if (!this.app.ticker.started) {
      return;
    }
    this.app.ticker.stop(); // Stop the PIXI application ticker
    InputSystemLogger.log("Game paused");
  }

  resume() {
    if (this.app.ticker.started) {
      return;
    }
    this.app.ticker.start(); // Start the PIXI application ticker
    InputSystemLogger.log("Game resumed");
  }

  public update(delta: number) {
    this.character.update(delta);
    this.bg.update(delta);
  }

  destroy(options?: PIXI.DestroyOptions): void {
    super.destroy(options);
    this.character.destroy(options);
    this.bg.destroy(options);
    this.eventMode = "none"; // Disable event handling

    window.removeEventListener("keydown", this.handleInput.bind(this));
    window.removeEventListener("keyup", this.handleInput.bind(this));

    console.log("GameplayScreen destroyed");
  }
}
