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
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-control border border-line-strong text-xs text-ink-soft hover:bg-control-hover transition-colors"
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
