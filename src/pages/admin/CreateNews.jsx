import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Typography, message, Space, Switch } from 'antd';
import { SendOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateNews = () => {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cấu hình thanh công cụ cho khung soạn thảo
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const onFinish = async (values) => {
        if (!content || content === '<p><br></p>') {
            message.error("Vui lòng nhập nội dung bài viết!");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: values.title,
                category: values.category,
                thumbnail_url: values.thumbnail_url,
                content: content,
                publish: values.publish || false // True = Đăng luôn, False = Lưu nháp
            };

            await api.post('/editor/news', payload);

            message.success(values.publish ? "Đã xuất bản bài viết thành công!" : "Đã lưu nháp bài viết!");
            navigate('/about'); // Đăng xong thì nhảy ra trang Về khoa xem kết quả luôn
        } catch (error) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu bài viết!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    className="mb-4 pl-0 text-gray-500 hover:text-blue-600 font-medium"
                >
                    Quay lại
                </Button>

                <Card className="shadow-md rounded-2xl border-0 overflow-hidden">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                         <Title level={3} className="m-0 text-gray-800">Soạn thảo Bài viết mới</Title>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ category: 'Tin tức', publish: true }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Cột trái: Thông tin cơ bản */}
                            <div className="lg:col-span-3">
                                <Form.Item
                                    name="title"
                                    label={<Text strong>Tiêu đề bài viết</Text>}
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                >
                                    <Input placeholder="Ví dụ: Sinh viên khoa CNTT đạt giải Nhất Hackathon..." size="large" />
                                </Form.Item>

                                <Form.Item label={<Text strong>Nội dung bài viết</Text>} required>
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={modules}
                                            className="h-[600px] pb-10" // Tăng không gian biên tập
                                            placeholder="Bắt đầu viết nội dung tại đây..."
                                        />
                                    </div>
                                </Form.Item>
                            </div>

                            {/* Cột phải: Cài đặt bài viết */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
                                <Title level={5} className="mb-4 text-gray-700">Thiết lập đăng bài</Title>
                                
                                <Form.Item
                                    name="category"
                                    label={<Text strong className="text-gray-600">Chuyên mục</Text>}
                                >
                                    <Select size="large" className="w-full">
                                        <Option value="Tin tức">📰 Tin tức chung</Option>
                                        <Option value="Sự kiện">📅 Sự kiện khoa</Option>
                                        <Option value="Giải thưởng">🏆 Thành tích</Option>
                                        <Option value="Đồ án">💻 Đồ án</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="thumbnail_url"
                                    label={<Text strong className="text-gray-600">Ảnh bìa (URL)</Text>}
                                    extra="Dán link ảnh bìa hiển thị"
                                >
                                    <Input placeholder="https://..." size="large" allowClear />
                                </Form.Item>

                                <Form.Item
                                    name="publish"
                                    valuePropName="checked"
                                    className="mb-8"
                                >
                                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mt-2">
                                        <Text strong className="text-blue-800">Xuất bản ngay?</Text>
                                        <Switch defaultChecked />
                                    </div>
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SendOutlined />}
                                    block
                                    size="large"
                                    loading={loading}
                                    className="bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium shadow-md"
                                >
                                    Lưu Bài Viết
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CreateNews;