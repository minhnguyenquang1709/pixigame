import * as PIXI from "pixi.js";
import { GameConstants } from "../GameConstants";

export class Ground extends PIXI.Container {
  sprite: PIXI.TilingSprite;

  constructor() {
    super();

    const texture = PIXI.Assets.get("background");
    if (!texture) {
      throw new Error("Background texture not found");
    }

    // console.log("Texture info:", {
    //   width: texture.width,
    //   height: texture.height,
    //   baseTexture: texture.baseTexture.width + "x" + texture.baseTexture.height,
    //   frame: texture.frame,
    // });

    this.sprite = new PIXI.TilingSprite(texture);
    this.sprite.setSize(GameConstants.WIDTH, GameConstants.HEIGHT);
    // this.sprite.height = GameConstants.HEIGHT;
    this.sprite.anchor.set(0.5);

    const scaleX = GameConstants.WIDTH / texture.width;
    const scaleY = GameConstants.HEIGHT / texture.height;
    this.sprite.tileScale.set(scaleX, scaleY);
    // this.sprite.applyAnchorToTexture = true;
    this.sprite.x = GameConstants.WIDTH / 2;
    this.sprite.y = GameConstants.HEIGHT / 2;
    this.addChild(this.sprite);
  }

  update(delta: number) {
    this.sprite.tilePosition.y += 200 * delta;
  }
}
