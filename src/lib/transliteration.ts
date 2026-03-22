export const HALANT       = "\u094D"; 
export const ANUSVARA     = "\u0902"; 
export const CHANDRABINDU = "\u0901"; 
export const VISARGA      = "\u0903"; 

export type SegType = "C" | "V" | "NASAL" | "SPACE" | "OTHER";

export interface Seg {
  type:  SegType;
  roman: string;
  dev:   string;
  matra: string;
}


const VOWEL_TABLE = [
  { r: "aaN", d: "आँ", m: "ाँ" },
  { r: "aN",  d: "अँ", m: "ँ"  },

  { r: "aun", d: "औं", m: "ौं" },
  { r: "ain", d: "ऐं", m: "ैं" },
  { r: "oun", d: "औं", m: "ौं" },

  { r: "aa",  d: "आ",  m: "ा" },
  { r: "ai",  d: "ऐ",  m: "ै" },
  { r: "au",  d: "औ",  m: "ौ" },

  { r: "ee",  d: "ई",  m: "ी" },
  { r: "ii",  d: "ई",  m: "ी" },
  { r: "oo",  d: "ऊ",  m: "ू" },
  { r: "uu",  d: "ऊ",  m: "ू" },

  { r: "ou",  d: "औ",  m: "ौ" },
  { r: "ri",  d: "ऋ",  m: "ृ" },

  { r: "a",   d: "अ",  m: ""  },
  { r: "i",   d: "इ",  m: "ि" },
  { r: "u",   d: "उ",  m: "ु" },
  { r: "e",   d: "ए",  m: "े" },
  { r: "o",   d: "ओ",  m: "ो" },

  { r: "A",   d: "आ",  m: "ा" },
  { r: "I",   d: "ई",  m: "ी" },
  { r: "U",   d: "ऊ",  m: "ू" },
  { r: "E",   d: "ऐ",  m: "ै" },
  { r: "O",   d: "औ",  m: "ौ" },
];


const CONSONANT_TABLE: [string,string][] = [

  ["MM", CHANDRABINDU], 
  ["M",  ANUSVARA],    
  ["H",  VISARGA],      

  ["ksh", "क्ष"], ["gy","ज्ञ"], ["tr","त्र"], ["str","स्त्र"], ["shr","श्र"],

  ["chh","छ"], ["ddh","ढ"], ["tth","ठ"],

  ["kh","ख"], ["gh","घ"], ["ng","ङ"], ["ch","च"], ["jh","झ"],
  ["Th","ठ"], ["Dh","ढ"], ["th","थ"], ["dh","ध"], ["ph","फ"], ["bh","भ"],
  ["sh","श"], ["Sh","ष"], ["nh","न्ह"],

  ["k","क"], ["g","ग"], ["c","च"], ["j","ज"],
  ["T","ट"], ["D","ड"], ["N","ण"],
  ["t","त"], ["d","द"], ["n","न"],
  ["p","प"], ["b","ब"], ["m","म"],
  ["y","य"], ["r","र"], ["l","ल"], ["L","ळ"],
  ["v","व"], ["w","व"],
  ["s","स"], ["h","ह"],
  ["f","फ"], ["z","ज"], ["q","क"], ["x","क्ष"],
];

function mV(s:string,p:number){
  for(const v of VOWEL_TABLE) if(s.startsWith(v.r,p)) return v;
  return null;
}

function mC(s:string,p:number){
  for(const [r,d] of CONSONANT_TABLE) if(s.startsWith(r,p)) return [r,d];
  return null;
}

export function tokenize(input:string):Seg[]{
  const segs:Seg[]=[]; let i=0;

  while(i<input.length){
    const ch=input[i];

    if(/[\s\n\t]/.test(ch)){
      segs.push({type:"SPACE",roman:ch,dev:ch,matra:""});
      i++; continue;
    }

    if(ch>='0' && ch<='9'){
      segs.push({type:"OTHER",roman:ch,dev:"०१२३४५६७८९"[+ch],matra:""});
      i++; continue;
    }

    const P:Record<string,string>={".":"।",",":",","?":"?","!":"!"};
    if(P[ch]){
      segs.push({type:"OTHER",roman:ch,dev:P[ch],matra:""});
      i++; continue;
    }

    const v=mV(input,i);
    if(v){
      segs.push({type:"V",roman:v.r,dev:v.d,matra:v.m});
      i+=v.r.length; continue;
    }

    const c=mC(input,i);
    if(c){
      // Special nasal/visarga
      if(c[1]===ANUSVARA || c[1]===CHANDRABINDU || c[1]===VISARGA){
        segs.push({type:"NASAL",roman:c[0],dev:c[1],matra:""});
      } else {
        segs.push({type:"C",roman:c[0],dev:c[1],matra:""});
      }
      i+=c[0].length; continue;
    }

    segs.push({type:"OTHER",roman:ch,dev:ch,matra:""});
    i++;
  }

  return segs;
}


export function build(segs:Seg[]):string{
  let out=""; const n=segs.length;

  for(let j=0;j<n;j++){
    const s=segs[j];
    const nx=segs[j+1] ?? null;

    if(s.type==="SPACE" || s.type==="OTHER"){
      out+=s.dev; continue;
    }

    if(s.type==="NASAL"){
      out+=s.dev; continue;
    }

    if(s.type==="V"){
      out+=s.dev; continue;
    }

    if(s.type==="C"){
      if(!nx){
        out+=s.dev+HALANT;
        continue;
      }

      if(nx.type==="V"){
        out+=s.dev+nx.matra;
        j++;

        if(segs[j+1]?.type==="NASAL"){
          out+=segs[j+1].dev;
          j++;
        }

        continue;
      }

      if(nx.type==="C"){
        out+=s.dev+HALANT;
        continue;
      }

      out+=s.dev;
    }
  }

  return out;
}

function postProcess(raw:string):string{
  let out = raw
    .replace(/्([ \t\n,।?!])/g,"$1")
    .replace(/ंं/g,"ं")
    .replace(/ँँ/g,"ँ");

  return out;
}

export function transliterate(input:string):string{
  if(!input?.trim()) return "";
  return postProcess(build(tokenize(input)));
}

export function transliterateWord(word:string):string{
  if(!word) return "";
  return build(tokenize(word));
}