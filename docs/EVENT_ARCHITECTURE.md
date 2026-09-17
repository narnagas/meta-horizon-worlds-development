# Typed Event Architecture

## Purpose

Interactive worlds quickly become difficult to maintain when every script holds direct references to several other scripts. This reference architecture uses a small typed event bus as a communication boundary between world systems.

The portable core deliberately avoids direct Horizon API dependencies. Horizon-specific components can translate editor/runtime events into domain events at the boundary while reusable behavior remains testable and understandable.

## Design Goals

- Keep interaction producers independent from consumers.
- Make event names and payloads discoverable through TypeScript.
- Prevent accidental payload mismatches at compile time.
- Allow multiple systems to react to the same world event.
- Make subscriptions explicitly disposable.
- Support one-time lifecycle events.
- Keep the core portable enough for automated tests.

## Event Flow

```text
Player / World Action
        |
        v
Horizon Integration Component
        |
        v
Typed World Event
        |
        v
     EventBus
      / | \
     /  |  \
    v   v   v
 Door  UI  Score / State / Audio / Other Systems
```

## Event Contract

`WorldEventMap` is the shared contract. Each key represents an event and each value defines the exact payload required when that event is emitted.

Examples include player lifecycle events, interaction lifecycle events, and world-state changes. Feature-specific events can be added as systems are introduced.

## Horizon Integration Boundary

This repository does not pretend that portable TypeScript is a replacement for Horizon Worlds APIs. A Horizon component should own platform-specific concerns such as entity references, player callbacks, trigger events, animation, audio, and network behavior. It then publishes domain-level events to the portable core.

This separation makes the architectural intent visible while keeping platform-specific code focused on the world runtime.

## Example

`EventDrivenDoor` listens for an `interaction:completed` event matching its configured interaction identifier. It toggles its state and publishes a `state:changed` event. The producer does not need a direct reference to the door, and other systems can observe the same state change independently.

## Next Increment

The next layer will introduce explicit world state management and a small state-machine pattern. Those systems will consume the event architecture established here rather than coupling directly to interaction producers.
