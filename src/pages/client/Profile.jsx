import React, { useState, useEffect } from 'react';
import { Layout, Card, Descriptions, Tabs, Table, Tag, Avatar, Typography, Spin, message, Button } from 'antd';
import { UserOutlined, FileTextOutlined, MailOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setData(response.data);
            } catch (error) {
                message.error("Không thể tải thông tin cá nhân!");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex justify-center pt-20">
                <Spin size="large" tip="Đang tải thông tin cá nhân..." />
            </div>
        );
    }

    const { user, documents } = data;

    // Cấu hình bảng danh sách tài liệu cá nhân
    const columns = [
        { title: 'Tên tài liệu', dataIndex: 'title', key: 'title', className: 'font-medium' },
        { title: 'Ngày đăng', dataIndex: 'created_at', key: 'created_at', width: 120 },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'approved' ? 'green' : status === 'pending' ? 'gold' : 'red';
                let text = status === 'approved' ? 'Đã duyệt' : status === 'pending' ? 'Chờ duyệt' : 'Từ chối';
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            }
        },
        { title: 'Lượt xem', dataIndex: 'view_count', key: 'view_count', width: 100 },
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
            <Card className="shadow-md rounded-xl overflow-hidden mb-8" bodyStyle={{ padding: 0 }}>
                <div className="bg-blue-600 h-32 w-full"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-4 flex items-end gap-4">
                        <Avatar size={100} icon={<UserOutlined />} className="border-4 border-white bg-blue-500 shadow-lg" />
                        <div className="mb-2">
                            <Title level={2} className="m-0">{user.full_name}</Title>
                            <Tag color="blue">{user.role.toUpperCase()}</Tag>
                        </div>
                    </div>

                    <Tabs defaultActiveKey="1" items={[
                        {
                            key: '1',
                            label: 'Thông tin tài khoản',
                            children: (
                                <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className="mt-4">
                                    <Descriptions.Item label={<span><UserOutlined /> Mã số</span>}>{user.user_code}</Descriptions.Item>
                                    <Descriptions.Item label={<span><MailOutlined /> Email</span>}>{user.email}</Descriptions.Item>
                                    <Descriptions.Item label={<span><BankOutlined /> Đơn vị/Khoa</span>}>{user.department}</Descriptions.Item>
                                    {user.class_name && <Descriptions.Item label="Lớp">{user.class_name}</Descriptions.Item>}
                                    <Descriptions.Item label={<span><SafetyCertificateOutlined /> Quyền hạn</span>}>
                                        {user.role === 'lecturer' ? 'Giảng viên' : user.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
                                    </Descriptions.Item>
                                </Descriptions>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Tài liệu đã đăng',
                            children: (
                                <Table
                                    columns={columns}
                                    dataSource={documents}
                                    rowKey="id"
                                    className="mt-4"
                                    pagination={{ pageSize: 5 }}
                                    locale={{ emptyText: "Bạn chưa có tài liệu nào." }}
                                />
                            ),
                        },
                    ]} />
                </div>
            </Card>
        </div>
    );
};

export default Profile;