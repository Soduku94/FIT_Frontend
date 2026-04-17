import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, message } from 'antd';
import {
    FileTextOutlined,
    UserOutlined,
    CloudDownloadOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import api from '../../services/api';

const { Title } = Typography;

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: { total_docs: 0, pending_docs: 0, total_users: 0, total_downloads: 0 },
        category_data: [],
        download_data: []
    });

    // Gọi API lấy dữ liệu thống kê
    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            setDashboardData(response.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải dữ liệu thống kê!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Nếu đang tải dữ liệu thì hiện vòng xoay ở giữa màn hình
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    // Tách dữ liệu ra các biến cho dễ dùng
    const { stats, category_data, download_data } = dashboardData;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <Title level={3} className="m-0 text-gray-800">Tổng quan Hệ thống</Title>
                <p className="text-gray-500 mt-1">Thống kê dữ liệu hoạt động của FIT Research Hub</p>
            </div>

            {/* TẦNG 1: CÁC THẺ SỐ LIỆU (Dùng dữ liệu thật từ biến stats) */}
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-blue-500 rounded-lg hover:shadow-md transition-shadow">
                        <Statistic title="Tổng số Tài liệu" value={stats.total_docs} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-green-500 rounded-lg hover:shadow-md transition-shadow">
                        <Statistic title="Tài liệu chờ duyệt" value={stats.pending_docs} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-purple-500 rounded-lg hover:shadow-md transition-shadow">
                        <Statistic title="Lượt tải xuống" value={stats.total_downloads} prefix={<CloudDownloadOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-orange-500 rounded-lg hover:shadow-md transition-shadow">
                        <Statistic title="Người dùng" value={stats.total_users} prefix={<UserOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* TẦNG 2: KHU VỰC BIỂU ĐỒ (Bơm dữ liệu thật vào data={...}) */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Tài liệu theo Chuyên ngành" className="shadow-sm rounded-lg h-full">
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={category_data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip cursor={{fill: '#f5f5f5'}} />
                                    <Legend />
                                    <Bar dataKey="count" name="Số bài báo" fill="#1677ff" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Lượt tải xuống 5 tháng gần nhất" className="shadow-sm rounded-lg h-full">
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={download_data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="downloads" name="Lượt tải" stroke="#52c41a" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;