"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  activeFont: string;
  initialHtml?: string;
}

type Layout = "portrait" | "landscape";

const A4 = {
  portrait:  { width: 794,  height: 1123 },
  landscape: { width: 1123, height: 794  },
};

// ── Texture definitions ───────────────────────────────────────────────────────
interface TextureOption {
  id:          string;
  name:        string;
  label:       string;       // emoji label
  background:  string;       // CSS background for preview + page
  printBg:     string;       // CSS for print (same or simplified)
  textColor:   string;       // default text color on this texture
  borderColor: string;       // page border
}

const TEXTURES: TextureOption[] = [
  {
    id: "clean",
    name: "Clean White",
    label: "⬜",
    background: "#ffffff",
    printBg: "#ffffff",
    textColor: "#1a1a1a",
    borderColor: "#e5e7eb",
  },
  {
    id: "lokta",
    name: "Lokta Paper",
    label: "📜",
    background: `
      radial-gradient(ellipse at 20% 30%, rgba(205,170,110,0.18) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 70%, rgba(180,140,80,0.15) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 10%, rgba(220,190,130,0.12) 0%, transparent 50%),
      repeating-linear-gradient(
        92deg,
        transparent 0px, transparent 3px,
        rgba(160,120,60,0.04) 3px, rgba(160,120,60,0.04) 4px
      ),
      repeating-linear-gradient(
        2deg,
        transparent 0px, transparent 6px,
        rgba(140,100,50,0.03) 6px, rgba(140,100,50,0.03) 7px
      ),
      linear-gradient(160deg, #f5e8c8 0%, #e8d4a0 35%, #f0ddb0 65%, #e4cc94 100%)
    `,
    printBg: "linear-gradient(160deg, #f5e8c8 0%, #e8d4a0 50%, #e4cc94 100%)",
    textColor: "#2c1a08",
    borderColor: "#c8a060",
  },
  {
    id: "aged",
    name: "Aged Parchment",
    label: "📋",
    background: `
      radial-gradient(ellipse at 5% 5%, rgba(120,80,20,0.25) 0%, transparent 40%),
      radial-gradient(ellipse at 95% 95%, rgba(100,60,10,0.20) 0%, transparent 40%),
      radial-gradient(ellipse at 90% 5%, rgba(140,90,30,0.15) 0%, transparent 35%),
      radial-gradient(ellipse at 10% 90%, rgba(110,70,15,0.18) 0%, transparent 35%),
      radial-gradient(ellipse at 50% 50%, rgba(160,120,50,0.08) 0%, transparent 70%),
      repeating-linear-gradient(
        88deg,
        transparent 0px, transparent 2px,
        rgba(100,60,10,0.05) 2px, rgba(100,60,10,0.05) 3px
      ),
      linear-gradient(170deg, #d4b483 0%, #c8a055 20%, #d6b870 50%, #c4985a 80%, #b8884a 100%)
    `,
    printBg: "linear-gradient(170deg, #d4b483 0%, #c8a055 50%, #b8884a 100%)",
    textColor: "#1a0e00",
    borderColor: "#8b5e20",
  },
  {
    id: "handmade",
    name: "Handmade Cream",
    label: "🟡",
    background: `
      repeating-linear-gradient(
        95deg,
        transparent 0px, transparent 8px,
        rgba(180,160,100,0.04) 8px, rgba(180,160,100,0.04) 9px
      ),
      repeating-linear-gradient(
        5deg,
        transparent 0px, transparent 12px,
        rgba(160,140,80,0.03) 12px, rgba(160,140,80,0.03) 13px
      ),
      radial-gradient(ellipse at 30% 40%, rgba(240,220,160,0.3) 0%, transparent 60%),
      linear-gradient(145deg, #fdf6e3 0%, #f5e9c5 40%, #faf0d5 70%, #f0e0b0 100%)
    `,
    printBg: "linear-gradient(145deg, #fdf6e3 0%, #f5e9c5 60%, #f0e0b0 100%)",
    textColor: "#2a1f00",
    borderColor: "#d4b870",
  },
  {
    id: "nepali-red",
    name: "Nepali Red",
    label: "🔴",
    background: `
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 20px,
        rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px
      ),
      linear-gradient(160deg, #c0392b 0%, #922b21 40%, #a93226 70%, #7b241c 100%)
    `,
    printBg: "linear-gradient(160deg, #c0392b 0%, #922b21 60%, #7b241c 100%)",
    textColor: "#fff8f0",
    borderColor: "#7b241c",
  },
  {
    id: "himalayan-blue",
    name: "Himalayan Blue",
    label: "🔵",
    background: `
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 15px,
        rgba(255,255,255,0.02) 15px, rgba(255,255,255,0.02) 16px
      ),
      linear-gradient(155deg, #1a4a7a 0%, #0d3362 40%, #1a4a8a 70%, #0a2a55 100%)
    `,
    printBg: "linear-gradient(155deg, #1a4a7a 0%, #0d3362 60%, #0a2a55 100%)",
    textColor: "#e8f4ff",
    borderColor: "#0a2a55",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    label: "🟢",
    background: `
      radial-gradient(ellipse at 20% 20%, rgba(100,180,80,0.15) 0%, transparent 50%),
      linear-gradient(150deg, #1e5631 0%, #145a32 40%, #1a6b3c 70%, #0f4523 100%)
    `,
    printBg: "linear-gradient(150deg, #1e5631 0%, #145a32 60%, #0f4523 100%)",
    textColor: "#e8ffe8",
    borderColor: "#0f4523",
  },
  {
    id: "dark-slate",
    name: "Dark Slate",
    label: "⬛",
    background: `
      repeating-linear-gradient(
        45deg,
        transparent 0px, transparent 10px,
        rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 11px
      ),
      linear-gradient(160deg, #2c2c2c 0%, #1a1a1a 50%, #242424 100%)
    `,
    printBg: "linear-gradient(160deg, #2c2c2c 0%, #1a1a1a 60%, #242424 100%)",
    textColor: "#f0f0f0",
    borderColor: "#444",
  },
  {
    id: "golden",
    name: "Royal Gold",
    label: "✨",
    background: `
      repeating-linear-gradient(
        88deg,
        transparent 0px, transparent 4px,
        rgba(180,130,0,0.06) 4px, rgba(180,130,0,0.06) 5px
      ),
      radial-gradient(ellipse at 50% 0%, rgba(255,220,80,0.25) 0%, transparent 60%),
      linear-gradient(160deg, #f4d03f 0%, #d4ac0d 30%, #f0c030 60%, #c8a000 100%)
    `,
    printBg: "linear-gradient(160deg, #f4d03f 0%, #d4ac0d 50%, #c8a000 100%)",
    textColor: "#1a0e00",
    borderColor: "#8b6914",
  },
  {
    id: "saffron",
    name: "Saffron",
    label: "🟠",
    background: `
      radial-gradient(ellipse at 70% 30%, rgba(255,200,80,0.2) 0%, transparent 55%),
      linear-gradient(155deg, #f39c12 0%, #d68910 40%, #e67e22 70%, #ca6f1e 100%)
    `,
    printBg: "linear-gradient(155deg, #f39c12 0%, #d68910 50%, #ca6f1e 100%)",
    textColor: "#1a0800",
    borderColor: "#935116",
  },
  {
    id: "rose",
    name: "Rose Petal",
    label: "🌸",
    background: `
      radial-gradient(ellipse at 30% 30%, rgba(255,200,200,0.3) 0%, transparent 55%),
      linear-gradient(150deg, #f8c6c6 0%, #f0a0a0 40%, #f5b8b8 70%, #e88888 100%)
    `,
    printBg: "linear-gradient(150deg, #f8c6c6 0%, #f0a0a0 50%, #e88888 100%)",
    textColor: "#2a0a0a",
    borderColor: "#c06060",
  },
  {
    id: "lavender",
    name: "Lavender",
    label: "💜",
    background: `
      radial-gradient(ellipse at 60% 20%, rgba(200,180,255,0.25) 0%, transparent 55%),
      linear-gradient(155deg, #e8d5f5 0%, #d4b8f0 40%, #e0c8f8 70%, #c8a0e8 100%)
    `,
    printBg: "linear-gradient(155deg, #e8d5f5 0%, #d4b8f0 50%, #c8a0e8 100%)",
    textColor: "#1a0a2a",
    borderColor: "#9060c0",
  },
];

