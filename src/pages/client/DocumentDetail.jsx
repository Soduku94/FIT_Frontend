import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Tag, Spin, message, Breadcrumb, Divider, Row, Col, Card } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined, DownloadOutlined, LinkOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const DocumentDetail = () => {
    const { id } = useParams(); // Lấy ID từ trên thanh địa chỉ URL
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    // Hàm làm sạch tên tác giả
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



    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // 1. Mở cuốn sổ tay trong localStorage (Nếu chưa có thì tạo mảng rỗng [])
                const viewedDocs = JSON.parse(localStorage.getItem('viewedDocs')) || [];

                // 2. Kiểm tra xem ID bài báo này đã có trong sổ chưa?
                const hasViewed = viewedDocs.includes(id);

                // 3. Nếu CHƯA xem, ta gắn thêm cờ ?increase_view=true để Backend cộng view
                // Nếu ĐÃ xem rồi, ta chỉ gọi link bình thường để lấy dữ liệu
                const url = hasViewed
                    ? `/public/documents/${id}`
                    : `/public/documents/${id}?increase_view=true`;

                const response = await api.get(url);
                setDoc(response.data.document);

                // 4. Nếu là lần đầu xem, lập tức ghi ID bài này vào sổ tay để lần sau không cộng nữa
                if (!hasViewed) {
                    viewedDocs.push(id);
                    localStorage.setItem('viewedDocs', JSON.stringify(viewedDocs));
                }

            } catch (error) {
                message.error("Không thể tải chi tiết tài liệu!");
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

    return (
        <Layout className="min-h-screen bg-gray-50">
            {/* THANH NAVBAR NHỎ */}
            <Header className="bg-white shadow-sm flex items-center px-4 sm:px-10 z-10 h-16">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate('/')} className="font-medium text-gray-600">
                    Trở về Trang chủ
                </Button>
            </Header>

            <Content className="pt-8 pb-16 px-4 flex justify-center">
                <div className="w-full max-w-5xl animate-fade-in">

                    {/* Breadcrumb điều hướng */}
                    <Breadcrumb className="mb-6">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>{doc.category_name}</Breadcrumb.Item>
                        <Breadcrumb.Item className="truncate w-48 inline-block">{doc.title}</Breadcrumb.Item>
                    </Breadcrumb>

                    <Row gutter={[24, 24]}>
                        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
                        <Col xs={24} lg={16}>
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <Tag color={doc.doc_type === 'Dataset' ? 'purple' : 'blue'} className="text-sm px-3 py-1">
                                        {doc.doc_type}
                                    </Tag>
                                    <Tag className="text-sm px-3 py-1">{doc.category_name}</Tag>
                                </div>

                                <Title level={2} className="mt-0 mb-4 text-gray-800 leading-tight">
                                    {doc.title}
                                </Title>

                                <div className="flex flex-wrap gap-6 text-gray-500 mb-6 border-b border-gray-100 pb-6">
                                    <span className="flex items-center"><UserOutlined className="mr-2" />{formatAuthors(doc.authors)}</span>
                                    <span className="flex items-center"><CalendarOutlined className="mr-2" />{doc.created_at}</span>
                                    <span className="flex items-center text-blue-500 bg-blue-50 px-2 py-0.5 rounded"><EyeOutlined className="mr-2" />{doc.view_count} lượt xem</span>
                                </div>

                                <Title level={4} className="text-gray-800 mb-3">Tóm tắt (Abstract)</Title>
                                <Paragraph className="text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                                    {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                                </Paragraph>

                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <Title level={5} className="text-gray-700 mb-3">Từ khóa (Keywords)</Title>
                                        <div className="flex flex-wrap gap-2">
                                            {doc.tags.map((tag, idx) => (
                                                <Tag key={idx} className="bg-gray-100 text-gray-600 border-0 px-3 py-1 text-sm">{tag}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* CỘT PHẢI: METADATA & NÚT HÀNH ĐỘNG */}
                        <Col xs={24} lg={8}>
                            <Card className="rounded-xl shadow-sm border-gray-200 sticky top-24">
                                <Title level={5} className="mt-0 mb-4 border-b pb-2">Tải xuống & Liên kết</Title>

                                <div className="flex flex-col gap-3">
                                    {doc.file_url ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<DownloadOutlined />}
                                            className="bg-blue-600 w-full"
                                            onClick={() => window.open(doc.file_url, '_blank')}
                                        >
                                            Tải File PDF
                                        </Button>
                                    ) : (
                                        <Button size="large" disabled className="w-full">Tài liệu không có file đính kèm</Button>
                                    )}

                                    {doc.external_link && (
                                        <Button
                                            size="large"
                                            icon={<LinkOutlined />}
                                            className="w-full"
                                            onClick={() => window.open(doc.external_link, '_blank')}
                                        >
                                            Xem bài viết gốc
                                        </Button>
                                    )}
                                </div>

                                <Divider className="my-6" />

                                <div className="text-sm text-gray-500 space-y-2">
                                    <p><strong>Mã tài liệu:</strong> #{doc.id}</p>
                                    <p><strong>Cấp phép:</strong> Được duyệt bởi Admin</p>
                                </div>
                            </Card>
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