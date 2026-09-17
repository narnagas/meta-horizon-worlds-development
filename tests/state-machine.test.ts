import { describe, expect, it } from 'vitest';
import { StateMachine } from '../src/core/state-machine';

type State = 'idle' | 'active' | 'complete';
type Event = 'start' | 'finish';

describe('StateMachine', () => {
  it('follows configured transitions', () => {
    const machine = new StateMachine<State, Event>('idle', [
      { from: 'idle', event: 'start', to: 'active' },
      { from: 'active', event: 'finish', to: 'complete' },
    ]);

    expect(machine.send('start').changed).toBe(true);
    expect(machine.state).toBe('active');
    expect(machine.send('finish').changed).toBe(true);
    expect(machine.state).toBe('complete');
  });

  it('rejects invalid transitions', () => {
    const machine = new StateMachine<State, Event>('idle', [
      { from: 'idle', event: 'start', to: 'active' },
    ]);

    const result = machine.send('finish');

    expect(result.changed).toBe(false);
    expect(machine.state).toBe('idle');
  });
});
