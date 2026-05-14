# FIT Research Hub - Frontend

Đây là giao diện người dùng (Frontend) của hệ thống FIT Research Hub, được xây dựng bằng **ReactJS** (sử dụng **Vite**) và thư viện UI **Ant Design** (kết hợp **TailwindCSS**).

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản 18.0 trở lên.
- **npm** (được cài sẵn cùng Node.js) 

## Hướng dẫn cài đặt và khởi chạy

Thực hiện các bước dưới đây để thiết lập và chạy dự án Frontend trên máy mới.

### 1. Mở thư mục dự án
Mở Terminal (Command Prompt / PowerShell / Git Bash) và điều hướng đến thư mục Frontend:
```bash
cd du-an-cua-ban/FIT_Frontend
```

### 2. Cài đặt các thư viện phụ thuộc (Dependencies)
Chạy lệnh sau để tải và cài đặt toàn bộ các thư viện cần thiết (React, Ant Design, TailwindCSS,...):
```bash
npm install
```


### 3. Cấu hình biến môi trường
Dự án cần biết địa chỉ của Backend API để có thể kết nối lấy dữ liệu.

1. Tại thư mục gốc `FIT_Frontend`, tạo một file mới tên là `.env`.
hoặc có thể tham khảo file `.env.example` để biết cấu trúc file .
2. Mở file `.env` và thêm dòng cấu hình sau (đảm bảo địa chỉ khớp với Backend của bạn đang chạy):

```ini
# Dùng localhost cho môi trường phát triển cục bộ
VITE_API_URL=http://localhost:5000
```
*(Cổng `5000` là cổng mặc định của Backend Flask. Nếu Backend của bạn chạy ở cổng khác, hãy cập nhật lại cho đúng).*

### 4. Khởi chạy Server Frontend
Sau khi cài đặt xong, chạy lệnh sau để khởi động dự án ở chế độ phát triển (development):
```bash
npm run dev
```

Terminal sẽ hiển thị địa chỉ local (thường là `http://localhost:5173/`). Nhấn `Ctrl + Click` vào link đó hoặc mở trình duyệt web và dán địa chỉ vào để xem trang web.



## Lưu ý
- Hãy chắc chắn rằng **Backend Server** (thư mục `FIT_Backend`) đã được bật và đang chạy song song thì Frontend mới có thể gọi API đăng nhập và hiển thị dữ liệu.
- Nếu gặp lỗi về mạng (Network Error) hoặc lấy dữ liệu không được, hãy kiểm tra lại cấu hình file `.env` xem `VITE_API_URL` đã trỏ đúng IP/Port của Backend 
Có thể trên các máy khác nhau có cấu hình local khác nhau không tránh khỏi lỗi, cái này cũng khó giải thích mặc dù có thể máy cài đặt môi trường giống nhau
