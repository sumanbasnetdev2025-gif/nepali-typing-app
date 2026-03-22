// src/lib/fontLoader.ts
import { FONT_REGISTRY, type FontEntry } from "./fontRegistry";

const loadedFonts = new Set<string>();

export function loadFont(fontName: string): void {
  if (loadedFonts.has(fontName)) return;

  const entry: FontEntry | undefined = FONT_REGISTRY.find(
    (f) => f.name === fontName
  );
  if (!entry) return;

  const style = document.createElement("style");
  const ext = entry.file.split(".").pop();
  const format = ext === "woff2" ? "woff2" : ext === "woff" ? "woff" : "truetype";

  style.textContent = `
    @font-face {
      font-family: '${entry.name}';
      src: url('/fonts/${entry.file}') format('${format}');
      font-weight: ${entry.weight ?? 400};
      font-style: ${entry.style ?? "normal"};
      font-display: swap;
    }
  `;

  document.head.appendChild(style);
  loadedFonts.add(fontName);
}