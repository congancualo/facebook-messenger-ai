# Hướng dẫn nhanh

## Phần mã nguồn đã hoàn thành

Không cần sửa thêm `package.json`, cài máy ảo, cấu hình Nginx hoặc Docker.

## Anh thực hiện 3 việc

1. Giải nén ZIP và tải toàn bộ nội dung trong thư mục lên một repository GitHub.
2. Trên Render chọn **New → Blueprint**, kết nối repository đó và nhập các khóa được yêu cầu.
3. Sau khi Render chạy thành công, nhập vào Meta:

```text
Callback URL: https://TEN-DICH-VU.onrender.com/webhook
Verify Token: giá trị META_VERIFY_TOKEN trong Render
```

## Không được tải lên GitHub

- File `.env` thật.
- OpenAI API Key.
- Meta App Secret.
- Page Access Token.

File `.env.example` chỉ là mẫu, không chứa khóa thật và có thể tải lên GitHub.
