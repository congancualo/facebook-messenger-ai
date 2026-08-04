const HANDOFF_PATTERNS = [
  /gặp\s+(cán bộ|trực ban|người thật)/iu,
  /chuyển\s+(cán bộ|người thật)/iu,
  /tố giác/iu,
  /khiếu nại/iu,
  /khẩn cấp/iu,
  /chatbot.*(sai|không đúng)/iu,
  /vụ việc của (tôi|mình)/iu,
  /hồ sơ của (tôi|mình)/iu,
];

const SENSITIVE_PATTERNS = [
  /\bOTP\b/iu,
  /mã\s+(xác thực|đăng nhập|ngân hàng)/iu,
  /mật khẩu/iu,
  /số\s+tài khoản/iu,
  /mã\s+PIN/iu,
  /CVV|CVC/iu,
  /\b\d{12}\b/u
];

export function isHandoffRequest(text) {
  return HANDOFF_PATTERNS.some((pattern) => pattern.test(text));
}

export function mayContainSensitiveData(text) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeUserText(text) {
  return text.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 2000);
}
