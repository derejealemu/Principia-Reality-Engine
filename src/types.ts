export interface VisualizationControl {
  id: string;
  label: string;
  type: 'range' | 'boolean'; // extendable for later
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean;
}

export interface VisualizationData {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  setupCode: string;
  animationCode: string;
  explanation: string;
  controls?: VisualizationControl[];
}

export interface ViewSettings {
  zoom: number;
  autoRotate: boolean;
  bloomStrength: number;
  color1: string;
  color2: string;
}

export interface SharedState {
  v: VisualizationData;
  p: Record<string, number | boolean>;
  c: ViewSettings;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  VISUALIZING = 'VISUALIZING',
  ERROR = 'ERROR',
}