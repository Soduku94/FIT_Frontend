import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Tag, Button, Empty, Skeleton, Space, Divider } from 'antd';
import { 
    FolderOpenOutlined, 
    ArrowRightOutlined, 
    FileTextOutlined, 
    DatabaseOutlined,
    ReadOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const Categories = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Sử dụng Public API giống Home.jsx
            const catRes = await api.get('/public/categories');
            setCategories(catRes.data.categories || []);

            // Lấy toàn bộ tài liệu công khai để phân loại
            const docRes = await api.get('/public/documents?limit=100');
            setDocuments(docRes.data.documents || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Nhóm tài liệu theo danh mục - Logic so sánh cực kỳ cẩn thận
    const groupedDocs = categories.map(cat => ({
        ...cat,
        docs: documents.filter(doc => {
            const catIdMatch = doc.category_id === cat.id;
            const catNameMatch = doc.category_name?.toLowerCase().trim() === cat.name?.toLowerCase().trim();
            const catFieldMatch = doc.category?.toLowerCase().trim() === cat.name?.toLowerCase().trim();
            return catIdMatch || catNameMatch || catFieldMatch;
        }).slice(0, 4)
    }));

    const renderDocumentCard = (doc) => (
        <Col xs={24} sm={12} lg={6} key={doc.id}>
            <Card 
                hoverable 
                className="h-full border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl"
                onClick={() => navigate(`/document/${doc.id}`)}
                bodyStyle={{ padding: '16px' }}
            >
                <div className="flex flex-col h-full">
                    <div className="mb-2">
                        {doc.doc_type === 'paper' ? 
                            <Tag color="red" icon={<FileTextOutlined />}>Bài báo</Tag> : 
                            <Tag color="purple" icon={<DatabaseOutlined />}>Dataset</Tag>
                        }
                    </div>
                    <Title level={5} className="line-clamp-2 mb-2 flex-grow text-gray-800" style={{ fontSize: '15px' }}>
                        {doc.title}
                    </Title>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                        <Text type="secondary" className="text-xs">{doc.author}</Text>
                        <Text type="secondary" className="text-[10px]">{doc.created_at}</Text>
                    </div>
                </div>
            </Card>
        </Col>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 overflow-hidden">
            {/* MODERN SIMPLE HERO SECTION */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 border-b border-blue-200 py-16 px-6 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

                <div className="max-w-3xl w-full mx-auto relative z-10 animate-fade-in text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-blue-600 mb-6 shadow-sm border border-blue-200">
                        <ReadOutlined style={{ fontSize: '28px' }} />
                    </div>
                    <Title level={1} className="mb-4 m-0 tracking-tight text-gray-800" style={{ fontWeight: 800, fontSize: '2.2rem' }}>
                        Danh mục Chuyên ngành
                    </Title>
                    <Paragraph className="text-gray-700 text-lg max-w-2xl mx-auto m-0 leading-relaxed">
                        Khám phá kho tri thức số được phân loại khoa học theo từng lĩnh vực nghiên cứu chuyên sâu của Khoa Công nghệ Thông tin.
                    </Paragraph>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-20">
                {loading ? (
                    <div className="space-y-12">
                        {[1, 2, 3].map(i => (
                            <div key={i}>
                                <Skeleton.Input active size="large" style={{ width: 300, marginBottom: 20 }} />
                                <Row gutter={[20, 20]}>
                                    {[1, 2, 3, 4].map(j => <Col span={6} key={j}><Skeleton.Button active block style={{ height: 150 }} /></Col>)}
                                </Row>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {groupedDocs.map(category => (
                            <div key={category.id} className="animate-fade-in">
                                {/* Simple Section Header */}
                                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <FolderOpenOutlined style={{ fontSize: '24px' }} />
                                        </div>
                                        <div>
                                            <Title level={3} className="m-0 text-gray-800 font-bold">{category.name}</Title>
                                            <Text type="secondary" className="text-sm">{category.description || `Các tài liệu nghiên cứu mới nhất thuộc chuyên ngành ${category.name}`}</Text>
                                        </div>
                                    </div>
                                    <Button 
                                        type="link" 
                                        icon={<ArrowRightOutlined />} 
                                        onClick={() => navigate(`/?category=${category.name}`)}
                                        className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        Xem tất cả
                                    </Button>
                                </div>

                                {/* Clean Document Grid */}
                                {category.docs.length > 0 ? (
                                    <Row gutter={[20, 20]}>
                                        {category.docs.map(doc => (
                                            <Col xs={24} sm={12} lg={6} key={doc.id}>
                                                <Card 
                                                    hoverable 
                                                    className="h-full border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden"
                                                    onClick={() => navigate(`/document/${doc.id}`)}
                                                    bodyStyle={{ padding: '20px' }}
                                                >
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <Tag color={doc.doc_type === 'paper' ? 'blue' : 'purple'} className="m-0 border-none px-2 rounded-md font-medium text-[11px]">
                                                                {doc.doc_type === 'paper' ? 'BÀI BÁO' : 'DATASET'}
                                                            </Tag>
                                                            <Text type="secondary" className="text-[11px] font-medium">{doc.publication_year || '2024'}</Text>
                                                        </div>
                                                        
                                                        <Title level={5} className="line-clamp-2 mb-3 flex-grow text-gray-800 leading-snug" style={{ fontSize: '15px', fontWeight: 600 }}>
                                                            {doc.title}
                                                        </Title>
                                                        
                                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                                                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <UserOutlined className="text-gray-400 text-[10px]" />
                                                            </div>
                                                            <Text className="text-gray-500 text-xs font-medium truncate" style={{ maxWidth: '140px' }}>
                                                                {doc.author}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <div className="bg-gray-50/50 p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                                        <Empty description={<Text type="secondary">Chưa có tài liệu nào trong mục này</Text>} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="py-20 bg-white rounded-3xl shadow-sm text-center border border-gray-100">
                                <Empty 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<Text type="secondary">Đang cập nhật danh mục hệ thống...</Text>} 
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Categories;
