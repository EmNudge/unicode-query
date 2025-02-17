import { deserialize, simpleQuery } from "../lib";

let unicodeMappingsCache: Awaited<ReturnType<typeof deserialize>> | undefined;

export async function init() {
  if (unicodeMappingsCache) return unicodeMappingsCache;

  const getFile = (path: string) =>
    fetch(path).then((res) => res.text());

  const promises = [
    getFile("/Blocks.txt"),
    getFile("/UnicodeData.txt"),
    getFile("/SymbolHtmlNames.txt"),
  ] as const;

  const [unicodeBlocks, unicodeData, symbolHtmlNames] = await Promise.all(promises);

  unicodeMappingsCache = deserialize({
    blocks: unicodeBlocks,
    unicodeData,
    symbolHtmlNames,
  });

  return unicodeMappingsCache;
}


document.body.innerHTML = `
    <input type="text">
    <output>
    </output>
  `;
const inputEl = document.querySelector("input")!;
const outputEl = document.querySelector("output")!;



inputEl.addEventListener("input", async () => {
  if (!inputEl.value) return;

  const unicodeMappings = await init();

  const results = simpleQuery(unicodeMappings, inputEl.value);
  outputEl.innerHTML = results
    .map((result) => {
      return `<div>${String.fromCodePoint(result.codepoint)} (${
        result.codepoint
      }) ${result.label}</div>`;
    })
    .join("\n");
});
