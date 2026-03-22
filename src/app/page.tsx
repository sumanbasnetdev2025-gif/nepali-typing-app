// src/app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import TypingArea from "@/components/TypingArea";
import SuggestionPanel from "@/components/SuggestionPanel";
import FontSelector from "@/components/FontSelector";
import OutputPreview from "@/components/OutputPreview";
import FontPreviewPanel from "@/components/FontPreviewPanel";
import RichEditor from "@/components/RichEditor";
import DocumentCanvas from "@/components/DocumentCanvas";
import { DEFAULT_FONT } from "@/lib/fontRegistry";
import { loadFont } from "@/lib/fontLoader";

const STORAGE_KEY = "nepali-typing-last-font";

type Tab = "type" | "format" | "document";

export default function Home() {
  const [unicodeText, setUnicodeText]   = useState("");
  const [activeFont, setActiveFont]     = useState<string>(DEFAULT_FONT);
  const [suggestions, setSuggestions]   = useState<string[]>([]);
  const [showPreview, setShowPreview]   = useState(false);
  const [activeTab, setActiveTab]       = useState<Tab>("type");
  const [richHtml, setRichHtml]         = useState("");
  const [handleSuggestionSelect, setHandleSuggestionSelect] = useState<(word: string) => void>(() => () => {});


  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { setActiveFont(saved); loadFont(saved); }
    else loadFont(DEFAULT_FONT);
  }, []);

  const handleFontChange = useCallback((fontName: string) => {
    setActiveFont(fontName);
    loadFont(fontName);
    localStorage.setItem(STORAGE_KEY, fontName);
    document.documentElement.style.setProperty("--typing-font", `'${fontName}', serif`);
  }, []);

  const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: "type",     label: "① Type",     desc: "Transliterate" },
    { id: "format",   label: "② Format",   desc: "Bold / Italic" },
    { id: "document", label: "③ Document", desc: "Layout & PDF"  },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">नेपाली टाइपिङ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Romanized → Unicode Devanagari · Bold/Italic formatting · PDF export
        </p>
      </header>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="hidden md:inline text-xs ml-1 opacity-60">
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab 1: Type ── */}
     {/* Tab 1 */}
{activeTab === "type" && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:col-span-2 flex flex-col gap-4">
      <TypingArea
        activeFont={activeFont}
        onUnicodeChange={setUnicodeText}
        onSuggestionsChange={setSuggestions}
        onRomanChange={() => {}}
      />
    </div>

    <div className="flex flex-col gap-4">
      <FontSelector activeFont={activeFont} onFontChange={handleFontChange} />
      {/* DELETE any <SuggestionPanel> that was here — it's now inside TypingArea */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="text-sm text-blue-600 underline text-left"
      >
        {showPreview ? "Hide" : "Show"} font preview panel
      </button>
    </div>

    <div className="md:col-span-3">
      <OutputPreview text={unicodeText} activeFont={activeFont} />
    </div>

    {showPreview && (
      <div className="md:col-span-3">
        <FontPreviewPanel activeFont={activeFont} onSelect={handleFontChange} />
      </div>
    )}

    {unicodeText && (
  <div className="md:col-span-3 flex justify-end">
    <button
      onClick={() => {
        setRichHtml(unicodeText);
        setActiveTab("document"); // ← was "format", now "document"
      }}
      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
    >
      Open in Document →
    </button>
  </div>
)}
  </div>
)}
      {/* ── Tab 2: Format ── */}
      {activeTab === "format" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Rich Text Editor</h2>
              <p className="text-sm text-gray-400">
                Select any word or sentence, then click Bold / Italic / Color in the toolbar.
              </p>
            </div>
            <FontSelector activeFont={activeFont} onFontChange={handleFontChange} />
          </div>

          <RichEditor
            activeFont={activeFont}
            initialText={richHtml || unicodeText}
            onContentChange={setRichHtml}
          />

          {/* Send to document */}
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("document")}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Open in Document →
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Document ── */}
      {activeTab === "document" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Document Canvas</h2>
              <p className="text-sm text-gray-400">
                Choose Portrait or Landscape layout. Click anywhere on the page to type or paste.
                Download as PDF when ready.
              </p>
            </div>
            <FontSelector activeFont={activeFont} onFontChange={handleFontChange} />
          </div>

          <DocumentCanvas
            activeFont={activeFont}
            initialHtml={richHtml}
          />
        </div>
      )}
    </main>
  );
}