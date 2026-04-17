import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Card, Tag, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;

const DocumentApproval = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm lấy danh sách bài chờ duyệt
    const fetchPendingDocs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/documents/pending');
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

    // Hàm xử lý khi bấm Duyệt hoặc Từ chối
    const handleReview = async (id, status) => {
        try {
            await api.put(`/admin/documents/${id}/review`, { status: status });

            message.success(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} tài liệu!`);

            // Xóa bài đó khỏi danh sách trên màn hình để không phải gọi lại API fetch quá nhiều
            setDocuments(documents.filter(doc => doc.id !== id));

        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    // Cấu hình các cột của bảng
    const columns = [
        { title: 'STT', key: 'index', width: 60, align: 'center', render: (text, record, index) => index + 1 },
        { title: 'Tên Tài liệu', dataIndex: 'title', key: 'title', render: text => <span className="font-semibold text-blue-700">{text}</span> },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Chuyên ngành', dataIndex: 'category', key: 'category', render: cat => <Tag color="blue">{cat}</Tag> },
        { title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at' },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {/* Nút Duyệt - Màu xanh */}
                    <Popconfirm
                        title="Duyệt bài báo này?"
                        description="Bài báo sẽ được công khai trên hệ thống."
                        onConfirm={() => handleReview(record.id, 'approved')}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" className="bg-green-600" icon={<CheckOutlined />}>Duyệt</Button>
                    </Popconfirm>

                    {/* Nút Từ chối - Màu đỏ */}
                    <Popconfirm
                        title="Từ chối bài báo này?"
                        description="Bài báo sẽ bị trả lại."
                        onConfirm={() => handleReview(record.id, 'rejected')}
                        okText="Từ chối"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<CloseOutlined />}>Từ chối</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <Title level={3} className="m-0 text-gray-800">Duyệt Tài liệu</Title>
                <p className="text-gray-500 mt-1">Danh sách các bài báo đang chờ Quản trị viên xét duyệt</p>
            </div>

            <Card className="shadow-sm rounded-lg overflow-hidden border-gray-200">
                <Table
                    columns={columns}
                    dataSource={documents}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                    locale={{ emptyText: 'Hiện tại không có tài liệu nào cần duyệt.' }}
                />
            </Card>
        </div>
    );
};

export default DocumentApproval;