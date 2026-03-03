import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "vite";
import serveStatic from "vite-plugin-serve-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "static");

export default defineConfig({
  plugins: [
    serveStatic({
      rules: [
        {
          pattern: /^\/metadata\.json$/,
          resolve: path.join(staticDir, "metadata.json"),
        },
        {
          pattern: /^\/data\/(.*)$/,
          resolve: (match: RegExpExecArray) => path.join(staticDir, "data", `${match[1]!}.csv`),
        },
        {
          pattern: /^\/pages\/(.*)$/,
          resolve: (match: RegExpExecArray) => path.join(staticDir, "pages", `${match[1]!}.html`),
        },
      ],
    }),
  ],
});
