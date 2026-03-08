'use client';

import type { Palette } from '@/types';
import { CopyButton } from './copy-button';

interface PaletteDisplayProps {
  palette: Palette;
}

export function PaletteDisplay({ palette }: PaletteDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-300">Palette</h2>
        <span className="text-xs text-neutral-500 font-mono">{palette.name}</span>
      </div>

      <div className="grid grid-cols-11 gap-1">
        {palette.steps.map((step) => (
          <div key={step.step} className="flex flex-col items-center gap-1.5">
            <div
              className="w-full aspect-[3/4] rounded-lg border border-neutral-700/50 transition-transform hover:scale-110 cursor-pointer shadow-sm"
              style={{ backgroundColor: step.hex }}
              title={`${step.step}: ${step.hex}`}
              onClick={() => navigator.clipboard.writeText(step.hex)}
            />
            <span className="text-[10px] text-neutral-500 font-medium">
              {step.step}
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-neutral-400 font-mono">
                {step.hex}
              </span>
              <CopyButton text={step.hex} size={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
