// src/components/FontSelector.tsx
"use client";

import { FONT_REGISTRY } from "@/lib/fontRegistry";
import { loadFont } from "@/lib/fontLoader";

interface Props {
  activeFont: string;
  onFontChange: (name: string) => void;
}

export default function FontSelector({ activeFont, onFontChange }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
        Font ({FONT_REGISTRY.length} available)
      </label>
      <select
        value={activeFont}
        onChange={(e) => {
          loadFont(e.target.value);
          onFontChange(e.target.value);
        }}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {FONT_REGISTRY.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}