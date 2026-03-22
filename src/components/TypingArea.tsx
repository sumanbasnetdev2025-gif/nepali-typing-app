"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import { transliterate, transliterateWord } from "@/lib/transliteration";
import { getSuggestions, debounce } from "@/lib/suggestions";
import { isPreetiText, convertPreetiToUnicode } from "@/lib/preetiConverter";
import nepalify from "nepalify";

interface Props {
  activeFont: string;
  onUnicodeChange: (text: string) => void;
  onSuggestionsChange: (s: string[]) => void;
  onRomanChange: (r: string) => void;
}

export default function TypingArea({
  activeFont,
  onUnicodeChange,
  onSuggestionsChange,
  onRomanChange,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [currentWord, setCurrentWord] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // Cursor position
  // ─────────────────────────────────────────────
  const getCursorPos = useCallback((ta: HTMLTextAreaElement, idx: number) => {
    const mirror = mirrorRef.current;
    if (!mirror) return { top: 32, left: 0 };

    const cs = window.getComputedStyle(ta);

    Object.assign(mirror.style, {
      font: cs.font,
      padding: cs.padding,
      width: ta.offsetWidth + "px",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      position: "absolute",
      visibility: "hidden",
    });

    mirror.textContent = ta.value.substring(0, idx);

    const span = document.createElement("span");
    span.textContent = "|";
    mirror.appendChild(span);

    const taRect = ta.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    mirror.removeChild(span);

    return {
      top: spanRect.top - taRect.top + ta.scrollTop + 28,
      left: Math.max(4, spanRect.left - taRect.left),
    };
  }, []);

  // ─────────────────────────────────────────────
  // Apply suggestion
  // ─────────────────────────────────────────────
  const applySuggestion = useCallback(
    (nepaliWord: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const cursor = ta.selectionStart ?? input.length;
      const before = input.substring(0, cursor);
      const after = input.substring(cursor);

      const newBefore = before.replace(/(\S+)$/, nepaliWord);
      const newInput = newBefore + after;

      setInput(newInput);
      onRomanChange(newInput);

      const newOutput = transliterate(newBefore) + transliterate(after);
      setOutput(newOutput);
      onUnicodeChange(newOutput);

      setSuggestions([]);
      setShowDropdown(false);
      setCurrentWord("");
      onSuggestionsChange([]);

      setTimeout(() => {
        const pos = newBefore.length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      }, 0);
    },
    [input, onRomanChange, onUnicodeChange, onSuggestionsChange]
  );

  // ─────────────────────────────────────────────
  // Debounced suggestions
  // ─────────────────────────────────────────────
 const fetchSuggestions = useMemo(() => {
  return debounce(
    (word: string, cursor: number, ta: HTMLTextAreaElement) => {
      if (!word) {
        setShowDropdown(false);
        return;
      }

      const suggs = getSuggestions(word);

      setSuggestions(suggs);
      onSuggestionsChange(suggs);
      setSelectedIndex(0);

      if (suggs.length > 0) {
        setDropdownPos(getCursorPos(ta, cursor));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    },
    120
  );
}, [getCursorPos, onSuggestionsChange]);

  // ─────────────────────────────────────────────
  // Handle typing (🔥 HYBRID ENGINE HERE)
  // ─────────────────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursor = e.target.selectionStart ?? value.length;

      setInput(value);
      onRomanChange(value);

      // ✅ PRIMARY ENGINE
      let converted = transliterate(value);

      // ✅ FALLBACK (nepalify)
      if (!converted || converted === value) {
        converted = nepalify.format(value, { layout: "romanized" });
      }

      setOutput(converted);
      onUnicodeChange(converted);

      // Current word detection
      const before = value.substring(0, cursor);
      const match = before.match(/(\S+)$/);
      const word = match ? match[1] : "";

      setCurrentWord(word);

      fetchSuggestions(word, cursor, e.target);
    },
    [onRomanChange, onUnicodeChange, fetchSuggestions]
  );

  // ─────────────────────────────────────────────
  // Keyboard navigation
  // ─────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showDropdown || suggestions.length === 0) return;

      if (e.key === " ") {
        e.preventDefault();
        applySuggestion(suggestions[selectedIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    },
    [showDropdown, suggestions, selectedIndex, applySuggestion]
  );

  // ─────────────────────────────────────────────
  // Paste handler
  // ─────────────────────────────────────────────
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pasted = e.clipboardData.getData("text");

      if (isPreetiText(pasted)) {
        e.preventDefault();
        const unicode = convertPreetiToUnicode(pasted);
        const newOutput = output + unicode;

        setOutput(newOutput);
        onUnicodeChange(newOutput);
      }
    },
    [output, onUnicodeChange]
  );

  // ─────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        rows={5}
        placeholder="Type Romanized Nepali..."
        className="w-full border rounded-lg p-3"
      />

      {/* Suggestions */}
      {showDropdown && (
        <div className="border rounded bg-white shadow">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={() => applySuggestion(s)}
              className={`p-2 cursor-pointer ${
                i === selectedIndex ? "bg-blue-500 text-white" : ""
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Current word preview */}
      {currentWord && (
        <p className="text-sm text-gray-500">
          {currentWord} →{" "}
          {
            transliterateWord(currentWord) ||
            nepalify.format(currentWord, { layout: "romanized" })
          }
        </p>
      )}

      {/* Output */}
      <div className="border p-3 min-h-[80px] bg-gray-50">
        {output || "नेपाली यहाँ देखिन्छ..."}
      </div>
    </div>
  );
}