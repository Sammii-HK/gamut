import type { SemanticTokens } from "@/types";

export function defaultTokens(
  scales: { id: string; role: string }[],
): SemanticTokens {
  const primary =
    scales.find((s) => s.role === "primary")?.id ?? scales[0]?.id ?? "primary";
  const secondary = scales.find((s) => s.role === "secondary")?.id ?? primary;
  const accent = scales.find((s) => s.role === "accent")?.id ?? primary;
  const neutral = scales.find((s) => s.role === "neutral")?.id ?? primary;

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
  mode: "light" | "dark",
): string {
  const step = mode === "light" ? token.lightStep : token.darkStep;
  return palettes.get(token.scale)?.get(step) ?? "#888888";
}

export function resolveAllTokens(
  tokens: SemanticTokens,
  palettes: Map<string, Map<number, string>>,
  mode: "light" | "dark",
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, token] of Object.entries(tokens)) {
    resolved[`--${camelToKebab(key)}`] = resolveToken(
      token as { scale: string; lightStep: number; darkStep: number },
      palettes,
      mode,
    );
  }
  return resolved;
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Semantic references always use identity, never the editable display name. */
export function buildPaletteMap(
  palettes: import("@/types").Palette[],
): Map<string, Map<number, string>> {
  return new Map(
    palettes.map((palette) => [
      palette.id,
      new Map(palette.steps.map((step) => [step.step, step.hex])),
    ]),
  );
}

/** Safe, unique names for export keys, including duplicate or empty labels. */
export function paletteNames(
  palettes: import("@/types").Palette[],
): Map<string, string> {
  const used = new Set([
    "semantic-light",
    "semantic-dark",
    "__proto__",
    "constructor",
    "prototype",
  ]);
  const result = new Map<string, string>();
  for (const palette of palettes) {
    const slug = palette.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const base = "scale-" + (slug || palette.id).replace(/[^a-z0-9_-]+/g, "-");
    const preferred = /^[a-z_]/.test(slug) ? slug : base;
    let name = preferred,
      suffix = 2;
    while (used.has(name)) name = `${preferred}-${suffix++}`;
    used.add(name);
    result.set(palette.id, name);
  }
  return result;
}
