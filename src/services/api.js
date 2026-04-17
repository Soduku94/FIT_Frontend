import axios from 'axios';

// Tạo một instance (bản sao) của axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api', // Đường dẫn gốc của Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động nhét Token vào mỗi lần gọi API (dành cho các chức năng sau này)
api.interceptors.request.use(
    (config) => {
        // Lấy token từ kho lưu trữ của trình duyệt
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;