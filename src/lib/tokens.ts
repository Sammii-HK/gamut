import type { SemanticTokens } from '@/types';

export function defaultTokens(scales: { id: string; role: string }[]): SemanticTokens {
  const primary = scales.find((s) => s.role === 'primary')?.id ?? scales[0]?.id ?? 'primary';
  const secondary = scales.find((s) => s.role === 'secondary')?.id ?? primary;
  const accent = scales.find((s) => s.role === 'accent')?.id ?? primary;
  const neutral = scales.find((s) => s.role === 'neutral')?.id ?? primary;

  return {
    background: { scale: neutral, lightStep: 50, darkStep: 950 },
    surface: { scale: neutral, lightStep: 50, darkStep: 900 },
    surfaceRaised: { scale: neutral, lightStep: 100, darkStep: 800 },
    textPrimary: { scale: neutral, lightStep: 900, darkStep: 50 },
    textSecondary: { scale: neutral, lightStep: 600, darkStep: 400 },
    textMuted: { scale: neutral, lightStep: 400, darkStep: 600 },
    border: { scale: neutral, lightStep: 200, darkStep: 800 },
    borderStrong: { scale: neutral, lightStep: 300, darkStep: 700 },
    primarySolid: { scale: primary, lightStep: 500, darkStep: 500 },
    primaryText: { scale: primary, lightStep: 50, darkStep: 50 },
    primarySubtle: { scale: primary, lightStep: 100, darkStep: 900 },
    secondarySolid: { scale: secondary, lightStep: 500, darkStep: 400 },
    accentSolid: { scale: accent, lightStep: 500, darkStep: 400 },
  };
}

export function resolveToken(
  token: { scale: string; lightStep: number; darkStep: number },
  palettes: Map<string, Map<number, string>>,
  mode: 'light' | 'dark'
): string {
  const step = mode === 'light' ? token.lightStep : token.darkStep;
  return palettes.get(token.scale)?.get(step) ?? '#888888';
}

export function resolveAllTokens(
  tokens: SemanticTokens,
  palettes: Map<string, Map<number, string>>,
  mode: 'light' | 'dark'
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, token] of Object.entries(tokens)) {
    resolved[`--${camelToKebab(key)}`] = resolveToken(
      token as { scale: string; lightStep: number; darkStep: number },
      palettes,
      mode
    );
  }
  return resolved;
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
