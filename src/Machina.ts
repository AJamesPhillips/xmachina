import { Nullable } from "./index";

/**
 * Current state and transitions to other states.
 */
export type MachinaState<S, E, T extends Transition<S, E>> = {
  /**
   * Current machina state
   */
  current: S,
  /**
   * All transitions (edges) to other states, if any.
   */
  possibleTransitions: T[]
}

export type Transition<S, E> = {
  /**
   * Name to uniquely (from this state) identify the transition (not needed to be unique across other states)
   */
  edge: E
  /**
   * Description of the transition (optional)
   */
  description?: string
  /**
   * State machina will be in after this transition
   */
  nextState: S
}

export interface IMachina<S, E, T extends Transition<S, E>> {
  /**
   * Edge to follow from current state to another state (edge is the input that triggers a transition).
   */
  trigger: (edge: E) => Nullable<MachinaState<S, E, T>>

  /**
   * Current machine state (includes transitions out of current state, if any)
   */
  readonly state: MachinaState<S, E, T>
}

export class Machina<S, E, T extends Transition<S, E>> implements IMachina<S, E, T> {
  private currentState: S;
  constructor(initialState: S, private stateMap: Map<S, T[]>) {
    this.currentState = initialState;
  }

  get state(): MachinaState<S, E, T> {
    return {
      current: this.currentState,
      possibleTransitions: this.stateMap.get(this.currentState)!
    }
  }

  trigger = (edge: E) => {
    const transitions: T[] = (this.stateMap.get(this.currentState))!;
    const match: T | undefined = transitions.find(t => t.edge === edge);
    if (match === undefined) {
      return null;
    } else {
      this.currentState = match.nextState;
      const result: MachinaState<S, E, T> = {
        current: match.nextState,
        possibleTransitions: this.stateMap.get(match.nextState)!
      }
      return result;
    }
  }
}