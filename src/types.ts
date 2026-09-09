import { LovelaceCardConfig } from "custom-card-helpers";

export interface AppConfig {
  id?: string;
  name?: string;
  icon?: string;
  activity?: string;
  packageId?: string;
}

export interface RemoteCardConfig extends LovelaceCardConfig {
  type: string;
  remote_entity: string; // Jouw remote.lg_tv entiteit (voor webostv.button)
  media_entity: string; // Jouw media_player.lg_tv entiteit (voor de status en apps)
  volume_entity?: string; // Optionele losse entiteit voor audio (bijv. Sonos/ontvanger)
  title?: string;

  // Visuele weergave toggles (visibility switches)
  show_title?: boolean;
  show_navigation?: boolean;
  show_buttons?: boolean;
  show_apps?: boolean;
  show_volume?: boolean;

  // Label opties
  show_label_navigation?: boolean;
  show_label_volume?: boolean;
  show_button_labels?: boolean;
  label_navigation?: string;
  label_volume?: string;

  // De lijst met apps die op het dashboard getoond wordt
  apps?: (string | AppConfig)[];
}
