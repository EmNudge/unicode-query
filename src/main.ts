import { init, query, query2 } from "./lib";
import { simpleQuery } from "./lib/querier";
import { time } from "./utils/time";

const unicodeMappings = await time("init", init);

await time("query", () => query(unicodeMappings, "face"));

await time("query2", () => query2(unicodeMappings, "face"));

await time('simple-query-1', () => simpleQuery(unicodeMappings, 'face'), console.log)
await time('simple-query-2', () => simpleQuery(unicodeMappings, '/face/'), console.log)
await time('simple-query-3', () => simpleQuery(unicodeMappings, '0xface'), console.log)