import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, Drawer } from 'antd';
import {
    UserOutlined, LogoutOutlined, ProfileOutlined,
    UploadOutlined, DashboardOutlined, LoginOutlined, EditOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // Lấy thông tin từ localStorage
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Menu items shared between Desktop and Mobile
    const navItems = [
        { key: '/', label: t('navbar.home') },
        { key: '/categories', label: t('navbar.categories') },
        { key: '/news', label: t('navbar.documents') },
        { key: '/about', label: t('navbar.news') },
        { key: '/events', label: t('navbar.about') },

    ];

    // Menu cho Dropdown Avatar
    const userMenuItems = [
        {
            key: 'profile',
            label: t('navbar.profile'),
            icon: <ProfileOutlined />,
            onClick: () => navigate('/profile')
        },
        // Nếu là Admin thì hiện thêm nút quản trị
        ...(userRole === 'admin' ? [{
            key: 'admin',
            label: t('navbar.admin_dashboard'),
            icon: <DashboardOutlined />,
            onClick: () => navigate('/admin')
        }] : []),
        // Nếu là BTV, Giảng viên hoặc Admin thì hiện thêm nút đăng bài nhanh
        ...(['lecturer', 'editor', 'admin'].includes(userRole) ? [{
            key: 'upload',
            label: t('navbar.upload'),
            icon: <UploadOutlined />,
            onClick: () => navigate('/upload')
        }] : []),
        ...(userRole === 'admin' || userRole === 'editor' ? [{
            key: 'create_news',
            label: t('navbar.create_news'),
            icon: <EditOutlined />,
            onClick: () => navigate('/editor/news/create')
        }] : []),
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: t('navbar.logout'),
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },

    ];

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    return (
        <Header className="bg-white px-4 sm:px-10 flex items-center justify-between shadow-sm sticky top-0 z-50 h-16">
            {/* LEFT: LOGO & BRAND */}
            <div className="flex items-center">
                {/* Hamburger Menu for Mobile */}
                <Button
                    type="text"
                    icon={<MenuOutlined className="text-xl" />}
                    className="md:hidden mr-2 flex items-center justify-center"
                    onClick={toggleMobileMenu}
                />

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
            </div>

            {/* CENTER: NAVIGATION MENU (DESKTOP) */}
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                className="flex-grow justify-center border-none hidden md:flex px-10"
                items={navItems}
                onClick={({ key }) => {
                    navigate(key);
                }}
            />

            {/* RIGHT: AUTH SECTION & LANGUAGE SWITCHER */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Language Switcher */}
                <Dropdown
                    menu={{
                        items: [
                            { 
                                key: 'vi', 
                                label: <span className="font-medium">Tiếng Việt</span>, 
                                icon: <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="rounded-sm" />, 
                                onClick: () => changeLanguage('vi') 
                            },
                            { 
                                key: 'en', 
                                label: <span className="font-medium">English</span>, 
                                icon: <img src="https://flagcdn.com/w20/us.png" alt="US" className="rounded-sm" />, 
                                onClick: () => changeLanguage('en') 
                            },
                        ],
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Button 
                        className="flex items-center gap-2 px-3 h-10 rounded-full border-gray-200 hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all bg-white"
                    >
                        <img 
                            src={i18n.language === 'en' ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/vn.png"} 
                            alt="flag" 
                            className="w-5 h-auto rounded-sm shadow-xs"
                        />
                        <span className="hidden xs:inline font-semibold text-xs uppercase tracking-wider">
                            {i18n.language === 'en' ? 'EN' : 'VN'}
                        </span>
                    </Button>
                </Dropdown>

                {token ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-full transition-colors">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-gray-800 leading-none">{userName}</div>
                                <Text type="secondary" className="text-[10px] uppercase">
                                    {userRole === 'admin' ? t('roles.admin') : userRole === 'editor' ? t('roles.editor') : userRole === 'lecturer' ? t('roles.lecturer') : t('roles.student')}
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
                        <span className="hidden xs:inline">{t('navbar.login')}</span>
                    </Button>
                )}
            </div>

            {/* MOBILE DRAWER */}
            <Drawer
                title={
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-blue-600 font-bold">FIT Hub</span>
                    </div>
                }
                placement="left"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}
                bodyStyle={{ padding: 0 }}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[location.pathname]}
                    items={navItems}
                    onClick={({ key }) => {
                        navigate(key);
                        setMobileMenuVisible(false);
                    }}
                    style={{ border: 'none' }}
                />
                
                {!token && (
                    <div className="p-4 mt-4 border-t border-gray-100">
                        <Button 
                            type="primary" 
                            block 
                            icon={<LoginOutlined />} 
                            onClick={() => {
                                navigate('/login');
                                setMobileMenuVisible(false);
                            }}
                        >
                            {t('navbar.login')}
                        </Button>
                    </div>
                )}
            </Drawer>
        </Header>
    );
};

export default Navbar;