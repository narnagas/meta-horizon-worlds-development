import { EventBus } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';
import { InteractionAdapter } from '../interactions/interaction-adapter';
import { ManualInteractionSource } from '../interactions/manual-interaction-source';
import { StatefulDoor } from './stateful-door';

/**
 * End-to-end portable demonstration of the intended Horizon boundary:
 * runtime callback -> adapter -> typed event -> domain behavior/state.
 */
export function createInteractionFlowExample() {
  const events = new EventBus<WorldEventMap>();
  const source = new ManualInteractionSource();
  const adapter = new InteractionAdapter(events, 'entry-door-switch', source);
  const door = new StatefulDoor(events, 'entry-door-switch');

  door.start();
  adapter.start();

  return {
    events,
    source,
    adapter,
    door,
  };
}
