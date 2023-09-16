import { BidiClass, UnicodeMappings } from "./index.d";

export const PLANE_LENGTH = 2 << 15;

/*

Kinds of searches:

- range search
  - generic range
  - unicode plane
  - unicode block
  - is near character
- name match
  - label, oldName
  - regex vs plaintext includes
- bidi class
- Unicode Property Class
  - regex match on character

*/

// TODO: settle on differences between regex on character vs name
type FilterData = { type: 'regex', value: RegExp }
  | { type: 'includes', value: string }
  | { type: 'range', value: [number, number] }
  | { type: 'bidi', value: BidiClass };

export type Filter = FilterData & { negated?: boolean };

export function advancedQuery(unicodeMappings: UnicodeMappings, filters: Filter[]) {
  let data = [...unicodeMappings.unicodeData.values()];

  for (const filter of filters) {
    data = data.filter(val => {
      if (filter.type === 'regex') {
        return filter.negated ? !filter.value.test(val.label) : filter.value.test(val.label);
      }

      if (filter.type === 'includes') {
        // note: include oldName
        return filter.negated ? !val.label.includes(filter.value) : val.label.includes(filter.value);
      }

      if (filter.type === 'range') {
        const [min, max] = filter.value;
        return filter.negated ? !(val.codepoint >= min && val.codepoint <= max) : (val.codepoint >= min && val.codepoint <= max);
      }

      if (filter.type === 'bidi') {
        return filter.negated ? val.bidiClass !== filter.value : val.bidiClass === filter.value;
      }

      // @ts-ignore
      throw new Error(`Unknown filter type: ${filter.type}`);
    })
  }

  return data;
}