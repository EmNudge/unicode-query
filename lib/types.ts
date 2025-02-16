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

export type CombiningClass =
  | 0 /** Not Reordered */
  | 1 /** Overlay */
  | 6 /** UNKNOWN */
  | 7 /** Nukta */
  | 8 /** Kana Voicing */
  | 9 /** Virama */
  | 10 /** CCC10 */
  | 11 /** CCC11 */
  | 12 /** CCC12 */
  | 13 /** CCC13 */
  | 14 /** CCC14 */
  | 15 /** CCC15 */
  | 16 /** CCC16 */
  | 17 /** CCC17 */
  | 18 /** CCC18 */
  | 19 /** CCC19 */
  | 20 /** CCC20 */
  | 21 /** CCC21 */
  | 22 /** CCC22 */
  | 23 /** CCC23 */
  | 24 /** CCC24 */
  | 25 /** CCC25 */
  | 26 /** CCC26 */
  | 27 /** CCC27 */
  | 28 /** CCC28 */
  | 29 /** CCC29 */
  | 30 /** CCC30 */
  | 31 /** CCC31 */
  | 32 /** CCC32 */
  | 33 /** CCC33 */
  | 34 /** CCC34 */
  | 35 /** CCC35 */
  | 36 /** CCC36 */
  | 84 /** CCC84 */
  | 91 /** CCC91 */
  | 103 /** CCC103 */
  | 107 /** CCC107 */
  | 118 /** CCC118 */
  | 122 /** CCC122 */
  | 129 /** CCC129 */
  | 130 /** CCC130 */
  | 132 /** CCC132 */
  | 202 /** Attached Below */
  | 214 /** Attached Above */
  | 216 /** Attached Above Right */
  | 218 /** Below Left */
  | 220 /** Below */
  | 222 /** Below Right */
  | 224 /** Left */
  | 226 /** Right */
  | 228 /** Above Left */
  | 230 /** Above */
  | 232 /** Above Right */
  | 233 /** Double Below */
  | 234 /** Double Above */
  | 240; /** Iota Subscript */

export type UnicodeCategory =
  | "Cc"
  | "Zs"
  | "Po"
  | "Sc"
  | "Ps"
  | "Pe"
  | "Sm"
  | "Pd"
  | "Nd"
  | "Lu"
  | "Sk"
  | "Pc"
  | "Ll"
  | "So"
  | "Lo"
  | "Pi"
  | "Cf"
  | "No"
  | "Pf"
  | "Lt"
  | "Lm"
  | "Mn"
  | "Me"
  | "Mc"
  | "Nl"
  | "Zl"
  | "Zp"
  | "Cs"
  | "Co";

type Codepoint = number;

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Numeric = `${number}` | `${number}/${number}`;

export interface UnicodeMapData {
  codepoint: Codepoint;
  label: string;
  category: UnicodeCategory;
  combiningClass: CombiningClass;
  bidiClass: BidiClass;
  decompositionStr: string | null;
  decimalEquiv: Digit | null;
  digitEquiv: Digit | null;
  numericEquiv: Numeric | null;
  isBidiMirrored: boolean;
  oldName: string | null;
  uppercaseMapping: Codepoint | null;
  lowercaseMapping: Codepoint | null;
  titlecaseMapping: Codepoint | null;
}