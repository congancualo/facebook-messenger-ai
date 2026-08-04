import express from "express";
import { config } from "./config.js";
import { handleWebhook } from "./handler.js";
import { verifyMetaSignature } from "./meta.js";

const app = express();

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buffer) => {
      req.rawBody = Buffer.from(buffer);
    },
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "Facebook Messenger AI webhook",
    unit: config.unitName,
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.metaVerifyToken && typeof challenge === "string") {
    res.status(200).send(challenge);
    return;
  }

  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  const signature = req.header("x-hub-signature-256") ?? undefined;

  if (!verifyMetaSignature(req.rawBody, signature)) {
    res.sendStatus(401);
    return;
  }

  // Meta cần phản hồi nhanh. Xử lý AI tiếp tục sau khi đã xác nhận webhook.
  res.sendStatus(200);
  setImmediate(() => {
    void handleWebhook(req.body);
  });
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled HTTP error", error);
  if (!res.headersSent) res.sendStatus(500);
});

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`Messenger AI webhook listening on port ${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
