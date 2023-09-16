import type { UnicodeMappings, BidiClass, UnicodeMapData, UnicodeBlockData } from "./index.d";

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

let initState: Promise<UnicodeMappings> | null = null;

export async function init(): Promise<UnicodeMappings> {
  if (initState) return initState;

  const promises = [
    fetch("/Blocks.txt").then((res) => res.text()).then(getUnicodeBlockMap),
    fetch("/UnicodeData.txt").then((res) => res.text()).then(getUnicodeMap),
    fetch("/SymbolHtmlNames.txt").then((res) => res.text()).then(getSymbolHtmlNamesMap),
  ] as const;

  initState = Promise.all(promises).then(values => {
    const [unicodeBlocks, unicodeData, symbolHtmlNames] = values;
    return {
      unicodeBlocks,
      unicodeData,
      symbolHtmlNames,
    } as UnicodeMappings;
  });

  return initState;
}

export * from './simpleQuery';
export * from './advancedQuery';