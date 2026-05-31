import AdmZip from "adm-zip";
import { rmSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const zipPath = "export.zip";
const outputDir = "dist";

rmSync(zipPath, { force: true });
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

execFileSync("npx", ["mintlify", "export", "--output", zipPath], {
  stdio: "inherit",
});

const zip = new AdmZip(zipPath);
zip.extractAllTo(outputDir, true);
