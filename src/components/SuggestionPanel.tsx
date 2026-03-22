"use client";

interface Props {
  suggestions: string[];
  onSelect: (word: string) => void;
}

export default function SuggestionPanel({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
        Suggestions
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((word, i) => (
          <button
            key={i}
            // onMouseDown instead of onClick — fires BEFORE the textarea loses focus
            onMouseDown={(e) => {
              e.preventDefault(); // prevents textarea from losing focus
              onSelect(word);
            }}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm nepali-text transition cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}