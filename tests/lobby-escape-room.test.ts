import { describe, expect, it, vi } from 'vitest';
import { createLobbyEscapeRoom } from '../src/experiences/lobby-escape-room';

describe('Lobby escape room', () => {
  it('solves A -> C -> B and unlocks the shared door', () => {
    const lobby = createLobbyEscapeRoom();
    lobby.start();

    lobby.buttons.a.complete('player-1');
    lobby.buttons.c.complete('player-2');
    lobby.buttons.b.complete('player-1');

    expect(lobby.puzzle.currentState).toBe('solved');
    expect(lobby.puzzle.currentProgress).toBe(3);
    expect(lobby.door.currentState).toBe('unlocking');
    expect(lobby.light.currentState).toBe('success');

    lobby.door.openingComplete();
    expect(lobby.door.currentState).toBe('open');
  });

  it('resets shared progress after a wrong button', () => {
    const lobby = createLobbyEscapeRoom();
    lobby.start();

    lobby.buttons.a.complete('player-1');
    lobby.buttons.b.complete('player-2');

    expect(lobby.puzzle.currentState).toBe('idle');
    expect(lobby.puzzle.currentProgress).toBe(0);
    expect(lobby.door.currentState).toBe('locked');
    expect(lobby.light.currentState).toBe('ready');
  });

  it('requests success audio when solved', () => {
    const lobby = createLobbyEscapeRoom();
    const requested = vi.fn();
    lobby.events.on('sound:requested', requested);
    lobby.start();

    lobby.buttons.a.complete('player-1');
    lobby.buttons.c.complete('player-1');
    lobby.buttons.b.complete('player-1');

    expect(requested).toHaveBeenCalledWith({ soundId: 'puzzle-success' });
  });

  it('does not duplicate subscriptions when start is called twice', () => {
    const lobby = createLobbyEscapeRoom();
    lobby.start();
    lobby.start();

    lobby.buttons.a.complete('player-1');
    expect(lobby.puzzle.currentProgress).toBe(1);
  });
});
