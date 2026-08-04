import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const folders = ["src", "scripts"];
const files = [];

for (const folder of folders) {
  collectJavaScriptFiles(path.join(projectRoot, folder), files);
}

for (const file of files.sort()) {
  const relative = path.relative(projectRoot, file);
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    process.stderr.write(`Syntax check failed: ${relative}\n`);
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  console.log(`OK ${relative}`);
}

console.log(`Checked ${files.length} JavaScript files.`);

function collectJavaScriptFiles(directory, output) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectJavaScriptFiles(fullPath, output);
    if (entry.isFile() && entry.name.endsWith(".js")) output.push(fullPath);
  }
}
