import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  target: "node20",
  format: ["esm"],
  dts: true,
});
