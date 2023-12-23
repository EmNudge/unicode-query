import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        copy({
          targets: [{ src: "lib/index.d.ts", dest: "dist/index.d.ts" }],
        }),
      ],
    },
    plugins: [],
    lib: {
      entry: "lib/index.ts",
      name: "unicode-query",
    },
  },
});
