import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Card, Tag, Popconfirm, Modal, Input, Row, Col, Descriptions, Divider } from 'antd';
import { CheckOutlined, CloseOutlined, FilePdfOutlined, DatabaseOutlined, EyeOutlined, UserOutlined, CalendarOutlined, GlobalOutlined, GithubOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const DocumentApproval = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho Modal Từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 1. HÀM LẤY DANH SÁCH BÀI CHỜ DUYỆT
    const fetchPendingDocs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/documents?status=pending');
            setDocuments(response.data.documents);
        } catch (error) {
            message.error('Không thể tải danh sách tài liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDocs();
    }, []);

    // 2. HÀM XỬ LÝ DUYỆT BÀI
    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/documents/${id}/review`, { status: 'approved' });
            message.success('Đã duyệt tài liệu thành công!');
            setDocuments(documents.filter(doc => doc.id !== id));
            if (isPreviewModalOpen) setIsPreviewModalOpen(false);
        } catch (error) {
            message.error('Có lỗi xảy ra khi phê duyệt!');
        }
    };

    // 3. CÁC HÀM XỬ LÝ TỪ CHỐI BÀI
    const openRejectModal = (doc) => {
        setSelectedDoc(doc);
        setRejectReason("");
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            message.warning("Vui lòng nhập lý do từ chối!");
            return;
        }

        setSubmitting(true);
        try {
            await api.put(`/admin/documents/${selectedDoc.id}/review`, {
                status: 'rejected',
                reject_reason: rejectReason
            });
            message.success('Đã từ chối tài liệu và gửi phản hồi!');
            setIsRejectModalOpen(false);
            setIsPreviewModalOpen(false);
            setDocuments(documents.filter(doc => doc.id !== selectedDoc.id));
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối!');
        } finally {
            setSubmitting(false);
        }
    };

    const openPreviewModal = (doc) => {
        setSelectedDoc(doc);
        setIsPreviewModalOpen(true);
    };

    const getFullFileUrl = (url) => {
        if (!url) return "";
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // 4. CẤU HÌNH CỘT CHO BẢNG
    const columns = [
        { title: 'STT', key: 'index', width: 60, align: 'center', render: (_, __, index) => index + 1 },
        {
            title: 'Tên Tài liệu',
            dataIndex: 'title',
            key: 'title',
            render: text => <span className="font-semibold text-blue-700">{text}</span>
        },
        {
            title: 'Loại',
            dataIndex: 'doc_type',
            key: 'doc_type',
            align: 'center',
            render: (type) => (
                type === 'paper'
                    ? <Tag icon={<FilePdfOutlined />} color="red">Bài báo</Tag>
                    : <Tag icon={<DatabaseOutlined />} color="purple">Dataset</Tag>
            )
        },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Chuyên ngành', dataIndex: 'category', key: 'category', render: cat => <Tag color="blue">{cat}</Tag> },
        { title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at' },
        {
            title: 'Hành động',
            key: 'action',
            width: 280,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    {/* Nút Xem trước */}
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => openPreviewModal(record)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        Xem trước
                    </Button>

                    {/* Nút Duyệt */}
                    <Popconfirm
                        title="Duyệt tài liệu này?"
                        description="Tài liệu sẽ được hiển thị công khai."
                        onConfirm={() => handleApprove(record.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" className="bg-green-600 hover:bg-green-500" icon={<CheckOutlined />}>Duyệt</Button>
                    </Popconfirm>

                    {/* Nút Từ chối */}
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => openRejectModal(record)}
                    >
                        Từ chối
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <Title level={3} className="m-0 text-gray-800">Duyệt Tài liệu</Title>
                <p className="text-gray-500 mt-1">Danh sách các bài báo & bộ dữ liệu đang chờ xét duyệt</p>
            </div>

            <Card className="shadow-sm rounded-lg overflow-hidden border-gray-200">
                <Table
                    columns={columns}
                    dataSource={documents}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                    locale={{ emptyText: 'Tuyệt vời! Không có tài liệu nào đang chờ duyệt.' }}
                />
            </Card>

            {/* MODAL XEM TRƯỚC TÀI LIỆU (CHIỀU RỘNG LỚN) */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <EyeOutlined className="text-blue-500" />
                        <span>Xem trước: {selectedDoc?.title}</span>
                        <Tag color={selectedDoc?.doc_type === 'paper' ? 'red' : 'purple'} className="ml-2">
                            {selectedDoc?.doc_type === 'paper' ? 'BÀI BÁO' : 'DATASET'}
                        </Tag>
                    </div>
                }
                open={isPreviewModalOpen}
                onCancel={() => setIsPreviewModalOpen(false)}
                width="95%"
                style={{ top: 20 }}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>Đóng</Button>,
                    <Button 
                        key="reject" 
                        danger 
                        icon={<CloseOutlined />} 
                        onClick={() => openRejectModal(selectedDoc)}
                    >
                        Từ chối
                    </Button>,
                    <Button 
                        key="approve" 
                        type="primary" 
                        className="bg-green-600 hover:bg-green-500" 
                        icon={<CheckOutlined />}
                        onClick={() => handleApprove(selectedDoc?.id)}
                    >
                        Duyệt tài liệu
                    </Button>
                ]}
            >
                <Row gutter={[24, 24]}>
                    {/* Cột trái: Thông tin chi tiết */}
                    <Col xs={24} lg={8}>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            <Title level={4} className="mb-4 text-blue-800">Thông tin chi tiết</Title>
                            
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Tiêu đề">{selectedDoc?.title}</Descriptions.Item>
                                <Descriptions.Item label="Tác giả">{selectedDoc?.author}</Descriptions.Item>
                                <Descriptions.Item label="Chuyên ngành">{selectedDoc?.category}</Descriptions.Item>
                                <Descriptions.Item label="Ngày gửi">{selectedDoc?.created_at}</Descriptions.Item>
                                {selectedDoc?.doc_type === 'paper' ? (
                                    <>
                                        <Descriptions.Item label="Năm XB">{selectedDoc?.publication_year || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Tạp chí">{selectedDoc?.journal_name || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="DOI">{selectedDoc?.doi || 'N/A'}</Descriptions.Item>
                                    </>
                                ) : (
                                    <>
                                        <Descriptions.Item label="Định dạng">{selectedDoc?.data_format || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Dung lượng">{selectedDoc?.file_size || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Giấy phép">{selectedDoc?.license_type || 'N/A'}</Descriptions.Item>
                                    </>
                                )}
                            </Descriptions>

                            <Divider orientation="left">Tóm tắt / Mô tả</Divider>
                            <Paragraph className="text-gray-600 italic bg-white p-4 rounded border border-dashed">
                                {selectedDoc?.description || "Không có nội dung mô tả."}
                            </Paragraph>

                            {selectedDoc?.github_url && (
                                <div className="mt-4">
                                    <Button icon={<GithubOutlined />} block onClick={() => window.open(selectedDoc.github_url, '_blank')}>
                                        Xem trên GitHub
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Cột phải: Xem nội dung File */}
                    <Col xs={24} lg={16}>
                        <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-700" style={{ height: 'calc(100vh - 250px)' }}>
                            {selectedDoc?.file_url ? (
                                selectedDoc.doc_type === 'paper' ? (
                                    <iframe 
                                        src={getFullFileUrl(selectedDoc.file_url)} 
                                        width="100%" 
                                        height="100%" 
                                        title="PDF Preview"
                                        className="border-none"
                                    />
                                ) : (
                                    <div className="text-center p-10 text-slate-300">
                                        <DatabaseOutlined style={{ fontSize: 64, marginBottom: 20, color: '#8B5CF6' }} />
                                        <Title level={3} className="text-white">Dữ liệu Dataset</Title>
                                        <p>Loại tệp: {selectedDoc.data_format || 'N/A'}</p>
                                        <p>Kích thước: {selectedDoc.file_size || 'N/A'}</p>
                                        <Button 
                                            type="primary" 
                                            icon={<GlobalOutlined />} 
                                            className="mt-4 bg-purple-600 border-none"
                                            onClick={() => window.open(getFullFileUrl(selectedDoc.file_url), '_blank')}
                                        >
                                            Kiểm tra Link / Tải về
                                        </Button>
                                    </div>
                                )
                            ) : (
                                <div className="text-center p-10 text-slate-400">
                                    <FilePdfOutlined style={{ fontSize: 64, marginBottom: 20 }} />
                                    <p>Tài liệu này không có file đính kèm hoặc lỗi đường dẫn.</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal>

            {/* MODAL NHẬP LÝ DO TỪ CHỐI */}
            <Modal
                title={<div><CloseOutlined className="text-red-500 mr-2"/> Từ chối Tài liệu</div>}
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onOk={handleRejectSubmit}
                okText="Xác nhận Từ chối"
                cancelText="Hủy bỏ"
                okButtonProps={{ danger: true, loading: submitting }}
                zIndex={2000} // Cao hơn Preview Modal nếu mở đè lên
            >
                <div className="mb-4">
                    Bạn đang từ chối tài liệu: <span className="font-semibold text-blue-600">{selectedDoc?.title}</span>
                </div>
                <div className="mb-2 font-medium">Lý do từ chối (Bắt buộc):</div>
                <TextArea
                    rows={4}
                    placeholder="Ví dụ: File PDF bị lỗi font, Link github bị hỏng, Cần bổ sung thêm ảnh..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default DocumentApproval;