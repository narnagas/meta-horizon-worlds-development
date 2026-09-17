import { EventBus } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

/**
 * Portable example of one world system reacting to another without holding a
 * direct reference to the interaction script that produced the event.
 */
export class EventDrivenDoor {
  private isOpen = false;

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly interactionId: string,
  ) {}

  start(): void {
    this.events.on('interaction:completed', ({ interactionId }) => {
      if (interactionId !== this.interactionId) {
        return;
      }

      this.setOpen(!this.isOpen);
    });
  }

  private setOpen(isOpen: boolean): void {
    const previousValue = this.isOpen;
    this.isOpen = isOpen;

    this.events.emit('state:changed', {
      key: `door:${this.interactionId}:open`,
      previousValue,
      value: isOpen,
    });
  }
}
