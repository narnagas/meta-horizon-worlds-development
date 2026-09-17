# Performance-Conscious World Design

Meta Horizon Worlds experiences run across constrained real-time hardware, so architecture should make resource use visible and predictable rather than treating optimization as a final cleanup step.

## Repository Pattern: Reuse Before Recreate

`src/core/object-pool.ts` provides a platform-neutral object pool with:

- optional prewarming;
- a hard maximum allocation count;
- explicit acquire/release ownership;
- reset hooks before reuse; and
- observable counts for available, active, and total objects.

A Horizon-facing adapter can use this pattern for reusable effects, interaction helpers, temporary gameplay objects, UI resources, or wrappers around pre-created world entities. The core implementation intentionally avoids inventing or depending on a specific Horizon API.

## Why Pooling Matters

Meta's current Horizon Worlds guidance recommends asset pooling for frequently used or per-player objects and recommends limiting dynamic spawning. Reusing pre-instantiated resources can reduce repeated runtime creation work, make resource ceilings explicit, and improve predictability under multiplayer load.

Pooling is not a substitute for measurement. A pool that is oversized simply moves cost earlier and can waste memory. Size pools from observed concurrency and test the experience under realistic player counts.

## Practical Checklist

1. Prefer reusable/pre-created resources for frequently repeated behavior.
2. Put explicit upper bounds on resources that can grow at runtime.
3. Release resources when interactions, effects, or sessions complete.
4. Keep hot-path handlers small and avoid unnecessary repeated allocation.
5. Combine or simplify world content where doing so preserves the intended experience.
6. Test with the expected maximum player count; multiplayer scaling can reveal issues that small tests do not.
7. Use the performance tooling available in the Worlds Desktop Editor to measure script, physics, audio, CPU, and GPU impact.
8. Optimize based on measured bottlenecks while keeping architecture simple enough to reason about.

## Portfolio Boundary

This document records architectural practices applicable to Meta Horizon Worlds. It does not claim native Unity, Unreal Engine, or Meta XR SDK implementation. Platform-specific examples should be added only when they are grounded in the current Horizon Worlds TypeScript APIs.
