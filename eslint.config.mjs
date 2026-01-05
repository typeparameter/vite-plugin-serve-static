// @ts-check

import path from "path";
import { fileURLToPath } from "url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

const __dirname = fileURLToPath(path.dirname(import.meta.url));

export default defineConfig([
  includeIgnoreFile(path.join(__dirname, ".gitignore")),
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
]);
