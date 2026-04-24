import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Tabs, Card, Tag, Spin, message, Row, Col, Empty, Button } from 'antd';
import { SearchOutlined, FilePdfOutlined, DatabaseOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('paper'); // Mặc định mở tab Bài báo
    const [searchText, setSearchText] = useState('');
    const hellyeah =()=>{
        console.log("Console log này in ra các tài khoản để làm việc với API như admin người dùng các thứ ")
        console.log("Tài khoản admin: admin@gmail.com")
        console.log("Mật khẩu admin: admin123")
        console.log("Tài khoản editor: editor@gmail.com")
        console.log("Mật khẩu editor: editor123")
        console.log("Tài khoản user: user@gmail.com")
        console.log("Mật khẩu user: user123")



    }
    
    // Hàm gọi API lấy danh sách tài liệu
    const fetchDocuments = async (type, search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/public/documents?type=${type}&search=${search}`);
            setDocuments(response.data.documents);
        } catch (error) {
            message.error("Không thể tải danh sách tài liệu!");
        } finally {
            setLoading(false);
        }
        hellyeah();
    };

    // Chạy khi Tab hoặc từ khóa tìm kiếm thay đổi
    useEffect(() => {
        fetchDocuments(activeTab, searchText);
    }, [activeTab, searchText]);

    // Xử lý khi gõ tìm kiếm (Ấn Enter)
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Hàm format tác giả (Tránh mảng bị lỗi JSON)
    const formatAuthors = (authorsData) => {
        if (!authorsData || authorsData.length === 0) return 'Đang cập nhật';
        try {
            if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
                return JSON.parse(authorsData).join(', ');
            }
            if (Array.isArray(authorsData)) return authorsData.join(', ');
        } catch (e) {}
        return authorsData;
    };

    return (
        <Layout className="min-h-screen bg-gray-50">


            {/* 1. KHU VỰC HERO (MẶT TIỀN TÌM KIẾM) */}
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 py-20 px-4 text-center shadow-inner">
                <div className="max-w-3xl mx-auto animate-fade-in-up">
                    <Title className="text-white m-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
                        Khám phá Tri thức Công nghệ
                    </Title>
                    <p className="text-blue-100 text-lg mt-4 mb-8">
                        Kho lưu trữ hàng ngàn bài báo khoa học và bộ dữ liệu thực tế dành riêng cho sinh viên & giảng viên Khoa CNTT.
                    </p>

                    <Input.Search
                        placeholder="Nhập tên bài báo, tác giả, hoặc từ khóa (VD: Trí tuệ nhân tạo)..."
                        allowClear
                        enterButton={<Button type="primary" className="bg-blue-600 w-24"><SearchOutlined /> Tìm</Button>}
                        size="large"
                        onSearch={handleSearch}
                        className="shadow-lg rounded-lg overflow-hidden custom-search"
                    />

                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Text className="text-blue-200 mr-2">Gợi ý tìm kiếm:</Text>
                        {['Machine Learning', 'Blockchain', 'Data Mining', 'Web Security'].map(tag => (
                            <Tag
                                key={tag}
                                className="bg-blue-800 border-blue-600 text-blue-100 cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSearch(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. KHU VỰC TABS & NỘI DUNG */}
            <Content className="max-w-6xl mx-auto w-full px-4 py-12 -mt-8">
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
                    <Tabs
                        defaultActiveKey="paper"
                        size="large"
                        centered
                        onChange={(key) => setActiveTab(key)}
                        items={[
                            {
                                label: <span className="text-base px-4"><FilePdfOutlined /> Bài báo khoa học</span>,
                                key: 'paper',
                            },
                            {
                                label: <span className="text-base px-4"><DatabaseOutlined /> Bộ dữ liệu (Dataset)</span>,
                                key: 'dataset',
                            }
                        ]}
                    />

                    {/* Danh sách thẻ (Cards) */}
                    <div className="mt-8">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spin size="large" tip="Đang tải dữ liệu..." />
                            </div>
                        ) : documents.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {documents.map(doc => (
                                    <Col xs={24} sm={12} lg={8} key={doc.id}>
                                        <Card
                                            hoverable
                                            className="h-full flex flex-col rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                            onClick={() => navigate(`/document/${doc.id}`)}
                                            bodyStyle={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <Tag color={activeTab === 'paper' ? 'blue' : 'purple'} className="border-0 font-medium">
                                                    {doc.category_name}
                                                </Tag>
                                                {doc.has_pdf && <Tag color="red" className="border-0 m-0"><FilePdfOutlined /> PDF</Tag>}
                                            </div>

                                            <Title level={4} className="mt-0 mb-2 line-clamp-2 text-gray-800 text-lg hover:text-blue-600 transition-colors">
                                                {doc.title}
                                            </Title>

                                            <Paragraph className="text-gray-500 line-clamp-3 mb-4 flex-grow">
                                                {doc.description || 'Chưa có tóm tắt.'}
                                            </Paragraph>

                                            <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500 flex flex-col gap-2">
                                                <span className="flex items-center text-gray-700 font-medium truncate">
                                                    <UserOutlined className="mr-2 text-blue-500" /> {formatAuthors(doc.authors)}
                                                </span>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="flex items-center"><CalendarOutlined className="mr-1" /> {doc.created_at}</span>
                                                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded"><EyeOutlined className="mr-1 text-blue-500" /> {doc.view_count || 0}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="py-20">
                                <Empty description={<span className="text-gray-500">Không tìm thấy tài liệu nào phù hợp.</span>} />
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Home;