import React, { useState, useEffect } from 'react';
import { Typography, List, Card, Tag, Spin, message, Breadcrumb, Row, Col } from 'antd';
import { NotificationOutlined, CalendarOutlined, RightOutlined } from '@ant-design/icons';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Title, Text } = Typography;

const Notifications = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get('/public/news');
                // Filter news that has 'Thông báo' category or similar if exists
                setNews(response.data.news);
            } catch (error) {
                message.error('Không thể tải thông báo!');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 py-10">
                <div className="max-w-5xl mx-auto px-6">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Thông báo</Breadcrumb.Item>
                    </Breadcrumb>
                    <Title level={2} className="m-0 flex items-center gap-3">
                        <NotificationOutlined className="text-blue-600" />
                        Trung tâm Thông báo
                    </Title>
                    <Text type="secondary">Cập nhật các thông báo mới nhất từ Văn phòng Khoa</Text>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-10">
                {loading ? (
                    <div className="text-center py-20"><Spin size="large" /></div>
                ) : (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={news}
                        renderItem={(item) => (
                            <List.Item>
                                <Card 
                                    className="hover:shadow-md transition-all cursor-pointer border-gray-100 rounded-xl"
                                    onClick={() => window.location.href = `/news/${item.id}`}
                                >
                                    <Row gutter={24} align="middle">
                                        <Col xs={24} sm={4} className="text-center">
                                            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                                <CalendarOutlined className="text-2xl block mb-1" />
                                                <Text className="text-[10px] font-bold uppercase">{item.created_at.split(' ')[0]}</Text>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={18}>
                                            <Tag color="orange" className="mb-2 rounded-full border-0 px-3 uppercase text-[10px] font-bold tracking-wider">Thông báo mới</Tag>
                                            <Title level={4} className="m-0 mb-2 hover:text-blue-600 transition-colors">{item.title}</Title>
                                            <Text type="secondary" className="line-clamp-2">{item.excerpt}</Text>
                                        </Col>
                                        <Col xs={0} sm={2} className="text-right">
                                            <RightOutlined className="text-gray-300" />
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
            <AppFooter />
        </div>
    );
};

export default Notifications;
