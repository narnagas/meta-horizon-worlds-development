import { EventBus } from './event-bus';
import { WorldEventMap } from './world-events';

export type WorldStateShape = Record<string, unknown>;

/**
 * Small observable state store for portable world/domain state.
 * Platform-specific Horizon components remain responsible for entities,
 * animations, networking, and other runtime concerns.
 */
export class WorldState<TState extends WorldStateShape> {
  private readonly values: TState;

  constructor(
    initialState: TState,
    private readonly events?: EventBus<WorldEventMap>,
  ) {
    this.values = { ...initialState };
  }

  get<TKey extends keyof TState>(key: TKey): TState[TKey] {
    return this.values[key];
  }

  set<TKey extends keyof TState>(key: TKey, value: TState[TKey]): boolean {
    const previousValue = this.values[key];

    if (Object.is(previousValue, value)) {
      return false;
    }

    this.values[key] = value;

    this.events?.emit('state:changed', {
      key: String(key),
      previousValue,
      value,
    });

    return true;
  }

  snapshot(): Readonly<TState> {
    return { ...this.values };
  }
}
