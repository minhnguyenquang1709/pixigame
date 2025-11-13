import { EPlayerState, IState } from "../../types/state";

export interface IStateMachine {
  switchState(stateKey: EPlayerState): void;
}

export class StateMachine implements IStateMachine {
  private _currentState: IState | null;
  private _states: Map<EPlayerState, IState> = new Map();

  constructor(states: Record<EPlayerState, IState>) {
    for (const key in states) {
      const keyName = key as EPlayerState;
      this._states.set(keyName, states[keyName]);
    }
    const firstState = this._states.values().next().value;
    this._currentState = firstState || null;
    this._currentState?.enter();
  }

  public switchState(stateKey: EPlayerState): void {
    let newState: IState | null = null;
    if (this._states.has(stateKey)) {
      newState = this._states.get(stateKey) || null;
    }

    if (!newState) {
      console.warn("State not found");
      return;
    }

    this._currentState = newState;
    this._currentState.enter();
  }
}
