import { EventBus } from '../core/event-bus';
import { StateMachine } from '../core/state-machine';
import { WorldState } from '../core/world-state';
import { WorldEventMap } from '../core/world-events';

type DoorState = 'closed' | 'opening' | 'open' | 'closing' | 'locked';
type DoorEvent = 'toggle' | 'animationComplete' | 'lock' | 'unlock';

interface DoorWorldState {
  [key: string]: unknown;
  doorState: DoorState;
}

/**
 * Multi-stage door flow demonstrating event-driven interaction, explicit
 * transitions, and shared world state without Horizon runtime dependencies.
 */
export class StatefulDoor {
  private readonly state: WorldState<DoorWorldState>;
  private readonly machine: StateMachine<DoorState, DoorEvent>;

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly interactionId: string,
  ) {
    this.state = new WorldState<DoorWorldState>(
      { doorState: 'closed' },
      events,
    );

    this.machine = new StateMachine<DoorState, DoorEvent>(
      'closed',
      [
        { from: 'closed', event: 'toggle', to: 'opening' },
        { from: 'opening', event: 'animationComplete', to: 'open' },
        { from: 'open', event: 'toggle', to: 'closing' },
        { from: 'closing', event: 'animationComplete', to: 'closed' },
        { from: 'closed', event: 'lock', to: 'locked' },
        { from: 'locked', event: 'unlock', to: 'closed' },
      ],
      (_previous, next) => this.state.set('doorState', next),
    );
  }

  start(): void {
    this.events.on('interaction:completed', ({ interactionId }) => {
      if (interactionId === this.interactionId) {
        this.machine.send('toggle');
      }
    });
  }

  animationComplete(): void {
    this.machine.send('animationComplete');
  }

  lock(): void {
    this.machine.send('lock');
  }

  unlock(): void {
    this.machine.send('unlock');
  }

  get currentState(): DoorState {
    return this.machine.state;
  }
}
