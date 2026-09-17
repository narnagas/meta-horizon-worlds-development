export type EventHandler<TPayload> = (payload: TPayload) => void;

export interface Subscription {
  unsubscribe(): void;
}

/**
 * Lightweight typed event bus for decoupling world systems.
 *
 * TEvents is constrained to an object rather than Record<string, unknown> so
 * finite event-map interfaces do not need an unsafe catch-all index signature.
 * Known event keys and payloads remain fully type checked by keyof TEvents.
 */
export class EventBus<TEvents extends object> {
  private readonly handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

  on<TKey extends keyof TEvents>(
    event: TKey,
    handler: EventHandler<TEvents[TKey]>,
  ): Subscription {
    let eventHandlers = this.handlers.get(event);

    if (!eventHandlers) {
      eventHandlers = new Set<EventHandler<unknown>>();
      this.handlers.set(event, eventHandlers);
    }

    eventHandlers.add(handler as EventHandler<unknown>);

    let active = true;

    return {
      unsubscribe: () => {
        if (!active) {
          return;
        }

        active = false;
        eventHandlers?.delete(handler as EventHandler<unknown>);

        if (eventHandlers?.size === 0) {
          this.handlers.delete(event);
        }
      },
    };
  }

  once<TKey extends keyof TEvents>(
    event: TKey,
    handler: EventHandler<TEvents[TKey]>,
  ): Subscription {
    let subscription: Subscription;

    subscription = this.on(event, (payload) => {
      subscription.unsubscribe();
      handler(payload);
    });

    return subscription;
  }

  emit<TKey extends keyof TEvents>(event: TKey, payload: TEvents[TKey]): void {
    const eventHandlers = this.handlers.get(event);

    if (!eventHandlers) {
      return;
    }

    // Snapshot the handlers so subscriptions may safely change during emit.
    for (const handler of [...eventHandlers]) {
      handler(payload);
    }
  }

  clear<TKey extends keyof TEvents>(event?: TKey): void {
    if (event === undefined) {
      this.handlers.clear();
      return;
    }

    this.handlers.delete(event);
  }
}
