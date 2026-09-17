import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '../src/core/event-bus';
import { WorldEventMap } from '../src/core/world-events';
import { InteractionAdapter } from '../src/interactions/interaction-adapter';
import { ManualInteractionSource } from '../src/interactions/manual-interaction-source';

describe('InteractionAdapter', () => {
  it('translates runtime callbacks into typed interaction events', () => {
    const events = new EventBus<WorldEventMap>();
    const source = new ManualInteractionSource();
    const started = vi.fn();
    const completed = vi.fn();
    events.on('interaction:started', started);
    events.on('interaction:completed', completed);
    const adapter = new InteractionAdapter(events, 'switch-1', source);

    adapter.start();
    source.begin('player-1');
    source.complete('player-1', 'success');

    expect(started).toHaveBeenCalledWith({
      interactionId: 'switch-1',
      player: { playerId: 'player-1' },
    });
    expect(completed).toHaveBeenCalledWith({
      interactionId: 'switch-1',
      player: { playerId: 'player-1' },
      result: 'success',
    });
  });

  it('does not duplicate subscriptions and stops cleanly', () => {
    const events = new EventBus<WorldEventMap>();
    const source = new ManualInteractionSource();
    const completed = vi.fn();
    events.on('interaction:completed', completed);
    const adapter = new InteractionAdapter(events, 'switch-1', source);

    adapter.start();
    adapter.start();
    source.complete('player-1');
    adapter.stop();
    source.complete('player-1');

    expect(completed).toHaveBeenCalledTimes(1);
  });
});
