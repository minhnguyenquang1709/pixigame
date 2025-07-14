import { useRef } from "react";
import { usePixiApplication } from "../hooks/usePixiApplication";

/**
 * The game container, encapsulate the game app, game overlay.
 * Write the game overlay in a separate component.
 */
export const GameScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { score, gameplay, pauseGame, resumeGame, destroyGame } =
    usePixiApplication(canvasRef);

  return (
    <div className="absolute size-full flex flex-col items-center justify-center bg-amber-300">
      <canvas className="size-full max-w-2xl outline-none" ref={canvasRef} />
      <GameOverlay
        score={score}
        gameplay={gameplay}
        pauseGame={pauseGame}
        resumeGame={resumeGame}
        destroyGame={destroyGame}
      />
    </div>
  );
};

/**
 * Display the game overlay, such as the score, time, buttons, etc.
 */
const GameOverlay = (props) => {
  return (
    <div className="absolute size-full flex flex-col place-items-center">
      <h1 className="text-2xl font-bold text-white">Game Overlay</h1>
      <p className="text-lg text-white">Score: {props.score}</p>
      <button
        className="w-fit h-8 flex place-items-center"
        onClick={props.pauseGame}
      >
        Pause
      </button>
      <button
        className="w-fit h-8 flex place-items-center"
        onClick={props.resumeGame}
      >
        Resume
      </button>
      <button
        className="w-fit h-8 flex place-items-center"
        onClick={props.destroyGame}
      >
        Destroy
      </button>
    </div>
  );
};
