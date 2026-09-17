import { describe, expect, it } from 'vitest';
import { createInteractionFlowExample } from '../src/examples/horizon-interaction-flow';

describe('Horizon interaction flow example', () => {
  it('moves the door through the complete interaction lifecycle', () => {
    const { source, door } = createInteractionFlowExample();

    expect(door.currentState).toBe('closed');

    source.complete('player-1');
    expect(door.currentState).toBe('opening');

    door.animationComplete();
    expect(door.currentState).toBe('open');

    source.complete('player-1');
    expect(door.currentState).toBe('closing');

    door.animationComplete();
    expect(door.currentState).toBe('closed');
  });
});
