import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { GameConstants } from "../games/GameConstants";
import { GameplayScreen } from "../games/GameplayScreen";

export const usePixiApplication = (
  canvasRef: React.RefObject<PIXI.ICanvas | undefined>
) => {
  const gameplay = useRef<GameplayScreen>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas ref is not available.");
      return;
    }

    const app = new PIXI.Application();
    const init = async () => {
      await app.init({
        width: GameConstants.WIDTH, // game world width
        height: GameConstants.HEIGHT,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        canvas: canvasRef.current,
        backgroundColor: 0xff0000,
      });

      await PIXI.Assets.load({
        alias: "bunny",
        src: "https://pixijs.com/assets/bunny.png",
      });

      // load assets
      PIXI.Assets.load({ alias: "texture", src: "texture.json" });
      PIXI.Assets.load({ alias: "anim_moving", src: "atlas/anim_moving.json" }); // Load character spritesheet
      PIXI.Assets.load({ alias: "anim_idle", src: "atlas/anim_idle.json" }); // Load character spritesheet
      await PIXI.Assets.load("texture");
      await PIXI.Assets.load("anim_moving");
      await PIXI.Assets.load("anim_idle");
      console.log("Assets loaded");

      const gamePlayScreen = new GameplayScreen(app);
      gameplay.current = gamePlayScreen;
      app.stage.addChild(gamePlayScreen);

      app.ticker.add((ticker: PIXI.Ticker) => {
        gamePlayScreen.update(ticker.deltaMS / 1000);
      });
    };

    init();

    // cleanup
    return () => {
      // call application destroy method if it exists
      app.destroy(true, { children: true });
      gameplay.current = null;
      canvasRef.current = undefined;
    };
  }, []);

  // return to parent component
  return {
    // any necessary state or functions
    score: 0,
    gameplay: gameplay,
    pauseGame: () => {
      gameplay.current?.pause();
    },
    resumeGame: () => {
      gameplay.current?.resume();
    },
    destroyGame: () => {
      gameplay.current?.destroy(true);
    },
  };
};
