# Lobby Escape Room

This example turns the architecture into one understandable shared-world experience.

## Experience

The lobby contains three buttons (A, B, C), a locked exit door, a status light, and success/failure audio. The required sequence is **A -> C -> B**.

The puzzle belongs to the room, not to an individual player. Multiple players may therefore cooperate: one player can press A, another C, and either can press B.

## Responsibilities

- **Horizon-facing interaction source:** detects a real world interaction. The repository uses `ManualInteractionSource` as a portable stand-in until a concrete Horizon component is attached.
- **InteractionAdapter:** translates the platform-facing callback into the repository's typed interaction event.
- **EventBus:** communicates what happened; it does not own puzzle or door state.
- **SequencePuzzle:** owns the shared sequence and progress.
- **PuzzleDoor:** owns the door state and responds to `puzzle:solved`.
- **PuzzleLight:** owns status-light feedback.
- **PuzzleSound:** requests success/failure audio.

## Flow

```text
Player presses A
  -> Horizon interaction boundary
  -> interaction:completed
  -> SequencePuzzle progress 1/3

Player presses C
  -> progress 2/3

Player presses B
  -> progress 3/3
  -> puzzle:solved
  -> door unlocks
  -> light shows success
  -> success sound requested
```

A wrong button emits `puzzle:failed` and then resets the shared puzzle to its ready state.

## State ownership

State belongs to the thing that logically owns it:

- puzzle progress -> Puzzle
- locked/unlocking/open -> Door
- ready/progress/success/failure -> Light
- player identity -> Player interaction data

This prevents the Event Bus from becoming the world's memory or decision-maker.

## Horizon boundary

The example intentionally does not invent Meta Horizon Worlds runtime API names. A Horizon-specific component should implement `InteractionSource` and translate supported Horizon callbacks into this portable architecture. The same core logic can then be validated outside the headset.
