import crypto from "node:crypto";
import { config } from "./config.js";

export function verifyMetaSignature(rawBody, signatureHeader) {
  if (!rawBody || !signatureHeader?.startsWith("sha256=")) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", config.metaAppSecret)
    .update(rawBody)
    .digest("hex")}`;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

async function callSendApi(payload) {
  const url = new URL(
    `https://graph.facebook.com/${config.metaGraphVersion}/me/messages`
  );
  url.searchParams.set("access_token", config.metaPageAccessToken);

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta Send API ${response.status}: ${body}`);
  }
}

export async function sendText(psid, text) {
  const chunks = splitMessage(text, 1800);
  for (const chunk of chunks) {
    await callSendApi({
      recipient: { id: psid },
      messaging_type: "RESPONSE",
      message: { text: chunk },
    });
  }
}

export async function sendTyping(psid, enabled) {
  await callSendApi({
    recipient: { id: psid },
    sender_action: enabled ? "typing_on" : "typing_off",
  });
}

function splitMessage(text, limit) {
  const normalized = text.trim();
  if (normalized.length <= limit) return [normalized];

  const chunks = [];
  let remaining = normalized;
  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf("\n", limit);
    if (cut < limit * 0.5) cut = remaining.lastIndexOf(" ", limit);
    if (cut < limit * 0.5) cut = limit;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}
