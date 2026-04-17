import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    FileTextOutlined,
    AppstoreOutlined,
    LogoutOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const userName = localStorage.getItem('user_name') || 'Quản trị viên';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý Danh mục' },
        { key: '/admin/documents', icon: <FileTextOutlined />, label: 'Duyệt Tài liệu' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng' },
    ];

    return (
        // Ép cứng chiều cao tối thiểu bằng 100% màn hình (100vh)
        <Layout style={{ minHeight: '100vh' }}>

            {/* ================= CỘT SIDEBAR ================= */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
                className="shadow-lg z-20" // Thêm shadow để tách biệt với vùng nội dung
            >
                {/* Khu vực Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <Text strong className="text-xl text-blue-600 truncate px-2">
                        {collapsed ? 'FIT' : 'FIT Research'}
                    </Text>
                </div>

                {/* Menu điều hướng */}
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    items={menuItems}
                    className="mt-2 border-r-0"
                />
            </Sider>

            {/* ================= KHU VỰC BÊN PHẢI ================= */}
            <Layout>
                {/* Thanh Header Đỉnh Đầu */}
                <Header
                    style={{ padding: 0, background: colorBgContainer }}
                    className="flex justify-between items-center shadow-sm z-10 px-4"
                >
                    {/* Cụm bên trái Header (Nút đóng mở menu) */}
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-12 h-12 text-lg"
                    />

                    {/* Cụm bên phải Header (Thông tin User & Nút Đăng xuất) */}
                    <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 hidden sm:block">
              Xin chào, {userName}
            </span>
                        <Button
                            danger
                            type="primary" // Dùng type primary màu đỏ cho nổi bật hẳn lên
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </Header>

                {/* Vùng Nội Dung Chính (Có viền bo góc và nền trắng, cách lề xám) */}
                <Content
                    style={{
                        margin: '24px',
                        padding: '24px',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        minHeight: 280
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>

        </Layout>
    );
};

export default AdminLayout;