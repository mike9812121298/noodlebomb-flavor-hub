// Finalize the PWC Lab standalone build: vite emits pwclab/pwclab.html;
// the deploy serves the directory index, and screens reference product
// images at /pwclab/assets/* which live in public/pwclab/assets.
import { cpSync, renameSync, existsSync } from "node:fs";

renameSync("pwclab/pwclab.html", "pwclab/index.html");

if (existsSync("public/pwclab/assets")) {
  cpSync("public/pwclab/assets", "pwclab/assets", { recursive: true });
}

console.log("pwclab/ build finalized (index.html + assets).");
