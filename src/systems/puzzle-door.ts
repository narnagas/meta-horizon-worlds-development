import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

export type PuzzleDoorState = 'locked' | 'unlocking' | 'open';

export class PuzzleDoor {
  private state: PuzzleDoorState = 'locked';
  private subscription?: Subscription;

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly puzzleId: string,
    private readonly doorId: string,
  ) {}

  start(): void {
    if (this.subscription) return;
    this.subscription = this.events.on('puzzle:solved', ({ puzzleId }) => {
      if (puzzleId !== this.puzzleId || this.state !== 'locked') return;
      this.setState('unlocking');
    });
  }

  stop(): void { this.subscription?.unsubscribe(); this.subscription = undefined; }

  openingComplete(): void {
    if (this.state === 'unlocking') this.setState('open');
  }

  get currentState(): PuzzleDoorState { return this.state; }

  private setState(state: PuzzleDoorState): void {
    const previousState = this.state;
    this.state = state;
    this.events.emit('door:stateChanged', { doorId: this.doorId, previousState, state });
  }
}
