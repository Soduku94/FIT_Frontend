import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Tag, Spin, message, Breadcrumb, Divider, Row, Col, Card, Descriptions } from 'antd';
import {
    EyeOutlined, CalendarOutlined, UserOutlined, DownloadOutlined,
    LeftOutlined, GithubOutlined, FilePdfOutlined, DatabaseOutlined, GlobalOutlined,
    RobotOutlined, ThunderboltOutlined, SyncOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleGenerateAiSummary = () => {
        setIsAiLoading(true);
        // Simulate API call for AI summary
        setTimeout(() => {
            setAiSummary("Đây là bản tóm tắt tự động do AI tạo ra.\n\nTài liệu này trình bày chi tiết các phương pháp nghiên cứu tiên tiến và kết quả đạt được. Trọng tâm là cải thiện hiệu suất của mô hình và đưa ra các đánh giá khách quan dựa trên tập dữ liệu thực tế.\n\n(Lưu ý: Đây là dữ liệu giả lập hiển thị giao diện UI, tính năng backend sẽ được cập nhật sau).");
            setIsAiLoading(false);
        }, 2500);
    };

    const formatAuthors = (authorsData) => {
        if (!authorsData) return 'Đang cập nhật';
        try {
            if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
                const parsed = JSON.parse(authorsData);
                return Array.isArray(parsed) ? parsed.join(', ') : authorsData;
            }
            if (Array.isArray(authorsData)) return authorsData.join(', ');
        } catch (e) {
        }
        return authorsData;
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const viewedDocs = JSON.parse(localStorage.getItem('viewedDocs')) || [];
                const hasViewed = viewedDocs.includes(id);

                const url = hasViewed
                    ? `/public/documents/${id}`
                    : `/public/documents/${id}?increase_view=true`;

                const response = await api.get(url);
                setDoc(response.data.document);

                if (!hasViewed) {
                    viewedDocs.push(id);
                    localStorage.setItem('viewedDocs', JSON.stringify(viewedDocs));
                }
            } catch (error) {
                message.error("Không thể tải chi tiết tài liệu hoặc tài liệu không tồn tại!");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (loading) {
        return (
            <Layout className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spin size="large" tip="Đang tải dữ liệu tài liệu..." />
            </Layout>
        );
    }

    if (!doc) return null;

    const isPaper = doc.doc_type === 'paper';

    return (
        <Layout className="min-h-screen bg-gray-50">
            {/* THANH NAVBAR NHỎ */}
            {/* <Header className="bg-white shadow-sm flex items-center px-4 sm:px-10 z-10 h-16 relative">
                <Button type="text" icon={<LeftOutlined/>} onClick={() => navigate(-1)}
                        className="font-medium text-gray-600">
                    Trở về
                </Button>
            </Header> */}

            <Content className="pb-16 animate-fade-in block">
                {/* HERO BANNER SECTION */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white pt-12 pb-24 px-4 sm:px-10 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
                    </div>

                    <div className="w-full max-w-[1440px] mx-auto relative z-10">
                        {/* Breadcrumb điều hướng (Sáng màu) */}
                        <Breadcrumb className="mb-6 opacity-80" separator={<span className="text-white/50">/</span>}>
                            <Breadcrumb.Item href="/" className="text-white hover:text-blue-200">Trang chủ</Breadcrumb.Item>
                            <Breadcrumb.Item className="text-white hover:text-blue-200">{doc.category_name}</Breadcrumb.Item>
                            <Breadcrumb.Item className="truncate w-48 inline-block text-white/50">{doc.title}</Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="mb-5 flex flex-wrap gap-3">
                            <Tag className={`text-sm px-4 py-1.5 flex items-center gap-2 border-0 rounded-full font-medium ${isPaper ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'} shadow-md`}>
                                {isPaper ? <FilePdfOutlined /> : <DatabaseOutlined />}
                                {isPaper ? 'Bài báo khoa học' : 'Bộ dữ liệu (Dataset)'}
                            </Tag>
                            <Tag className="text-sm px-4 py-1.5 border-0 bg-white/20 text-white rounded-full backdrop-blur-sm">
                                {doc.category_name}
                            </Tag>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight max-w-5xl tracking-tight text-white drop-shadow-md">
                            {doc.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-blue-100 text-base">
                            <span className="flex items-center bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <UserOutlined className="mr-2 opacity-70" />
                                <span className="font-medium">{formatAuthors(doc.authors)}</span>
                            </span>
                            <span className="flex items-center">
                                <CalendarOutlined className="mr-2 opacity-70" /> {doc.created_at}
                            </span>
                            <span className="flex items-center">
                                <EyeOutlined className="mr-2 opacity-70" /> {doc.view_count || 0} lượt xem
                            </span>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT SECTION */}
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 -mt-12 relative z-20">
                    <Row gutter={[40, 32]} align="top">
                        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
                        <Col xs={24} lg={16}>
                            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 h-full">
                                {/* BẢNG THÔNG TIN ĐẶC THÙ */}
                                <div className={`p-6 rounded-xl mb-10 border ${isPaper ? 'bg-blue-50/50 border-blue-100' : 'bg-purple-50/50 border-purple-100'}`}>
                                    <Title level={5} className={`mt-0 mb-4 flex items-center gap-2 ${isPaper ? 'text-blue-800' : 'text-purple-800'}`}>
                                        <DatabaseOutlined /> Chi tiết xuất bản
                                    </Title>
                                    <Descriptions column={{ xs: 1, sm: 2 }} size="middle" className="font-medium">
                                        {isPaper ? (
                                            <>
                                                <Descriptions.Item label={<span className="text-gray-500">Năm xuất bản</span>}>{doc.publication_year || 'Chưa cập nhật'}</Descriptions.Item>
                                                <Descriptions.Item label={<span className="text-gray-500">Tạp chí / Hội nghị</span>}>{doc.journal_name || 'Chưa cập nhật'}</Descriptions.Item>
                                                <Descriptions.Item label={<span className="text-gray-500">Mã DOI</span>}>
                                                    {doc.doi ? <span className="text-blue-600 break-all">{doc.doi}</span> : 'Chưa cập nhật'}
                                                </Descriptions.Item>
                                            </>
                                        ) : (
                                            <>
                                                <Descriptions.Item label={<span className="text-gray-500">Định dạng</span>}>{doc.data_format || 'Chưa cập nhật'}</Descriptions.Item>
                                                <Descriptions.Item label={<span className="text-gray-500">Dung lượng</span>}>{doc.file_size || 'Chưa cập nhật'}</Descriptions.Item>
                                                <Descriptions.Item label={<span className="text-gray-500">Giấy phép</span>}>{doc.license_type || 'Chưa cập nhật'}</Descriptions.Item>
                                            </>
                                        )}
                                    </Descriptions>
                                </div>

                                <Title level={4} className="text-gray-800 mb-4 flex items-center gap-2">
                                    Tóm tắt (Abstract)
                                </Title>
                                <div className="text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line bg-gray-50 p-6 border-l-4 border-blue-500 rounded-r-xl italic">
                                    {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                                </div>

                                {/* AI SUMMARY SECTION */}
                                <div className="mt-10 pt-8 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                        <div>
                                            <Title level={4} className="m-0 text-gray-800 flex items-center gap-2">
                                                <RobotOutlined className="text-indigo-500" /> AI Trợ lý Tóm tắt
                                            </Title>
                                            <p className="text-gray-500 mt-1 text-sm">
                                                Sử dụng AI để đọc nhanh và tóm tắt những nội dung chính yếu của tài liệu.
                                            </p>
                                        </div>
                                        
                                        {!aiSummary && (
                                            <Button 
                                                type="primary" 
                                                size="large"
                                                icon={isAiLoading ? <SyncOutlined spin /> : <ThunderboltOutlined />} 
                                                onClick={handleGenerateAiSummary}
                                                disabled={isAiLoading}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-md hover:shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all font-medium whitespace-nowrap"
                                            >
                                                {isAiLoading ? 'AI Đang phân tích...' : 'Tóm tắt ngay'}
                                            </Button>
                                        )}
                                    </div>

                                    {aiSummary && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl border border-indigo-100 shadow-inner relative overflow-hidden animate-fade-in">
                                            {/* Decorative blob */}
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-40 -mt-10 -mr-10 pointer-events-none"></div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                                                        <RobotOutlined className="text-2xl" />
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="text-indigo-900 font-bold mb-3 text-lg">Bản tóm tắt thông minh</h5>
                                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base text-justify">
                                                        {aiSummary}
                                                    </p>
                                                    <div className="mt-5 flex gap-3 border-t border-indigo-100/50 pt-4">
                                                        <Button 
                                                            size="middle" 
                                                            className="text-indigo-600 border-indigo-200 hover:border-indigo-400 hover:text-indigo-700 font-medium" 
                                                            onClick={handleGenerateAiSummary}
                                                            disabled={isAiLoading}
                                                            icon={isAiLoading ? <SyncOutlined spin /> : <SyncOutlined />}
                                                        >
                                                            {isAiLoading ? 'Đang tạo lại...' : 'Tạo lại bản tóm tắt'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="mt-10 pt-8 border-t border-gray-100">
                                        <Title level={5} className="text-gray-500 mb-4 text-sm uppercase tracking-wider">Từ khóa liên quan</Title>
                                        <div className="flex flex-wrap gap-2">
                                            {doc.tags.map((tag, idx) => (
                                                <Tag key={idx} className="bg-gray-100 text-gray-700 border-0 px-4 py-2 text-sm rounded-lg hover:bg-white hover:shadow-md cursor-pointer transition-all">#{tag}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* CỘT PHẢI: NÚT TẢI XUỐNG */}
                        <Col xs={24} lg={8}>
                            <div className="sticky top-24">
                                <Card className="rounded-2xl shadow-xl border-0 overflow-hidden" bodyStyle={{ padding: 0 }}>
                                    {/* Card Header with mild gradient and icon */}
                                    <div className={`p-8 text-center ${isPaper ? 'bg-gradient-to-br from-blue-50 to-blue-100' : 'bg-gradient-to-br from-purple-50 to-purple-100'} border-b border-gray-100`}>
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-md ${isPaper ? 'bg-white text-blue-600' : 'bg-white text-purple-600'}`}>
                                            {isPaper ? <FilePdfOutlined /> : <DatabaseOutlined />}
                                        </div>
                                        <Title level={4} className="m-0 text-gray-800">Tài liệu đính kèm</Title>
                                        <p className="text-gray-500 mt-2 text-sm leading-tight">Truy cập toàn văn bài nghiên cứu hoặc bộ dữ liệu gốc</p>
                                    </div>

                                    <div className="p-6 flex flex-col gap-4">
                                        {/* Nút Tải File PDF / ZIP */}
                                        {doc.file_url ? (
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<DownloadOutlined className="text-lg" />}
                                                className={`w-full h-14 text-base font-medium border-0 shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${isPaper ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'} text-white`}
                                                onClick={() => {
                                                    let finalUrl = doc.file_url;
                                                    if (finalUrl.startsWith('http//')) {
                                                        finalUrl = finalUrl.replace('http//', 'http://');
                                                    }
                                                    if (!finalUrl.startsWith('http')) {
                                                        finalUrl = `http://localhost:5000${finalUrl.startsWith('/') ? '' : '/'}${finalUrl}`;
                                                    }
                                                    window.open(finalUrl, '_blank');
                                                }}
                                            >
                                                {isPaper ? 'Tải PDF (Toàn văn)' : 'Tải ZIP (Dataset)'}
                                            </Button>
                                        ) : (
                                            <Button size="large" disabled className="w-full h-14 bg-gray-50 font-medium">Chưa có file đính kèm cục bộ</Button>
                                        )}

                                        {/* Nút Github / Link ngoài */}
                                        {doc.github_url && (
                                            <Button
                                                size="large"
                                                icon={<GithubOutlined />}
                                                className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 hover:text-white border-0 font-medium shadow-md transition-all hover:-translate-y-0.5"
                                                onClick={() => window.open(doc.github_url, '_blank')}
                                            >
                                                Xem Mã nguồn / GitHub
                                            </Button>
                                        )}

                                        {doc.doi && (
                                            <Button
                                                size="large"
                                                icon={<GlobalOutlined />}
                                                className="w-full h-12 border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600 font-medium transition-colors"
                                                onClick={() => window.open(`https://doi.org/${doc.doi}`, '_blank')}
                                            >
                                                Tra cứu mã DOI
                                            </Button>
                                        )}

                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Mã định danh</span>
                                                <span className="font-mono text-gray-800 bg-gray-200 px-2 py-0.5 rounded shadow-sm">#{String(doc.id).substring(0, 8)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Trạng thái</span>
                                                <span className="text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Đã kiểm duyệt</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
            <Footer className="text-center text-gray-500 bg-white border-t border-gray-200">
                FIT Research Hub ©2026
            </Footer>
        </Layout>
    );
};

export default DocumentDetail;