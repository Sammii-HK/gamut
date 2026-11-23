"use client";

import { X } from "lucide-react";
import type { Palette } from "@/types";
import { contrastRatio, wcagLevel } from "@/lib/colour";

interface ContrastGridProps {
  palette: Palette;
}

export function ContrastGrid({ palette }: ContrastGridProps) {
  const backgrounds = ["#ffffff", "#000000"];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-ink-soft">Contrast ratios</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 pr-3 text-ink-faint font-medium">
                Step
              </th>
              <th className="py-2 px-3 text-ink-faint font-medium">
                vs white
              </th>
              <th className="py-2 px-3 text-ink-faint font-medium">
                vs black
              </th>
            </tr>
          </thead>
          <tbody>
            {palette.steps.map((step) => {
              const ratioWhite = contrastRatio(step.hex, backgrounds[0]);
              const ratioBlack = contrastRatio(step.hex, backgrounds[1]);
              const levelWhite = wcagLevel(ratioWhite);
              const levelBlack = wcagLevel(ratioBlack);

              return (
                <tr key={step.step} className="border-b border-line/50">
                  <td className="py-1.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: step.hex }}
                      />
                      <span className="text-ink-muted font-mono">
                        {step.step}
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    <ContrastBadge ratio={ratioWhite} level={levelWhite} />
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    <ContrastBadge ratio={ratioBlack} level={levelBlack} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContrastBadge({ ratio, level }: { ratio: number; level: string }) {
  const colours = {
    AAA: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 light:text-emerald-800 light:border-emerald-600/40",
    AA: "bg-amber-500/15 text-amber-400 border-amber-500/30 light:text-amber-800 light:border-amber-600/40",
    fail: "bg-red-500/10 text-red-400/85 border-red-500/20 light:text-red-700 light:border-red-600/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border ${colours[level as keyof typeof colours]}`}
    >
      <span>{ratio.toFixed(1)}</span>
      <span className="font-semibold">
        {level === "fail" ? (
          <>
            <X size={12} aria-hidden />
            <span className="sr-only">Fails normal text AA</span>
          </>
        ) : (
          level
        )}
      </span>
    </span>
  );
}
