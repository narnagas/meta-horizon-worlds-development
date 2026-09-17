# World State and State Machines

## Why Explicit State Matters

Immersive interactions often have more than two conditions. A door may be closed, opening, open, closing, or locked. A puzzle can be idle, active, solved, failed, or resetting. Representing those flows with scattered booleans makes invalid combinations easy to create and difficult to debug.

This repository uses two small portable primitives: `WorldState` for shared observable values and `StateMachine` for explicit lifecycle transitions.

## WorldState

`WorldState<TState>` stores typed domain state and publishes `state:changed` through the existing event architecture when a value actually changes.

This makes state changes observable without forcing consumers to know which component owns the value. A UI system, audio system, analytics/debug layer, or another interaction can respond independently.

The store returns snapshots rather than exposing its mutable backing object.

## StateMachine

`StateMachine<TState, TEvent>` defines allowed transitions as data:

```text
closed --toggle--> opening --animationComplete--> open
   ^                                           |
   |                                           |
   +--animationComplete-- closing <--toggle----+

closed --lock--> locked --unlock--> closed
```

Events that are invalid for the current state do not mutate the machine. Optional guards can add contextual rules without hiding transitions inside deeply nested conditionals.

## Horizon Worlds Boundary

The portable state machine describes *what should happen next*. A Meta Horizon Worlds component remains responsible for *how the world performs that transition* using the platform runtime—for example starting an animation, moving an entity, playing audio, responding to a player interaction, or coordinating networked behavior.

A typical integration flow is:

```text
Horizon interaction callback
        |
        v
interaction:completed
        |
        v
StateMachine transition
        |
        v
WorldState update
        |
        v
state:changed
        |
        +----> Horizon animation adapter
        +----> UI / feedback
        +----> audio
        +----> other world systems
```

## Stateful Door Example

`StatefulDoor` combines the event bus, world state, and finite state machine. An interaction requests a toggle, but the machine determines whether that request is valid. Opening and closing are multi-stage states and only become stable after `animationComplete`.

Locking is only valid while closed, illustrating how explicit transitions prevent contradictory states such as a locked door that is simultaneously open.

## Next Increment

The next layer should introduce a Horizon-facing interaction adapter pattern. It will demonstrate how platform callbacks can be translated into these portable domain events while keeping Horizon-specific entities and runtime behavior at the integration boundary.
