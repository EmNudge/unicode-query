import { UnicodeMappings } from "./deserialize";

function getNumFromText(text: string): number | null {
  if (/^[0-9]+$/.test(text)) return Number(text);
  if (/^(?:0x|U\+)[0-9a-f]+$/i.test(text)) return parseInt(text.slice(2), 16);
  if (/^0b[10]+$/.test(text)) return parseInt(text.slice(2), 2);

  return null;
}

function getNumRangeFromText(text: string): [number, number] | null {
  const numStrings = text.split('-');
  if (numStrings.length !== 2) return null;

  const n1 = getNumFromText(numStrings[0].trim());
  if (!n1) return null;
  const n2 = getNumFromText(numStrings[1].trim());
  if (!n2) return null;

  return [n1, n2];
}

function getRegexFromGlob(text: string): RegExp | null {
  if (!text.includes('*')) return null;
  if (!/^[a-zA-Z-* ]+$/.test(text)) return null;

  const regexText = text.replace(/\*/g, '.*');
  return new RegExp(regexText, 'i');
}

const charQuery = (unicodeMappings: UnicodeMappings, codepoint: number) => {
  return [...unicodeMappings.unicodeData.values()]
    .find(char => char.codepoint === codepoint);
}

export function simpleQuery(unicodeMappings: UnicodeMappings, text: string) {
  const num = getNumFromText(text);
  if (num !== null) {
    const result = charQuery(unicodeMappings, num);
    return result ? [result] : [];
  }
  if ([...text].length === 1) {
    const result = charQuery(unicodeMappings, text.codePointAt(0)!);
    return result ? [result] : [];
  }

  // allow ranges of codepoints using '-' as a separator
  const range = getNumRangeFromText(text);
  if (range) {
    return [...unicodeMappings.unicodeData.values()]
      .filter(({ codepoint }) => codepoint >= range[0] && codepoint <= range[1])
  }

  const globRegex = getRegexFromGlob(text.trim());
  if (globRegex) {
    return [...unicodeMappings.unicodeData.values()]
      .filter(({ label }) => globRegex.test(label))
  }

  const regexRes = text.match(/\/(.+?)\/([a-z]+)?/);
  if (regexRes) {
    const { 1: regexStr, 2: flagsStr } = regexRes;
    const regex = new RegExp(regexStr, /i/i.test(flagsStr) ? 'ui' : 'u');
    return [...unicodeMappings.unicodeData.values()]
      .filter(({ codepoint }) => regex.test(String.fromCodePoint(codepoint)))
  }

  // name includes match
  return [...unicodeMappings.unicodeData.values()]
    .filter(({ label }) => label.includes(text))
}