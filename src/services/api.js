import axios from 'axios';

// Lấy URL từ biến môi trường, mặc định là localhost nếu không cấu hình
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Tạo một instance (bản sao) của axios với cấu hình mặc định
const api = axios.create({
    baseURL: `${BASE_URL}/api`,// Đường dẫn gốc của Backend
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