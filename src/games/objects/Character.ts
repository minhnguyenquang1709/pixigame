import * as PIXI from "pixi.js";
import { GameConstants } from "../GameConstants";

interface CharacterState {
  handleInput: (character: Character, event: KeyboardEvent) => void;
  update: (character: Character, delta: number) => void;
}

export class RunningState implements CharacterState {
  textures: PIXI.Texture[];
  sprite: PIXI.AnimatedSprite;

  constructor() {
    const idleTextures = [];
    for (let i = 0; i < 6; i++) {
      const texture = PIXI.Texture.from(`moving_${i}`);
      idleTextures.push(texture);
    }
    this.textures = idleTextures;
    this.sprite = new PIXI.AnimatedSprite(this.textures);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(3);
    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.1; // Adjust speed as needed
    this.sprite.play();
  }
  handleInput(character: Character, event: KeyboardEvent) {
    character.handleInput(event);
  }

  update(character: Character, delta: number) {}
}

export class IdleState implements CharacterState {
  textures: PIXI.Texture[];
  sprite: PIXI.AnimatedSprite;

  constructor() {
    const idleTextures = [];
    for (let i = 0; i < 6; i++) {
      const texture = PIXI.Texture.from(`idle_${i}`);
      idleTextures.push(texture);
    }
    this.textures = idleTextures;
    this.sprite = new PIXI.AnimatedSprite(this.textures);
    this.sprite.anchor.set(0.5);
    this.sprite.loop = true;
    this.sprite.scale.set(3);
    this.sprite.animationSpeed = 0.1; // Adjust speed as needed
    this.sprite.play();
  }
  handleInput(character: Character, event: KeyboardEvent) {
    character.handleInput(event);
  }

  update(character: Character, delta: number) {}
}

export class Character extends PIXI.Container {
  sprite: PIXI.Sprite | PIXI.AnimatedSprite;
  direction: PIXI.Point;
  keyState: { [key: string]: boolean } = {};
  velocity: PIXI.Point;
  velocityScale: number;
  stateList: { [key: string]: CharacterState };
  state: CharacterState;

  constructor() {
    super();
    this.stateList = {
      idle: new IdleState(),
      running: new RunningState(),
    };
    this.state = this.stateList.idle; // Start in idle state

    this.sprite = this.state.sprite;
    this.sprite.anchor.set(0.5);
    this.x = GameConstants.WIDTH / 2;
    this.y = GameConstants.HEIGHT / 2;
    this.addChild(this.sprite);

    this.direction = new PIXI.Point(0, 0);
    this.velocity = new PIXI.Point(0, 0);
    this.velocityScale = 300; // Adjust speed as needed
  }

  public handleInput(event: KeyboardEvent) {
    // Handle input for character movement
    // console.log("Character input event:", event.key);
    if (event.type === "keydown") {
      this.keyState[event.key] = true;
    }
    if (event.type === "keyup") {
      this.keyState[event.key] = false;
    }
    console.log("Key state:", this.keyState);

    if (this.keyState["ArrowUp"] || this.keyState["w"]) {
      this.direction.y = -1;
    } else if (this.keyState["ArrowDown"] || this.keyState["s"]) {
      this.direction.y = 1;
    } else {
      this.direction.y = 0;
    }
    if (this.keyState["ArrowLeft"] || this.keyState["a"]) {
      this.direction.x = -1;
    } else if (this.keyState["ArrowRight"] || this.keyState["d"]) {
      this.direction.x = 1;
    } else {
      this.direction.x = 0;
    }

    this.velocity.x = this.direction.x * this.velocityScale;
    this.velocity.y = this.direction.y * this.velocityScale;
  }

  update(delta: number) {
    if (
      this.keyState["ArrowUp"] ||
      this.keyState["w"] ||
      this.keyState["ArrowDown"] ||
      this.keyState["s"] ||
      this.keyState["ArrowLeft"] ||
      this.keyState["a"] ||
      this.keyState["ArrowRight"] ||
      this.keyState["d"]
    ) {
      this.x += this.velocity.x * delta;
      this.y += this.velocity.y * delta;

      // Keep character within bounds
      this.x = Math.max(
        this.width / 2,
        Math.min(GameConstants.WIDTH - this.width / 2, this.x)
      );
      this.y = Math.max(
        this.height / 2,
        Math.min(GameConstants.HEIGHT - this.height / 2, this.y)
      );
    }

    // flip
    if (this.direction.x < 0) {
      this.sprite.scale.x = -3;
    } else if (this.direction.x > 0) {
      this.sprite.scale.x = 3;
    }

    if (this.direction.x === 0 && this.direction.y === 0) {
      if (this.state !== this.stateList.idle) {
        this.switchState("idle");
      }
    } else {
      if (this.state !== this.stateList.running) {
        this.switchState("running");
      }
    }

    this.state.update(this, delta);
  }

  private switchState(newState: string) {
    this.removeChild(this.sprite);
    this.state = this.stateList[newState];

    // set the new sprite
    this.sprite = this.state.sprite;
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }
}
