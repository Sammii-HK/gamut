"use client";

import { Moon, Sun } from "lucide-react";
import type { PreviewMode } from "@/types";

interface ModeToggleProps {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <button
      aria-label={`Switch preview to ${mode === "light" ? "dark" : "light"} mode`}
      onClick={() => onChange(mode === "light" ? "dark" : "light")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
    >
      {mode === "light" ? (
        <Sun size={14} aria-hidden />
      ) : (
        <Moon size={14} aria-hidden />
      )}
      {mode === "light" ? "Light" : "Dark"}
    </button>
  );
}
