import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '../src/core/event-bus';
import { WorldState } from '../src/core/world-state';
import { WorldEventMap } from '../src/core/world-events';

interface TestState {
  [key: string]: unknown;
  score: number;
}

describe('WorldState', () => {
  it('publishes state changes only when values change', () => {
    const events = new EventBus<WorldEventMap>();
    const handler = vi.fn();
    events.on('state:changed', handler);
    const state = new WorldState<TestState>({ score: 0 }, events);

    expect(state.set('score', 10)).toBe(true);
    expect(state.set('score', 10)).toBe(false);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      key: 'score',
      previousValue: 0,
      value: 10,
    });
  });
});
