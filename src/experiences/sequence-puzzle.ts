import { EventBus, Subscription } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';

export type PuzzleState = 'idle' | 'active' | 'solved' | 'failed';

export class SequencePuzzle {
  private progress = 0;
  private state: PuzzleState = 'idle';
  private subscription?: Subscription;

  constructor(
    private readonly events: EventBus<WorldEventMap>,
    private readonly puzzleId: string,
    private readonly sequence: readonly string[],
  ) {
    if (sequence.length === 0) throw new Error('Puzzle sequence cannot be empty.');
  }

  start(): void {
    if (this.subscription) return;
    this.subscription = this.events.on('interaction:completed', ({ interactionId }) => {
      if (!this.sequence.includes(interactionId) || this.state === 'solved') return;
      this.accept(interactionId);
    });
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  reset(): void {
    this.progress = 0;
    this.state = 'idle';
    this.events.emit('puzzle:reset', { puzzleId: this.puzzleId });
  }

  get currentState(): PuzzleState { return this.state; }
  get currentProgress(): number { return this.progress; }

  private accept(interactionId: string): void {
    const expected = this.sequence[this.progress];

    if (interactionId !== expected) {
      this.state = 'failed';
      this.events.emit('puzzle:failed', {
        puzzleId: this.puzzleId,
        expectedInteractionId: expected ?? '',
        receivedInteractionId: interactionId,
      });
      this.reset();
      return;
    }

    this.progress += 1;
    this.state = this.progress === this.sequence.length ? 'solved' : 'active';
    this.events.emit('puzzle:progress', {
      puzzleId: this.puzzleId,
      progress: this.progress,
      total: this.sequence.length,
      interactionId,
    });

    if (this.state === 'solved') {
      this.events.emit('puzzle:solved', { puzzleId: this.puzzleId });
    }
  }
}
