import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title } = Typography;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token: token,
                new_password: values.password
            });
            message.success("Đặt lại mật khẩu thành công!");
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || "Link không hợp lệ hoặc đã hết hạn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <Title level={3} className="text-center mb-6">Đặt lại mật khẩu mới</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="password" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự!' }]}>
                        <Input.Password prefix={<LockOutlined />} size="large" />
                    </Form.Item>
                    <Form.Item name="confirm" label="Xác nhận mật khẩu" dependencies={['password']}
                               rules={[{ required: true }, ({ getFieldValue }) => ({
                                   validator(_, value) {
                                       if (!value || getFieldValue('password') === value) return Promise.resolve();
                                       return Promise.reject(new Error('Mật khẩu không khớp!'));
                                   },
                               })]}>
                        <Input.Password prefix={<LockOutlined />} size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} className="bg-blue-600">
                        Cập nhật mật khẩu
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;