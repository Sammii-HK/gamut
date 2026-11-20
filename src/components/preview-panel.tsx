"use client";

import type { Palette, PreviewMode, SemanticTokens } from "@/types";
import { resolveAllTokens, buildPaletteMap, paletteNames } from "@/lib/tokens";
import { ModeToggle } from "./mode-toggle";
import { ButtonPreview } from "./preview/button-preview";
import { CardPreview } from "./preview/card-preview";
import { InputPreview } from "./preview/input-preview";
import { TypographyPreview } from "./preview/typography-preview";

interface PreviewPanelProps {
  palettes: Palette[];
  tokens: SemanticTokens;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
}

export function PreviewPanel({
  palettes,
  tokens,
  mode,
  onModeChange,
}: PreviewPanelProps) {
  const paletteMap = buildPaletteMap(palettes);
  // Resolve semantic tokens for current mode
  const resolved = resolveAllTokens(tokens, paletteMap, mode);

  // Also set raw scale vars for any direct references
  const scaleVars: Record<string, string> = {};
  for (const p of palettes) {
    for (const s of p.steps) {
      scaleVars[`--${paletteNames(palettes).get(p.id)}-${s.step}`] = s.hex;
    }
  }

  return (
    <section id="preview" className="space-y-3 scroll-mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-300">Preview</h2>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>

      <div
        className="rounded-xl border border-neutral-800 p-6 space-y-6 transition-colors duration-300"
        style={{
          ...scaleVars,
          ...resolved,
          backgroundColor: resolved["--background"],
          color: resolved["--text-primary"],
        }}
      >
        <TypographyPreview />
        <ButtonPreview />
        <InputPreview />
        <CardPreview />
      </div>
    </section>
  );
}
