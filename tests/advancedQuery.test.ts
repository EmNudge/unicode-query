import { describe, expect, it } from "vitest";
import { advancedQuery, deserialize } from "../lib";
import Blocks from "../public/Blocks.txt?raw";
import UnicodeData from "../public/UnicodeData.txt?raw";
import SymbolHtmlNames from "../public/SymbolHtmlNames.txt?raw";

const unicodeMappings = deserialize({
  blocks: Blocks,
  unicodeData: UnicodeData,
  symbolHtmlNames: SymbolHtmlNames,
});

describe("advanced query", () => {
  it("allows name matches", async () => {
    const result = advancedQuery(unicodeMappings, [
      {
        type: "name",
        value: "pile",
      },
    ]);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
