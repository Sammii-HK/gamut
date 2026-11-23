"use client";

import { useState } from "react";
import type {
  ExportFormat,
  Palette,
  SemanticTokens,
  PreviewMode,
} from "@/types";
import { exportTheme } from "@/lib/export";
import { CopyButton } from "./copy-button";

interface ExportPanelProps {
  palettes: Palette[];
  tokens: SemanticTokens;
  mode: PreviewMode;
}

const formats: { id: ExportFormat; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "json", label: "JSON" },
  { id: "figma", label: "Style Dictionary" },
];

export function ExportPanel({ palettes, tokens, mode }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const output = exportTheme(palettes, tokens, mode, format);

  return (
    <section id="export" className="space-y-3 scroll-mt-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <h2 className="text-sm font-medium text-ink-soft">Export</h2>
        <div className="flex flex-wrap gap-1 bg-wash/50 rounded-lg p-1">
          {formats.map((f) => (
            <button
              key={f.id}
              aria-pressed={format === f.id}
              onClick={() => setFormat(f.id)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                format === f.id
                  ? "bg-segment-active text-ink"
                  : "text-ink-muted hover:text-ink-strong"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-faint">
        Names become unique export keys. Semantic colours follow each scale even
        when you rename it.
      </p>
      <div className="relative">
        <pre className="bg-panel border border-line rounded-lg p-4 text-xs font-mono text-ink-soft overflow-x-auto max-h-80">
          {output}
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={output} />
        </div>
      </div>
    </section>
  );
}
