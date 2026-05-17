import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Layout, Typography, Button, Tag, Spin, message, Breadcrumb, Divider, Row, Col, Card, Descriptions, Modal, Skeleton,
    Space, Badge
} from 'antd';
import {
    EyeOutlined, CalendarOutlined, UserOutlined, DownloadOutlined,
    LeftOutlined, GithubOutlined, FilePdfOutlined, DatabaseOutlined, GlobalOutlined,
    RobotOutlined, ThunderboltOutlined, SyncOutlined, LockOutlined, CopyOutlined,
    ArrowRightOutlined, FullscreenOutlined, FullscreenExitOutlined,
    ZoomInOutlined, ZoomOutOutlined, LeftCircleOutlined, RightCircleOutlined,
    RotateRightOutlined, ExpandOutlined, PrinterOutlined,
    StarOutlined, StarFilled
} from '@ant-design/icons';
import { InputNumber, Tooltip } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Cấu hình worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

/* ─── Shared Card Component from Home ─── */
const DocCard = ({ doc, onClick, viewMode = 'grid' }) => {
    const isPaper = doc.doc_type === 'paper';
    const isList = viewMode === 'list';

    const formatAuthors = (authorsData) => {
        if (!authorsData) return 'Tác giả';
        try {
            if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
                const parsed = JSON.parse(authorsData);
                return Array.isArray(parsed) ? parsed.join(', ') : authorsData;
            }
            if (Array.isArray(authorsData)) return authorsData.join(', ');
        } catch (e) {}
        return authorsData;
    };

    if (isList) {
        return (
            <Card
                hoverable
                className="list-card"
                onClick={onClick}
                bodyStyle={{ padding: window.innerWidth < 576 ? '20px' : '24px 32px' }}
            >
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} sm={20}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Tag
                                color={isPaper ? 'blue' : 'purple'}
                                style={{ 
                                    borderRadius: 8, 
                                    fontWeight: 800, 
                                    fontSize: 11, 
                                    border: 'none', 
                                    margin: 0,
                                    padding: '2px 10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                {doc.category_name || (isPaper ? 'BÀI BÁO' : 'DATASET')}
                            </Tag>
                            <Divider type="vertical" style={{ background: '#E2E8F0', height: 14 }} />
                            <Text style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                                <CalendarOutlined style={{ marginRight: 6, color: '#94A3B8' }} />
                                {doc.publication_year || doc.created_at}
                            </Text>
                        </div>
                        
                        <Title level={4} style={{ 
                            margin: '0 0 10px', 
                            color: '#0F172A', 
                            fontWeight: 700, 
                            fontSize: window.innerWidth < 576 ? 17 : 20,
                            lineHeight: 1.4
                        }}>
                            {doc.title}
                        </Title>
                        
                        <Paragraph style={{ 
                            color: '#475569', 
                            fontSize: 14, 
                            margin: '0 0 16px',
                            lineHeight: 1.6,
                            maxWidth: '90%'
                        }} ellipsis={{ rows: 2 }}>
                            {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                        </Paragraph>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserOutlined style={{ color: '#3B82F6', fontSize: 13 }} />
                                </div>
                                <Text style={{ color: '#1E293B', fontWeight: 600, fontSize: 14 }}>
                                    {formatAuthors(doc.authors)}
                                </Text>
                            </div>
                            
                            <Space size={16} style={{ color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                                <span><EyeOutlined style={{ marginRight: 6 }} />{doc.view_count || 0} lượt xem</span>
                                {isPaper && doc.has_pdf && <Tag color="error" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700, border: 'none' }}>PDF</Tag>}
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card
            hoverable
            className="grid-card"
            style={{ 
                borderRadius: 20, 
                border: '1px solid #E2E8F0', 
                height: '100%', 
                overflow: 'hidden', 
                background: '#fff',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={onClick}
            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <div style={{ padding: '24px 24px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Badge count={doc.category_name} style={{ backgroundColor: isPaper ? '#3B82F6' : '#8B5CF6', fontSize: 10, fontWeight: 700 }} />
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                        {doc.publication_year || doc.created_at}
                    </Text>
                </div>
                
                <Title level={5} style={{ 
                    margin: '0 0 12px', fontSize: 16, lineHeight: 1.5, fontWeight: 700, 
                    color: '#1E293B'
                }} ellipsis={{ rows: 2 }}>
                    {doc.title}
                </Title>

                <Paragraph style={{ 
                    color: '#64748B', fontSize: 13, marginBottom: 16, flex: 1
                }} ellipsis={{ rows: 2 }}>
                    {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                </Paragraph>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                        <UserOutlined style={{ color: '#3B82F6', fontSize: 12 }} />
                    </div>
                    <Text style={{ fontSize: 13, color: '#475569', fontWeight: 600, maxWidth: '80%' }} ellipsis>
                        {formatAuthors(doc.authors)}
                    </Text>
                </div>
            </div>

            <div style={{ 
                padding: '12px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Space size={12}>
                    <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <EyeOutlined style={{ color: '#94A3B8' }} /> {doc.view_count || 0}
                    </span>
                </Space>
                <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: 700 }}>
                    Chi tiết <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Text>
            </div>
        </Card>
    );
};

/* ─── NÂNG CẤP CUSTOM PDF VIEWER COMPONENT ─── */
const CustomPDFReader = ({ fileUrl, height = '800px', isFullScreen = false }) => {
    const { t } = useTranslation();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotate, setRotate] = useState(0);
    const [isFitWidth, setIsFitWidth] = useState(true);
    const token = localStorage.getItem('token');

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleDownload = () => {
        if (!token) {
            message.warning(t('auth.login_required_download'));
            return;
        }
        window.open(fileUrl + (fileUrl.includes('?') ? '&' : '?') + 'download=true', '_blank');
    };

    const handlePrint = () => {
        if (!token) {
            message.warning(t('auth.login_required_read'));
            return;
        }
        // Tạo iframe ẩn để in
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = fileUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            iframe.contentWindow.print();
        };
    };

    return (
        <div className="flex flex-col h-full bg-gray-200 select-none overflow-hidden">
            {/* Toolbar chuyên nghiệp */}
            <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap justify-between items-center shadow-xl z-20 border-b border-slate-700">
                <Space size="large">
                    <Space>
                        <Tooltip title="Trang trước">
                            <Button ghost size="small" icon={<LeftCircleOutlined />} disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)} />
                        </Tooltip>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-md">
                            <InputNumber 
                                min={1} max={numPages} 
                                value={pageNumber} 
                                onChange={val => val && setPageNumber(val)}
                                size="small"
                                className="w-12 bg-transparent text-white border-none text-center"
                                controls={false}
                            />
                            <span className="text-xs text-slate-400">/ {numPages || '--'}</span>
                        </div>
                        <Tooltip title="Trang sau">
                            <Button ghost size="small" icon={<RightCircleOutlined />} disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)} />
                        </Tooltip>
                    </Space>

                    <Divider type="vertical" className="bg-slate-700 h-6" />

                    <Space>
                        <Tooltip title="Thu nhỏ">
                            <Button ghost size="small" icon={<ZoomOutOutlined />} onClick={() => setScale(Math.max(0.5, scale - 0.25))} />
                        </Tooltip>
                        <span className="text-xs font-mono min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
                        <Tooltip title="Phóng to">
                            <Button ghost size="small" icon={<ZoomInOutlined />} onClick={() => setScale(Math.min(3, scale + 0.25))} />
                        </Tooltip>
                        <Tooltip title="Vừa chiều rộng">
                            <Button 
                                ghost 
                                size="small" 
                                icon={<ExpandOutlined />} 
                                className={isFitWidth ? "text-blue-400 border-blue-400" : ""}
                                onClick={() => setIsFitWidth(!isFitWidth)} 
                            />
                        </Tooltip>
                    </Space>
                </Space>

                <Space size="middle">
                    <Tooltip title="Xoay trang">
                        <Button ghost size="small" icon={<RotateRightOutlined />} onClick={() => setRotate((rotate + 90) % 360)} />
                    </Tooltip>

                    <Divider type="vertical" className="bg-slate-700 h-6" />

                    {/* Nút In & Tải về (Có kiểm tra quyền) */}
                    <Tooltip title={token ? "In tài liệu" : "Đăng nhập để in"}>
                        <Button 
                            ghost 
                            size="small" 
                            icon={<PrinterOutlined />} 
                            className={!token ? "opacity-30" : "hover:text-blue-400"}
                            onClick={handlePrint} 
                        />
                    </Tooltip>
                    
                    <Tooltip title={token ? "Tải PDF" : "Đăng nhập để tải"}>
                        <Button 
                            ghost 
                            size="small" 
                            icon={<DownloadOutlined />} 
                            className={!token ? "opacity-30" : "hover:text-green-400"}
                            onClick={handleDownload} 
                        />
                    </Tooltip>
                </Space>
            </div>

            {/* Vùng hiển thị tài liệu - Chế độ cuộn dọc liên tục */}
            <div className="flex-grow overflow-auto p-4 md:p-8 flex flex-col items-center bg-slate-800 custom-pdf-scroll-area">
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="flex flex-col items-center gap-4 py-20"><Spin size="large" /><span className="text-slate-400">Đang chuẩn bị tài liệu...</span></div>}
                    error={<div className="text-slate-400 p-10 bg-slate-900 rounded-xl border border-slate-700">Không thể hiển thị nội dung PDF vào lúc này.</div>}
                >
                    {numPages && Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="mb-6 last:mb-0 relative">
                            <Page 
                                pageNumber={index + 1} 
                                scale={scale} 
                                rotate={rotate}
                                width={isFitWidth ? (window.innerWidth < 768 ? window.innerWidth - 40 : 850) : undefined}
                                className="shadow-2xl border border-slate-700 transition-all duration-300"
                                renderAnnotationLayer={true}
                                renderTextLayer={true}
                                // Tự động cập nhật số trang khi cuộn đến (tùy chọn nâng cao)
                                onRenderSuccess={() => {
                                    // Logic này có thể bổ sung nếu cần đồng bộ số trang chính xác khi cuộn
                                }}
                            />
                            <div className="absolute -left-12 top-0 text-slate-500 text-xs font-mono hidden md:block">
                                P.{(index + 1).toString().padStart(2, '0')}
                            </div>
                        </div>
                    ))}
                </Document>
            </div>
            
            <style>{`
                .custom-pdf-scroll-area::-webkit-scrollbar { width: 10px; }
                .custom-pdf-scroll-area::-webkit-scrollbar-track { background: #0f172a; }
                .custom-pdf-scroll-area::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; border: 2px solid #0f172a; }
                .custom-pdf-scroll-area::-webkit-scrollbar-thumb:hover { background: #475569; }
                .react-pdf__Page__canvas { margin: 0 auto; }
            `}</style>
        </div>
    );
};

