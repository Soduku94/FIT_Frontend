import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', {
                user_code: values.user_code,
                email: values.email
            });
            message.success(response.data.message);
        } catch (error) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/login')} className="mb-4 pl-0">
                    Quay lại đăng nhập
                </Button>
                <div className="text-center mb-6">
                    <Title level={2}>Quên mật khẩu?</Title>
                    <Text type="secondary">Nhập mã số và email để nhận link khôi phục</Text>
                </div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="user_code" label="Mã số (SV/GV)" rules={[{ required: true, message: 'Vui lòng nhập mã số!' }]}>
                        <Input placeholder="Ví dụ: GV001" size="large" />
                    </Form.Item>
                    <Form.Item name="email" label="Email đăng ký" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                        <Input prefix={<MailOutlined />} placeholder="email@fit.edu.vn" size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} className="bg-blue-600 mt-2">
                        Gửi link khôi phục
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;