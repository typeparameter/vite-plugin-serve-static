import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { createServer, ViteDevServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(__dirname, "..", "static");

describe("plugin integration", () => {
  let server: ViteDevServer;
  let baseUrl: string;

  beforeAll(async () => {
    const configFile = path.resolve(__dirname, "..", "vite.config.ts");

    server = await createServer({
      configFile,
      server: {
        port: 0,
        strictPort: false,
      },
    });

    await server.listen();

    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("Failed to start Vite dev server");

    baseUrl = `http://localhost:${address.port}`;
  });

  afterAll(async () => {
    await server?.close();
  });

  it("serves a configured static JSON file", async () => {
    const response = await fetch(`${baseUrl}/metadata.json`);

    const contentType = response.headers.get("content-type") ?? "";

    expect(response.status).toBe(200);
    expect(contentType).toContain("application/json");

    const expected = await fs.readFile(path.join(staticDir, "metadata.json"), "utf-8");
    await expect(response.text()).resolves.toBe(expected);
  });

  it("serves files matched by a wildcard pattern", async () => {
    const response = await fetch(`${baseUrl}/data/dog-treats`);

    const contentType = response.headers.get("content-type") ?? "";

    expect(response.status).toBe(200);
    expect(contentType).toContain("text/csv");

    const expected = await fs.readFile(path.join(staticDir, "data", "dog-treats.csv"), "utf-8");
    await expect(response.text()).resolves.toBe(expected);
  });

  it("serves files matched by a capture group pattern", async () => {
    const response = await fetch(`${baseUrl}/pages/index`);

    const contentType = response.headers.get("content-type") ?? "";

    expect(response.status).toBe(200);
    expect(contentType).toContain("text/html");

    const expected = await fs.readFile(path.join(staticDir, "pages", "index.html"), "utf-8");
    await expect(response.text()).resolves.toBe(expected);
  });

  it("returns 404 for missing files", async () => {
    const response = await fetch(`${baseUrl}/data/missing`);

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe("Not found");
  });
});
