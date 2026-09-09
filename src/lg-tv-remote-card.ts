import { LitElement, html, css, TemplateResult, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCard } from "custom-card-helpers";
import { LGRemoteCardConfig, LGSourceConfig } from "./types";

@customElement("lg-webos-remote-card")
export class LGWebOSRemoteCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: LGRemoteCardConfig;

  public setConfig(config: LGRemoteCardConfig): void {
    if (!config.entity) {
      throw new Error("Geef een geldige LG WebOS media_player entiteit op.");
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

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config")) return true;
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;

    // Alleen updaten als de status van de TV of de receiver verandert
    return (
      oldHass.states[this._config.entity] !==
        this.hass.states[this._config.entity] ||
      (!!this._config.ampli_entity &&
        oldHass.states[this._config.ampli_entity] !==
          this.hass.states[this._config.ampli_entity])
    );
  }

  private _callService(
    service: string,
    serviceData: any = {},
    domain = "media_player",
  ): void {
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...serviceData,
    });
  }

  private _handleVolume(
    action: "volume_up" | "volume_down" | "volume_mute",
  ): void {
    // Als er een receiver is ingesteld, sturen we de volume-acties daarheen
    const targetEntity = this._config.ampli_entity || this._config.entity;
    const domain = targetEntity.startsWith("media_player.")
      ? "media_player"
      : "button";

    this.hass.callService(domain, action, {
      entity_id: targetEntity,
    });
  }

  private _handlePower(): void {
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj || stateObj.state === "off") {
      if (this._config.mac) {
        // Gebruik wake_on_lan service als er een MAC-adres is geconfigureerd
        this.hass.callService("wake_on_lan", "send_magic_packet", {
          mac: this._config.mac,
        });
      } else {
        this._callService("turn_on");
      }
    } else {
      this._callService("turn_off");
    }
  }

  private _handleSource(sourceName: string): void {
    this._callService("select_source", { source: sourceName });
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) return html``;

    const stateObj = this.hass.states[this._config.entity];
    const isOn = stateObj && stateObj.state !== "off";
    const currentSource = stateObj?.attributes?.source;

    // Dynamische CSS variabelen toepassen op basis van de config (net als in jouw repo)
    const scale = this._config.dimensions?.scale || 1;
    const borderWidth = this._config.dimensions?.border_width || "1px";
    const btnColor =
      this._config.colors?.buttons ||
      "var(--deactive-background-button-color, #f2f0fa)";
    const txtColor = this._config.colors?.texts || "var(--primary-text-color)";
    const bgColor =
      this._config.colors?.background || "var(--primary-background-color)";
    const borderColor =
      this._config.colors?.border || "var(--app-header-text-color, #ccc)";

    return html`
      <ha-card
        style="
        --remote-scale: ${scale};
        --remote-border-width: ${borderWidth};
        --remote-btn-color: ${btnColor};
        --remote-txt-color: ${txtColor};
        --remote-bg-color: ${bgColor};
        --remote-border-color: ${borderColor};
      "
      >
        ${this._config.show_title && this._config.title
          ? html`<div class="title">${this._config.title}</div>`
          : ""}

        <!-- Power Button -->
        <div class="row central">
          <ha-icon-button
            class="btn power ${isOn ? "on" : ""}"
            @click=${this._handlePower}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </ha-icon-button>
        </div>

        <!-- Navigation Section -->
        ${this._config.show_navigation
          ? html`
              ${this._config.show_label_navigation
                ? html`<div class="label">
                    ${this._config.label_navigation}
                  </div>`
                : ""}
              <div class="dpad">
                <div class="row central">
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "UP",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:chevron-up"></ha-icon
                  ></ha-icon-button>
                </div>
                <div class="row space-betweenHorizontal">
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "LEFT",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:chevron-left"></ha-icon
                  ></ha-icon-button>
                  <button
                    class="btn ok-btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "ENTER",
                        media_content_type: "button",
                      })}
                  >
                    OK
                  </button>
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "RIGHT",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:chevron-right"></ha-icon
                  ></ha-icon-button>
                </div>
                <div class="row central">
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "DOWN",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:chevron-down"></ha-icon
                  ></ha-icon-button>
                </div>
              </div>
            `
          : ""}

        <!-- Control Buttons (Back / Home) -->
        ${this._config.show_buttons
          ? html`
              <div class="row space-around">
                <div class="btn-container">
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "BACK",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:arrow-left"></ha-icon
                  ></ha-icon-button>
                  ${this._config.show_button_labels
                    ? html`<span class="btn-label">terug</span>`
                    : ""}
                </div>
                <div class="btn-container">
                  <ha-icon-button
                    class="btn"
                    @click=${() =>
                      this._callService("play_media", {
                        media_content_id: "HOME",
                        media_content_type: "button",
                      })}
                    ><ha-icon icon="mdi:home"></ha-icon
                  ></ha-icon-button>
                  ${this._config.show_button_labels
                    ? html`<span class="btn-label">home</span>`
                    : ""}
                </div>
              </div>
            `
          : ""}

        <!-- App Launcher Bar -->
        ${this._config.show_apps &&
        this._config.sources &&
        this._config.sources.length > 0
          ? html`
              <div class="apps-containerRow">
                ${this._config.sources.map((src: LGSourceConfig) => {
                  const isAppActive =
                    currentSource?.toLowerCase() === src.name.toLowerCase();
                  return html`
                    <ha-icon-button
                      class="btn app-btn ${isAppActive ? "active-app" : ""}"
                      @click=${() => this._handleSource(src.name)}
                    >
                      ${src.icon === "disney" || src.icon === "amazon"
                        ? html`<span class="special-icon">${src.icon}</span>`
                        : html`<ha-icon icon="${src.icon}"></ha-icon>`}
                    </ha-icon-button>
                  `;
                })}
              </div>
            `
          : ""}

        <!-- Volume Section -->
        ${this._config.show_volume
          ? html`
              ${this._config.show_label_volume
                ? html`<div class="label">${this._config.label_volume}</div>`
                : ""}
              <div class="row space-betweenHorizontal volume-row">
                <ha-icon-button
                  class="btn"
                  @click=${() => this._handleVolume("volume_down")}
                  ><ha-icon icon="mdi:volume-minus"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  class="btn"
                  @click=${() => this._handleVolume("volume_mute")}
                  ><ha-icon icon="mdi:volume-off"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  class="btn"
                  @click=${() => this._handleVolume("volume_up")}
                  ><ha-icon icon="mdi:volume-plus"></ha-icon
                ></ha-icon-button>
              </div>
            `
          : ""}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        background-color: var(--remote-bg-color);
        border: var(--remote-border-width) solid var(--remote-border-color);
        padding: calc(16px * var(--remote-scale));
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(var(--remote-scale));
        transform-origin: top center;
      }
      .title {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--remote-txt-color);
      }
      .label {
        font-size: 0.8em;
        text-transform: uppercase;
        margin: 8px 0;
        color: var(--remote-txt-color);
        opacity: 0.7;
      }
      .row {
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 4px 0;
      }
      .central {
        justify-content: center;
      }
      .space-around {
        justify-content: space-around;
        width: 100%;
      }
      .space-betweenHorizontal {
        justify-content: space-between;
        width: 80%;
      }
      .dpad {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 8px 0;
      }
      .btn {
        background-color: var(--remote-btn-color);
        color: var(--remote-txt-color);
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        transition: background-color 0.2s;
      }
      .ok-btn {
        border-radius: 12px;
        font-weight: bold;
        width: 54px;
        height: 48px;
      }
      .power.on {
        background-color: #ef5350;
        color: white;
      }
      .btn-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .btn-label {
        font-size: 0.75em;
        margin-top: 2px;
        color: var(--remote-txt-color);
      }
      .apps-containerRow {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin: 12px 0;
      }
      .active-app {
        border: 2px solid var(--accent-color, #03a9f4);
        box-shadow: 0 0 8px var(--accent-color, #03a9f4);
      }
      .special-icon {
        font-size: 0.7em;
        font-weight: bold;
        text-transform: uppercase;
      }
      .volume-row {
        margin-top: 8px;
      }
    `;
  }

  public getCardSize(): number {
    return 5;
  }
}
