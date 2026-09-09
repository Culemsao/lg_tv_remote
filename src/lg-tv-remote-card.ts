import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from "custom-card-helpers";

interface AppConfig {
  id?: string;
  name: string;
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

@customElement("google-tv-remote-card")
export class LGTVRemoteCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;

  public setConfig(config: CardConfig): void {
    if (!config.remote_entity) {
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
      ...config,
    };
  }

  // Actie 1: Fysieke knoppen simuleren op de LG TV
  private _sendButtonCommand(webosButton: string): void {
    this.hass.callService("webostv", "button", {
      entity_id: this._config.remote_entity,
      button: webosButton,
    });
  }

  // Actie 2: Media player acties uitvoeren (zoals volume en aan/uit)
  private _sendMediaCommand(service: string): void {
    const targetEntity =
      this._config.media_entity || this._config.remote_entity;
    this.hass.callService("media_player", service, {
      entity_id: targetEntity,
    });
  }

  // Actie 3: Geavanceerde systeemmenu's openen via Luna commando's
  private _sendSpecialCommand(commandString: string): void {
    this.hass.callService("webostv", "command", {
      entity_id: this._config.remote_entity,
      command: commandString,
    });
  }

  // Actie 4: Apps openen op basis van de exacte naam (Input Source)
  private _launchLGApp(sourceName: string): void {
    const targetEntity =
      this._config.media_entity || this._config.remote_entity;
    this.hass.callService("media_player", "select_source", {
      entity_id: targetEntity,
      source: sourceName,
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
                      class="control-button ${isTvOn && currentSource === "Home"
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
                    title="Instellingen"
                    @click="${() => this._sendButtonCommand("DASHBOARD")}"
                  ></ha-icon-button>
                </div>
              `
            : ""}
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
          ${this._config.show_apps &&
          this._config.apps &&
          this._config.apps.length > 0
            ? html`
                <div class="apps-row">
                  ${this._config.apps.map((app) => {
                    const name = typeof app === "string" ? app : app.name;
                    const icon =
                      typeof app === "string"
                        ? "mdi:television-play"
                        : app.icon || "mdi:television-play";
                    return html`<ha-icon-button
                      class="app-button ${isTvOn &&
                      currentSource.toLowerCase() === name.toLowerCase()
                        ? "active"
                        : ""}"
                      icon="${icon}"
                      title="${name}"
                      @click="${() => this._launchLGApp(name)}"
                    ></ha-icon-button>`;
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
    }
    .section-label {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      opacity: 0.5;
      text-align: center;
      margin-top: 12px;
    }
    .top-control-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
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
      margin: 12px 0;
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
      margin: 0 12px;
      color: var(--primary-color);
    }
    .button-row,
    .volume-row,
    .apps-row {
      display: flex;
      justify-content: space-around;
      margin: 12px 0;
    }
    .extra-actions {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
    }
    .control-button-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .button-label {
      font-size: 11px;
      opacity: 0.6;
    }
    .active {
      color: var(--accent-color, #ff9800);
    }
    ha-icon-button {
      color: var(--primary-text-color);
    }
  `;
}
