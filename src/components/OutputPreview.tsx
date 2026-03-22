// src/components/OutputPreview.tsx
"use client";

interface Props {
  text: string;
  activeFont: string;
}

export default function OutputPreview({ text, activeFont }: Props) {
  const handleCopy = () => navigator.clipboard.writeText(text);

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nepali-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Output Preview — {activeFont}
        </p>
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition">
            Copy
          </button>
          <button onClick={handleDownload}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
            Download .txt
          </button>
        </div>
      </div>
      <div
        className="text-2xl leading-loose min-h-[80px] nepali-text"
        style={{ fontFamily: `'${activeFont}', serif` }}
      >
        {text || <span className="text-gray-300 text-base">Output will appear here...</span>}
      </div>
    </div>
  );
}