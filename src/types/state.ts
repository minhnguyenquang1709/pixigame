export interface IState {
  enter: () => void;
}

export enum EPlayerState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
}
