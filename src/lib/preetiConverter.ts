// src/lib/preetiConverter.ts

const PREETI_TO_UNICODE: Record<string, string> = {
  "!": "!",   "@": "ा",   "#": "्र", "$": "र्", "%": "%",
  "^": "ँ",   "&": "ट",   "*": "ठ",  "(": "(",  ")": ")",
  "Q": "ौ",   "W": "ै",   "E": "े",  "R": "र",  "T": "त",
  "Y": "य",   "U": "ु",   "I": "ि",  "O": "ो",  "P": "प",
  "{": "ु",   "}": "ू",   "|": "्",  "A": "ा",  "S": "स",
  "D": "द",   "F": "ि",   "G": "ग",  "H": "ह",  "J": "ज",
  "K": "क",   "L": "ल",   ":": ":",  '"': '"',
  "Z": "्",   "X": "ं",   "C": "च",  "V": "व",  "B": "ब",
  "N": "न",   "M": "म",   "<": ",",  ">": "।",  "?": "?",
  "q": "ध",   "w": "थ",   "e": "े",  "r": "र",  "t": "त",
  "y": "य",   "u": "ु",   "i": "ि",  "o": "ो",  "p": "प",
  "[": "ु",   "]": "ू",   "\\": "्", "a": "ा",  "s": "स",
  "d": "द",   "f": "फ",   "g": "ग",  "h": "ह",  "j": "ज",
  "k": "क",   "l": "ल",   ";": "ः",  "'": "्",
  "z": "ज्ञ","x": "ं",   "c": "च",  "v": "व",  "b": "ब",
  "n": "न",   "m": "म",   ",": "ˈ",  ".": "।",
  "1": "१",   "2": "२",   "3": "३",  "4": "४",  "5": "५",
  "6": "६",   "7": "७",   "8": "८",  "9": "९",  "0": "०",
  // Vowels standing alone
  "3": "इ",   "v": "उ",   "j": "ज",
};

export function isPreetiText(text: string): boolean {
  // Heuristic: if text has no Devanagari Unicode range chars
  // but has typical Preeti chars, flag as Preeti
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return false;
  const preetiChars = text.split("").filter((c) => PREETI_TO_UNICODE[c]);
  return preetiChars.length > text.length * 0.5;
}

export function convertPreetiToUnicode(text: string): string {
  return text
    .split("")
    .map((ch) => PREETI_TO_UNICODE[ch] ?? ch)
    .join("");
}