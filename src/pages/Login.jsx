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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-md shadow-lg rounded-xl border-0">
                <div className="text-center mb-8">
                    <Title level={2} className="m-0 text-blue-600 font-bold">FIT Research</Title>
                    <p className="text-gray-500 mt-2 text-base">Đăng nhập để quản lý tài liệu học thuật</p>
                </div>

                <Form name="login_form" layout="vertical" onFinish={onFinish} size="large">
                    <Form.Item
                        name="user_code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã số!' }]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Mã số (VD: admin_fit)" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className="mb-2"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mật khẩu" />
                    </Form.Item>

                    {/* DÒNG MỚI THÊM: Nút Quên mật khẩu */}
                    <div className="flex justify-end mb-6">
                        <Button
                            type="link"
                            onClick={() => navigate('/forgot-password')}
                            className="p-0 h-auto text-sm text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
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