import type { BidiClass, CombiningClass, Digit, Numeric, UnicodeCategory, UnicodeMapData } from "./types";

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
      oldName,
      _isoComment,
      uppercaseMapping,
      lowercaseMapping,
      titlecaseMapping,
    ] = line.split(";");

    const codepoint = parseInt(codepointStr, 16);

    const data: UnicodeMapData = {
      codepoint,
      label: label.toLowerCase(),
      category: category as UnicodeCategory,
      combiningClass: parseInt(combiningClass) as CombiningClass,
      bidiClass: bidiClass as BidiClass,
      decompositionStr: decompositionStr || null,
      decimalEquiv: decimalEquiv ? parseInt(decimalEquiv) as Digit : null,
      digitEquiv: digitEquiv ? parseInt(digitEquiv) as Digit : null,
      numericEquiv: numericEquiv as Numeric || null,
      isBidiMirrored: bidiMirrored === "Y",
      oldName: oldName || null,
      uppercaseMapping: uppercaseMapping ? parseInt(uppercaseMapping, 16) : null,
      lowercaseMapping: lowercaseMapping ? parseInt(lowercaseMapping, 16) : null,
      titlecaseMapping: titlecaseMapping ? parseInt(titlecaseMapping, 16) : null,
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
