// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role');

    if (!token) {
        // Chưa đăng nhập -> Đá về Login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Đăng nhập rồi nhưng sai quyền -> Đá về trang chủ
        return <Navigate to="/" replace />;
    }

    // Hợp lệ -> Cho phép truy cập vào các Route con
    return <Outlet />;
};

export default ProtectedRoute;