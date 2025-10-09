import { PIXI } from "../types";
import { ICommand } from "../types/command";

class Command implements ICommand {
  private _actor: any;
  constructor(actor: any) {
    this._actor = actor;
  }

  public execute(): void {}
}

class MoveCommand extends Command {
  private _direction: PIXI.Point;

  constructor(actor: any, direction: PIXI.Point) {
    super(actor);
    this._direction = direction;
  }

  public execute(): void {
    this._actor.move();
  }
}

class CommandProcessor {
  private static _instance: CommandProcessor;
  private _commandQueue: ICommand[] = [];

  private constructor() {}

  public static getInstance(): CommandProcessor {
    if (!this._instance) {
      this._instance = new CommandProcessor();
    }
    return this._instance;
  }
}

export const commandProcessor = CommandProcessor.getInstance();