export default function DocumentCanvas({ activeFont, initialHtml }: Props) {
  const [layout, setLayout]           = useState<Layout>("portrait");
  const [downloading, setDownloading] = useState(false);
  const [activeTexture, setActiveTexture] = useState<TextureOption>(TEXTURES[1]); // Lokta default
  const [showTextures, setShowTextures]   = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const dims = A4[layout];

  useEffect(() => {
    if (pageRef.current && initialHtml) {
      if (!pageRef.current.innerText.trim()) {
        pageRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml]);

  // ── PDF via print window (no headers workaround) ─────────────────────────
  const downloadPDF = useCallback(async () => {
    if (!pageRef.current) return;
    setDownloading(true);

    try {
      const { FONT_REGISTRY } = await import("@/lib/fontRegistry");
      const entry    = FONT_REGISTRY.find(f => f.name === activeFont);
      const fontFile = entry?.file ?? "";
      const fontUrl  = `${window.location.origin}/fonts/${fontFile}`;
      const content  = pageRef.current.innerHTML;
      const texture  = activeTexture;

      const printWindow = window.open("", "_blank");
      if (!printWindow) { alert("Please allow popups."); setDownloading(false); return; }

      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title></title>
  <style>
    @font-face {
      font-family: '${activeFont}';
      src: url('${fontUrl}') format('truetype');
      font-display: block;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: ${texture.printBg}; }

    /* ── CRITICAL: removes browser date/title headers ── */
    @page {
      size: ${layout === "landscape" ? "A4 landscape" : "A4 portrait"};
      margin: 0;
    }

    body {
      font-family: '${activeFont}', 'Noto Sans Devanagari', serif;
      color: ${texture.textColor};
      background: ${texture.printBg};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: ${layout === "landscape" ? "297mm" : "210mm"};
      min-height: ${layout === "landscape" ? "210mm" : "297mm"};
      padding: 18mm 20mm;
      font-size: 16px;
      line-height: 1.8;
      background: ${texture.printBg};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    b, strong { font-weight: bold; }
    i, em     { font-style: italic; }
    u         { text-decoration: underline; }

    @media print {
      /* Force background to print */
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: ${texture.printBg} !important; }
      .page { background: ${texture.printBg} !important; }
    }
  </style>
</head>
<body>
  <div class="page">${content}</div>
  <script>
    // Wait for fonts then print
    document.fonts.ready.then(function() {
      setTimeout(function() {
        window.print();
        // Close after print dialog closes
        window.onafterprint = function() { window.close(); };
      }, 600);
    });
  </script>
</body>
</html>`);
      printWindow.document.close();

    } catch (err) {
      alert("PDF failed: " + (err as Error).message);
    } finally {
      setDownloading(false);
    }
  }, [layout, activeFont, activeTexture]);

  return (
    <div className="flex flex-col gap-4">

      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">

        {/* Layout toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLayout("portrait")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              layout === "portrait" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="inline-block w-3 h-4 border border-current rounded-sm" />
            Portrait
          </button>
          <button
            onClick={() => setLayout("landscape")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              layout === "landscape" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="inline-block w-4 h-3 border border-current rounded-sm" />
            Landscape
          </button>
        </div>

        {/* Texture selector button */}
        <div className="relative">
          <button
            onClick={() => setShowTextures(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:border-blue-400 transition"
          >
            <span className="text-base">{activeTexture.label}</span>
            <span className="text-gray-700">{activeTexture.name}</span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>

          {/* Texture dropdown */}
          {showTextures && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 w-72">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                Page Texture
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TEXTURES.map(tex => (
                  <button
                    key={tex.id}
                    onClick={() => { setActiveTexture(tex); setShowTextures(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition ${
                      activeTexture.id === tex.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {/* Texture mini-preview */}
                    <div
                      className="w-12 h-8 rounded"
                      style={{
                        background: tex.background,
                        border: `1px solid ${tex.borderColor}`,
                      }}
                    />
                    <span className="text-xs text-gray-600 text-center leading-tight">
                      {tex.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400">A4 · {layout}</span>

        <div className="flex-1" />

        <button
          onClick={() => { if (pageRef.current) pageRef.current.innerHTML = ""; }}
          className="px-3 py-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear
        </button>

        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60 transition"
        >
          {downloading ? (
            <>
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
              Opening...
            </>
          ) : "⬇ Download PDF"}
        </button>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <span>💡</span>
        <span>
          In the print dialog: set <strong>Margins → None</strong> and
          uncheck <strong>"Headers and footers"</strong> to remove the date/title from PDF.
          Also enable <strong>"Background graphics"</strong> to print the texture.
        </span>
      </div>

      {/* ── A4 page canvas ───────────────────────────────────────────────── */}
      <div className="overflow-auto bg-gray-300 rounded-xl p-6"
        onClick={() => setShowTextures(false)}
      >
        <div
          ref={pageRef}
          contentEditable
          suppressContentEditableWarning
          className="relative mx-auto shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          style={{
            width:      dims.width,
            minHeight:  dims.height,
            padding:    "72px 80px",
            fontFamily: `'${activeFont}', serif`,
            fontSize:   "16px",
            lineHeight: "1.8",
            color:      activeTexture.textColor,
            background: activeTexture.background,
            border:     `1px solid ${activeTexture.borderColor}`,
            borderRadius: "2px",
            // Smooth texture transition
            transition: "background 0.3s ease, color 0.2s ease",
          }}
          data-placeholder="Click here to type or paste your Nepali text..."
        />
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(0,0,0,0.25);
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  );
}