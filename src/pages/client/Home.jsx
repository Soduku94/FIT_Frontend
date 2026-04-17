import React, { useState, useEffect } from 'react';
import {Typography, Input, Button, Layout, Row, Col, Card, Tag, Spin, message, Space, Dropdown, Avatar} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    DownloadOutlined,
    BookOutlined,
    EyeOutlined,
    LinkOutlined,
    HeartOutlined, LogoutOutlined, DashboardOutlined, CloudUploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const Home = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin từ két sắt
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role');
    const userName = localStorage.getItem('user_name');

    const formatAuthors = (authorsData) => {
        if (!authorsData) return 'Đang cập nhật';
        try {
            // Nếu nó là chuỗi JSON (ví dụ: '["Nguyễn Văn A"]') thì dịch nó ra
            if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
                const parsed = JSON.parse(authorsData);
                return Array.isArray(parsed) ? parsed.join(', ') : authorsData;
            }
            // Nếu nó đã là mảng sẵn
            if (Array.isArray(authorsData)) return authorsData.join(', ');
        } catch (e) {}
        return authorsData; // Trả về nguyên gốc nếu không cần bóc
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        localStorage.clear(); // Xóa sạch token
        message.success('Đã đăng xuất thành công!');
        navigate('/'); // F5 lại trang chủ
        window.location.reload();
    };
    const menuItems = [
        {
            key: 'profile',
            label: 'Trang cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile')
        },
        {
            key: 'saved',
            label: 'Tài liệu đã lưu',
            icon: <HeartOutlined />,
            onClick: () => navigate('/saved-documents')
        },
        // Nếu là ADMIN thì hiện thêm nút vào trang quản trị
        ...(userRole === 'admin' ? [{
            key: 'admin',
            label: 'Trang quản trị',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/admin')
        }] : []),
        // Nếu là GIẢNG VIÊN thì hiện thêm nút đăng tài liệu
        ...(userRole === 'lecturer' ? [{
            key: 'upload',
            label: 'Đăng tài liệu',
            icon: <CloudUploadOutlined />,
            onClick: () => navigate('/upload')
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
    // Hàm gọi API của BẠN (Hỗ trợ cả lấy danh sách và Tìm kiếm)
    const fetchDocuments = async (searchKeyword = '') => {
        setLoading(true);
        try {
            // Truyền thêm param search nếu người dùng có gõ từ khóa
            const url = searchKeyword
                ? `/public/documents?search=${encodeURIComponent(searchKeyword)}`
                : `/public/documents`;

            const response = await api.get(url);
            setDocuments(response.data.documents);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải danh sách tài liệu!");
        } finally {
            setLoading(false);
        }
    };

    // Tự động chạy khi mở trang chủ (Lấy tất cả bài)
    useEffect(() => {
        fetchDocuments();
    }, []);

    // Hàm xử lý khi người dùng gõ vào thanh Search và ấn Enter
    const handleSearch = (value) => {
        fetchDocuments(value);
    };

    return (
        <Layout className="min-h-screen bg-gray-50">
            {/* THANH NAVBAR MỚI */}
            <Header className="bg-white shadow-sm flex items-center justify-between px-4 sm:px-10 z-10 sticky top-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => fetchDocuments()}>
                    <BookOutlined className="text-2xl text-blue-600" />
                    <Title level={3} className="m-0 text-blue-600 tracking-tight">FIT Research</Title>
                </div>

                <div className="flex gap-4 items-center">
                    {token ? (
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                            <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-all">
                                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                                <span className="text-gray-700 font-medium hidden md:block">
                  {userName}
                </span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button type="text" className="font-medium text-gray-600" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </Button>
                            <Button type="primary" className="bg-blue-600 font-medium" onClick={() => navigate('/login')}>
                                Dành cho Giảng viên
                            </Button>
                        </Space>
                    )}
                </div>
            </Header>

            <Content className="flex flex-col items-center pt-20 pb-16 px-4">
                {/* KHU VỰC TÌM KIẾM */}
                <div className="text-center max-w-3xl w-full animate-fade-in mb-16">
                    <Title level={1} className="text-gray-800 text-4xl md:text-5xl font-extrabold mb-6">
                        Khám Phá Tri Thức <span className="text-blue-600">Công Nghệ</span>
                    </Title>
                    <Paragraph className="text-lg text-gray-500 mb-10 px-4">
                        Kho lưu trữ tài liệu nghiên cứu, đồ án và bài báo khoa học chính thức dành cho sinh viên và giảng viên Khoa Công nghệ Thông tin.
                    </Paragraph>
                    <div className="px-4 md:px-16">
                        <Search
                            placeholder="Nhập tên bài báo, đồ án, tóm tắt..."
                            allowClear
                            enterButton="Tìm kiếm"
                            size="large"
                            className="shadow-md hover:shadow-lg transition-shadow"
                            onSearch={handleSearch} // Gọi hàm tìm kiếm khi ấn Enter
                        />
                    </div>
                </div>

                {/* KHU VỰC DANH SÁCH TÀI LIỆU MỚI */}
                <div className="w-full max-w-6xl px-4">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-8">
                        <Title level={3} className="m-0 text-gray-800">Tài liệu mới cập nhật</Title>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Spin size="large" tip="Đang tải dữ liệu..." />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                            <BookOutlined className="text-4xl mb-3 opacity-50" />
                            <p className="text-lg">Không tìm thấy tài liệu nào phù hợp.</p>
                        </div>
                    ) : (
                        <Row gutter={[24, 24]}>
                            {documents.map((doc) => (
                                <Col xs={24} sm={12} lg={8} key={doc.id}>
                                    <Card
                                        hoverable
                                        className="h-full rounded-xl border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden"
                                        bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}
                                        onClick={() => navigate(`/document/${doc.id}`)}
                                    >
                                        {/* Dải màu phân biệt Bài báo / Dataset */}
                                        <div className={`absolute top-0 left-0 w-full h-1 ${doc.doc_type === 'Dataset' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

                                        <div className="mb-3 flex justify-between items-start mt-2">
                                            <Tag color={doc.doc_type === 'Dataset' ? 'purple' : 'blue'} className="font-medium border-0">
                                                {doc.category_name}
                                            </Tag>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                        {doc.doc_type}
                                    </span>
                                        </div>

                                        <Title level={5} className="mt-0 mb-2 text-gray-800 line-clamp-2 leading-tight">
                                            {doc.title}
                                        </Title>

                                        <Paragraph className="text-gray-500 text-sm line-clamp-2 flex-grow mb-4">
                                            {doc.description || "Chưa có tóm tắt cho tài liệu này."}
                                        </Paragraph>

                                        {/* Tags (nếu có) */}
                                        {doc.tags && doc.tags.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-1">
                                                {doc.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">#{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto border-t border-gray-100 pt-3">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center text-sm text-gray-600 truncate pr-2">
                                                    <UserOutlined className="mr-2 text-gray-400" />
                                                    <span className="truncate">{formatAuthors(doc.authors)}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-400 whitespace-nowrap">
                                                    <EyeOutlined className="mr-1" /> {doc.view_count || 0}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-2">
                                        <span className="flex items-center text-xs text-gray-400">
                                            <CalendarOutlined className="mr-1" />
                                            {doc.created_at}
                                        </span>

                                                {/* Nút hành động dựa trên cờ hiệu của Backend */}
                                                <Space>
                                                    {doc.has_external_link && (
                                                        <Button size="small" type="default" icon={<LinkOutlined />} title="Link bài báo gốc" />
                                                    )}
                                                    {doc.has_pdf ? (
                                                        <Button type="primary" size="small" ghost icon={<DownloadOutlined />}>Tải PDF</Button>
                                                    ) : (
                                                        <Button type="primary" size="small" disabled>Chưa có file</Button>
                                                    )}
                                                </Space>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Content>

            <Footer className="text-center text-gray-500 bg-white border-t border-gray-200 mt-10">
                FIT Research Hub ©2026 - Phát triển bởi Sinh viên CNTT
            </Footer>
        </Layout>
    );
};

export default Home;