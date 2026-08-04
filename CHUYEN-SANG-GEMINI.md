# Danh sách thay đổi từ OpenAI sang Gemini

## Đã thay đổi trong mã nguồn

- Thay thư viện `openai` bằng `@google/genai`.
- Thay OpenAI Responses API bằng Gemini Interactions API.
- Thay OpenAI Vector Store bằng Gemini File Search Store.
- Đặt `store: false` cho mỗi lượt tương tác Gemini.
- Chỉ gửi câu trả lời khi có File Search citation.
- Thay script `npm run knowledge` để tạo và nạp tài liệu vào Gemini File Search.
- Thay toàn bộ biến môi trường OpenAI trong `render.yaml`.
- Bổ sung phản hồi lỗi thân thiện khi Gemini tạm thời không hoạt động.

## Biến môi trường mới

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_FILE_SEARCH_STORE=fileSearchStores/...
```

## Biến môi trường cũ không còn dùng

```env
OPENAI_API_KEY=...
OPENAI_MODEL=...
OPENAI_VECTOR_STORE_ID=vs_...
```
