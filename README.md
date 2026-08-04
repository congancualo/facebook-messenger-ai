# Chatbot AI Facebook Messenger – Công an phường Cửa Lò

Bộ mã đã được cấu hình để triển khai từ **GitHub lên Render** mà không cần tự quản lý máy ảo, Nginx, Docker hay chứng thư HTTPS.

## Việc cần làm

### 1. Đưa mã lên GitHub

Tạo một repository mới, sau đó tải **toàn bộ file và thư mục ở cấp gốc này** lên repository. Không tải riêng thư mục cha và không tải file `.env` có khóa bí mật.

Các file quan trọng đã chuẩn bị sẵn:

- `render.yaml`: cấu hình Render Blueprint.
- `.node-version`: khóa phiên bản Node.js.
- `.github/workflows/validate.yml`: tự kiểm tra mã khi đẩy lên GitHub.
- `package.json`: lệnh chạy Render là `npm start` → `node src/server.js`.

### 2. Tạo Render Blueprint từ repository

1. Đăng nhập Render và kết nối GitHub.
2. Chọn **New → Blueprint**.
3. Chọn repository vừa tải lên.
4. Render sẽ đọc `render.yaml` và yêu cầu nhập các biến bí mật.
5. Nhập đúng các giá trị:

| Biến | Giá trị cần nhập |
|---|---|
| `META_APP_SECRET` | App Secret trong Meta App |
| `META_PAGE_ACCESS_TOKEN` | Page Access Token |
| `META_PAGE_ID` | ID Fanpage |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_VECTOR_STORE_ID` | ID kho tài liệu, dạng `vs_...` |
| `DUTY_PHONE` | Số điện thoại trực ban chính thức |
| `OFFICE_ADDRESS` | Địa chỉ trụ sở chính thức |

`META_VERIFY_TOKEN` được Render tự tạo. Sau khi triển khai, mở **Render → Service → Environment**, sao chép giá trị này để nhập vào phần Verify Token của Meta.

### 3. Cấu hình Meta Webhook

Sau khi Render triển khai thành công, lấy địa chỉ dịch vụ, ví dụ:

```text
https://chatbot-cong-an-cua-lo.onrender.com
```

Điền trên Meta:

```text
Callback URL: https://chatbot-cong-an-cua-lo.onrender.com/webhook
Verify Token: giá trị META_VERIFY_TOKEN trên Render
```

Đăng ký tối thiểu:

```text
messages
messaging_postbacks
```

### 4. Kiểm tra

Mở:

```text
https://chatbot-cong-an-cua-lo.onrender.com/health
```

Kết quả đúng:

```json
{"ok":true}
```

Sau đó dùng một tài khoản Facebook khác nhắn tin cho Fanpage.

## Nạp kho tài liệu

Việc nạp tài liệu thực hiện một lần trên máy cá nhân:

```bash
cp .env.example .env
npm install
npm run knowledge
```

Sao chép kết quả `OPENAI_VECTOR_STORE_ID=vs_...` vào Render.

## Tạo lời chào và menu Messenger

Sau khi điền thông tin Meta vào `.env` trên máy cá nhân:

```bash
npm run profile
```

## Lưu ý vận hành

- Gói Render Free chỉ phù hợp thử nghiệm; nên nâng cấp trước khi vận hành chính thức.
- Không đưa `.env`, API key, App Secret hoặc Page Access Token lên GitHub.
- Không nạp hồ sơ nghiệp vụ, dữ liệu dân cư, tài liệu điều tra hoặc tài liệu mật vào kho AI.
- Trạng thái chuyển cán bộ hiện lưu trong RAM và sẽ mất khi dịch vụ khởi động lại; đây là bản MVP.
