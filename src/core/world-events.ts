export interface PlayerReference {
  playerId: string;
}

export interface InteractionReference {
  interactionId: string;
  player: PlayerReference;
}

export interface WorldEventMap {
  'world:ready': {
    startedAt: number;
  };

  'player:entered': PlayerReference;

  'player:left': PlayerReference;

  'interaction:started': InteractionReference;

  'interaction:completed': InteractionReference & {
    result?: string;
  };

  'state:changed': {
    key: string;
    previousValue: unknown;
    value: unknown;
  };
}
