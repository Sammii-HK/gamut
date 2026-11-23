"use client";

import { useState, useEffect } from "react";
import { hexToOklch, oklchToHex, isValidHex, normaliseHex } from "@/lib/colour";
import type { OklchColour } from "@/types";

interface ColourPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function ColourPicker({ value, onChange }: ColourPickerProps) {
  const [hexInput, setHexInput] = useState(value);
  const [oklch, setOklch] = useState<OklchColour>(() => hexToOklch(value));
  const [activeTab, setActiveTab] = useState<"picker" | "hex" | "oklch">(
    "picker",
  );

  useEffect(() => {
    setHexInput(value);
    setOklch(hexToOklch(value));
  }, [value]);

  const handleHexChange = (raw: string) => {
    setHexInput(raw);
    const clean = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(clean)) {
      onChange(normaliseHex(clean));
    }
  };

  const handleOklchChange = (key: keyof OklchColour, val: number) => {
    const next = { ...oklch, [key]: val };
    setOklch(next);
    const hex = oklchToHex(next);
    onChange(hex);
  };

  const tabs = [
    { id: "picker" as const, label: "Picker" },
    { id: "hex" as const, label: "Hex" },
    { id: "oklch" as const, label: "OKLCH" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-wash/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-segment-active text-ink"
                : "text-ink-muted hover:text-ink-strong"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "picker" && (
        <div className="flex flex-col items-center gap-3">
          <input
            type="color"
            aria-label="Base colour"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-32 rounded-lg cursor-pointer border border-line-strong bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
          />
          <span className="text-xs text-ink-muted font-mono">{value}</span>
        </div>
      )}

      {activeTab === "hex" && (
        <div className="space-y-2">
          <label htmlFor="base-hex" className="text-xs text-ink-muted">
            Hex colour
          </label>
          <div className="flex gap-2 items-center">
            <div
              className="w-10 h-10 rounded-lg border border-line-strong flex-shrink-0"
              style={{ backgroundColor: value }}
            />
            <input
              type="text"
              id="base-hex"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#3b82f6"
              className="min-w-0 flex-1 bg-control border border-line-strong rounded-lg px-3 py-2 text-sm font-mono text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-line-bold"
              maxLength={7}
            />
          </div>
        </div>
      )}

      {activeTab === "oklch" && (
        <div className="space-y-3">
          <SliderInput
            label="L (lightness)"
            value={oklch.l}
            min={0}
            max={1}
            step={0.01}
            format={(v) => v.toFixed(2)}
            onChange={(v) => handleOklchChange("l", v)}
          />
          <SliderInput
            label="C (chroma)"
            value={oklch.c}
            min={0}
            max={0.4}
            step={0.005}
            format={(v) => v.toFixed(3)}
            onChange={(v) => handleOklchChange("c", v)}
          />
          <SliderInput
            label="H (hue)"
            value={oklch.h}
            min={0}
            max={360}
            step={1}
            format={(v) => `${Math.round(v)}°`}
            onChange={(v) => handleOklchChange("h", v)}
          />
          <div
            className="w-full h-8 rounded-lg border border-line-strong"
            style={{ backgroundColor: value }}
          />
        </div>
      )}
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="text-ink-soft font-mono">{format(value)}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-thumb h-1.5 bg-track rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-thumb [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-thumb-ring"
      />
    </div>
  );
}
