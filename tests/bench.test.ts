import { bench, describe, expect, it } from "vitest";
import { deserialize, simpleQuery } from "../lib";

import Blocks from "../public/Blocks.txt?raw";
import UnicodeData from "../public/UnicodeData.txt?raw";
import SymbolHtmlNames from "../public/SymbolHtmlNames.txt?raw";

const unicodeMappings = deserialize({
  blocks: Blocks,
  unicodeData: UnicodeData,
  symbolHtmlNames: SymbolHtmlNames,
});

if (globalThis["__vitest_worker__"].config.mode === "benchmark") {
  bench("simple query", () => {
    simpleQuery(unicodeMappings, "pile");
  }, { time: 500 });
} else {
  describe("ran 0 benchmarks (skipped)", () => {
    it("should be skipped", () => {
      expect(true).toBe(true);
    });
  });
}
