import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import {
    UserOutlined, LogoutOutlined, ProfileOutlined,
    UploadOutlined, DashboardOutlined, LoginOutlined,EditOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy thông tin từ localStorage
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Menu cho Dropdown Avatar
    const userMenuItems = [
        {
            key: 'profile',
            label: 'Trang cá nhân',
            icon: <ProfileOutlined />,
            onClick: () => navigate('/profile')
        },
        // Nếu là Admin thì hiện thêm nút quản trị
        ...(userRole === 'admin' ? [{
            key: 'admin',
            label: 'Bảng điều khiển Admin',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/admin')
        }] : []),
        // Nếu là BTV, Giảng viên hoặc Admin thì hiện thêm nút đăng bài nhanh
        ...(['lecturer', 'editor', 'admin'].includes(userRole) ? [{
            key: 'upload',
            label: 'Đăng tải tài liệu',
            icon: <UploadOutlined />,
            onClick: () => navigate('/upload')
        }] : []),
        ...(userRole === 'admin' || userRole === 'editor' ? [{
            key: 'create_news',
            label: 'Viết tin tức / PR',
            icon: <EditOutlined />,
            onClick: () => navigate('/editor/news/create')
        }] : []),
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },

    ];

    return (
        <Header className="bg-white px-4 sm:px-10 flex items-center justify-between shadow-sm sticky top-0 z-50 h-16">
            {/* LOGO & BRAND */}
            <div
                className="flex items-center cursor-pointer group"
                onClick={() => navigate('/')}
            >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-700 transition-colors">
                    <span className="text-white font-bold text-xl">F</span>
                </div>
                <div className="hidden sm:block">
                    <div className="text-blue-600 font-bold leading-none text-lg">FIT</div>
                    <div className="text-gray-500 text-[10px] tracking-widest uppercase">Research Hub</div>
                </div>
            </div>

            {/* NAVIGATION MENU */}
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                className="flex-grow justify-center border-none hidden md:flex px-10"
                items={[
                    { key: '/', label: 'Trang chủ' },
                    { key: '/about', label: 'Về khoa' },
                    { key: '/events', label: 'Sự kiện' },
                    { key: '/news', label: 'Tin tức' },
                ]}
                onClick={({ key }) => {
                    if (key === '/events' || key === '/news') {
                        navigate('/about');
                    } else {
                        navigate(key);
                    }
                }}

            />

            {/* AUTH SECTION */}
            <div className="flex items-center">
                {token ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-full transition-colors">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-gray-800 leading-none">{userName}</div>
                                <Text type="secondary" className="text-[10px] uppercase">
                                    {userRole === 'admin' ? 'Quản trị viên' : userRole === 'editor' ? 'Quản trị nội dung' : userRole === 'lecturer' ? 'Giảng viên' : 'Sinh viên'}
                                </Text>
                            </div>
                            <Avatar
                                style={{ backgroundColor: '#1890ff' }}
                                icon={<UserOutlined />}
                                className="shadow-sm border border-blue-100"
                            />
                        </Space>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        className="bg-blue-600 rounded-full px-6 flex items-center"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </Header>
    );
};

export default Navbar;