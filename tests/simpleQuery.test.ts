import { describe, expect, it } from "vitest";
import { deserialize, simpleQuery } from "../lib";
import Blocks from "../public/Blocks.txt?raw";
import UnicodeData from "../public/UnicodeData.txt?raw";
import SymbolHtmlNames from "../public/SymbolHtmlNames.txt?raw";

const unicodeMappings = deserialize({
  blocks: Blocks,
  unicodeData: UnicodeData,
  symbolHtmlNames: SymbolHtmlNames,
});

describe("simple query", () => {
  it("allows single codepoint matches", async () => {
    const result = simpleQuery(unicodeMappings, "128169");
    expect(result.length).toBe(1);
    expect(result[0].codepoint).toBe(128169);
  });

  it("allows range matches", async () => {
    const result = simpleQuery(unicodeMappings, "128169-128170");
    expect(result.length).toBe(2);
    expect(result[0].codepoint).toBe(128169);
    expect(result[1].codepoint).toBe(128170);
  });

  it("allows name substring matches", async () => {
    const result = simpleQuery(unicodeMappings, "pile");
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("allows glob matches on names", async () => {
    const result = simpleQuery(unicodeMappings, "* of *");
    expect(result.length).toBeGreaterThan(0);

    const pileOfPoo = result.find(({ label }) => label === "pile of poo");
    expect(pileOfPoo).toBeDefined();
  });

  it("allows regex matches on characters", async () => {
    const result = simpleQuery(unicodeMappings, "/\uD83D\uDE00/");
    const grinningFace = result.find(({ label }) => label === "grinning face");

    expect(grinningFace).toBeDefined();
  });

  it("supports regex matches with flags", async () => {
    const result = simpleQuery(unicodeMappings, "/(?=\\p{Currency_Symbol})/u");
    const yenSign = result.find(({ label }) => label === "yen sign");

    expect(yenSign).toBeDefined();
  });
});
