// ========================
//   REACT ROUTER IMPORTS
// ========================
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Outlet,
    Route,
    RouterProvider,
} from 'react-router-dom';

// ========================
//   LAYOUT & COMPONENTS
// ========================
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// ========================
//   PAGES - AUTH
// ========================
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/Login';
import ResetPassword from './pages/auth/ResetPassword';

// ========================
//   PAGES - CLIENT
// ========================
import Home from './pages/client/Home';
import DocumentDetail from './pages/client/DocumentDetail';
import Profile from './pages/client/Profile';
import UploadDocument from './pages/client/UploadDocument';

// ========================
//   PAGES - ADMIN
// ========================
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import CategoryManagement from './pages/admin/CategoryManagement';
import DocumentApproval from './pages/admin/DocumentApproval';
import UserManagement from './pages/admin/UserManagement';
import About from './pages/client/About';
import NewsDetail from './pages/client/NewsDetail';
import CreateNews from './pages/admin/CreateNews';
import NotFound from './pages/NotFound';
import FacultyLanding from './pages/client/FacultyLanding';
import Notifications from './pages/client/Notifications';
import Categories from './pages/client/Categories';
import LecturerProfile from './pages/client/LecturerProfile';


// 1. Tạo Layout chung cho các trang của người dùng (Client)
const ClientLayout = () => {
    return (
        <>
            <Navbar />  {/* Thanh điều hướng luôn nằm trên */}
            <Outlet />  {/* Nội dung các trang Home, Profile... sẽ chui vào đây */}
        </>
    );
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            {/* ==========================================
                NHÓM 1: CÁC TRANG KHÔNG CẦN NAVBAR
                (Đăng nhập, Quên mật khẩu, Reset mật khẩu)
            ========================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ==========================================
                NHÓM 2: KHU VỰC CLIENT (CÓ NAVBAR)
            ========================================== */}
            <Route element={<ClientLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/document/:id" element={<DocumentDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<FacultyLanding />} />
                <Route path="/news" element={<Notifications />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/lecturer/:id" element={<LecturerProfile />} />

                {/* Các trang cần đăng nhập của Client */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'lecturer', 'admin', 'editor']} />}>
                    <Route path="/upload" element={<UploadDocument />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit/:id" element={<UploadDocument />} />
                </Route>

                {/* Các trang dành riêng cho Admin và Editor */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
                    <Route path="/editor/news/create" element={<CreateNews />} />
                </Route>
            </Route>

            {/* ==========================================
                NHÓM 3: KHU VỰC ADMIN (CÓ LAYOUT RIÊNG)
            ========================================== */}
            <Route path="/admin" element={<AdminLayout />}>
                {/* Tự động nhảy vào dashboard khi gõ /admin */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />

                {/* Các trang con của Admin */}
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="documents" element={<DocumentApproval />} />
                <Route path="users" element={<UserManagement />} />
            </Route>

            {/* ==========================================
                NHÓM 4: CATCH-ALL ROUTE (404 NOT FOUND)
            ========================================== */}
            <Route path="*" element={<NotFound />} />
        </Route>

    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;