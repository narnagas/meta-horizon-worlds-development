import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

export class PuzzleLight {
  private subscriptions: Subscription[] = [];
  private state: 'ready' | 'progress' | 'success' | 'failure' = 'ready';

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly puzzleId: string,
    private readonly lightId: string,
  ) {}

  start(): void {
    if (this.subscriptions.length) return;
    this.subscriptions = [
      this.events.on('puzzle:progress', event => {
        if (event.puzzleId === this.puzzleId) this.setState('progress');
      }),
      this.events.on('puzzle:failed', event => {
        if (event.puzzleId === this.puzzleId) this.setState('failure');
      }),
      this.events.on('puzzle:reset', event => {
        if (event.puzzleId === this.puzzleId) this.setState('ready');
      }),
      this.events.on('puzzle:solved', event => {
        if (event.puzzleId === this.puzzleId) this.setState('success');
      }),
    ];
  }

  stop(): void { for (const subscription of this.subscriptions) subscription.unsubscribe(); this.subscriptions = []; }
  get currentState() { return this.state; }

  private setState(state: 'ready' | 'progress' | 'success' | 'failure'): void {
    this.state = state;
    this.events.emit('light:stateChanged', { lightId: this.lightId, state });
  }
}
