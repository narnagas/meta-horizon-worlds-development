# Meta Horizon Worlds Integration Boundary

## Purpose

The portable TypeScript architecture in this repository is intentionally separated from Meta Horizon Worlds runtime APIs. The integration boundary gives platform-facing scripts one responsibility: translate Horizon callbacks and references into stable domain events, and translate domain state back into world behavior.

This avoids pretending that generic TypeScript is itself a Horizon component while still demonstrating maintainable architecture for real world scripting.

## Interaction Adapter

`InteractionAdapter` consumes an `InteractionSource`. The source represents the small callback surface the domain needs:

```text
Runtime interaction begins
        |
        v
InteractionSource.onStarted
        |
        v
InteractionAdapter
        |
        v
interaction:started

Runtime interaction completes
        |
        v
InteractionSource.onCompleted
        |
        v
InteractionAdapter
        |
        v
interaction:completed
        |
        v
EventBus -> world systems
```

A Horizon-facing implementation can wrap the appropriate player/entity interaction callbacks and expose only stable values such as a player identifier to the portable layer.

## Lifecycle

Adapters have explicit `start()` and `stop()` methods. `start()` is idempotent, preventing duplicate callback registration. `stop()` unsubscribes all runtime-facing handlers so an adapter can be disposed cleanly.

Lifecycle management is especially important in event-driven worlds because duplicate subscriptions can cause an interaction to execute more than once and are difficult to diagnose from visible world behavior alone.

## Manual Source

`ManualInteractionSource` implements the same boundary without depending on Horizon APIs. It exists for reference examples and future automated tests. A caller can invoke `begin()` and `complete()` to simulate the callbacks that a Horizon component would normally receive.

## End-to-End Example

`createInteractionFlowExample()` composes the current architecture:

```text
Manual/Horizon callback
        |
        v
InteractionAdapter
        |
        v
Typed EventBus
        |
        v
StatefulDoor
        |
        v
StateMachine
        |
        v
WorldState
        |
        v
state:changed
```

The example can later swap `ManualInteractionSource` for a Horizon-backed implementation without changing the door's domain logic.

## What Belongs in a Horizon Component

Platform-facing components should own Horizon entity references, runtime callbacks, animation and audio calls, player/runtime objects, and networking behavior required by the world. They should translate those concerns into narrow domain contracts rather than spreading platform objects throughout every system.

## Next Increment

The next increment should add automated TypeScript validation for the portable core and integration boundary. Tests can verify event subscriptions, state transitions, world-state notifications, adapter lifecycle behavior, and the end-to-end interaction flow without requiring the Horizon editor.
