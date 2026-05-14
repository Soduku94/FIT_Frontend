import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Card, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    // 1. Hàm gọi API lấy danh sách
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data.categories);
        } catch (error) {
            message.error('Không thể tải danh sách danh mục!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Xử lý mở Modal
    const openModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description
            });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // 3. Xử lý Lưu (Thêm mới hoặc Cập nhật)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            
            if (editingCategory) {
                // Cập nhật
                await api.put(`/admin/categories/${editingCategory.id}`, values);
                message.success('Cập nhật danh mục thành công!');
            } else {
                // Thêm mới
                await api.post('/admin/categories', values);
                message.success('Thêm danh mục mới thành công!');
            }
            
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            if (error.name !== 'ValidationError') {
                message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu!');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // 4. Xử lý Xóa (Có kiểm tra ràng buộc)
    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/categories/${id}`);
            message.success('Đã xóa danh mục thành công!');
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "";
            // Kiểm tra lỗi ràng buộc khóa ngoại (thường trả về 400 hoặc 409 hoặc message chứa "foreign key")
            if (error.response?.status === 400 || error.response?.status === 409 || errorMsg.toLowerCase().includes("foreign key")) {
                Modal.warning({
                    title: 'Không thể xóa danh mục',
                    icon: <InfoCircleOutlined style={{ color: '#faad14' }} />,
                    content: 'Danh mục này hiện đang có các tài liệu hoặc bài viết liên kết. Để đảm bảo an toàn dữ liệu, bạn cần chuyển hoặc xóa các tài liệu này trước khi xóa danh mục.',
                    okText: 'Đã hiểu',
                });
            } else {
                message.error('Có lỗi xảy ra khi xóa danh mục!');
            }
        }
    };

    // 5. Cấu hình cột
    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên Danh Mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-semibold text-blue-700">{text}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="text" 
                        className="text-blue-500" 
                        icon={<EditOutlined />} 
                        onClick={() => openModal(record)}
                    />
                    <Popconfirm
                        title="Xóa danh mục này?"
                        description="Hành động này không thể hoàn tác."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={3} className="m-0 text-gray-800">Quản lý Danh mục</Title>
                    <p className="text-gray-500 mt-1">Xem và quản lý các chuyên ngành tài liệu</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    className="bg-blue-600 h-10 px-4"
                    onClick={() => openModal()}
                >
                    Thêm Danh mục
                </Button>
            </div>

            <Card className="shadow-sm rounded-lg overflow-hidden border-gray-200">
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* MODAL THÊM / SỬA DANH MỤC */}
            <Modal
                title={editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                confirmLoading={submitting}
                okText={editingCategory ? "Lưu thay đổi" : "Thêm mới"}
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Ví dụ: Trí tuệ nhân tạo, Khoa học dữ liệu..." />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <TextArea rows={4} placeholder="Mô tả ngắn gọn về danh mục này..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;