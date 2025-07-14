import * as PIXI from "pixi.js";
export class BaseScreen extends PIXI.Container {
  constructor() {
    super();
  }

  /**
   * 
   * @param _delta - The time elapsed since the last frame in seconds.
   */
  public update(_delta: number) {
    // Custom update logic can be implemented in subclasses
  }
}
