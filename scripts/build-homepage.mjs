import { build, transform } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const buildDir = join(repoRoot, "build");

const runtime = await build({
  stdin: {
    contents: `
      import React from "react";
      import { createPortal } from "react-dom";
      import { createRoot } from "react-dom/client";
      window.React = React;
      window.ReactDOM = { createPortal, createRoot };
      Object.assign(window, {
        useEffect: React.useEffect,
        useLayoutEffect: React.useLayoutEffect,
        useMemo: React.useMemo,
        useRef: React.useRef,
        useState: React.useState,
      });
    `,
    resolveDir: repoRoot,
    sourcefile: "homepage-react-runtime.js",
    loader: "js",
  },
  bundle: true,
  define: { "process.env.NODE_ENV": '"production"' },
  format: "iife",
  minify: true,
  platform: "browser",
  target: "es2018",
  write: false,
});

const chunks = [runtime.outputFiles[0].text];

for (const file of ["components.jsx", "monthly-drop.jsx", "app.jsx"]) {
  const source = await readFile(join(repoRoot, file), "utf8");
  const compiled = await transform(source, {
    loader: "jsx",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    minify: true,
    target: "es2018",
  });
  chunks.push(`(()=>{${compiled.code}})()`);
}

await mkdir(buildDir, { recursive: true });
await writeFile(
  join(buildDir, "homepage.js"),
  `/* NoodleBomb homepage runtime: React + approved eager app bundle. */\n${chunks.join(";\n")}\n`,
  "utf8",
);
