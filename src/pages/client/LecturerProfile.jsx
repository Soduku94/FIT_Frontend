import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Avatar, Tag, Spin, Space, Empty, Divider, Button, Breadcrumb } from 'antd';
import { 
    MailOutlined, BookOutlined, CalendarOutlined, EyeOutlined, 
    ArrowLeftOutlined, UserOutlined, LinkedinOutlined, FacebookOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const LecturerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecturer, setLecturer] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLecturerProfile = async () => {
            try {
                const response = await api.get(`/public/lecturers/${id}`);
                setLecturer(response.data.lecturer);
                setDocuments(response.data.documents);
            } catch (error) {
                console.error("Lỗi lấy thông tin giảng viên:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLecturerProfile();
    }, [id]);

    const formatAuthors = (authorsData) => {
        if (!authorsData) return 'Tác giả';
        if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
            try {
                const parsed = JSON.parse(authorsData);
                return Array.isArray(parsed) ? parsed.join(', ') : authorsData;
            } catch (e) {}
        }
        if (Array.isArray(authorsData)) return authorsData.join(', ');
        return authorsData;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Space direction="vertical" align="center" size="large">
                    <Spin size="large" />
                    <Text className="text-gray-500 font-medium">Đang tải thông tin giảng viên...</Text>
                </Space>
            </div>
        );
    }

    if (!lecturer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full text-center rounded-3xl shadow-xl border-gray-100 p-8">
                    <Empty description={<Text className="text-lg font-bold text-gray-700">Không tìm thấy giảng viên</Text>} />
                    <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} className="mt-6 rounded-xl">
                        Quay lại trang chủ
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: 'Plus Jakarta Sans', sans-serif; }
                .doc-card {
                    border-radius: 20px !important;
                    border: 1px solid #E2E8F0 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    background: #fff !important;
                }
                .doc-card:hover {
                    border-color: #3B82F6 !important;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(59,130,246,0.08) !important;
                }
                .back-btn:hover {
                    color: #3B82F6 !important;
                    background: #EFF6FF !important;
                }
            `}</style>

           

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 px-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <Row gutter={[40, 32]} align="middle">
                        <Col xs={24} md={6} className="text-center md:text-left">
                            <Avatar 
                                size={180} 
                                src={lecturer.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'} 
                                icon={<UserOutlined />}
                                className="border-4 border-white/20 shadow-2xl scale-95 hover:scale-100 transition-transform duration-300"
                            />
                        </Col>
                        <Col xs={24} md={18} className="text-center md:text-left">
                            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                                <span className="text-blue-300 font-bold text-xs uppercase tracking-wider">{lecturer.academic_title || 'Giảng Viên'}</span>
                            </div>
                            <Title level={1} className="text-white m-0 text-3xl md:text-5xl font-black mb-3">
                                {lecturer.full_name}
                            </Title>
                            <Text className="text-blue-200 block text-lg font-semibold mb-4">
                                {lecturer.department || 'Khoa Công nghệ Thông tin'}
                            </Text>
                            <Paragraph className="text-blue-100/80 text-base max-w-3xl leading-relaxed mb-6">
                                {lecturer.bio || 'Giảng viên giàu kinh nghiệm, tận tụy hướng dẫn sinh viên nghiên cứu khoa học và phát triển kỹ năng thực tiễn trong ngành Công nghệ thông tin.'}
                            </Paragraph>
                            <Space size={20} wrap className="justify-center md:justify-start">
                                <a href={`mailto:${lecturer.email}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all">
                                    <MailOutlined />
                                    <span>{lecturer.email}</span>
                                </a>
                                <div className="flex gap-3">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all">
                                        <LinkedinOutlined className="text-lg" />
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all">
                                        <FacebookOutlined className="text-lg" />
                                    </a>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Profile Content */}
            <Content className="max-w-7xl mx-auto px-6 py-12">
                <Row gutter={[40, 40]}>
                    {/* Left Column - Biography/Info details */}
                    <Col xs={24} lg={8}>
                        <div className="space-y-6">
                            <Card className="rounded-3xl shadow-sm border-gray-100 p-2">
                                <Title level={4} className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                    <UserOutlined className="text-blue-600" /> Thông tin học thuật
                                </Title>
                                <Divider className="my-3" />
                                <div className="space-y-4">
                                    <div>
                                        <Text className="text-gray-400 block text-xs uppercase tracking-wider font-semibold">Học hàm / Học vị</Text>
                                        <Text className="text-gray-800 font-bold text-base">{lecturer.academic_title || 'Tiến sĩ'}</Text>
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-xs uppercase tracking-wider font-semibold">Đơn vị công tác</Text>
                                        <Text className="text-gray-800 font-bold text-base">{lecturer.department || 'Bộ môn Công nghệ Phần mềm'}</Text>
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-xs uppercase tracking-wider font-semibold">Mã số giảng viên</Text>
                                        <Text className="text-gray-800 font-bold text-base">{lecturer.user_code}</Text>
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-xs uppercase tracking-wider font-semibold">Email liên hệ</Text>
                                        <Text className="text-blue-600 font-semibold text-base block break-all">{lecturer.email}</Text>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-3xl shadow-sm border-gray-100 p-2">
                                <Title level={4} className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                    <BookOutlined className="text-blue-600" /> Hướng nghiên cứu chính
                                </Title>
                                <Divider className="my-3" />
                                <div className="flex flex-wrap gap-2">
                                    <Tag color="blue" className="rounded-lg border-none px-3 py-1 font-medium m-0 text-sm">Trí tuệ nhân tạo (AI)</Tag>
                                    <Tag color="cyan" className="rounded-lg border-none px-3 py-1 font-medium m-0 text-sm">Học máy (Machine Learning)</Tag>
                                    <Tag color="purple" className="rounded-lg border-none px-3 py-1 font-medium m-0 text-sm">Công nghệ Phần mềm</Tag>
                                    <Tag color="orange" className="rounded-lg border-none px-3 py-1 font-medium m-0 text-sm">Khoa học Dữ liệu</Tag>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* Right Column - Lecturer Documents */}
                    <Col xs={24} lg={16}>
                        <Card className="rounded-3xl shadow-sm border-gray-100 p-4">
                            <div className="flex justify-between items-center mb-6">
                                <Title level={3} className="m-0 text-gray-800 font-black flex items-center gap-2">
                                    <BookOutlined className="text-blue-600" /> Công trình Nghiên cứu & Tài liệu ({documents.length})
                                </Title>
                            </div>
                            
                            {documents.length > 0 ? (
                                <div className="space-y-6">
                                    {documents.map((doc) => {
                                        const isPaper = doc.doc_type === 'paper';
                                        return (
                                            <Card
                                                key={doc.id}
                                                hoverable
                                                className="doc-card"
                                                onClick={() => navigate(`/document/${doc.id}`)}
                                                bodyStyle={{ padding: '24px' }}
                                            >
                                                <div className="flex gap-3 mb-3 items-center flex-wrap">
                                                    <Tag color={isPaper ? 'blue' : 'purple'} className="rounded-lg font-bold border-none text-xs px-2.5 py-0.5 m-0 uppercase">
                                                        {doc.category_name || (isPaper ? 'Bài báo' : 'Dataset')}
                                                    </Tag>
                                                    <Divider type="vertical" className="bg-gray-200 h-3" />
                                                    <Text className="text-gray-400 text-xs font-semibold flex items-center">
                                                        <CalendarOutlined className="mr-1.5" />
                                                        {doc.publication_year || doc.created_at}
                                                    </Text>
                                                </div>

                                                <Title level={4} className="m-0 text-gray-800 font-bold mb-2 text-lg hover:text-blue-600 transition-colors">
                                                    {doc.title}
                                                </Title>

                                                <Paragraph className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                                                    {doc.description || 'Tài liệu này hiện chưa có đoạn tóm tắt.'}
                                                </Paragraph>

                                                <div className="flex justify-between items-center pt-3 border-t border-gray-50 flex-wrap gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar size={24} icon={<UserOutlined />} className="bg-blue-50 text-blue-600 flex-shrink-0" />
                                                        <Text className="text-gray-700 font-bold text-xs">
                                                            {formatAuthors(doc.authors)}
                                                        </Text>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-gray-400 text-xs font-semibold">
                                                        <span className="flex items-center gap-1">
                                                            <EyeOutlined /> {doc.view_count || 0} lượt xem
                                                        </span>
                                                        {isPaper && doc.has_pdf && (
                                                            <Tag color="red" className="rounded-md border-none font-bold text-[10px]">PDF</Tag>
                                                        )}
                                                        {!isPaper && doc.has_external_link && (
                                                            <Tag color="green" className="rounded-md border-none font-bold text-[10px]">GITHUB</Tag>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <Empty 
                                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                        description={
                                            <div className="mt-3">
                                                <Text className="font-bold text-gray-600 block text-base">Chưa có công trình nghiên cứu công khai</Text>
                                                <Text className="text-gray-400 text-sm">Các tài liệu nghiên cứu và dữ liệu sinh viên/giảng viên sẽ sớm được bổ sung.</Text>
                                            </div>
                                        } 
                                    />
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
            
            <AppFooter />
        </div>
    );
};

export default LecturerProfile;
