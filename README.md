# Chatbot Gemini AI Facebook Messenger – Công an phường Cửa Lò

Phiên bản **2.0** đã chuyển từ OpenAI sang:

```text
Facebook Messenger → Render → Gemini API → Gemini File Search
```

Không cần máy ảo, Nginx, Docker, OpenAI API Key hoặc OpenAI Vector Store.

## Những biến môi trường đang sử dụng

### Meta/Facebook

- `META_VERIFY_TOKEN`
- `META_APP_SECRET`
- `META_PAGE_ACCESS_TOKEN`
- `META_PAGE_ID`
- `META_GRAPH_VERSION`

### Gemini

- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-3.1-flash-lite`
- `GEMINI_FILE_SEARCH_STORE=fileSearchStores/...`

### Thông tin đơn vị

- `UNIT_NAME`
- `DUTY_PHONE`
- `OFFICE_ADDRESS`

Các biến cũ sau đây không còn được sử dụng:

```text
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_VECTOR_STORE_ID
```

## 1. Đưa phiên bản mới lên GitHub

Giải nén ZIP, sau đó tải **toàn bộ file và thư mục ở cấp gốc** lên repository GitHub hiện có. Cho phép GitHub thay thế các file trùng tên.

Không tải file `.env` thật lên GitHub.

## 2. Tạo Gemini API Key

Tạo khóa tại Google AI Studio. Khóa chỉ được đặt trong:

- file `.env` trên máy để nạp tài liệu;
- phần Environment của Render để chatbot gọi Gemini.

Không đưa khóa vào mã nguồn hoặc README.

## 3. Tạo Gemini File Search Store

Chép tài liệu đã duyệt vào thư mục `knowledge/`. File `knowledge/README.md` được tự động bỏ qua.

Tạo file `.env` ở thư mục gốc:

```env
GEMINI_API_KEY=KHOA_GEMINI_CUA_ANH
```

Chạy trên Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run knowledge
```

Kết quả cuối cùng có dạng:

```text
GEMINI_FILE_SEARCH_STORE=fileSearchStores/abc123...
```

Sao chép toàn bộ phần bắt đầu bằng `fileSearchStores/` vào Render.

## 4. Cấu hình Render

Trong dịch vụ Render, thêm hoặc sửa:

```text
GEMINI_API_KEY=<khóa Gemini>
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_FILE_SEARCH_STORE=fileSearchStores/...
```

Sau đó chọn **Save and deploy**.

Các biến OpenAI cũ có thể xóa sau khi Gemini hoạt động ổn định.

## 5. Kiểm tra

Mở:

```text
https://TEN-DICH-VU.onrender.com/health
```

Kết quả đúng:

```json
{"ok":true}
```

Sau đó nhắn một câu hỏi có nội dung trong kho tài liệu cho Fanpage.

## Nguyên tắc an toàn

- Chatbot chỉ trả lời khi Gemini trả về trích dẫn từ File Search.
- Nếu không tìm thấy căn cứ trong tài liệu, chatbot hướng dẫn gặp cán bộ trực.
- Yêu cầu có dấu hiệu chứa OTP, mật khẩu, PIN, tài khoản ngân hàng hoặc số giấy tờ nhạy cảm bị chặn trước khi gửi đến Gemini.
- Không nạp hồ sơ nghiệp vụ, dữ liệu dân cư, tài liệu điều tra, bí mật nhà nước hoặc dữ liệu cá nhân nhạy cảm.
- Gói miễn phí chỉ phù hợp thử nghiệm. Cần xem xét điều khoản dữ liệu và phương án trả phí trước khi vận hành chính thức.

## Lưu ý kỹ thuật

- Mô hình mặc định là `gemini-3.1-flash-lite` vì đây là mô hình chi phí thấp hiện hỗ trợ Gemini File Search.
- Gemini File Search Store có tên dạng `fileSearchStores/...`, không phải `vs_...`.
- Mỗi lần chạy `npm run knowledge`, chương trình tạo một File Search Store mới.
- Trạng thái chuyển cán bộ đang lưu trong RAM và sẽ mất khi Render khởi động lại; đây là bản MVP.
