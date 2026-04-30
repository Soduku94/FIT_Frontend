import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Spin, message, Button } from 'antd';
import { CalendarOutlined, TrophyOutlined, TeamOutlined, ReadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Title, Text, Paragraph } = Typography;

const About = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get('/public/news');
                setNews(response.data.news);
            } catch (error) {
                message.error('Không thể tải tin tức từ máy chủ!');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="bg-white border-b border-gray-200 py-12 px-4 mb-10">
                <div className="max-w-6xl mx-auto">
                    <Title level={1} className="m-0 text-gray-900 font-black">Tin tức & Sự kiện</Title>
                    <Paragraph className="text-gray-500 text-lg mt-2 m-0">
                        Nơi cập nhật những hoạt động, nghiên cứu và thành tựu mới nhất từ đại gia đình Khoa CNTT.
                    </Paragraph>
                </div>
            </div>

            {/* KHU VỰC TIN TỨC & THÀNH TÍCH */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
            

                {loading ? (
                    <div className="flex justify-center py-20"><Spin size="large" tip="Đang tải tin tức..." /></div>
                ) : (
                    <Row gutter={[24, 32]}>
                        {news.length > 0 ? news.map((item) => (
                            <Col xs={24} md={12} lg={8} key={item.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    className="h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
                                    cover={
                                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                                            {item.thumbnail_url ? (
                                                <img alt={item.title} src={item.thumbnail_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    Không có ảnh bìa
                                                </div>
                                            )}
                                            <Tag color={item.category === 'Sự kiện' ? 'blue' : 'orange'} className="absolute top-4 left-4 border-0 font-medium px-3 py-1 text-sm shadow-sm">
                                                {item.category}
                                            </Tag>
                                        </div>
                                    }
                                    bodyStyle={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 192px)' }}
                                >
                                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-4">
                                        <span className="flex items-center"><CalendarOutlined className="mr-1" /> {item.created_at}</span>
                                    </div>
                                    <Title level={4} className="mt-0 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </Title>
                                    {/* Hàm dangerouslySetInnerHTML tạm dùng để render nếu excerpt vô tình dính thẻ HTML,
                                        nhưng vì là excerpt nên bóc tách text tĩnh sẽ tốt hơn ở bản hoàn chỉnh */}
                                    <div className="text-gray-500 line-clamp-3 mb-6 flex-grow text-justify" dangerouslySetInnerHTML={{ __html: item.excerpt }} />

                                    <Button type="link" className="p-0 mt-auto text-left flex items-center text-blue-600 font-medium group">
                                        Đọc tiếp <ArrowRightOutlined className="ml-1 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Card>
                            </Col>
                        )) : (
                            <div className="w-full text-center py-20 text-gray-500">
                                Chưa có bài viết nào được đăng tải.
                            </div>
                        )}
                    </Row>
                )}
            </div>
            <AppFooter />
        </div>
    );
};

export default About;