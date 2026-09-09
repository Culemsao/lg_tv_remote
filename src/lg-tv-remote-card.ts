import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from "custom-card-helpers";

// LG WebOS specifieke app-lijst met behoud van de originele register-structuur
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
  volume_entity?: string; // Losse volume-entiteit support (bijv. Sonos) uit origineel
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

@customElement("lg-tv-remote-card")
export class LGTVRemoteCard extends LitElement implements LovelaceCard {
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

  // Wordt aangeroepen door de navigatie en systeemenknoppen (UP, DOWN, ENTER, enz.)
  private _handleAction(buttonCode: string): void {
    this.hass.callService("webostv", "button", {
      entity_id: this._config.remote_entity,
      button: buttonCode,
    });
  }

  // Volumeregeling met ondersteuning voor de aparte volume_entity (zoals Sonos) uit de originele functionaliteit
  private _handleVolume(service: string): void {
    const targetEntity =
      this._config.volume_entity || this._config.media_entity;
    this.hass.callService("media_player", service, {
      entity_id: targetEntity,
    });
  }

  // App Launcher die de kortere defaults of handmatige overschrijvingen start via select_source
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
      <ha-card>
        ${this._config.show_title && this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ""}

        <div class="card-content">
          <!-- OORSPRONKELIJKE D-PAD INDELING MET GROTE TAP TARGETS -->
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

          <!-- OORSPRONKELIJKE TERUG- EN HOME-KNOPPEN MET REFRESH VAN STATE COLORS -->
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

          <!-- OORSPRONKELIJKE APP-LAUNCHER BAR INCLUSIEF HIGHLIGHT-STATE -->
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

          <!-- OORSPRONKELIJKE VOLUMEREGELAAR INTEGRATIE -->
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
        </div>
      </ha-card>
    `;
  }

  // DE EXACTE ORIGINELE CSS LAYOUT-STYLING UIT JE REPOSITORY
  static styles = css`
    ha-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
    }
    .card-header {
      font-family: var(--paper-font-headline_-_font-family);
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.012em;
      line-height: 32px;
      opacity: var(--dark-primary-opacity);
      padding: 24px 16px 16px;
      text-align: center;
    }
    .section-label {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      opacity: 0.5;
      text-align: center;
      margin-top: 16px;
      letter-spacing: 0.1em;
    }

    .dpad-container {
      display: flex;
      justify-content: center;
      margin: 24px 0;
    }
    .dpad {
      background: var(--secondary-background-color);
      border-radius: 50%;
      width: 180px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      box-sizing: border-box;
      position: relative;
    }
    .dpad-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      padding: 0 8px;
      box-sizing: border-box;
    }
    .dpad-button {
      --mdc-icon-size: 32px;
      color: var(--primary-text-color);
    }
    .dpad-button.ok {
      background: var(--card-background-color);
      border-radius: 50%;
      width: 56px;
      height: 56px;
      --mdc-icon-size: 28px;
      box-shadow: var(--shadow-elevation-2dp);
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
      width: 64px;
    }
    .remote-button {
      background: var(--secondary-background-color);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      --mdc-icon-size: 24px;
      color: var(--primary-text-color);
    }
    .button-label {
      font-size: 12px;
      opacity: 0.6;
      margin-top: 8px;
      text-transform: capitalize;
    }

    .apps-container {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin: 20px 0;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 16px;
    }
    .app-button {
      --mdc-icon-size: 26px;
      color: var(--primary-text-color);
      opacity: 0.7;
    }

    .volume-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px auto 8px;
      background: var(--secondary-background-color);
      border-radius: 24px;
      padding: 4px 8px;
      width: 85%;
      box-sizing: border-box;
    }
    .volume-container ha-icon-button {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }

    .active {
      color: var(--accent-color) !important;
      opacity: 1 !important;
    }
  `;
}
