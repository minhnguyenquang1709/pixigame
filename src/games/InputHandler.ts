import { ICommand } from "./Command";

export const isPressed = (event: UIEvent): boolean => {
  return event.type === "keydown";
};

export class InputHandler {
  private buttonUp: ICommand;
  private buttonDown: ICommand;
  private buttonLeft: ICommand;
  private buttonRight: ICommand;

  private static _instance: InputHandler;

  public keyState: Map<string, boolean> = new Map();

  private constructor() {}
  public static getInstance(): InputHandler {
    if (!InputHandler._instance) {
      InputHandler._instance = new InputHandler();
    }
    return InputHandler._instance;
  }

  public handleInput(event: KeyboardEvent): void {
    const eventCode = event.code || event.key.toLowerCase();
    if (event.type === "keydown") {
      this.keyState.set(eventCode, true);
    }
    if (event.type === "keyup") {
      this.keyState.set(eventCode, false);
    }

    if (isPressed(event) && eventCode === "ArrowUp") {
    }
  }
}
