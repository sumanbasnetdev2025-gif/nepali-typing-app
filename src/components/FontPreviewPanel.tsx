// src/components/FontPreviewPanel.tsx
"use client";

import { useEffect } from "react";
import { FONT_REGISTRY } from "@/lib/fontRegistry";
import { loadFont } from "@/lib/fontLoader";

const PREVIEW_TEXT = "नमस्ते, नेपाल";

interface Props {
  activeFont: string;
  onSelect: (name: string) => void;
}

export default function FontPreviewPanel({ activeFont, onSelect }: Props) {
  // Load all fonts for preview (lazy — only runs when panel is open)
  useEffect(() => {
    FONT_REGISTRY.forEach((f) => loadFont(f.name));
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Font Preview ({FONT_REGISTRY.length} fonts)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {FONT_REGISTRY.map((f) => (
          <button
            key={f.name}
            onClick={() => onSelect(f.name)}
            className={`text-left border rounded-lg p-3 hover:border-blue-400 transition ${
              activeFont === f.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">{f.name}</p>
            <p
              className="text-xl"
              style={{ fontFamily: `'${f.name}', serif` }}
            >
              {PREVIEW_TEXT}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}