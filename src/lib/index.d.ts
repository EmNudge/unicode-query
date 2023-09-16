export type BidiClass =
  | "L" | "R" | "AL" | "EN" | "ES" | "ET" | "AN" | "CS" | "NSM" | "BN" | "B" | "S" | "WS" | "ON"
  | "LRE" | "LRO" | "RLE" | "RLO" | "PDF" | "LRI" | "RLI" | "FSI" | "PDI"

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
};

interface UnicodeBlockData {
  name: string;
  range: [number, number];
};

export interface UnicodeMappings {
  unicodeBlocks: Map<string, UnicodeBlockData>;
  unicodeData: Map<number, UnicodeMapData>;
  symbolHtmlNames: Map<number, string[]>;
}
