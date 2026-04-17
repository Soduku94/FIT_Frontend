import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api'; // Import đường ống Axios của chúng ta

const { Title } = Typography;

const CategoryManagement = () => {
    // Biến lưu trữ danh sách danh mục
    const [categories, setCategories] = useState([]);
    // Biến trạng thái loading (xoay xoay) khi đang gọi API
    const [loading, setLoading] = useState(false);

    // 1. Hàm gọi API lấy danh sách từ Backend
    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Gọi API GET /categories (API public mà chúng ta đã làm ở Backend)
            const response = await api.get('/admin/categories');

            // Đổ dữ liệu vào biến categories
            setCategories(response.data.categories);
        } catch (error) {
            message.error('Không thể tải danh sách danh mục!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Tự động chạy hàm fetchCategories ngay khi mở trang
    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. Cấu hình các cột cho Bảng (Table)
    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (text, record, index) => index + 1, // Tự động đánh số thứ tự
        },
        {
            title: 'Tên Danh Mục',
            dataIndex: 'name', // Khớp với trường 'name' trong DB
            key: 'name',
            render: (text) => <span className="font-semibold text-blue-700">{text}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    {/* Tạm thời chỉ hiển thị nút, chức năng Thêm/Sửa/Xóa ta sẽ làm sau nếu cần */}
                    <Button type="text" className="text-blue-500" icon={<EditOutlined />} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <div className="animate-fade-in"> {/* Hiệu ứng mờ dần hiện ra của Tailwind (tuỳ chọn) */}
            {/* Tiêu đề và Nút Thêm mới */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={3} className="m-0 text-gray-800">Quản lý Danh mục</Title>
                    <p className="text-gray-500 mt-1">Xem và quản lý các chuyên ngành tài liệu</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 h-10 px-4">
                    Thêm Danh mục
                </Button>
            </div>

            {/* Bảng dữ liệu */}
            <Card className="shadow-sm rounded-lg overflow-hidden border-gray-200">
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id" // Báo cho Antd biết cột nào là ID duy nhất
                    loading={loading} // Hiển thị vòng xoay nếu đang gọi API
                    pagination={{ pageSize: 5 }} // Mỗi trang hiển thị 5 dòng
                />
            </Card>
        </div>
    );
};

export default CategoryManagement;