const DocumentDetail = () => {
    const { t } = useTranslation();
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
    const [checkingPdf, setCheckingPdf] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

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
        } catch (e) {}
        return authorsData;
    };
    
    // Hàm bổ trợ để lấy URL đầy đủ của file từ Backend
    const getFullFileUrl = (url, isDownload = false) => {
        if (!url) return "";
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        let finalUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        if (isDownload) {
            // Nếu là URL tuyệt đối từ Supabase Cloud
            if (url.startsWith('http')) {
                try {
                    // Trích xuất tên file gốc từ URL (bỏ phần prefix papers_xxxx_ hoặc datasets_xxxx_ chống trùng lặp)
                    const filename = url.split('/').pop().split('?')[0];
                    const parts = filename.split('_');
                    let cleanFilename = filename;
                    if (parts.length >= 3 && parts[1].length === 8) {
                        // Lấy các phần từ index 2 trở đi để lấy tên nguyên bản của file
                        cleanFilename = parts.slice(2).join('_');
                    }
                    // Truyền tham số download kèm tên file sạch cho Supabase CDN xử lý
                    finalUrl += (finalUrl.includes('?') ? '&' : '?') + `download=${encodeURIComponent(cleanFilename)}`;
                } catch (e) {
                    finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'download';
                }
            } else {
                // Nếu là local, tiếp tục dùng download=true theo thiết lập phục vụ file của Flask
                finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'download=true';
            }
        }
        return finalUrl;
    };

    const handleToggleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning("Vui lòng đăng nhập để lưu tài liệu!");
            return;
        }

        try {
            setSaving(true);
            const res = await api.post('/client/saved/toggle', {
                resource_id: id,
                resource_type: doc.doc_type
            });
            setIsSaved(res.data.saved);
            message.success(res.data.saved ? "Đã lưu vào danh sách đọc sau" : "Đã xóa khỏi danh sách lưu");
        } catch (error) {
            message.error("Không thể thực hiện tác vụ này");
        } finally {
            setSaving(false);
        }
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
                // 1. Lấy chi tiết tài liệu - Kiểm tra xem đã tăng view trong session này chưa
                const viewedDocs = JSON.parse(sessionStorage.getItem('viewed_docs') || '[]');
                const shouldIncreaseView = !viewedDocs.includes(id);
                
                const response = await api.get(`/public/documents/${id}?increase_view=${shouldIncreaseView}`);
                const documentData = response.data.document;
                setDoc(documentData);

                if (shouldIncreaseView) {
                    sessionStorage.setItem('viewed_docs', JSON.stringify([...viewedDocs, id]));
                }

                // 2. Lưu vào lịch sử đã xem (localStorage) - Lưu đầy đủ thông tin để Card hiển thị đẹp
                const savedHistory = JSON.parse(localStorage.getItem('view_history')) || [];
                const historyItem = { 
                    id: documentData.id, 
                    title: documentData.title, 
                    category_name: documentData.category_name, 
                    doc_type: documentData.doc_type,
                    authors: documentData.authors,
                    description: documentData.description,
                    view_count: documentData.view_count,
                    publication_year: documentData.publication_year,
                    created_at: documentData.created_at
                };

                const updatedHistory = [
                    historyItem,
                    ...savedHistory.filter(item => item.id !== documentData.id)
                ].slice(0, 10); // Giữ lại 10 bài gần nhất
                
                localStorage.setItem('view_history', JSON.stringify(updatedHistory));
                setHistoryDocs(updatedHistory.filter(item => item.id !== documentData.id).slice(0, 8)); // Lấy 8 bài cho grid 4x2

                // 3. Lấy tài liệu liên quan (cùng category) - Lấy nhiều hơn (limit=9) để lọc bài hiện tại
                const relatedRes = await api.get(`/public/documents?type=${documentData.doc_type}&limit=9`);
                setRelatedDocs(relatedRes.data.documents.filter(d => d.id !== documentData.id).slice(0, 8));

                // 4. Kiểm tra trạng thái lưu
                const token = localStorage.getItem('token');
                if (token) {
                    const savedRes = await api.get(`/client/saved/${id}/check?type=${documentData.doc_type}`);
                    setIsSaved(savedRes.data.is_saved);
                }

            } catch (error) {
                console.error("Fetch detail error:", error);
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
                        <Breadcrumb className="mb-6 opacity-80 text-xs sm:text-sm" separator={<span className="text-white/50">/</span>}>
                            <Breadcrumb.Item href="/" className="text-white hover:text-blue-200">{t('document_detail.breadcrumb_home')}</Breadcrumb.Item>
                            <Breadcrumb.Item className="text-white hover:text-blue-200">{doc.category_name}</Breadcrumb.Item>
                            <Breadcrumb.Item className="hidden sm:inline-block truncate max-w-[200px] text-white/50">{doc.title}</Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="mb-5 flex flex-wrap gap-3">
                            <Tag className={`text-sm px-4 py-1.5 flex items-center gap-2 border-0 rounded-full font-medium ${isPaper ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'} shadow-md`}>
                                {isPaper ? <FilePdfOutlined /> : <DatabaseOutlined />}
                                {isPaper ? t('document_detail.type_paper') : t('document_detail.type_dataset')}
                            </Tag>
                            <Tag className="text-sm px-4 py-1.5 border-0 bg-white/20 text-white rounded-full backdrop-blur-sm">
                                {doc.category_name}
                            </Tag>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight max-w-5xl tracking-tight text-white drop-shadow-md">
                            {doc.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 md:gap-6 text-blue-100 text-sm md:text-base">
                            <span className="flex items-center bg-black/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-sm">
                                <UserOutlined className="mr-2 opacity-70" />
                                <span className="font-medium">{formatAuthors(doc.authors)}</span>
                            </span>
                            <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                                <span className="flex items-center">
                                    <CalendarOutlined className="mr-2 opacity-70" /> {doc.created_at}
                                </span>
                                <span className="flex items-center">
                                    <EyeOutlined className="mr-2 opacity-70" /> {doc.view_count || 0} {t('document_detail.views')}
                                </span>
                                <Divider type="vertical" className="bg-white/30 h-4 hidden md:block" />
                                <Button 
                                    type="text" 
                                    className="text-white hover:bg-white/10 flex items-center gap-2 p-0 h-auto"
                                    onClick={handleToggleSave}
                                    loading={saving}
                                >
                                    {isSaved ? <StarFilled className="text-yellow-400" /> : <StarOutlined />}
                                    <span className="font-medium">{isSaved ? t('document_detail.saved_short') : t('document_detail.save_short')}</span>
                                </Button>
                            </div>
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
                                        <DatabaseOutlined /> {t('document_detail.pub_details')}
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
                                    {t('document_detail.abstract')}
                                </Title>
                                <div className="text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line bg-gray-50 p-6 border-l-4 border-blue-500 rounded-r-xl italic">
                                    {doc.description || t('document_detail.no_abstract')}
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
                                                    message.success(t('document_detail.copy_success'));
                                                }}
                                            >
                                                {t('document_detail.copy')}
                                            </Button>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 font-mono text-sm text-gray-600 relative group">
                                            {doc.citation}
                                        </div>
                                    </div>
                                )}



                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="mt-10 pt-8 border-t border-gray-100">
                                        <Title level={5} className="text-gray-500 mb-4 text-sm uppercase tracking-wider">{t('document_detail.related_tags')}</Title>
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
                                        <Title level={4} className="m-0 text-gray-800">{t('document_detail.attachments')}</Title>
                                        <p className="text-gray-500 mt-2 text-sm leading-tight">{t('document_detail.access_full')}</p>
                                    </div>

                                    <div className="p-6 flex flex-col gap-4">
                                        {/* Nút Save/Bookmark nổi bật hơn ở sidebar */}
                                        <Button
                                            size="large"
                                            icon={isSaved ? <StarFilled /> : <StarOutlined />}
                                            onClick={handleToggleSave}
                                            loading={saving}
                                            className={`w-full h-12 rounded-xl font-bold transition-all ${isSaved ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
                                        >
                                            {isSaved ? t('document_detail.saved_btn') : t('document_detail.save_btn')}
                                        </Button>

                                        {/* Nút Tải File PDF / ZIP */}
                                        {doc.file_url ? (
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<DownloadOutlined className="text-lg" />}
                                                className={`w-full h-14 text-base font-medium border-0 shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${isPaper ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'} text-white`}
                                                onClick={handleDownloadClick}
                                            >
                                                {isPaper ? t('document_detail.download_pdf') : t('document_detail.download_zip')}
                                            </Button>

                                        ) : (
                                            <Button size="large" disabled className="w-full h-14 bg-gray-50 font-medium">{t('document_detail.no_file')}</Button>
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
                                                {t('document_detail.search_doi')}
                                            </Button>
                                        )}

                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>{t('document_detail.identifier')}</span>
                                                <span className="font-mono text-gray-800 bg-gray-200 px-2 py-0.5 rounded shadow-sm">#{String(doc.id).substring(0, 8)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>{t('document_detail.status')}</span>
                                                <span className="text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t('document_detail.approved')}</span>
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
                                                <Title level={5} className="m-0 text-gray-800">{t('document_detail.ai_assistant')}</Title>
                                                <p className="text-gray-500 text-xs m-0">{t('document_detail.ai_subtitle')}</p>
                                            </div>
                                        </div>

                                        {isAiLoading ? (
                                            <div className="space-y-4 py-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <SyncOutlined spin className="text-indigo-500" />
                                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{t('document_detail.ai_analyzing')}</span>
                                                </div>
                                            </div>
                                        ) : !aiSummary ? (
                                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-50 text-center">
                                                <p className="text-gray-600 text-sm mb-4">{t('document_detail.ai_prompt')}</p>
                                                <Button
                                                    type="primary"
                                                    block
                                                    size="middle"
                                                    icon={<ThunderboltOutlined />}
                                                    onClick={handleGenerateAiSummary}
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-md hover:shadow-lg transition-all font-medium h-10"
                                                >
                                                    {t('document_detail.ai_btn')}
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
                                                    {t('document_detail.ai_regen')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>

                    {/* PDF READER SECTION */}
                    {isPaper && (
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                                    <Title level={3} className="m-0 text-gray-800">{t('document_detail.read_direct')}</Title>
                                </div>
                                <div className="flex gap-2">
                                    {showPdf && (
                                        <Button 
                                            icon={<FullscreenOutlined />}
                                            onClick={() => setIsFullScreen(true)}
                                            className="hidden md:flex items-center"
                                        >
                                            {t('document_detail.full_view')}
                                        </Button>
                                    )}
                                    <Button 
                                        type={showPdf ? "default" : "primary"}
                                        icon={checkingPdf ? <SyncOutlined spin /> : <FilePdfOutlined />}
                                        loading={checkingPdf}
                                        onClick={handleTogglePdf}
                                        className={showPdf ? "" : "bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 shadow-md"}
                                    >
                                        {showPdf ? t('document_detail.close_reader') : t('document_detail.open_reader')}
                                    </Button>
                                </div>
                            </div>

                            {!doc.file_url ? (
                                <div className="bg-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                                    <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                        <FilePdfOutlined />
                                    </div>
                                    <Title level={4} className="text-gray-800 mb-2">{t('document_detail.file_not_found')}</Title>
                                    <Paragraph className="text-gray-500 max-w-md mx-auto mb-8">
                                        {t('document_detail.file_not_found_desc')}
                                    </Paragraph>
                                    <Space size="middle">
                                        <Button 
                                            icon={<DownloadOutlined />} 
                                            onClick={handleDownloadClick}
                                            className="h-11 px-6 rounded-lg font-medium"
                                        >
                                            {t('document_detail.try_download')}
                                        </Button>
                                        <Button 
                                            type="primary" 
                                            danger
                                            ghost
                                            className="h-11 px-6 rounded-lg font-medium"
                                        >
                                            {t('document_detail.report_error')}
                                        </Button>
                                    </Space>
                                </div>
                            ) : showPdf ? (
                                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white h-[600px] md:h-[900px] relative">
                                     <CustomPDFReader fileUrl={getFullFileUrl(doc.file_url)} />
                                 </div>
                            ) : (
                                <div 
                                    onClick={handleTogglePdf}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-12 text-center cursor-pointer hover:shadow-xl transition-all group overflow-hidden relative border border-blue-100"
                                >
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <FilePdfOutlined className="text-[150px] md:text-[300px] -rotate-12 translate-x-1/2 text-blue-200" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                            <FilePdfOutlined />
                                        </div>
                                        <Title level={4} className="text-gray-800 mb-2 text-lg md:text-xl">{t('document_detail.preview_title')}</Title>
                                        <Paragraph className="text-gray-500 max-w-md mx-auto text-sm md:text-base">{t('document_detail.preview_desc')}</Paragraph>
                                        <Button className="mt-6 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-all rounded-full px-8">{t('document_detail.preview_btn')}</Button>
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
                                    <Title level={3} className="m-0 text-gray-800">{t('document_detail.related_docs')}</Title>
                                </div>
                                <Row gutter={[20, 20]}>
                                    {relatedDocs.map(item => (
                                        <Col xs={24} sm={12} md={6} key={item.id}>
                                            <DocCard doc={item} onClick={() => navigate(`/document/${item.id}`)} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {historyDocs.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-8 bg-gray-400 rounded-full"></div>
                                    <Title level={3} className="m-0 text-gray-800">{t('document_detail.view_history')}</Title>
                                </div>
                                <Row gutter={[20, 20]}>
                                    {historyDocs.map(item => (
                                        <Col xs={24} sm={12} md={6} key={item.id}>
                                            <DocCard doc={item} onClick={() => navigate(`/document/${item.id}`)} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </div>
                </div>
            </Content>

            {/* FULL SCREEN PDF MODAL */}
            <Modal
                open={isFullScreen}
                onCancel={() => setIsFullScreen(false)}
                footer={null}
                width="100vw"
                centered
                className="full-screen-pdf-modal"
                styles={{ 
                    body: { padding: 0, height: '100vh', overflow: 'hidden' },
                    mask: { background: '#000' }
                }}
                closeIcon={<div className="bg-white/20 backdrop-blur shadow-md p-2 rounded-full hover:bg-white/40 transition-all text-white"><FullscreenExitOutlined className="text-xl" /></div>}
            >
                {doc && doc.file_url && (
                    <CustomPDFReader fileUrl={getFullFileUrl(doc.file_url)} isFullScreen={true} />
                )}
            </Modal>

            <AppFooter />
        </Layout>
    );
};

export default DocumentDetail;