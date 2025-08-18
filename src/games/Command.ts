export interface ICommand{
  execute(): void;
}

class Command implements ICommand {
  constructor(){}

  public execute(): void {
    
  }
}

class HitCommand extends Command{
  constructor() {
    super();
  }

  public execute(): void {
    
  }
}