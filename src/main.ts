import type { UnicodeMapData } from "./lib/index.d";
import { init, simpleQuery, advancedQuery } from "./lib";
import { time } from "./utils/time";

const logChar = (vals: UnicodeMapData[]) => console.log(vals.map(val => String.fromCodePoint(val.codepoint)));

const unicodeMappings = await time("init", init);

await time('smp-1', () => simpleQuery(unicodeMappings, 'face'))
await time('smp-2', () => simpleQuery(unicodeMappings, '/face/'))
await time('smp-3', () => simpleQuery(unicodeMappings, '0xface'))

await time('adv-1', () => advancedQuery(unicodeMappings, [{ type: 'includes', value: 'face' }]))
await time('adv-2', () => advancedQuery(unicodeMappings, [{ type: 'regex', value: /face/ }]))
await time('adv-3', () => advancedQuery(unicodeMappings, [{ type: 'range', value: [0xface, 0xface] }]))
await time('adv-4', () => advancedQuery(unicodeMappings, [{ type: 'bidi', value: 'WS' }]), logChar)