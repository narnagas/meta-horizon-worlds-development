import { EventBus } from '../core/event-bus';
import { WorldEventMap } from '../core/world-events';
import { InteractionAdapter } from '../interactions/interaction-adapter';
import { ManualInteractionSource } from '../interactions/manual-interaction-source';
import { PuzzleDoor } from '../systems/puzzle-door';
import { PuzzleLight } from '../systems/puzzle-light';
import { PuzzleSound } from '../systems/puzzle-sound';
import { SequencePuzzle } from './sequence-puzzle';

export function createLobbyEscapeRoom() {
  const events = new EventBus<WorldEventMap>();
  const buttonA = new ManualInteractionSource();
  const buttonB = new ManualInteractionSource();
  const buttonC = new ManualInteractionSource();

  const adapters = [
    new InteractionAdapter(events, 'lobby-button-a', buttonA),
    new InteractionAdapter(events, 'lobby-button-b', buttonB),
    new InteractionAdapter(events, 'lobby-button-c', buttonC),
  ];

  const puzzle = new SequencePuzzle(events, 'lobby-puzzle', [
    'lobby-button-a',
    'lobby-button-c',
    'lobby-button-b',
  ]);
  const door = new PuzzleDoor(events, 'lobby-puzzle', 'lobby-exit-door');
  const light = new PuzzleLight(events, 'lobby-puzzle', 'lobby-status-light');
  const sound = new PuzzleSound(events, 'lobby-puzzle');

  const start = () => {
    for (const adapter of adapters) adapter.start();
    puzzle.start(); door.start(); light.start(); sound.start();
  };

  const stop = () => {
    for (const adapter of adapters) adapter.stop();
    puzzle.stop(); door.stop(); light.stop(); sound.stop();
  };

  return { events, buttons: { a: buttonA, b: buttonB, c: buttonC }, puzzle, door, light, sound, start, stop };
}
