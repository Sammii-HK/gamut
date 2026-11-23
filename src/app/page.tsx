"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ColourPicker } from "@/components/colour-picker";
import { PaletteDisplay } from "@/components/palette-display";
import { ContrastGrid } from "@/components/contrast-grid";
import { PreviewPanel } from "@/components/preview-panel";
import { ExportPanel } from "@/components/export-panel";
import { ScalesList } from "@/components/scales-list";
import { generatePalette } from "@/lib/palette";
import { defaultTokens } from "@/lib/tokens";
import { decodeState, updateUrl } from "@/lib/url";
import { Share2, Palette, ChevronDown } from "lucide-react";
import type { PreviewMode, Scale, ScaleRole } from "@/types";

const DEFAULT_SCALES: Scale[] = [
  { id: "primary", name: "primary", baseHex: "#3b82f6", role: "primary" },
  { id: "neutral", name: "neutral", baseHex: "#737373", role: "neutral" },
];

export default function Home() {
  const [scales, setScales] = useState<Scale[]>(DEFAULT_SCALES);
  const [activeScaleId, setActiveScaleId] = useState("primary");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light");
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareError, setShareError] = useState("");

  // Read URL params on mount
  useEffect(() => {
    const state = decodeState();
    if (state.scales?.length) setScales(state.scales);
    if (state.activeScaleId) setActiveScaleId(state.activeScaleId);
    if (state.mode) setPreviewMode(state.mode);
    setMounted(true);
  }, []);

  // Update URL when state changes
  useEffect(() => {
    if (!mounted) return;
    updateUrl({ scales, activeScaleId, mode: previewMode });
  }, [scales, activeScaleId, previewMode, mounted]);

  const activeScale = scales.find((s) => s.id === activeScaleId) ?? scales[0];

  // Generate all palettes
  const palettes = useMemo(
    () => scales.map((s) => generatePalette(s.baseHex, s.name, s.id)),
    [scales],
  );

  const activePalette =
    palettes.find((p) => p.id === activeScale.id) ?? palettes[0];

  // Semantic tokens derived from scale roles
  const tokens = useMemo(() => defaultTokens(scales), [scales]);

  const handleColourChange = useCallback(
    (hex: string) => {
      setScales((prev) =>
        prev.map((s) => (s.id === activeScaleId ? { ...s, baseHex: hex } : s)),
      );
    },
    [activeScaleId],
  );

  const handleAddScale = useCallback(() => {
    const colours = [
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];
    const hex = colours[scales.length % colours.length];
    const id = crypto.randomUUID();
    const name = `scale-${scales.length + 1}`;
    setScales((prev) => [...prev, { id, name, baseHex: hex, role: "custom" }]);
    setActiveScaleId(id);
  }, [scales.length]);

  const handleRemoveScale = useCallback(
    (id: string) => {
      setScales((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeScaleId === id && next.length > 0) {
          setActiveScaleId(next[0].id);
        }
        return next;
      });
    },
    [activeScaleId],
  );

  const handleRenameScale = useCallback((id: string, name: string) => {
    setScales((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }, []);

  const handleRoleChange = useCallback((id: string, role: ScaleRole) => {
    setScales((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
  }, []);

  const handleShare = async () => {
    setShareError("");
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShareError(
        "Sharing could not copy the link. Copy the address from your browser instead.",
      );
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-start justify-between gap-5 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-ink-faint mb-3">
              The colour workshop
            </p>
            <h1 className="text-4xl font-semibold tracking-tight flex items-center gap-3">
              <Palette size={30} aria-hidden />
              Gamut
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Shape a palette. Try it in context. Take the tokens with you.
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-control border border-line-strong text-xs text-ink-soft hover:bg-control-hover transition-colors"
          >
            <Share2 size={15} aria-hidden />
            {shared ? "Copied!" : "Share"}
          </button>
        </div>

        <nav
          aria-label="Workspace sections"
          className="flex flex-wrap gap-x-6 border-y border-line mb-8 text-xs text-ink-muted"
        >
          {["scales", "palette", "preview", "export"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="min-h-11 inline-flex items-center capitalize hover:text-ink"
            >
              {section}
            </a>
          ))}
        </nav>
        {shareError && (
          <p role="alert" className="text-sm text-rose-300 light:text-rose-700 mb-6">
            {shareError}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside
            className="space-y-6 rounded-2xl border border-line bg-panel/40 p-4 h-fit"
            aria-label="Palette controls"
          >
            <ColourPicker
              value={activeScale.baseHex}
              onChange={handleColourChange}
            />

            <ScalesList
              scales={scales}
              activeScaleId={activeScaleId}
              onSelect={setActiveScaleId}
              onAdd={handleAddScale}
              onRemove={handleRemoveScale}
              onRename={handleRenameScale}
              onRoleChange={handleRoleChange}
            />

            <details className="contrast-details border-t border-line pt-3">
              <summary className="flex min-h-11 items-center justify-between text-xs text-ink-muted cursor-pointer">
                Check contrast ratios
                <ChevronDown size={15} aria-hidden />
              </summary>
              <ContrastGrid palette={activePalette} />
            </details>
          </aside>

          {/* Main content */}
          <div className="space-y-8 min-w-0">
            <PaletteDisplay palette={activePalette} />
            <PreviewPanel
              palettes={palettes}
              tokens={tokens}
              mode={previewMode}
              onModeChange={setPreviewMode}
            />
            <ExportPanel
              palettes={palettes}
              tokens={tokens}
              mode={previewMode}
            />
          </div>
        </div>

        <footer className="mt-16 pt-6 border-t border-line text-center text-xs text-ink-faint">
          OKLCH scales, WCAG contrast ratios and portable theme tokens. All
          editing stays in your browser.
        </footer>
      </div>
    </main>
  );
}
