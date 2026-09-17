export interface StateTransition<TState extends string, TEvent extends string> {
  from: TState;
  event: TEvent;
  to: TState;
  guard?: () => boolean;
}

export interface StateTransitionResult<TState extends string> {
  changed: boolean;
  previousState: TState;
  state: TState;
}

/**
 * Deterministic finite state machine for interaction and experience flows.
 * Invalid transitions are ignored rather than mutating state implicitly.
 */
export class StateMachine<TState extends string, TEvent extends string> {
  private currentState: TState;

  constructor(
    initialState: TState,
    private readonly transitions: ReadonlyArray<StateTransition<TState, TEvent>>,
    private readonly onTransition?: (previousState: TState, state: TState, event: TEvent) => void,
  ) {
    this.currentState = initialState;
  }

  get state(): TState {
    return this.currentState;
  }

  can(event: TEvent): boolean {
    return this.findTransition(event) !== undefined;
  }

  send(event: TEvent): StateTransitionResult<TState> {
    const previousState = this.currentState;
    const transition = this.findTransition(event);

    if (!transition) {
      return {
        changed: false,
        previousState,
        state: this.currentState,
      };
    }

    this.currentState = transition.to;
    this.onTransition?.(previousState, this.currentState, event);

    return {
      changed: previousState !== this.currentState,
      previousState,
      state: this.currentState,
    };
  }

  private findTransition(event: TEvent): StateTransition<TState, TEvent> | undefined {
    return this.transitions.find(
      (transition) =>
        transition.from === this.currentState &&
        transition.event === event &&
        (transition.guard?.() ?? true),
    );
  }
}
