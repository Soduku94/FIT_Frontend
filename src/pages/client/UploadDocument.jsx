import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Select, Button, Upload, message, Typography, Card, Row, Col } from 'antd';
import { InboxOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const UploadDocument = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]); // State chứa danh sách chuyên mục
    const navigate = useNavigate();

    // Gọi API lấy danh sách chuyên mục khi vừa mở trang
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/public/categories');
                setCategories(response.data.categories);
            } catch (error) {
                message.error("Không tải được danh sách chuyên ngành!");
            }
        };
        fetchCategories();
    }, []);

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            const isAllowed = file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx');
            if (!isAllowed) {
                message.error('Chỉ được phép tải lên file PDF hoặc Word!');
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
    };

    const onFinish = async (values) => {
        if (fileList.length === 0) {
            message.error('Vui lòng đính kèm file tài liệu ở phía dưới!');
            return;
        }

        const formData = new FormData();
        formData.append('title', values.title);

        // Xử lý authors thành chuỗi JSON (Vì Backend đang ép kiểu ::JSONB)
        formData.append('authors', JSON.stringify([values.authors]));

        formData.append('doc_type', values.doc_type);
        formData.append('category_id', values.category_id); // Bây giờ lấy ID chuẩn từ Dropdown
        formData.append('description', values.description || '');
        formData.append('file', fileList[0]);

        setLoading(true);
        try {
            const response = await api.post('/auth/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success(response.data.message);
            navigate('/profile');
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi khi tải lên!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} className="mb-4 pl-0 text-gray-500 hover:text-blue-600">
                    Trở về Trang chủ
                </Button>

                <Card className="shadow-lg rounded-xl border-0">
                    <div className="text-center mb-8 border-b pb-6">
                        <Title level={2} className="m-0 text-gray-800">Tải lên Tài liệu</Title>
                        <Text className="text-gray-500">Đóng góp bài báo khoa học hoặc Dataset vào kho lưu trữ</Text>
                    </div>

                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item name="title" label={<span className="font-medium">Tiêu đề tài liệu</span>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                                    <Input size="large" placeholder="Ví dụ: Ứng dụng AI..." />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="authors" label={<span className="font-medium">Tên tác giả</span>} rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>
                                    <Input size="large" placeholder="Nguyễn Văn A, Trần Thị B..." />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item name="doc_type" label={<span className="font-medium">Loại tài liệu</span>} rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu!' }]}>
                                    <Select size="large" placeholder="-- Chọn loại --">
                                        <Option value="paper">Bài báo khoa học (Paper)</Option>
                                        <Option value="dataset">Bộ dữ liệu (Dataset)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            {/* === ĐÃ SỬA CHỖ NÀY THÀNH DROPDOWN === */}
                            <Col xs={24} md={12}>
                                <Form.Item name="category_id" label={<span className="font-medium">Chuyên ngành</span>} rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}>
                                    <Select size="large" placeholder="-- Chọn chuyên ngành --" loading={categories.length === 0}>
                                        {categories.map(cat => (
                                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label={<span className="font-medium">Tóm tắt (Abstract)</span>}>
                            <TextArea rows={5} placeholder="Nhập đoạn tóm tắt nội dung tài liệu..." />
                        </Form.Item>

                        <Form.Item label={<span className="font-medium text-lg">Đính kèm File PDF/DOC</span>} className="mt-8">
                            <Dragger {...uploadProps} className="bg-blue-50 border-blue-200 hover:border-blue-500 transition-colors">
                                <p className="ant-upload-drag-icon text-blue-500">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text text-lg font-medium text-gray-700">Kéo thả file vào đây hoặc nhấp để chọn</p>
                                <p className="ant-upload-hint text-gray-500">Hỗ trợ định dạng .pdf, .doc, .docx. Dung lượng tối đa 50MB.</p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item className="mb-0 text-center mt-10">
                            <Button type="primary" htmlType="submit" size="large" icon={<UploadOutlined />} loading={loading} className="bg-blue-600 px-12 h-12 text-lg rounded-lg shadow-md hover:shadow-lg">
                                Gửi Xét Duyệt
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default UploadDocument;