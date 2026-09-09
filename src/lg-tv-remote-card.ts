import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from "custom-card-helpers";

// Register met officiële LG webOS App IDs en bronnamen (sources)
const DEFAULT_APPS: Record<
  string,
  { name: string; source: string; icon: string; appId: string }
> = {
  netflix: {
    name: "Netflix",
    source: "Netflix",
    icon: "mdi:netflix",
    appId: "netflix",
  },
  nlziet: {
    name: "NLZIET",
    source: "NLZIET",
    icon: "mdi:television-play",
    appId: "nlziet",
  },
  spotify: {
    name: "Spotify",
    source: "Spotify",
    icon: "mdi:spotify",
    appId: "spotify",
  },
  youtube: {
    name: "YouTube",
    source: "YouTube",
    icon: "mdi:youtube",
    appId: "youtube.leanback.v4",
  },
  videoland: {
    name: "Videoland",
    source: "Videoland",
    icon: "mdi:play-box",
    appId: "cdp-30",
  },
  disneyplus: {
    name: "Disney+",
    source: "Disney+",
    icon: "mdi:television-classic",
    appId: "cdp-28",
  },
  primevideo: {
    name: "Prime Video",
    source: "Amazon Prime Video",
    icon: "mdi:video",
    appId: "amazon",
  },
  viaplay: {
    name: "Viaplay",
    source: "Viaplay",
    icon: "mdi:sports-car",
    appId: "viaplay",
  },
  max: { name: "Max", source: "Max", icon: "mdi:movie-roll", appId: "hbo.max" },
  plex: { name: "Plex", source: "Plex", icon: "mdi:plex", appId: "plex" },
  kodi: {
    name: "Kodi",
    source: "Kodi",
    icon: "mdi:kodi",
    appId: "org.xbmc.kodi",
  },
};

interface AppConfig {
  id?: string;
  name?: string;
  icon?: string;
}

interface CardConfig extends LovelaceCardConfig {
  remote_entity: string; // Jouw media_player.lg_webos_tv entiteit
  media_entity?: string;
  title?: string;
  show_title?: boolean;
  show_navigation?: boolean;
  show_buttons?: boolean;
  show_apps?: boolean;
  show_volume?: boolean;
  show_extra_actions?: boolean;
  show_label_navigation?: boolean;
  show_label_volume?: boolean;
  show_button_labels?: boolean;
  label_navigation?: string;
  label_volume?: string;
  apps?: (string | AppConfig)[];
}

