import React, { useState, useEffect } from 'react';
import {
    Layout, Typography, Button, Tag, Spin, message, Breadcrumb, Divider, Row, Col, Card, Descriptions, Modal, Skeleton,
    Space
} from 'antd';
import {
    EyeOutlined, CalendarOutlined, UserOutlined, DownloadOutlined,
    LeftOutlined, GithubOutlined, FilePdfOutlined, DatabaseOutlined, GlobalOutlined,
    RobotOutlined, ThunderboltOutlined, SyncOutlined, LockOutlined, CopyOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [relatedDocs, setRelatedDocs] = useState([]); // Tài liệu cùng chủ đề
    const [historyDocs, setHistoryDocs] = useState([]); // Lịch sử đã xem
    const [showPdf, setShowPdf] = useState(false); // Trạng thái hiển thị PDF
    const [pdfError, setPdfError] = useState(false); // Trạng thái lỗi file PDF
    const [checkingPdf, setCheckingPdf] = useState(false); // Đang kiểm tra file



    const handleTogglePdf = async () => {
        if (!showPdf && !pdfError) {
            setCheckingPdf(true);
            try {
                const fileUrl = getFullFileUrl(doc.file_url);
                const response = await fetch(fileUrl, { method: 'HEAD' });
                if (!response.ok) {
                    setPdfError(true);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra PDF:", error);
                // Có thể do CORS hoặc mạng, vẫn cho hiện thử iframe
            } finally {
                setCheckingPdf(false);
                setShowPdf(true);
            }
        } else {
            setShowPdf(!showPdf);
        }
    };

    const handleGenerateAiSummary = async () => {
        setIsAiLoading(true);
        try {
            const response = await api.get(`/public/documents/${id}/summary`);
            setAiSummary(response.data.summary);
        } catch (error) {
            message.error("Không thể khởi tạo AI lúc này. Vui lòng thử lại sau!");
        } finally {
            setIsAiLoading(false);
        }
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
    
    // Hàm bổ trợ để lấy URL đầy đủ của file từ Backend
    const getFullFileUrl = (url, isDownload = false) => {
        if (!url) return "";
        let finalUrl = url.startsWith('http') ? url : `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
        if (isDownload) {
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'download=true';
        }
        return finalUrl;
    };

    // Hàm xử lý tải xuống có kiểm tra đăng nhập
    const handleDownloadClick = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            Modal.info({
                title: 'Yêu cầu đăng nhập',
                icon: <LockOutlined style={{ color: '#ff4d4f' }} />,
                content: (
                    <div>
                        <p>Bạn cần đăng nhập tài khoản để có thể tải tài liệu về máy.</p>
                        <p className="text-gray-400 text-sm italic">Khách vãng lai chỉ được phép xem trực tiếp trên trình duyệt.</p>
                    </div>
                ),
                okText: 'Đăng nhập ngay',
                okButtonProps: { className: 'bg-blue-600' },
                onOk: () => navigate('/login'),
                maskClosable: true,
            });
            return;
        }

        // Nếu đã đăng nhập thì mở link tải
        window.open(getFullFileUrl(doc.file_url, true), '_blank');
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // 1. Lấy chi tiết tài liệu
                const response = await api.get(`/public/documents/${id}?increase_view=true`);
                const documentData = response.data.document;
                setDoc(documentData);

                // 2. Lưu vào lịch sử đã xem (localStorage)
                const savedHistory = JSON.parse(localStorage.getItem('view_history')) || [];
                // Lọc bỏ bài hiện tại nếu đã có trong lịch sử để đưa lên đầu
                const updatedHistory = [
                    { id: documentData.id, title: documentData.title, category_name: documentData.category_name, doc_type: documentData.doc_type },
                    ...savedHistory.filter(item => item.id !== documentData.id)
                ].slice(0, 10); // Chỉ giữ lại 10 bài gần nhất
                
                localStorage.setItem('view_history', JSON.stringify(updatedHistory));
                setHistoryDocs(updatedHistory.filter(item => item.id !== documentData.id)); // Hiển thị các bài KHÁC bài hiện tại

                // 3. Lấy tài liệu liên quan (cùng category)
                const relatedRes = await api.get(`/public/documents?type=${documentData.doc_type}&limit=4`);
                setRelatedDocs(relatedRes.data.documents.filter(d => d.id !== documentData.id));

            } catch (error) {
                message.error("Không thể tải chi tiết tài liệu!");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
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

                                {isPaper && doc.citation && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <Title level={4} className="text-gray-800 m-0 flex items-center gap-2">
                                                Trích dẫn học thuật (Citation)
                                            </Title>
                                            <Button 
                                                icon={<CopyOutlined />} 
                                                size="small"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(doc.citation);
                                                    message.success("Đã sao chép trích dẫn!");
                                                }}
                                            >
                                                Sao chép
                                            </Button>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 font-mono text-sm text-gray-600 relative group">
                                            {doc.citation}
                                        </div>
                                    </div>
                                )}



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

                        {/* CỘT PHẢI: NÚT TẢI XUỐNG & AI */}
                        <Col xs={24} lg={8}>
                            <div className="space-y-6">
                                <Card className="rounded-2xl shadow-2xl border-0 overflow-hidden hover:shadow-blue-100 transition-all duration-500" bodyStyle={{ padding: 0 }}>
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
                                                onClick={handleDownloadClick}
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

                                {/* AI SUMMARY SECTION */}
                                <Card className="rounded-2xl shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-indigo-50/30 hover:shadow-indigo-100 transition-all duration-500">
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                                <RobotOutlined className="text-xl" />
                                            </div>
                                            <div>
                                                <Title level={5} className="m-0 text-gray-800">AI Trợ lý Tóm tắt</Title>
                                                <p className="text-gray-500 text-xs m-0">Đọc nhanh nội dung chính</p>
                                            </div>
                                        </div>

                                        {isAiLoading ? (
                                            <div className="space-y-4 py-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <SyncOutlined spin className="text-indigo-500" />
                                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">AI đang phân tích tài liệu...</span>
                                                </div>
                                                <Skeleton active paragraph={{ rows: 4 }} title={false} />
                                            </div>
                                        ) : !aiSummary ? (
                                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-50 text-center">
                                                <p className="text-gray-600 text-sm mb-4">Bạn muốn nắm bắt nhanh ý chính của tài liệu này?</p>
                                                <Button
                                                    type="primary"
                                                    block
                                                    size="middle"
                                                    icon={<ThunderboltOutlined />}
                                                    onClick={handleGenerateAiSummary}
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-md hover:shadow-lg transition-all font-medium h-10"
                                                >
                                                    Tóm tắt thông minh
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="animate-fade-in space-y-5">
                                                {/* CẤU TRÚC TÓM TẮT CHUYÊN NGHIỆP */}
                                                <div className="space-y-4">
                                                    <div className="relative pl-4 border-l-2 border-indigo-500">
                                                        <Text className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Mục tiêu chính</Text>
                                                        <p className="text-gray-700 text-sm leading-relaxed m-0 animate-typewriter">{aiSummary.objective}</p>
                                                    </div>
                                                    
                                                    <div className="relative pl-4 border-l-2 border-purple-400">
                                                        <Text className="block text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Phương pháp</Text>
                                                        <p className="text-gray-700 text-sm leading-relaxed m-0">{aiSummary.methodology}</p>
                                                    </div>

                                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                                        <Text className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <ThunderboltOutlined className="text-xs" /> Kết quả nổi bật
                                                        </Text>
                                                        <ul className="m-0 pl-4 space-y-1.5">
                                                            {aiSummary.key_findings && aiSummary.key_findings.map((item, i) => (
                                                                <li key={i} className="text-gray-700 text-sm leading-snug list-disc">{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="link" 
                                                    block
                                                    size="small"
                                                    icon={<SyncOutlined />}
                                                    onClick={handleGenerateAiSummary}
                                                    className="text-indigo-600 hover:text-indigo-700 text-[10px] font-bold p-0 uppercase"
                                                >
                                                    Tạo lại bản tóm tắt
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>


                        </Col>
                    </Row>

                    {/* PHẦN 2.5: TRÌNH ĐỌC PDF TRỰC TIẾP */}
                    {isPaper && doc.file_url && (
                        <div className="mt-16 animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                                    <Title level={3} className="m-0 text-gray-800">Đọc trực tiếp</Title>
                                </div>
                                <Button 
                                    type={showPdf ? "default" : "primary"}
                                    icon={checkingPdf ? <SyncOutlined spin /> : <FilePdfOutlined />}
                                    loading={checkingPdf}
                                    onClick={handleTogglePdf}
                                    className={showPdf ? "" : "bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 shadow-md"}
                                >
                                    {showPdf ? "Đóng trình đọc" : "Mở trình đọc PDF"}
                                </Button>
                            </div>
                            
                            {showPdf && pdfError ? (
                                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center shadow-inner">
                                    <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                        <FilePdfOutlined />
                                    </div>
                                    <Title level={4} className="text-gray-800 mb-2">Tài liệu tạm thời không khả dụng</Title>
                                    <Paragraph className="text-gray-500 max-w-md mx-auto mb-8">
                                        Rất tiếc, tệp tin PDF này không được tìm thấy trên máy chủ hoặc đường dẫn đã thay đổi. 
                                        Bạn có thể thử tải về trực tiếp hoặc liên hệ quản trị viên.
                                    </Paragraph>
                                    <Space size="middle">
                                        <Button 
                                            icon={<DownloadOutlined />} 
                                            onClick={handleDownloadClick}
                                            className="h-11 px-6 rounded-lg font-medium"
                                        >
                                            Thử tải về máy
                                        </Button>
                                        <Button 
                                            type="primary" 
                                            danger
                                            ghost
                                            className="h-11 px-6 rounded-lg font-medium"
                                        >
                                            Báo cáo lỗi file
                                        </Button>
                                    </Space>
                                </div>
                            ) : showPdf ? (
                                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-2xl border-8 border-white h-[800px] relative">
                                    <iframe
                                        src={`${getFullFileUrl(doc.file_url)}#toolbar=0`}
                                        width="100%"
                                        height="100%"
                                        className="border-0"
                                        title="PDF Preview"
                                    ></iframe>
                                </div>
                            ) : (
                                <div 
                                    onClick={handleTogglePdf}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center cursor-pointer hover:shadow-xl transition-all group overflow-hidden relative border border-blue-100"
                                >
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <FilePdfOutlined className="text-[300px] -rotate-12 translate-x-1/2 text-blue-200" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                            <FilePdfOutlined />
                                        </div>
                                        <Title level={4} className="text-gray-800 mb-2">Xem toàn văn bài báo</Title>
                                        <Paragraph className="text-gray-500 max-w-md mx-auto">Bạn có thể xem trực tiếp nội dung bài báo khoa học ngay tại đây mà không cần tải về máy.</Paragraph>
                                        <Button className="mt-6 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-all rounded-full px-8">Bắt đầu đọc ngay</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PHẦN 3: TÀI LIỆU LIÊN QUAN & LỊCH SỬ */}
                    <div className="mt-20">
                        {relatedDocs.length > 0 && (
                            <div className="mb-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    <Title level={3} className="m-0 text-gray-800">Tài liệu cùng chủ đề</Title>
                                </div>
                                <Row gutter={[24, 24]}>
                                    {relatedDocs.map(item => (
                                        <Col xs={24} sm={12} md={6} key={item.id}>
                                            <Card
                                                hoverable
                                                className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-all h-full"
                                                onClick={() => navigate(`/document/${item.id}`)}
                                                bodyStyle={{ padding: '16px' }}
                                            >
                                                <Tag color={item.doc_type === 'paper' ? 'blue' : 'purple'} className="mb-2 text-[10px] uppercase font-bold border-0">
                                                    {item.category_name}
                                                </Tag>
                                                <Title level={5} className="text-sm line-clamp-2 mb-4 h-10 hover:text-blue-600">
                                                    {item.title}
                                                </Title>
                                                <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                    <span><CalendarOutlined /> {item.created_at}</span>
                                                    <span><EyeOutlined /> {item.view_count || 0}</span>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {historyDocs.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-8 bg-gray-400 rounded-full"></div>
                                    <Title level={3} className="m-0 text-gray-800">Tài liệu bạn đã xem</Title>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {historyDocs.map(item => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => navigate(`/document/${item.id}`)}
                                            className="min-w-[280px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                                        >
                                            <Title level={5} className="text-sm line-clamp-2 mb-3 text-gray-700">
                                                {item.title}
                                            </Title>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-blue-500 font-medium px-2 py-0.5 bg-blue-50 rounded">
                                                    {item.category_name}
                                                </span>
                                                <Text type="secondary" className="text-[10px]">Xem lại →</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Content>

            <AppFooter />
        </Layout>
    );
};

export default DocumentDetail;