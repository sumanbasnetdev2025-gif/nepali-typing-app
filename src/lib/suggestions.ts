import { transliterateWord } from "./transliteration";
import dictionary from "./dictionary.json";
import { WORD_MAP } from "./wordmap";

export interface Candidate {
  text: string;
  score: number;
  source: "direct" | "variant" | "dictionary" | "prefix" | "wordmap";
}

const cache = new Map<string, string[]>();
const DICT = dictionary as Record<string, number>;


function generateVariants(roman: string): string[] {
  const variants = new Set<string>([roman]);

  const SUBS: [string, string][] = [
    ["aa","a"],["a","aa"],["ee","i"],["i","ee"],["ii","ee"],
    ["oo","u"],["u","oo"],["uu","oo"],["au","o"],["o","au"],
    ["ai","e"],["e","ai"],
    ["ch","chh"],["chh","ch"],
    ["sh","s"],["s","sh"],
    ["v","b"],["b","v"],["w","v"],
    ["z","j"],["f","ph"],

    // Retroflex fixes
    ["t","T"],["T","t"],
    ["d","D"],["D","d"],
    ["n","N"],["N","n"],
    ["th","Th"],["Th","th"],
    ["dh","Dh"],["Dh","dh"],
  ];

  for (const [f, t] of SUBS) {
    if (roman.includes(f)) {
      variants.add(roman.replace(f, t));
      variants.add(roman.split(f).join(t));
    }
  }

  if (roman.endsWith("n")) {
    variants.add(roman.slice(0, -1));
    variants.add(roman.slice(0, -1) + "N");
  } else {
    variants.add(roman + "n");
  }

  variants.delete(roman);
  return [...variants].slice(0, 10);
}

function scoreCandidate(dev: string, direct: string): number {
  let score = 0;

  if (DICT[dev] !== undefined) score += 500 + DICT[dev];

  if (dev === direct) score += 300;
  if (dev.startsWith(direct) && dev !== direct) score += 120;

  if (dev.endsWith("्")) score -= 80;

  score -= (dev.match(/्/g) || []).length * 5;

  return score;
}

function dedupRank(candidates: Candidate[]): string[] {
  const seen = new Map<string, number>();

  for (const c of candidates) {
    const prev = seen.get(c.text) ?? -Infinity;
    if (c.score > prev) seen.set(c.text, c.score);
  }

  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([text]) => text)
    .slice(0, 5);
}


export function getSuggestions(roman: string): string[] {
  if (!roman || roman.trim().length === 0) return [];

  const key = roman.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key)!;

  const direct = transliterateWord(roman);
  const all: Candidate[] = [];
  const seen = new Set<string>();

  if (WORD_MAP[key]) {
    for (const word of WORD_MAP[key]) {
      all.push({
        text: word,
        score: 2000, 
        source: "wordmap",
      });
      seen.add(word);
    }
  }

  for (const [word, nepali] of Object.entries(WORD_MAP)) {
    if (word.startsWith(key) && word !== key) {
      for (const n of nepali) {
        if (!seen.has(n)) {
          all.push({
            text: n,
            score: 1500,
            source: "wordmap",
          });
          seen.add(n);
        }
      }
    }
    if (all.length >= 5) break;
  }

  if (direct && direct !== roman && !seen.has(direct)) {
    all.push({
      text: direct,
      score: scoreCandidate(direct, direct),
      source: "direct",
    });
    seen.add(direct);
  }

  for (const variant of generateVariants(roman)) {
    const dev = transliterateWord(variant);
    if (!dev || dev === variant || seen.has(dev)) continue;

    all.push({
      text: dev,
      score: scoreCandidate(dev, direct),
      source: "variant",
    });

    seen.add(dev);
    if (all.length > 15) break;
  }

  // ── 4. Dictionary prefix matching ─────────────
  if (direct && direct.length >= 2) {
    const clean = direct.replace(/्$/, "");

    for (const [word, freq] of Object.entries(DICT)) {
      if (seen.has(word)) continue;

      if (word === direct) {
        all.push({
          text: word,
          score: 1800 + freq,
          source: "dictionary",
        });
      } else if (word.startsWith(clean)) {
        all.push({
          text: word,
          score: 400 + freq,
          source: "prefix",
        });
      }

      seen.add(word);
      if (all.length > 25) break;
    }
  }

  const result = dedupRank(all);
  cache.set(key, result);

  return result;
}


export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}