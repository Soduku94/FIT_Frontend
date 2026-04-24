import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Card, Tag, Popconfirm, Modal, Input } from 'antd';
import { CheckOutlined, CloseOutlined, FilePdfOutlined, DatabaseOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const DocumentApproval = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho Modal Từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 1. HÀM LẤY DANH SÁCH BÀI CHỜ DUYỆT (Đã cập nhật đường dẫn API mới)
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

    // 2. HÀM XỬ LÝ DUYỆT BÀI (Chỉ dùng cho Approved)
    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/documents/${id}/review`, { status: 'approved' });
            message.success('Đã duyệt tài liệu thành công!');
            setDocuments(documents.filter(doc => doc.id !== id)); // Cập nhật UI
        } catch (error) {
            message.error('Có lỗi xảy ra khi phê duyệt!');
        }
    };

    // 3. CÁC HÀM XỬ LÝ TỪ CHỐI BÀI (Mở modal & Gửi lý do)
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
            setDocuments(documents.filter(doc => doc.id !== selectedDoc.id)); // Cập nhật UI
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối!');
        } finally {
            setSubmitting(false);
        }
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
            title: 'Loại', // Cột mới để phân biệt Paper và Dataset
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
            width: 220,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {/* Nút Duyệt (Vẫn dùng Popconfirm cho nhanh) */}
                    <Popconfirm
                        title="Duyệt tài liệu này?"
                        description="Tài liệu sẽ được hiển thị công khai."
                        onConfirm={() => handleApprove(record.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" className="bg-green-600 hover:bg-green-500" icon={<CheckOutlined />}>Duyệt</Button>
                    </Popconfirm>

                    {/* Nút Từ chối (Bấm vào sẽ mở Modal nhập lý do) */}
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

            {/* MODAL NHẬP LÝ DO TỪ CHỐI */}
            <Modal
                title={<div><CloseOutlined className="text-red-500 mr-2"/> Từ chối Tài liệu</div>}
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onOk={handleRejectSubmit}
                okText="Xác nhận Từ chối"
                cancelText="Hủy bỏ"
                okButtonProps={{ danger: true, loading: submitting }}
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