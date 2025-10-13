import { EPlayerState, IState } from "../../types/state";

interface IStateMachine {
  switchState(stateKey: EPlayerState): void;
}

export class StateMachine implements IStateMachine {
  private _currentState: IState;
  private _states: Map<EPlayerState, IState> = new Map();

  constructor(states: IState[]) {
    this._states.set(EPlayerState.IDLE, new );
    this._currentState = states[0];
    this._currentState.enter();
  }

  public switchState(stateKey: EPlayerState): void {
    let newState: IState | null = null;
    for (const state of this._states) {
      if (state instanceof T) {
        newState = state;
        break;
      }
    }

    if (!newState) {
      console.warn("State not found");
      return;
    }

    this._currentState = newState;
    this._currentState.enter();
  }
}
