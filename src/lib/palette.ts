import type { ColourStep, OklchColour, Palette } from "@/types";
import { gamutClamp, hexToOklch, oklchToHex, oklchToRgb } from "./colour.ts";

// Tailwind-style lightness targets in OKLCH L (0–1)
const STEP_CONFIG: { step: number; lightness: number; chromaScale: number }[] =
  [
    { step: 50, lightness: 0.97, chromaScale: 0.25 },
    { step: 100, lightness: 0.93, chromaScale: 0.35 },
    { step: 200, lightness: 0.87, chromaScale: 0.5 },
    { step: 300, lightness: 0.78, chromaScale: 0.7 },
    { step: 400, lightness: 0.68, chromaScale: 0.9 },
    { step: 500, lightness: 0.55, chromaScale: 1.0 },
    { step: 600, lightness: 0.48, chromaScale: 0.95 },
    { step: 700, lightness: 0.4, chromaScale: 0.85 },
    { step: 800, lightness: 0.32, chromaScale: 0.7 },
    { step: 900, lightness: 0.24, chromaScale: 0.55 },
    { step: 950, lightness: 0.16, chromaScale: 0.4 },
  ];

export function generatePalette(
  baseHex: string,
  name = "primary",
  id = name,
): Palette {
  const baseOklch = hexToOklch(baseHex);

  const steps: ColourStep[] = STEP_CONFIG.map(
    ({ step, lightness, chromaScale }) => {
      const raw: OklchColour = {
        l: lightness,
        c: baseOklch.c * chromaScale,
        h: baseOklch.h,
      };

      const clamped = gamutClamp(raw);
      const hex = oklchToHex(clamped);
      const rgb = oklchToRgb(clamped);

      return { step, oklch: clamped, hex, rgb };
    },
  );

  return { id, name, baseHex, baseOklch, steps };
}

export const STEPS = STEP_CONFIG.map((s) => s.step);
