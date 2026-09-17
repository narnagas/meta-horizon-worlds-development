import * as hz from 'horizon/core';

class lobbyController extends hz.Component<typeof lobbyController> {
  static propsDefinition = {
    mainLight: { type: hz.PropTypes.Entity },
  };

  start() {
    console.log('[Lobby] lobbyController started');

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      this.onPlayerEnterWorld,
    );
  }

  private onPlayerEnterWorld = (player: hz.Player) => {
    console.log(`Player entered the lobby: ${player.id}`);
  };
}

hz.Component.register(lobbyController);
