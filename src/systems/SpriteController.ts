import { BaseGameObject } from "../game/objects/BaseGameObject";
import { IRenderableState } from "../types/state";
import { IStateMachine } from "./StateMachine";
import * as PIXI from "pixi.js";

/**
 * Control the rendering of sprite based on the state machine's current state.
 */
export class SpriteController {
  private _host: BaseGameObject;
  private _stateMachine: IStateMachine;
  private _currentSprite: PIXI.Sprite | PIXI.AnimatedSprite | null = null;

  constructor(host: BaseGameObject, stateMachine: IStateMachine) {
    this._host = host;
    this._stateMachine = stateMachine;

    this.syncWithCurrentState();
  }

  /**
   * Sync the host's sprite with the current state's sprite.
   * Call after state changes.
   */
  public syncWithCurrentState(): void {
    const state = this._stateMachine.currentState;

    // remove current sprite if the next state is not renderable
    if (!state || !("sprite" in state)) {
      if (this._currentSprite) {
        this._host.removeChild(this._currentSprite);
        this._currentSprite = null;
      }

      return;
    }

    const renderableState = state as IRenderableState;
    const newSprite = renderableState.sprite;

    if (this._currentSprite == newSprite) {
      return;
    }

    if (this._currentSprite) {
      this._host.removeChild(this._currentSprite);
    }

    this._host.addChild(newSprite);
    this._currentSprite = newSprite;
  }
}
