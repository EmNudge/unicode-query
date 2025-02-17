import type { UnicodeMappings } from "./deserialize";
import type { BidiClass } from "./types";

type FilterData =
  | { type: "character"; value: RegExp }
  | { type: "name"; value: RegExp | string }
  | { type: "range"; value: [number, number] }
  | { type: "bidi"; value: BidiClass };

export type Filter = FilterData & { negated?: boolean };

export const PLANE_LENGTH = 2 << 15;

export function advancedQuery(
  unicodeMappings: UnicodeMappings,
  filters: Filter[],
) {
  let data = [...unicodeMappings.unicodeData.values()];

  for (const filter of filters) {
    data = data.filter((val) => {
      if (filter.type === "name") {
        if (typeof filter.value === "string") {
          // note: include oldName
          return filter.negated
            ? !val.label.includes(filter.value)
            : val.label.includes(filter.value);
        }
        return filter.negated
          ? !filter.value.test(val.label)
          : filter.value.test(val.label);
      }

      if (filter.type === "character") {
        const char = String.fromCodePoint(val.codepoint);
        return filter.negated
          ? !filter.value.test(char)
          : filter.value.test(char);
      }

      if (filter.type === "range") {
        const [min, max] = filter.value;
        return filter.negated
          ? !(val.codepoint >= min && val.codepoint <= max)
          : val.codepoint >= min && val.codepoint <= max;
      }

      if (filter.type === "bidi") {
        return filter.negated
          ? val.bidiClass !== filter.value
          : val.bidiClass === filter.value;
      }

      // @ts-expect-error
      throw new Error(`Unknown filter type: ${filter.type}`);
    });
  }

  return data;
}
