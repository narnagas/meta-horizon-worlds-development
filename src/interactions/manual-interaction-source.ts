import { Subscription } from '../core/event-bus';
import { InteractionSource } from './interaction-adapter';

type StartedHandler = (playerId: string) => void;
type CompletedHandler = (playerId: string, result?: string) => void;

/**
 * Portable interaction source for examples and automated tests. In a Horizon
 * world this is replaced by an adapter backed by actual runtime callbacks.
 */
export class ManualInteractionSource implements InteractionSource {
  private readonly startedHandlers = new Set<StartedHandler>();
  private readonly completedHandlers = new Set<CompletedHandler>();

  onStarted(handler: StartedHandler): Subscription {
    this.startedHandlers.add(handler);
    return this.subscriptionFor(this.startedHandlers, handler);
  }

  onCompleted(handler: CompletedHandler): Subscription {
    this.completedHandlers.add(handler);
    return this.subscriptionFor(this.completedHandlers, handler);
  }

  begin(playerId: string): void {
    for (const handler of [...this.startedHandlers]) {
      handler(playerId);
    }
  }

  complete(playerId: string, result?: string): void {
    for (const handler of [...this.completedHandlers]) {
      handler(playerId, result);
    }
  }

  private subscriptionFor<THandler>(handlers: Set<THandler>, handler: THandler): Subscription {
    let active = true;

    return {
      unsubscribe: () => {
        if (!active) {
          return;
        }

        active = false;
        handlers.delete(handler);
      },
    };
  }
}
