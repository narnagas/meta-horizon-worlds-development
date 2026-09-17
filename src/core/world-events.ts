export interface PlayerReference {
  playerId: string;
}

export interface InteractionReference {
  interactionId: string;
  player: PlayerReference;
}

export interface WorldEventMap {
  'world:ready': { startedAt: number };
  'player:entered': PlayerReference;
  'player:left': PlayerReference;
  'interaction:started': InteractionReference;
  'interaction:completed': InteractionReference & { result?: string };
  'state:changed': { key: string; previousValue: unknown; value: unknown };

  'lobby:entered': PlayerReference;
  'puzzle:progress': { puzzleId: string; progress: number; total: number; interactionId: string };
  'puzzle:failed': { puzzleId: string; expectedInteractionId: string; receivedInteractionId: string };
  'puzzle:reset': { puzzleId: string };
  'puzzle:solved': { puzzleId: string };
  'door:stateChanged': { doorId: string; previousState: string; state: string };
  'light:stateChanged': { lightId: string; state: 'ready' | 'progress' | 'success' | 'failure' };
  'sound:requested': { soundId: string };
}
