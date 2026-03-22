"use client";

import { useRef, useEffect, useCallback } from "react";

interface Props {
  activeFont: string;
  initialText?: string;
  onContentChange?: (html: string) => void;
}

export default function RichEditor({ activeFont, initialText, onContentChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!editorRef.current || !initialText) return;

  if (editorRef.current.innerText.trim()) return;

  if (/<[a-z][\s\S]*>/i.test(initialText)) {
    editorRef.current.innerHTML = initialText;
  } else {
    editorRef.current.textContent = initialText;
  }
}, [initialText]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onContentChange?.(editorRef.current?.innerHTML ?? "");
  }, [onContentChange]);

  const setFontSize = useCallback((size: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    try {
      const range = sel.getRangeAt(0);
      const extracted = range.extractContents();
      const span = document.createElement("span");
      span.style.fontSize = size;
      span.appendChild(extracted);
      range.insertNode(span);
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.addRange(newRange);
      onContentChange?.(editorRef.current?.innerHTML ?? "");
    } catch {
      document.execCommand("fontSize", false, "3");
      const fontEls = editorRef.current?.querySelectorAll("font[size]");
      fontEls?.forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = size;
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
      onContentChange?.(editorRef.current?.innerHTML ?? "");
    }
  }, [onContentChange]);

  const setColor = useCallback((color: string) => {
    exec("foreColor", color);
  }, [exec]);

  const handleInput = useCallback(() => {
    onContentChange?.(editorRef.current?.innerHTML ?? "");
  }, [onContentChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 rounded-lg border border-gray-200">

        <button
          onMouseDown={(e) => { e.preventDefault(); exec("bold"); }}
          className="px-3 py-1.5 font-bold text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-blue-100"
        >B</button>

        <button
          onMouseDown={(e) => { e.preventDefault(); exec("italic"); }}
          className="px-3 py-1.5 italic text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-blue-100"
        >I</button>

        <button
          onMouseDown={(e) => { e.preventDefault(); exec("underline"); }}
          className="px-3 py-1.5 underline text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-blue-100"
        >U</button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <select
          onChange={(e) => setFontSize(e.target.value)}
          defaultValue=""
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="" disabled>Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="28px">28</option>
          <option value="32px">32</option>
          <option value="36px">36</option>
          <option value="48px">48</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }}
          className="px-2 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >⬅</button>
        <button
          onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }}
          className="px-2 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >☰</button>
        <button
          onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }}
          className="px-2 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >➡</button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
          Color
          <input
            type="color"
            defaultValue="#000000"
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border border-gray-300"
          />
        </label>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
          className="px-2 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-500"
        >Clear</button>
      </div>

      <p className="text-xs text-gray-400">
        💡 Select any text, then click Bold / Italic / Color to format it.
      </p>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="w-full min-h-[160px] border border-gray-200 rounded-lg p-4 text-lg leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ fontFamily: `'${activeFont}', serif` }}
        data-placeholder="Paste your Nepali text here, then select words to make them bold, italic, colored..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #d1d5db;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}