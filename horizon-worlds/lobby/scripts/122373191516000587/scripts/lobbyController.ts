import * as hz from 'horizon/core';

class lobbyController extends hz.Component<typeof lobbyController> {
  static propsDefinition = {
    mainLight: { type: hz.PropTypes.Entity },
    accentLight: { type: hz.PropTypes.Entity },
  };

  start() {
    console.log('[Lobby] lobbyController started');

    if (this.props.mainLight) {
      const mainLight = this.props.mainLight.as(hz.DynamicLightGizmo);

      console.log('[Lobby] Main light assigned');
      mainLight.enabled.set(false);
      console.log('[Lobby] Main light disabled');
    } else {
      console.warn('[Lobby] Main light is not assigned');
    }

    if (this.props.accentLight) {
      const accentLight = this.props.accentLight.as(hz.DynamicLightGizmo);

      console.log('[Lobby] Accent light assigned');
      accentLight.enabled.set(false);
      console.log('[Lobby] Accent light disabled');
    } else {
      console.warn('[Lobby] Accent light is not assigned');
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
        const mainLight = this.props.mainLight.as(hz.DynamicLightGizmo);

        mainLight.enabled.set(true);
        console.log('[Lobby] Main light enabled');
      }
    }, 1500);

    this.async.setTimeout(() => {
      if (this.props.accentLight) {
        const accentLight = this.props.accentLight.as(hz.DynamicLightGizmo);

        accentLight.enabled.set(true);
        console.log('[Lobby] Accent light enabled');
      }
    }, 2500);
  };
}

hz.Component.register(lobbyController);
