import { deserialize, simpleQuery } from "../lib";

const unicodeMappings = await init();

export async function init() {
  const getFile = (path: string) =>
    fetch(path).then((res) => res.text());

  const promises = [
    getFile("/Blocks.txt"),
    getFile("/UnicodeData.txt"),
    getFile("/SymbolHtmlNames.txt"),
  ] as const;

  const [unicodeBlocks, unicodeData, symbolHtmlNames] = await Promise.all(promises);

  return deserialize({
    blocks: unicodeBlocks,
    unicodeData,
    symbolHtmlNames,
  });
}


document.body.innerHTML = `
    <input type="text">
    <output>
    </output>
  `;
const inputEl = document.querySelector("input")!;
const outputEl = document.querySelector("output")!;

inputEl.addEventListener("input", () => {
  if (!inputEl.value) return;

  const results = simpleQuery(unicodeMappings, inputEl.value);
  outputEl.innerHTML = results
    .map((result) => {
      return `<div>${String.fromCodePoint(result.codepoint)} (${
        result.codepoint
      }) ${result.label}</div>`;
    })
    .join("\n");
});
