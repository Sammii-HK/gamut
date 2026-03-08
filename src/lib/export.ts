import type { Palette, ExportFormat, SemanticTokens, PreviewMode } from '@/types';
import { resolveAllTokens } from './tokens';

export function exportTheme(
  palettes: Palette[],
  tokens: SemanticTokens,
  mode: PreviewMode,
  format: ExportFormat
): string {
  switch (format) {
    case 'css':
      return exportCss(palettes, tokens, mode);
    case 'tailwind':
      return exportTailwind(palettes);
    case 'json':
      return exportJson(palettes, tokens, mode);
    case 'figma':
      return exportFigma(palettes, tokens);
  }
}

// Keep single-palette export for backwards compat
export function exportPalette(palette: Palette, format: ExportFormat): string {
  if (format === 'figma') return exportFigma([palette], {} as SemanticTokens);
  if (format === 'css') return exportCssSingle(palette);
  if (format === 'tailwind') return exportTailwind([palette]);
  return exportJsonSingle(palette);
}

function exportCssSingle(palette: Palette): string {
  const lines = palette.steps.map(
    (s) => `  --${palette.name}-${s.step}: ${s.hex};`
  );
  return `:root {\n${lines.join('\n')}\n}`;
}

function exportCss(palettes: Palette[], tokens: SemanticTokens, mode: PreviewMode): string {
  const paletteMap = buildPaletteMap(palettes);
  const resolved = resolveAllTokens(tokens, paletteMap, mode);

  const scaleLines: string[] = [];
  for (const p of palettes) {
    scaleLines.push(`  /* ${p.name} */`);
    for (const s of p.steps) {
      scaleLines.push(`  --${p.name}-${s.step}: ${s.hex};`);
    }
    scaleLines.push('');
  }

  const tokenLines = Object.entries(resolved).map(
    ([key, val]) => `  ${key}: ${val};`
  );

  return `:root {\n${scaleLines.join('\n')}\n  /* Semantic tokens (${mode}) */\n${tokenLines.join('\n')}\n}`;
}

function exportTailwind(palettes: Palette[]): string {
  const colorEntries = palettes.map((p) => {
    const steps = p.steps.map((s) => `        ${s.step}: '${s.hex}',`);
    return `      ${p.name}: {\n${steps.join('\n')}\n      },`;
  });

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colorEntries.join('\n')}\n      },\n    },\n  },\n};`;
}

function exportJsonSingle(palette: Palette): string {
  const obj: Record<string, string> = {};
  for (const s of palette.steps) {
    obj[s.step] = s.hex;
  }
  return JSON.stringify({ [palette.name]: obj }, null, 2);
}

function exportJson(palettes: Palette[], tokens: SemanticTokens, mode: PreviewMode): string {
  const paletteMap = buildPaletteMap(palettes);
  const resolved = resolveAllTokens(tokens, paletteMap, mode);

  const scales: Record<string, Record<string, string>> = {};
  for (const p of palettes) {
    scales[p.name] = {};
    for (const s of p.steps) {
      scales[p.name][s.step] = s.hex;
    }
  }

  return JSON.stringify({ scales, tokens: resolved }, null, 2);
}

function exportFigma(palettes: Palette[], tokens: SemanticTokens): string {
  const result: Record<string, Record<string, { value: string; type: string }>> = {};

  for (const p of palettes) {
    result[p.name] = {};
    for (const s of p.steps) {
      result[p.name][`${s.step}`] = { value: s.hex, type: 'color' };
    }
  }

  if (tokens && Object.keys(tokens).length > 0) {
    const paletteMap = buildPaletteMap(palettes);

    result['semantic-light'] = {};
    const lightResolved = resolveAllTokens(tokens, paletteMap, 'light');
    for (const [key, val] of Object.entries(lightResolved)) {
      result['semantic-light'][key.replace('--', '')] = { value: val, type: 'color' };
    }

    result['semantic-dark'] = {};
    const darkResolved = resolveAllTokens(tokens, paletteMap, 'dark');
    for (const [key, val] of Object.entries(darkResolved)) {
      result['semantic-dark'][key.replace('--', '')] = { value: val, type: 'color' };
    }
  }

  return JSON.stringify(result, null, 2);
}

function buildPaletteMap(palettes: Palette[]): Map<string, Map<number, string>> {
  const map = new Map<string, Map<number, string>>();
  for (const p of palettes) {
    const stepMap = new Map<number, string>();
    for (const s of p.steps) {
      stepMap.set(s.step, s.hex);
    }
    map.set(p.name, stepMap);
  }
  return map;
}
