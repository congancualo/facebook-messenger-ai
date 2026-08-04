// Chỉ dùng cho MVP. Production phải thay bằng PostgreSQL hoặc Redis.
const handoffUsers = new Set();

export function enableHandoff(psid) {
  handoffUsers.add(psid);
}

export function disableHandoff(psid) {
  handoffUsers.delete(psid);
}

export function isInHandoff(psid) {
  return handoffUsers.has(psid);
}
