import type { OklchColour } from '@/types';

// OKLab to linear RGB matrix (Bjorn Ottosson)
function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

function oklchToOklab(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

function oklabToOklch(L: number, a: number, b: number): OklchColour {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

// Gamma encoding/decoding
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function srgbToLinear(c: number): number {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// OKLCH → hex
export function oklchToHex(colour: OklchColour): string {
  const [L, a, b] = oklchToOklab(colour.l, colour.c, colour.h);
  const [lr, lg, lb] = oklabToLinearRgb(L, a, b);
  const r = Math.round(clamp01(linearToSrgb(lr)) * 255);
  const g = Math.round(clamp01(linearToSrgb(lg)) * 255);
  const bl = Math.round(clamp01(linearToSrgb(lb)) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function oklchToRgb(colour: OklchColour): [number, number, number] {
  const [L, a, b] = oklchToOklab(colour.l, colour.c, colour.h);
  const [lr, lg, lb] = oklabToLinearRgb(L, a, b);
  return [
    Math.round(clamp01(linearToSrgb(lr)) * 255),
    Math.round(clamp01(linearToSrgb(lg)) * 255),
    Math.round(clamp01(linearToSrgb(lb)) * 255),
  ];
}

// hex → OKLCH
export function hexToOklch(hex: string): OklchColour {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r / 255);
  const lg = srgbToLinear(g / 255);
  const lb = srgbToLinear(b / 255);
  const [L, a, bOk] = linearRgbToOklab(lr, lg, lb);
  return oklabToOklch(L, a, bOk);
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

// Check if OKLCH colour is within sRGB gamut
export function isInGamut(colour: OklchColour): boolean {
  const [L, a, b] = oklchToOklab(colour.l, colour.c, colour.h);
  const [lr, lg, lb] = oklabToLinearRgb(L, a, b);
  const eps = 0.001;
  return (
    lr >= -eps && lr <= 1 + eps &&
    lg >= -eps && lg <= 1 + eps &&
    lb >= -eps && lb <= 1 + eps
  );
}

// Clamp to sRGB gamut by reducing chroma
export function gamutClamp(colour: OklchColour): OklchColour {
  if (isInGamut(colour)) return colour;

  let lo = 0;
  let hi = colour.c;
  let mid = colour.c;

  for (let i = 0; i < 20; i++) {
    mid = (lo + hi) / 2;
    if (isInGamut({ ...colour, c: mid })) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return { ...colour, c: lo };
}

// WCAG 2.1 relative luminance
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r / 255) + 0.7152 * srgbToLinear(g / 255) + 0.0722 * srgbToLinear(b / 255);
}

// WCAG 2.1 contrast ratio
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'fail';

export function wcagLevel(ratio: number, largeText = false): WcagLevel {
  if (largeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}

// Validate hex string
export function isValidHex(hex: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

export function normaliseHex(hex: string): string {
  const clean = hex.replace('#', '');
  return `#${clean.toLowerCase()}`;
}
