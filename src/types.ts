import { LovelaceCardConfig } from "custom-card-helpers";

export interface LGRemoteCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string; // LG WebOS media_player entity
  mac?: string; // MAC address for turning the TV on
  ampli_entity?: string; // Optional AV receiver entity
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
  sources?: LGSourceConfig[];
  dimensions?: LGDimensionsConfig;
  colors?: LGColorsConfig;
}

export interface LGSourceConfig {
  name: string;
  icon: string;
}

export interface LGDimensionsConfig {
  scale?: number;
  border_width?: string;
}

export interface LGColorsConfig {
  buttons?: string;
  texts?: string;
  background?: string;
  border?: string;
}
