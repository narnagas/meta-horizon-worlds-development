import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

export interface InteractionSource {
  onStarted(handler: (playerId: string) => void): Subscription;
  onCompleted(handler: (playerId: string, result?: string) => void): Subscription;
}

/**
 * Boundary adapter that translates platform/runtime callbacks into portable
 * world-domain events. A Horizon-specific component can implement
 * InteractionSource without leaking platform entities into the core layer.
 */
export class InteractionAdapter {
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly interactionId: string,
    private readonly source: InteractionSource,
  ) {}

  start(): void {
    if (this.subscriptions.length > 0) {
      return;
    }

    this.subscriptions = [
      this.source.onStarted((playerId) => {
        this.events.emit('interaction:started', {
          interactionId: this.interactionId,
          player: { playerId },
        });
      }),
      this.source.onCompleted((playerId, result) => {
        this.events.emit('interaction:completed', {
          interactionId: this.interactionId,
          player: { playerId },
          result,
        });
      }),
    ];
  }

  stop(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions = [];
  }
}
