import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';
import { SequencePuzzle } from '../experiences/sequence-puzzle';

export interface DelayScheduler {
  schedule(delayMs: number, callback: () => void): { cancel(): void };
}

export class TimeoutDelayScheduler implements DelayScheduler {
  schedule(delayMs: number, callback: () => void): { cancel(): void } {
    const handle = setTimeout(callback, delayMs);
    return { cancel: () => clearTimeout(handle) };
  }
}

export class PuzzleResetController {
  private subscription?: Subscription;
  private pendingReset?: { cancel(): void };

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly puzzle: SequencePuzzle,
    private readonly puzzleId: string,
    private readonly scheduler: DelayScheduler,
    private readonly failureDelayMs = 1200,
  ) {}

  start(): void {
    if (this.subscription) return;
    this.subscription = this.events.on('puzzle:failed', ({ puzzleId }) => {
      if (puzzleId !== this.puzzleId) return;
      this.pendingReset?.cancel();
      this.pendingReset = this.scheduler.schedule(this.failureDelayMs, () => {
        this.pendingReset = undefined;
        this.puzzle.reset();
      });
    });
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.pendingReset?.cancel();
    this.pendingReset = undefined;
  }
}
