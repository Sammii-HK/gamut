"use client";

import { Plus, X } from "lucide-react";
import type { Scale, ScaleRole } from "@/types";

interface ScalesListProps {
  scales: Scale[];
  activeScaleId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRoleChange: (id: string, role: ScaleRole) => void;
}

const ROLES: { value: ScaleRole; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
  { value: "custom", label: "Custom" },
];

export function ScalesList({
  scales,
  activeScaleId,
  onSelect,
  onAdd,
  onRemove,
  onRename,
  onRoleChange,
}: ScalesListProps) {
  return (
    <section id="scales" className="space-y-3 scroll-mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-300">Scales</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 min-h-11 px-2 py-1 rounded-md text-[10px] font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Plus size={14} aria-hidden />
          Add
        </button>
      </div>

      <div className="space-y-1">
        {scales.map((scale) => (
          <div
            key={scale.id}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
              activeScaleId === scale.id
                ? "bg-neutral-800 border border-neutral-700"
                : "hover:bg-neutral-800/50 border border-transparent"
            }`}
          >
            <button
              onClick={() => onSelect(scale.id)}
              aria-label={`Edit ${scale.name || "unnamed scale"}`}
              aria-pressed={activeScaleId === scale.id}
              className="w-11 h-11 rounded-md flex-shrink-0 border border-neutral-600/50"
              style={{ backgroundColor: scale.baseHex }}
            />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={scale.name}
                aria-label={`Scale name for ${scale.id}`}
                maxLength={100}
                onFocus={() => onSelect(scale.id)}
                onChange={(e) => onRename(scale.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full min-h-11 bg-transparent text-xs font-medium text-white outline-none"
              />
              <select
                value={scale.role}
                aria-label={`Role for ${scale.name || "unnamed scale"}`}
                onChange={(e) =>
                  onRoleChange(scale.id, e.target.value as ScaleRole)
                }
                onClick={(e) => e.stopPropagation()}
                className="min-h-11 max-w-full bg-transparent text-xs text-neutral-500 outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option
                    key={r.value}
                    value={r.value}
                    className="bg-neutral-900"
                  >
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {scales.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(scale.id);
                }}
                aria-label={`Remove ${scale.name || "unnamed scale"}`}
                className="min-w-11 min-h-11 flex items-center justify-center text-neutral-500 hover:text-red-400 transition-all"
              >
                <X size={15} aria-hidden />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
