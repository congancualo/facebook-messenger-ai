import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

const ai = new GoogleGenAI({ apiKey });
const knowledgeDir = path.resolve("knowledge");
const supported = new Set([
  ".txt",
  ".md",
  ".pdf",
  ".doc",
  ".docx",
  ".json",
  ".csv",
  ".rtf",
  ".xlsx",
  ".pptx",
]);

if (!fs.existsSync(knowledgeDir)) {
  throw new Error("Directory ./knowledge does not exist");
}

const files = fs
  .readdirSync(knowledgeDir)
  .map((name) => path.join(knowledgeDir, name))
  .filter((filePath) => fs.statSync(filePath).isFile())
  .filter((filePath) => path.basename(filePath).toLowerCase() !== "readme.md")
  .filter((filePath) => supported.has(path.extname(filePath).toLowerCase()));

if (files.length === 0) {
  throw new Error(
    "No supported knowledge files found in ./knowledge. README.md is ignored."
  );
}

const store = await ai.fileSearchStores.create({
  config: {
    displayName: `approved-knowledge-${new Date().toISOString().slice(0, 10)}`,
    embeddingModel: "models/gemini-embedding-2",
  },
});

console.log(`Created File Search store: ${store.name}`);

for (const filePath of files) {
  const fileName = path.basename(filePath);
  console.log(`Uploading ${fileName}...`);

  let operation = await ai.fileSearchStores.uploadToFileSearchStore({
    file: filePath,
    fileSearchStoreName: store.name,
    config: { displayName: fileName },
  });

  while (!operation.done) {
    await sleep(3000);
    operation = await ai.operations.get({ operation });
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  if (operation.error) {
    throw new Error(
      `Failed to process ${fileName}: ${JSON.stringify(operation.error)}`
    );
  }

  console.log(`Completed ${fileName}`);
}

console.log("\nKnowledge store is ready.");
console.log(`GEMINI_FILE_SEARCH_STORE=${store.name}`);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
