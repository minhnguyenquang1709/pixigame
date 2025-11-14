import * as PIXI from "pixi.js";
import { GameConstants } from "../GameConstants";
import { InputSystemLogger } from "../../utils/logger";
import { EPlayerState, IRenderableState, IState } from "../../types/state";
import { IStateMachine, StateMachine } from "../../systems/StateMachine";
import { BaseGameObject } from "./BaseGameObject";
import { SpriteController } from "../../systems/SpriteController";

export class RunningState implements IState {
  textures: PIXI.Texture[];
  sprite: PIXI.AnimatedSprite;

  constructor() {
    const runningTextures = [];
    for (let i = 0; i < 6; i++) {
      const texture = PIXI.Texture.from(`moving_${i}`);
      runningTextures.push(texture);
    }
    this.textures = runningTextures;
    this.sprite = new PIXI.AnimatedSprite(this.textures);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(3);
    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.1;

    this.enter();
  }
  enter() {
    this.sprite.play();
  }
  update(delta: number) {}
  exit() {}
}

export class IdleState implements IRenderableState {
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
    this.sprite.animationSpeed = 0.1;

    this.enter();
  }
  enter() {
    this.sprite.play();
  }
  update(delta: number) {}

  exit() {}
}

export class Character extends BaseGameObject {
  direction: PIXI.Point;
  keyState: { [key: string]: boolean } = {};
  velocity: PIXI.Point;
  velocityScale: number;
  stateMachine: IStateMachine;
  spriteController: SpriteController;

  constructor() {
    super();
    this.stateMachine = new StateMachine({
      [EPlayerState.IDLE]: new IdleState(),
      [EPlayerState.RUNNING]: new RunningState(),
    });
    this.spriteController = new SpriteController(this, this.stateMachine);

    this.direction = new PIXI.Point(0, 0);
    this.velocity = new PIXI.Point(0, 0);
    this.velocityScale = 300;

    const currentState = this.stateMachine.currentState;
  }

  public handleInput(event: KeyboardEvent) {
    // Handle input for character movement
    const eventCode = event.code || event.key.toLowerCase();
    if (event.type === "keydown") {
      this.keyState[eventCode] = true;
    }
    if (event.type === "keyup") {
      this.keyState[eventCode] = false;
    }
    InputSystemLogger.log("Key state:", this.keyState);

    if (this.keyState["ArrowUp"] || this.keyState["KeyW"]) {
      this.direction.y = -1;
    } else if (this.keyState["ArrowDown"] || this.keyState["KeyS"]) {
      this.direction.y = 1;
    } else {
      this.direction.y = 0;
    }
    if (this.keyState["ArrowLeft"] || this.keyState["KeyA"]) {
      this.direction.x = -1;
    } else if (this.keyState["ArrowRight"] || this.keyState["KeyD"]) {
      this.direction.x = 1;
    } else {
      this.direction.x = 0;
    }

    this.velocity.x = this.direction.x * this.velocityScale;
    this.velocity.y = this.direction.y * this.velocityScale;
  }

  private _move(velocity: PIXI.Point) {}

  update(delta: number) {
    if (
      this.keyState["ArrowUp"] ||
      this.keyState["KeyW"] ||
      this.keyState["ArrowDown"] ||
      this.keyState["KeyS"] ||
      this.keyState["ArrowLeft"] ||
      this.keyState["KeyA"] ||
      this.keyState["ArrowRight"] ||
      this.keyState["KeyD"]
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

    if (this.direction.x === 0 && this.direction.y === 0) {
      this.stateMachine.switchState(EPlayerState.IDLE);
      this.spriteController.syncWithCurrentState();
    } else {
      this.stateMachine.switchState(EPlayerState.RUNNING);
      this.spriteController.syncWithCurrentState();
    }

    this.stateMachine.update(delta);
  }
}
