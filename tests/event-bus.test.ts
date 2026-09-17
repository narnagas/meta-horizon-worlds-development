import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '../src/core/event-bus';

interface TestEvents {
  [key: string]: unknown;
  changed: { value: number };
}

describe('EventBus', () => {
  it('delivers typed payloads and supports unsubscribe', () => {
    const events = new EventBus<TestEvents>();
    const handler = vi.fn();
    const subscription = events.on('changed', handler);

    events.emit('changed', { value: 7 });
    subscription.unsubscribe();
    events.emit('changed', { value: 8 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ value: 7 });
  });

  it('runs once subscriptions only once', () => {
    const events = new EventBus<TestEvents>();
    const handler = vi.fn();

    events.once('changed', handler);
    events.emit('changed', { value: 1 });
    events.emit('changed', { value: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
