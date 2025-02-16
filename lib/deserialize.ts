export type BidiClass =
  | "L"
  | "R"
  | "AL"
  | "EN"
  | "ES"
  | "ET"
  | "AN"
  | "CS"
  | "NSM"
  | "BN"
  | "B"
  | "S"
  | "WS"
  | "ON"
  | "LRE"
  | "LRO"
  | "RLE"
  | "RLO"
  | "PDF"
  | "LRI"
  | "RLI"
  | "FSI"
  | "PDI";

export interface UnicodeMapData {
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
}

interface UnicodeBlockData {
  name: string;
  range: [number, number];
}

export interface UnicodeMappings {
  unicodeBlocks: Map<string, UnicodeBlockData>;
  unicodeData: Map<number, UnicodeMapData>;
  symbolHtmlNames: Map<number, string[]>;
}

export function getUnicodeMap(text: string): Map<number, UnicodeMapData> {
  const arr = text.split("\n").map((line) => {
    const [
      codepointStr,
      label,
      category,
      combiningClass,
      bidiClass,
      decompositionStr,
      decimalEquiv,
      digitEquiv,
      numericEquiv,
      bidiMirrored,
      oldName, /* isoComment */
      ,
      uppercaseMapping,
      lowercaseMapping,
      titlecaseMapping,
    ] = line.split(";");

    const codepoint = parseInt(codepointStr, 16);
    const isBidiMirrored = bidiMirrored === "Y";

    const data: UnicodeMapData = {
      codepoint,
      label: label.toLowerCase(),
      category,
      combiningClass,
      bidiClass: bidiClass as BidiClass,
      decompositionStr,
      decimalEquiv,
      digitEquiv,
      numericEquiv,
      isBidiMirrored,
      oldName,
      uppercaseMapping,
      lowercaseMapping,
      titlecaseMapping,
    };
    return [codepoint, data] as const;
  });

  return new Map(arr);
}

export function getUnicodeBlockMap(
  text: string,
): Map<string, UnicodeBlockData> {
  const arr = text.split("\n").map((row) => {
    const [rangeStr, name] = row.split("; ");

    const [lower, upper] = rangeStr.split("..");
    const blockData: UnicodeBlockData = {
      name,
      range: [parseInt(lower, 16), parseInt(upper, 16)],
    };
    return [name, blockData] as const;
  });

  return new Map(arr);
}

export function getSymbolHtmlNamesMap(text: string): Map<number, string[]> {
  const symbolNamesMap = text.split("\n").map((line) => {
    const [numStr, names] = line.split(";");
    return [parseInt(numStr, 16), names.split(",")] as [number, string[]];
  });

  return new Map(symbolNamesMap);
}

export function deserialize({
  blocks,
  unicodeData,
  symbolHtmlNames,
}: {
  blocks: string;
  unicodeData: string;
  symbolHtmlNames: string;
}): UnicodeMappings {
  return {
    unicodeBlocks: getUnicodeBlockMap(blocks),
    unicodeData: getUnicodeMap(unicodeData),
    symbolHtmlNames: getSymbolHtmlNamesMap(symbolHtmlNames),
  };
}