export type BidiClass =
  | "L" | "R" | "AL" | "EN" | "ES" | "ET" | "AN" | "CS" | "NSM" | "BN" | "B" | "S" | "WS" | "ON"
  | "LRE" | "LRO" | "RLE" | "RLO" | "PDF" | "LRI" | "RLI" | "FSI" | "PDI"

export interface UnicodeCharInfo {
  codepoint: number;
  name: string;
  category: string;
  combiningClass: number;
  bidiClass: BidiClass;
  decomposition: {
    type: string;
    codepoints: number[];
  } | null;
  numberEquivalent: {
    decimal: number | null;
    digit: number | null;
    numeric: string | null;
  };
  isBidiMirrored: boolean;
  caseMapping: {
    uppercase: number | null,
    lowercase: number | null,
    titlecase: number | null,
  };
  oldName: string | null;
}

export interface UnicodeMappings {
  unicodeBlocks: Map<string, UnicodeBlockData>;
  unicodeData: Map<number, UnicodeMapData>;
  symbolHtmlNames: Map<number, string[]>;
  nameIndex: Map<number, string[]>;
}