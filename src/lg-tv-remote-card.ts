import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from "custom-card-helpers";

// Gecorrigeerde DEFAULT_APPS: Structuur identiek aan origineel, maar met LG webOS App IDs en bronnamen
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
  remote_entity: string;
  media_entity: string;
  volume_entity?: string;
  title?: string;
  show_title?: boolean;
  show_navigation?: boolean;
  show_buttons?: boolean;
  show_apps?: boolean;
  show_volume?: boolean;
  show_label_navigation?: boolean;
  show_label_volume?: boolean;
  show_button_labels?: boolean;
  label_navigation?: string;
  label_volume?: string;
  apps?: (string | AppConfig)[];
}

@customElement("google-tv-remote-card")
export class GoogleTVRemoteCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;

  public setConfig(config: CardConfig): void {
    if (!config.remote_entity || !config.media_entity) {
      throw new Error("Zowel remote_entity als media_entity zijn verplicht.");
    }
    this._config = {
      show_title: true,
      show_navigation: true,
      show_buttons: true,
      show_apps: true,
      show_volume: true,
      show_label_navigation: true,
      show_label_volume: true,
      show_button_labels: true,
      label_navigation: "navigatie",
      label_volume: "volume",
      ...config,
    };
  }
  // Aangepast naar webostv.button integratieservice
  private _handleAction(buttonCode: string): void {
    this.hass.callService("webostv", "button", {
      entity_id: this._config.remote_entity,
      button: buttonCode,
    });
  }

  // Volumeregeling conform de originele logica (scheiding tussen media_entity en volume_entity)
  private _handleVolume(service: string): void {
    const targetEntity =
      this._config.volume_entity || this._config.media_entity;
    this.hass.callService("media_player", service, {
      entity_id: targetEntity,
    });
  }

  // App Launcher aangepast naar de select_source methodiek van webOS
  private _launchApp(appIdentifier: string): void {
    const defaultApp = DEFAULT_APPS[appIdentifier.toLowerCase()];
    const finalSource = defaultApp ? defaultApp.appId : appIdentifier;

    this.hass.callService("media_player", "select_source", {
      entity_id: this._config.media_entity,
      source: finalSource,
    });
  }
  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const mediaState = this.hass.states[this._config.media_entity];
    const isTvOn =
      mediaState &&
      mediaState.state !== "off" &&
      mediaState.state !== "unavailable";
    const currentSource = mediaState?.attributes?.source || "";

    return html`
      <ha-card .header="${this._config.show_title ? this._config.title : ""}">
        <!-- D-pad navigatie sectie -->
        ${this._config.show_navigation
          ? html`
              ${this._config.show_label_navigation
                ? html`<div class="section-label">
                    ${this._config.label_navigation}
                  </div>`
                : ""}
              <div class="dpad-container">
                <div class="dpad">
                  <ha-icon-button
                    class="dpad-button up"
                    icon="mdi:chevron-up"
                    @click="${() => this._handleAction("UP")}"
                  ></ha-icon-button>
                  <div class="dpad-row">
                    <ha-icon-button
                      class="dpad-button left"
                      icon="mdi:chevron-left"
                      @click="${() => this._handleAction("LEFT")}"
                    ></ha-icon-button>
                    <ha-icon-button
                      class="dpad-button ok"
                      icon="mdi:checkbox-blank-circle"
                      @click="${() => this._handleAction("ENTER")}"
                    ></ha-icon-button>
                    <ha-icon-button
                      class="dpad-button right"
                      icon="mdi:chevron-right"
                      @click="${() => this._handleAction("RIGHT")}"
                    ></ha-icon-button>
                  </div>
                  <ha-icon-button
                    class="dpad-button down"
                    icon="mdi:chevron-down"
                    @click="${() => this._handleAction("DOWN")}"
                  ></ha-icon-button>
                </div>
              </div>
            `
          : ""}

        <!-- Knoppen sectie (Terug en Home) -->
        ${this._config.show_buttons
          ? html`
              <div class="button-container">
                <div class="button-wrapper">
                  <ha-icon-button
                    class="remote-button"
                    icon="mdi:arrow-left"
                    @click="${() => this._handleAction("BACK")}"
                  ></ha-icon-button>
                  ${this._config.show_button_labels
                    ? html`<span class="button-label">terug</span>`
                    : ""}
                </div>
                <div class="button-wrapper">
                  <ha-icon-button
                    class="remote-button ${isTvOn &&
                    currentSource.toLowerCase() === "home"
                      ? "active"
                      : ""}"
                    icon="mdi:home"
                    @click="${() => this._handleAction("HOME")}"
                  ></ha-icon-button>
                  ${this._config.show_button_labels
                    ? html`<span class="button-label">home</span>`
                    : ""}
                </div>
              </div>
            `
          : ""}

        <!-- App Launcher sectie -->
        ${this._config.show_apps &&
        this._config.apps &&
        this._config.apps.length > 0
          ? html`
              <div class="apps-container">
                ${this._config.apps.map((app) => {
                  let name = "";
                  let icon = "mdi:television-play";
                  let appKey = "";
                  if (typeof app === "string") {
                    appKey = app.toLowerCase();
                    const defaultApp = DEFAULT_APPS[appKey];
                    name = defaultApp ? defaultApp.name : app;
                    icon = defaultApp ? defaultApp.icon : "mdi:television-play";
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
                      @click="${() => this._launchApp(appKey || name)}"
                    >
                    </ha-icon-button>
                  `;
                })}
              </div>
            `
          : ""}

        <!-- Volume regelaar sectie -->
        ${this._config.show_volume
          ? html`
              ${this._config.show_label_volume
                ? html`<div class="section-label">
                    ${this._config.label_volume}
                  </div>`
                : ""}
              <div class="volume-container">
                <ha-icon-button
                  icon="mdi:volume-minus"
                  @click="${() => this._handleVolume("volume_down")}"
                ></ha-icon-button>
                <ha-icon-button
                  icon="mdi:volume-mute"
                  @click="${() => this._handleVolume("volume_mute")}"
                ></ha-icon-button>
                <ha-icon-button
                  icon="mdi:volume-plus"
                  @click="${() => this._handleVolume("volume_up")}"
                ></ha-icon-button>
              </div>
            `
          : ""}
      </ha-card>
    `;
  }

  // Exact de originele styling uit de gedupliceerde repository
  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
    }
    .section-label {
      text-align: center;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 8px 0;
    }
    .dpad-container {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }
    .dpad {
      position: relative;
      width: 150px;
      height: 150px;
      background: var(--divider-color);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
    }
    .dpad-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .dpad-button {
      --mdc-icon-size: 32px;
    }
    .dpad-button.ok {
      background: var(--card-background-color);
      border-radius: 50%;
    }
    .button-container {
      display: flex;
      justify-content: space-around;
      margin: 16px 0;
    }
    .button-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .button-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    .apps-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 16px 0;
    }
    .app-button.active {
      color: var(--accent-color);
    }
    .volume-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }
    .remote-button.active {
      color: var(--accent-color);
    }
  `;
}
