function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function parsePort(value) {
  const port = Number(value ?? "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }
  return port;
}

function normalizeFileSearchStore(value) {
  const store = value.trim();
  if (!store.startsWith("fileSearchStores/")) {
    throw new Error(
      "GEMINI_FILE_SEARCH_STORE must start with fileSearchStores/"
    );
  }
  return store;
}

export const config = {
  port: parsePort(process.env.PORT),
  metaVerifyToken: required("META_VERIFY_TOKEN"),
  metaAppSecret: required("META_APP_SECRET"),
  metaPageAccessToken: required("META_PAGE_ACCESS_TOKEN"),
  metaPageId: process.env.META_PAGE_ID?.trim() ?? "",
  metaGraphVersion: process.env.META_GRAPH_VERSION?.trim() ?? "v26.0",
  geminiApiKey: required("GEMINI_API_KEY"),
  geminiModel: process.env.GEMINI_MODEL?.trim() ?? "gemini-3.1-flash-lite",
  geminiFileSearchStore: normalizeFileSearchStore(
    required("GEMINI_FILE_SEARCH_STORE")
  ),
  unitName: process.env.UNIT_NAME?.trim() ?? "Công an phường",
  dutyPhone: process.env.DUTY_PHONE?.trim() ?? "số điện thoại trực ban chính thức",
  officeAddress: process.env.OFFICE_ADDRESS?.trim() ?? "trụ sở Công an phường",
};
