export interface OklchColour {
  l: number; // 0–1
  c: number; // 0–0.4
  h: number; // 0–360
}

export interface ColourStep {
  step: number;
  oklch: OklchColour;
  hex: string;
  rgb: [number, number, number];
}

export interface Palette {
  name: string;
  baseHex: string;
  baseOklch: OklchColour;
  steps: ColourStep[];
}

export type ExportFormat = 'css' | 'tailwind' | 'json' | 'figma';

export type PreviewMode = 'light' | 'dark';

export interface Scale {
  id: string;
  name: string;
  baseHex: string;
  role: ScaleRole;
}

export type ScaleRole = 'primary' | 'secondary' | 'accent' | 'neutral' | 'custom';

export interface SemanticTokens {
  // Surface / background
  background: { scale: string; lightStep: number; darkStep: number };
  surface: { scale: string; lightStep: number; darkStep: number };
  surfaceRaised: { scale: string; lightStep: number; darkStep: number };
  // Text
  textPrimary: { scale: string; lightStep: number; darkStep: number };
  textSecondary: { scale: string; lightStep: number; darkStep: number };
  textMuted: { scale: string; lightStep: number; darkStep: number };
  // Border
  border: { scale: string; lightStep: number; darkStep: number };
  borderStrong: { scale: string; lightStep: number; darkStep: number };
  // Interactive
  primarySolid: { scale: string; lightStep: number; darkStep: number };
  primaryText: { scale: string; lightStep: number; darkStep: number };
  primarySubtle: { scale: string; lightStep: number; darkStep: number };
  secondarySolid: { scale: string; lightStep: number; darkStep: number };
  accentSolid: { scale: string; lightStep: number; darkStep: number };
}

export interface Theme {
  scales: Scale[];
  activeScaleId: string;
  mode: PreviewMode;
  tokens: SemanticTokens;
}
