'use client';

import { Plus, X } from 'lucide-react';
import type { Scale, ScaleRole } from '@/types';

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
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'custom', label: 'Custom' },
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-300">Scales</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Plus size={10} />
          Add
        </button>
      </div>

      <div className="space-y-1">
        {scales.map((scale) => (
          <div
            key={scale.id}
            onClick={() => onSelect(scale.id)}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
              activeScaleId === scale.id
                ? 'bg-neutral-800 border border-neutral-700'
                : 'hover:bg-neutral-800/50 border border-transparent'
            }`}
          >
            <div
              className="w-5 h-5 rounded-md flex-shrink-0 border border-neutral-600/50"
              style={{ backgroundColor: scale.baseHex }}
            />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={scale.name}
                onChange={(e) => onRename(scale.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-xs font-medium text-white outline-none"
              />
              <select
                value={scale.role}
                onChange={(e) => onRoleChange(scale.id, e.target.value as ScaleRole)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-[10px] text-neutral-500 outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value} className="bg-neutral-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              {scale.baseHex}
            </span>
            {scales.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(scale.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
