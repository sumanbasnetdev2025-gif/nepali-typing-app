export interface FontEntry {
  name: string;
  file: string;
  weight?: number;
  style?: string;
}

export const FONT_REGISTRY: FontEntry[] = [
  { name: "Akshar",              file: "Akshar-Regular.ttf" },
  { name: "Amiko",               file: "Amiko-Regular.ttf" },
  { name: "Amita",               file: "Amita-Regular.ttf" },
  { name: "Annapurna SIL",       file: "AnnapurnaSIL-Regular.ttf" },
  { name: "Arya",                file: "Arya-Regular.ttf" },
  { name: "Asar",                file: "Asar-Regular.ttf" },
  { name: "Eczar",               file: "Eczar-Regular.ttf" },
  { name: "Gajraj One",          file: "GajrajOne-Regular.ttf" },
  { name: "Gotu",                file: "Gotu-Regular.ttf" },
  { name: "Jaldi",               file: "Jaldi-Regular.ttf" },
  { name: "Kadwa",               file: "Kadwa-Regular.ttf" },
  { name: "Kalam",               file: "Kalam-Regular.ttf" },
  { name: "Kalimati",            file: "Kalimati.ttf" },
  { name: "Khula",               file: "Khula-Regular.ttf" },
  { name: "Laila",               file: "Laila-Regular.ttf" },
  { name: "Lohit Devanagari",    file: "Lohit-Devanagari.ttf" },
  { name: "Mangal",              file: "Mangal.ttf" },
  { name: "Martel",              file: "Martel-Regular.ttf" },
  { name: "Mukta",               file: "Mukta-Regular.ttf" },
  { name: "Noto Sans Devanagari",file: "NotoSansDevanagari-Regular.ttf" },
  { name: "Palanquin",           file: "Palanquin-Regular.ttf" },
  { name: "Poppins",             file: "Poppins-Regular.ttf" },
  { name: "Pragati Narrow",      file: "PragatiNarrow-Regular.ttf" },
  { name: "Preeti",              file: "Preeti.ttf" },
  { name: "Ranga",               file: "Ranga-Regular.ttf" },
  { name: "Rozha One",           file: "RozhaOne-Regular.ttf" },
  { name: "Sahitya",             file: "Sahitya-Regular.ttf" },
  { name: "Sarala",              file: "Sarala-Regular.ttf" },
  { name: "Sumana",              file: "Sumana-Regular.ttf" },
  { name: "Sura",                file: "Sura-Regular.ttf" },
  { name: "Vesper Libre",        file: "VesperLibre-Regular.ttf" },
  { name: "Yantramanav",         file: "Yantramanav-Regular.ttf" },
  { name: "Yatra One",           file: "YatraOne-Regular.ttf" },
];


export const DEFAULT_FONT = "Kalimati";