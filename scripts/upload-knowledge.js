import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

const openai = new OpenAI({ apiKey });
const knowledgeDir = path.resolve("knowledge");
const supported = new Set([".txt", ".md", ".pdf", ".doc", ".docx", ".json"]);

const files = fs
  .readdirSync(knowledgeDir)
  .map((name) => path.join(knowledgeDir, name))
  .filter((filePath) => fs.statSync(filePath).isFile())
  .filter((filePath) => supported.has(path.extname(filePath).toLowerCase()));

if (files.length === 0) {
  throw new Error("No supported files found in ./knowledge");
}

const vectorStore = await openai.vectorStores.create({
  name: `approved-knowledge-${new Date().toISOString().slice(0, 10)}`,
});

for (const filePath of files) {
  console.log(`Uploading ${path.basename(filePath)}...`);
  const uploaded = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "assistants",
  });
  await openai.vectorStores.files.create(vectorStore.id, { file_id: uploaded.id });
}

for (;;) {
  const list = await openai.vectorStores.files.list(vectorStore.id);
  const statuses = list.data.map((item) => item.status);
  console.log("Statuses:", statuses.join(", "));

  if (statuses.some((status) => status === "failed" || status === "cancelled")) {
    throw new Error("At least one knowledge file failed processing");
  }
  if (statuses.length === files.length && statuses.every((status) => status === "completed")) {
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

console.log(`\nOPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
