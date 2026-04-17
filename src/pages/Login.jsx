import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await api.post('/auth/login', values);
            const { token, user } = response.data;

            // 1. Lưu thông tin vào kho (localStorage)
            localStorage.setItem('token', token);
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_name', user.full_name);



            // 2. PHÂN LUỒNG ĐIỀU HƯỚNG
            message.success(`Chào mừng ${user.full_name} quay trở lại!`);
            navigate('/');
        } catch (error) {
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại!');

        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-lg">
                <div className="text-center mb-6">
                    <Title level={2} className="m-0 text-blue-600">FIT Research Hub</Title>
                    <p className="text-gray-500 mt-2">Đăng nhập để quản lý tài liệu học thuật</p>
                </div>

                <Form name="login_form" layout="vertical" onFinish={onFinish} size="large">
                    <Form.Item
                        name="user_code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã số!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Mã số (VD: admin_fit)" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600"
                            loading={loading}
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;