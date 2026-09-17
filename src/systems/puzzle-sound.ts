import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

export class PuzzleSound {
  private subscriptions: Subscription[] = [];

  constructor(private readonly events: EventBus<WorldEventMap>, private readonly puzzleId: string) {}

  start(): void {
    if (this.subscriptions.length) return;
    this.subscriptions = [
      this.events.on('puzzle:solved', event => {
        if (event.puzzleId === this.puzzleId) this.events.emit('sound:requested', { soundId: 'puzzle-success' });
      }),
      this.events.on('puzzle:failed', event => {
        if (event.puzzleId === this.puzzleId) this.events.emit('sound:requested', { soundId: 'puzzle-failure' });
      }),
    ];
  }

  stop(): void { for (const subscription of this.subscriptions) subscription.unsubscribe(); this.subscriptions = []; }
}
