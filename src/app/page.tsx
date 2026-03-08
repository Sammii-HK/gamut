'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { ColourPicker } from '@/components/colour-picker';
import { PaletteDisplay } from '@/components/palette-display';
import { ContrastGrid } from '@/components/contrast-grid';
import { PreviewPanel } from '@/components/preview-panel';
import { ExportPanel } from '@/components/export-panel';
import { ScalesList } from '@/components/scales-list';
import { generatePalette } from '@/lib/palette';
import { defaultTokens } from '@/lib/tokens';
import { decodeState, updateUrl } from '@/lib/url';
import { Share2 } from 'lucide-react';
import type { PreviewMode, Scale, ScaleRole } from '@/types';

const DEFAULT_SCALES: Scale[] = [
  { id: 'primary', name: 'primary', baseHex: '#3b82f6', role: 'primary' },
  { id: 'neutral', name: 'neutral', baseHex: '#737373', role: 'neutral' },
];

let idCounter = 0;
function nextId() {
  return `scale-${++idCounter}`;
}

export default function Home() {
  const [scales, setScales] = useState<Scale[]>(DEFAULT_SCALES);
  const [activeScaleId, setActiveScaleId] = useState('primary');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light');
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState(false);

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
    () => scales.map((s) => generatePalette(s.baseHex, s.name)),
    [scales]
  );

  const activePalette = palettes.find((p) => p.name === activeScale.name) ?? palettes[0];

  // Semantic tokens derived from scale roles
  const tokens = useMemo(() => defaultTokens(scales), [scales]);

  const handleColourChange = useCallback((hex: string) => {
    setScales((prev) =>
      prev.map((s) => (s.id === activeScaleId ? { ...s, baseHex: hex } : s))
    );
  }, [activeScaleId]);

  const handleAddScale = useCallback(() => {
    const colours = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const hex = colours[scales.length % colours.length];
    const id = nextId();
    const name = `scale-${scales.length + 1}`;
    setScales((prev) => [...prev, { id, name, baseHex: hex, role: 'custom' }]);
    setActiveScaleId(id);
  }, [scales.length]);

  const handleRemoveScale = useCallback((id: string) => {
    setScales((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeScaleId === id && next.length > 0) {
        setActiveScaleId(next[0].id);
      }
      return next;
    });
  }, [activeScaleId]);

  const handleRenameScale = useCallback((id: string, name: string) => {
    setScales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: name || s.id } : s))
    );
  }, []);

  const handleRoleChange = useCallback((id: string, role: ScaleRole) => {
    setScales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, role } : s))
    );
  }, []);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gamut</h1>
            <p className="text-sm text-neutral-400 mt-1">
              OKLCH theme builder with contrast checking
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            <Share2 size={12} />
            {shared ? 'Copied!' : 'Share'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <ColourPicker value={activeScale.baseHex} onChange={handleColourChange} />

            <ScalesList
              scales={scales}
              activeScaleId={activeScaleId}
              onSelect={setActiveScaleId}
              onAdd={handleAddScale}
              onRemove={handleRemoveScale}
              onRename={handleRenameScale}
              onRoleChange={handleRoleChange}
            />

            <ContrastGrid palette={activePalette} />
          </div>

          {/* Main content */}
          <div className="space-y-8">
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

        <footer className="mt-16 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          Built with OKLCH colour science. No dependencies.
        </footer>
      </div>
    </main>
  );
}
