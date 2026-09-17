import * as hz from 'horizon/core';

class lobbyController extends hz.Component<typeof lobbyController> {
  static propsDefinition = {
    mainLight: { type: hz.PropTypes.Entity },
  };

  start() {
    console.log('[Lobby] lobbyController started');

    if (this.props.mainLight) {
      console.log('[Lobby] Main light assigned');
      this.props.mainLight.visible.set(false);
    } else {
      console.warn('[Lobby] Main light is not assigned');
    }

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      this.onPlayerEnterWorld,
    );
  }

  private onPlayerEnterWorld = (player: hz.Player) => {
    console.log(`Player entered the lobby: ${player.id}`);
    console.log('[Lobby] Waiting to activate main light');

    this.async.setTimeout(() => {
      if (this.props.mainLight) {
        this.props.mainLight.visible.set(true);
        console.log('[Lobby] Main light shown');
      }
    }, 1500);
  };
}

hz.Component.register(lobbyController);
