import type { UnicodeMappings, BidiClass } from "./index.d";

interface UnicodeMapData {
  codepoint: number;
  label: string;
  category: string;
  combiningClass: string;
  bidiClass: BidiClass;
  decompositionStr: string;
  decimalEquiv: string;
  digitEquiv: string;
  numericEquiv: string;
  isBidiMirrored: boolean;
  oldName: string;
  uppercaseMapping: string;
  lowercaseMapping: string;
  titlecaseMapping: string;
};

function getUnicodeMap(text: string): Map<number, UnicodeMapData> {
  const arr = text.split('\n').map(line => {
    const [
      codepointStr, label, category, combiningClass, bidiClass,
      decompositionStr, decimalEquiv, digitEquiv, numericEquiv,
      bidiMirrored, oldName, /* isoComment */,
      uppercaseMapping, lowercaseMapping, titlecaseMapping
    ] = line.split(';');

    const codepoint = parseInt(codepointStr, 16);
    const isBidiMirrored = bidiMirrored === 'Y';

    const data: UnicodeMapData = {
      codepoint, label: label.toLowerCase(), category, combiningClass, bidiClass: bidiClass as BidiClass,
      decompositionStr, decimalEquiv, digitEquiv, numericEquiv,
      isBidiMirrored, oldName,
      uppercaseMapping, lowercaseMapping, titlecaseMapping
    }
    return [codepoint, data] as const;
  });

  return new Map(arr);
}

type UnicodeBlockData = {
  name: string;
  range: [number, number];
};

function getUnicodeBlockMap(text: string): Map<string, UnicodeBlockData> {
  const arr = text.split('\n').map(row => {
    const [rangeStr, name] = row.split('; ');

    const [lower, upper] = rangeStr.split('..');
    const blockData: UnicodeBlockData = { 
      name, 
      range: [parseInt(lower, 16), parseInt(upper, 16)]
    };
    return [name, blockData] as const;
  });

  return new Map(arr);
}

function getSymbolHtmlNamesMap(text: string): Map<number, string[]> {
  const symbolNamesMap = text.split('\n').map(line => {
    const [numStr, names] = line.split(';');
    return [parseInt(numStr, 16), names.split(',')] as [number, string[]];
  });

  return new Map(symbolNamesMap);
}

function getNameIndexMap(text: string): Map<number, string[]> {
  const map = new Map<number, string[]>();

  // multiple lines can refer to the same codepoint
  // we must iterate manually
  for (const line of text.split('\n')) {
    const [namesStr, codepointStr] = line.split('\t');
    const names = namesStr.split(', ');
    const codepoint = parseInt(codepointStr, 16);
    
    const fullNamesArr =[...(map.get(codepoint) ?? []), ...names];
    map.set(codepoint, fullNamesArr);
  }
  return map;
}

let initState: Promise<UnicodeMappings> | null = null;

export async function init(): Promise<UnicodeMappings> {
  if (initState) return initState;

  const promises = [
    fetch("/Blocks.txt").then((res) => res.text()).then(getUnicodeBlockMap),
    fetch("/UnicodeData.txt").then((res) => res.text()).then(getUnicodeMap),
    fetch("/SymbolHtmlNames.txt").then((res) => res.text()).then(getSymbolHtmlNamesMap),
    fetch("/Index.txt").then((res) => res.text()).then(getNameIndexMap),
  ] as const;

  initState = Promise.all(promises).then(values => {
    const [unicodeBlocks, unicodeData, symbolHtmlNames, nameIndex] = values;
    return {
      unicodeBlocks,
      unicodeData,
      symbolHtmlNames,
      nameIndex,
    } as UnicodeMappings;
  });

  return initState;
}

export function query(unicodeMappings: UnicodeMappings, name: string) {
  const results: UnicodeMapData[] = [];

  const normalizedName = name.toLowerCase();
  for (const [codepoint, data] of unicodeMappings.unicodeData) {
    const match = 
      data.label.includes(normalizedName)
      || data.oldName?.includes(normalizedName)
      || unicodeMappings.nameIndex.get(codepoint)?.some(n => n.includes(normalizedName));

    if (!match) continue;

    results.push(data);
  }
  
  return results;
}

export function query2(unicodeMappings: UnicodeMappings, name: string) {
  const normalizedName = name.toLowerCase();

  return [...unicodeMappings.unicodeData.values()]
    .filter(data => {
      const match = 
        data.label.includes(normalizedName)
        || data.oldName?.includes(normalizedName)
        || unicodeMappings.nameIndex.get(data.codepoint)?.some(n => n.includes(normalizedName));
      return match;
    })
    .map(data => {
      return { ...data, altNames: unicodeMappings.nameIndex.get(data.codepoint) }
    })
}