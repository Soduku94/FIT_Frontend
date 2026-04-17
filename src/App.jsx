import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import DocumentApproval from './pages/admin/DocumentApproval';
import UserManagement from './pages/admin/UserManagement';
import DocumentDetail from './pages/client/DocumentDetail';
import Profile from './pages/client/Profile';

import Home from './pages/client/Home';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UploadDocument from './pages/client/UploadDocument';
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />


            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            {/* KHU VỰC CỦA ADMIN */}
            <Route path="/admin" element={<AdminLayout />}>
                {/* Tự động nhảy vào dashboard khi gõ /admin */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />

                {/* Các trang con (tạm thời để chữ chay, ta sẽ code giao diện sau) */}
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="documents" element={<DocumentApproval />} />
                <Route path="users" element={<UserManagement />} />
            </Route>
            {/* NHÓM NGƯỜI DÙNG: lecturer và Student */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'lecturer']} />}>
                {/*<Route path="/my-documents" element={<MyDocuments />} />*/}
                <Route path="/upload" element={<UploadDocument />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

        </Routes>
    );
}

export default App;