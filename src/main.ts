import { init, advancedQuery, simpleQuery } from "../lib";

const unicodeMappings = await init();

const result = advancedQuery(unicodeMappings, [
  { type: "name", value: "face" },
]);
console.log({ result });

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
