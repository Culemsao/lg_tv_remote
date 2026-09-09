import { LovelaceCardConfig } from "custom-card-helpers";

export interface AppConfig {
  id?: string;
  name: string;
  icon?: string;
}

export interface CardConfig extends LovelaceCardConfig {
  remote_entity: string;
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
