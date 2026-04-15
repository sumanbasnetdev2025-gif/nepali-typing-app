// src/lib/preetiConverter.ts

const PREETI_TO_UNICODE: Record<string, string> = {
  "!": "!", "@": "ा", "#": "्र", "$": "र्", "%": "%",
  "^": "ँ", "&": "ट", "*": "ठ", "(": "(", ")": ")",

  "Q": "ौ", "W": "ै", "E": "े", "R": "र", "T": "त",
  "Y": "य", "U": "ु", "I": "ि", "O": "ो", "P": "प",

  "{": "ु", "}": "ू", "|": "्", "A": "ा", "S": "स",
  "D": "द", "F": "फ", "G": "ग", "H": "ह", "J": "ज",
  "K": "क", "L": "ल",

  "Z": "्", "X": "ं", "C": "च", "V": "व", "B": "ब",
  "N": "न", "M": "म", "<": ",", ">": "।", "?": "?",

  "q": "ध", "w": "थ", "e": "े", "r": "र", "t": "त",
  "y": "य", "u": "ु", "i": "ि", "o": "ो", "p": "प",

  "[": "ु", "]": "ू", "\\": "्", "a": "ा", "s": "स",
  "d": "द", "f": "फ", "g": "ग", "h": "ह", "j": "ज",
  "k": "क", "l": "ल", ";": "ः", "'": "्",

  "z": "ज्ञ", "x": "ं", "c": "च", "v": "व", "b": "ब",
  "n": "न", "m": "म", ",": "ˈ", ".": "।",

 
};

// ---------------------------------------------

export function isPreetiText(text: string): boolean {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return false;

  const matched = text.split("").filter((c) => PREETI_TO_UNICODE[c]);
  return matched.length > text.length * 0.4;
}

// ---------------------------------------------

export function convertPreetiToUnicode(text: string): string {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // direct mapping
    result += PREETI_TO_UNICODE[ch] ?? ch;
  }

  return result;
}