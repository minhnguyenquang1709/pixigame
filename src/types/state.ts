import * as PIXI from "pixi.js";

export interface IState {
  enter: () => void;
  update: (delta: number) => void;
  exit: () => void;
}

export interface IRenderableState extends IState {
  sprite: PIXI.Sprite | PIXI.AnimatedSprite;
}

export enum EPlayerState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
}
