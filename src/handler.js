import { answerFromKnowledge } from "./ai.js";
import { enableHandoff, isInHandoff } from "./handoff.js";
import { sendText, sendTyping } from "./meta.js";
import { isHandoffRequest, mayContainSensitiveData, sanitizeUserText } from "./safety.js";

const processedMessageIds = new Set();

export async function handleWebhook(body) {
  if (body.object !== "page") return;

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      try {
        await handleEvent(event);
      } catch (error) {
        console.error("Failed to handle Messenger event", error);
      }
    }
  }
}

async function handleEvent(event) {
  const psid = event.sender?.id;
  if (!psid) return;

  const eventId = event.message?.mid ?? event.postback?.mid;
  if (eventId) {
    if (processedMessageIds.has(eventId)) return;
    processedMessageIds.add(eventId);
    if (processedMessageIds.size > 10_000) processedMessageIds.clear();
  }

  if (event.message?.is_echo) return;

  if (event.postback?.payload) {
    await handlePostback(psid, event.postback.payload);
    return;
  }

  if (isInHandoff(psid)) return;

  if (event.message?.attachments?.length && !event.message.text) {
    await sendText(
      psid,
      "Trợ lý chưa tự động xử lý tệp, ảnh hoặc âm thanh. Vui lòng không gửi ảnh đầy đủ giấy tờ tùy thân. Hãy mô tả nội dung bằng chữ hoặc chọn “Gặp cán bộ trực”."
    );
    return;
  }

  const text = sanitizeUserText(event.message?.text ?? "");
  if (!text) return;

  if (isHandoffRequest(text)) {
    enableHandoff(psid);
    await sendText(
      psid,
      "Yêu cầu đã được chuyển sang chế độ cán bộ tiếp nhận. Trợ lý tự động sẽ tạm dừng trả lời trong cuộc hội thoại này. Trường hợp khẩn cấp, vui lòng gọi số trực ban chính thức."
    );
    return;
  }

  if (mayContainSensitiveData(text)) {
    await sendText(
      psid,
      "Vui lòng không gửi mật khẩu, mã OTP, mã PIN, thông tin tài khoản ngân hàng hoặc ảnh đầy đủ giấy tờ tùy thân qua Messenger. Hãy xóa/che thông tin nhạy cảm và chỉ mô tả nội dung cần hướng dẫn."
    );
    return;
  }

  await sendTyping(psid, true).catch(() => undefined);
  try {
    const answer = await answerFromKnowledge(psid, text);
    await sendText(psid, answer);
  } finally {
    await sendTyping(psid, false).catch(() => undefined);
  }
}

async function handlePostback(psid, payload) {
  switch (payload) {
    case "GET_STARTED":
      await sendText(
        psid,
        "Xin chào! Đây là trợ lý tự động. Tôi hỗ trợ thông tin chung về thủ tục hành chính, cư trú, VNeID, cảnh báo phòng ngừa và thông tin liên hệ. Không gửi mật khẩu, OTP, tài khoản ngân hàng hoặc ảnh đầy đủ giấy tờ tùy thân."
      );
      return;
    case "HUMAN_AGENT":
      enableHandoff(psid);
      await sendText(psid, "Đã chuyển yêu cầu cho cán bộ trực. Trợ lý tự động tạm dừng trả lời.");
      return;
    case "CONTACT":
      await sendText(psid, "Vui lòng xem số trực ban, địa chỉ và giờ làm việc trong thông tin chính thức của Fanpage.");
      return;
    default:
      await sendText(psid, "Vui lòng nhập nội dung cần được hướng dẫn.");
  }
}