@customElement("lg-tv-remote-card") // Netjes hernoemd naar lg-tv-remote-card!
export class LGTVRemoteCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;

  public setConfig(config: CardConfig): void {
    if (!config || !config.remote_entity) {
      throw new Error('De parameter "remote_entity" is verplicht.');
    }

    this._config = {
      show_title: true,
      show_navigation: true,
      show_buttons: true,
      show_apps: true,
      show_volume: true,
      show_extra_actions: true,
      show_label_navigation: true,
      show_label_volume: true,
      show_button_labels: true,
      label_navigation: "navigatie",
      label_volume: "volume",
      apps: [],
      ...config,
    };
  }

  // Actie 1: Fysieke knoppen simuleren op de LG TV via webostv.button
  private _sendButtonCommand(webosButton: string): void {
    if (!this.hass) return;
    this.hass.callService("webostv", "button", {
      entity_id: this._config.remote_entity,
      button: webosButton,
    });
  }

  // Actie 2: Media player acties uitvoeren (zoals volume en aan/uit)
  private _sendMediaCommand(service: string): void {
    if (!this.hass) return;
    const targetEntity =
      this._config.media_entity || this._config.remote_entity;
    this.hass.callService("media_player", service, {
      entity_id: targetEntity,
    });
  }

  // Actie 3: Systeemmenu's en Luna commando's openen via webostv.command
  private _sendSpecialCommand(commandString: string): void {
    if (!this.hass) return;
    this.hass.callService("webostv", "command", {
      entity_id: this._config.remote_entity,
      command: commandString,
    });
  }

  // Actie 4: Apps openen op basis van webOS App ID of handmatige bronnaam
  private _launchLGApp(appIdentifier: string): void {
    if (!this.hass) return;
    const targetEntity =
      this._config.media_entity || this._config.remote_entity;

    // Kijk of de app in de DEFAULT_APPS register staat, zo ja gebruik het App ID
    const defaultApp = DEFAULT_APPS[appIdentifier.toLowerCase()];
    const finalSource = defaultApp ? defaultApp.appId : appIdentifier;

    this.hass.callService("media_player", "select_source", {
      entity_id: targetEntity,
      source: finalSource,
    });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const stateObj = this.hass.states[this._config.remote_entity];
    const isTvOn =
      stateObj && stateObj.state !== "off" && stateObj.state !== "unavailable";
    const currentSource = stateObj?.attributes?.source || "";

    return html`
      <ha-card>
        ${this._config.show_title && this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ""}
        <div class="card-content">
          <!-- Aan/Uit en Input Source Menu -->
          <div class="top-control-row">
            <ha-icon-button
              class="power-btn ${isTvOn ? "active" : ""}"
              icon="mdi:power"
              @click="${() =>
                this._sendMediaCommand(isTvOn ? "turn_off" : "turn_on")}"
            ></ha-icon-button>
            <ha-icon-button
              icon="mdi:input"
              title="Invoerbron Menu"
              @click="${() =>
                this._sendSpecialCommand(
                  "com.webos.surfacemanager/showInputPicker",
                )}"
            ></ha-icon-button>
          </div>

          <!-- D-Pad Navigatie (LG WebOS Mapping) -->
          ${this._config.show_navigation
            ? html`
                ${this._config.show_label_navigation
                  ? html`<div class="section-label">
                      ${this._config.label_navigation}
                    </div>`
                  : ""}
                <div class="dpad-container">
                  <ha-icon-button
                    class="dpad-button up"
                    icon="mdi:chevron-up"
                    @click="${() => this._sendButtonCommand("UP")}"
                  ></ha-icon-button>
                  <div class="dpad-row">
                    <ha-icon-button
                      class="dpad-button left"
                      icon="mdi:chevron-left"
                      @click="${() => this._sendButtonCommand("LEFT")}"
                    ></ha-icon-button>
                    <ha-icon-button
                      class="dpad-button ok"
                      icon="mdi:checkbox-blank-circle"
                      @click="${() => this._sendButtonCommand("ENTER")}"
                    ></ha-icon-button>
                    <ha-icon-button
                      class="dpad-button right"
                      icon="mdi:chevron-right"
                      @click="${() => this._sendButtonCommand("RIGHT")}"
                    ></ha-icon-button>
                  </div>
                  <ha-icon-button
                    class="dpad-button down"
                    icon="mdi:chevron-down"
                    @click="${() => this._sendButtonCommand("DOWN")}"
                  ></ha-icon-button>
                </div>
              `
            : ""}

          <!-- Systeemknoppen (Terug, Home, Menu) -->
          ${this._config.show_buttons
            ? html`
                <div class="button-row">
                  <div class="control-button-wrapper">
                    <ha-icon-button
                      class="control-button"
                      icon="mdi:arrow-left"
                      @click="${() => this._sendButtonCommand("BACK")}"
                    ></ha-icon-button
                    >${this._config.show_button_labels
                      ? html`<span class="button-label">terug</span>`
                      : ""}
                  </div>
                  <div class="control-button-wrapper">
                    <ha-icon-button
                      class="control-button ${isTvOn &&
                      currentSource.toLowerCase() === "home"
                        ? "active"
                        : ""}"
                      icon="mdi:home"
                      @click="${() => this._sendButtonCommand("HOME")}"
                    ></ha-icon-button
                    >${this._config.show_button_labels
                      ? html`<span class="button-label">home</span>`
                      : ""}
                  </div>
                  <div class="control-button-wrapper">
                    <ha-icon-button
                      class="control-button"
                      icon="mdi:menu"
                      @click="${() => this._sendButtonCommand("MENU")}"
                    ></ha-icon-button
                    >${this._config.show_button_labels
                      ? html`<span class="button-label">menu</span>`
                      : ""}
                  </div>
                </div>
              `
            : ""}

          <!-- Extra LG webOS remote tools -->
          ${this._config.show_extra_actions
            ? html`
                <div class="button-row extra-actions">
                  <ha-icon-button
                    icon="mdi:information-outline"
                    title="Info"
                    @click="${() => this._sendButtonCommand("INFO")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:television-classic"
                    title="Live TV"
                    @click="${() => this._sendButtonCommand("LIVETV")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:cog"
                    title="Dashboard Instellingen"
                    @click="${() => this._sendButtonCommand("DASHBOARD")}"
                  ></ha-icon-button>
                </div>
              `
            : ""}

          <!-- Volumeregeling -->
          ${this._config.show_volume
            ? html`
                ${this._config.show_label_volume
                  ? html`<div class="section-label">
                      ${this._config.label_volume}
                    </div>`
                  : ""}
                <div class="volume-row">
                  <ha-icon-button
                    icon="mdi:volume-minus"
                    @click="${() => this._sendMediaCommand("volume_down")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:volume-mute"
                    @click="${() => this._sendMediaCommand("volume_mute")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:volume-plus"
                    @click="${() => this._sendMediaCommand("volume_up")}"
                  ></ha-icon-button>
                </div>
              `
            : ""}

          <!-- App Launcher met registersupport en handmatige overrides -->
          ${this._config.show_apps &&
          this._config.apps &&
          this._config.apps.length > 0
            ? html`
                <div class="apps-row">
                  ${this._config.apps.map((app) => {
                    let name = "";
                    let icon = "mdi:television-play";
                    let appKey = "";

                    if (typeof app === "string") {
                      appKey = app.toLowerCase();
                      const defaultApp = DEFAULT_APPS[appKey];
                      name = defaultApp ? defaultApp.name : app;
                      icon = defaultApp
                        ? defaultApp.icon
                        : "mdi:television-play";
                    } else {
                      appKey = app.id
                        ? app.id.toLowerCase()
                        : app.name
                          ? app.name.toLowerCase()
                          : "";
                      const defaultApp = DEFAULT_APPS[appKey];
                      name = app.name || (defaultApp ? defaultApp.name : "");
                      icon =
                        app.icon ||
                        (defaultApp ? defaultApp.icon : "mdi:television-play");
                    }

                    // Match de actieve statuskleur op basis van de webOS bronnaam
                    const defaultAppInfo = DEFAULT_APPS[appKey];
                    const matchSource = defaultAppInfo
                      ? defaultAppInfo.source.toLowerCase()
                      : name.toLowerCase();
                    const isActive =
                      isTvOn && currentSource.toLowerCase() === matchSource;

                    return html`
                      <ha-icon-button
                        class="app-button ${isActive ? "active" : ""}"
                        icon="${icon}"
                        title="${name}"
                        @click="${() => this._launchLGApp(appKey || name)}"
                      >
                      </ha-icon-button>
                    `;
                  })}
                </div>
              `
            : ""}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 16px;
      border-radius: 12px;
    }
    .card-header {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 8px;
    }
    .section-label {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      opacity: 0.5;
      text-align: center;
      margin-top: 14px;
    }
    .top-control-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .power-btn {
      color: var(--error-color, #db4437);
    }
    .power-btn.active {
      color: var(--success-color, #4caf50);
    }
    .dpad-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px 0;
    }
    .dpad-row {
      display: flex;
      justify-content: center;
    }
    .dpad-button {
      --mdc-icon-size: 38px;
    }
    .ok {
      --mdc-icon-size: 46px;
      margin: 0 16px;
      color: var(--primary-color);
    }
    .button-row,
    .volume-row,
    .apps-row {
      display: flex;
      justify-content: space-around;
      margin: 12px 0;
      align-items: center;
    }
    .extra-actions {
      background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
      border-radius: 8px;
      padding: 2px 0;
    }
    .control-button-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .button-label {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 2px;
    }
    .active {
      color: var(--accent-color, #ff9800);
    }
    ha-icon-button {
      color: var(--primary-text-color);
    }
    .app-button.active {
      border-bottom: 2px solid var(--accent-color, #ff9800);
      border-radius: 0;
    }
  `;
}
