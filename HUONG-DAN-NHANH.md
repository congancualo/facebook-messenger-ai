# Chuyển repository hiện có sang Gemini

## Bước 1 — Tải mã mới lên GitHub

1. Giải nén bộ mã Gemini.
2. Mở repository GitHub hiện có.
3. Chọn **Add file → Upload files**.
4. Kéo toàn bộ nội dung bên trong thư mục đã giải nén lên GitHub.
5. Commit với nội dung: `Switch chatbot from OpenAI to Gemini`.

Các file quan trọng phải nằm ngay ở thư mục gốc:

```text
package.json
render.yaml
src/
scripts/
knowledge/
```

## Bước 2 — Tạo kho tài liệu Gemini

1. Chép tài liệu đã duyệt vào `knowledge/` trên máy.
2. Tạo `.env`:

```env
GEMINI_API_KEY=KHOA_GEMINI_CUA_ANH
```

3. Chạy:

```powershell
npm.cmd install
npm.cmd run knowledge
```

4. Sao chép kết quả:

```text
fileSearchStores/...
```

## Bước 3 — Sửa Environment trên Render

Thêm:

```text
GEMINI_API_KEY
GEMINI_FILE_SEARCH_STORE
```

Kiểm tra:

```text
GEMINI_MODEL=gemini-3.1-flash-lite
```

Chọn **Save and deploy**.

Không nhập mã `vs_...` của OpenAI vào biến Gemini.

## Bước 4 — Kiểm tra

- Render phải hiện `Live`.
- `/health` phải trả `{"ok":true}`.
- Nhắn câu hỏi có trong tài liệu cho Fanpage.
- Xem Render Logs nếu chatbot không trả lời.

## Có thể xóa sau khi Gemini hoạt động

```text
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_VECTOR_STORE_ID
```
