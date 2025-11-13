export interface ICommand {
  execute(): void;
}

class Command implements ICommand {
  constructor() {}

  public execute(): void {}
}

class HitCommand implements ICommand {
  constructor() {}

  public execute(): void {}
}
