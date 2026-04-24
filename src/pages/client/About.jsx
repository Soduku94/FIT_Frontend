import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Spin, message, Button } from 'antd';
import { CalendarOutlined, TrophyOutlined, TeamOutlined, ReadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
            {/* KHU VỰC HERO: GIỚI THIỆU KHOA */}
            <div className="bg-blue-800 text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in-up">
                    <Title style={{ color: 'white' }} level={1}>Khoa Công Nghệ Thông Tin</Title>
                    <Paragraph className="text-blue-100 text-lg mt-4 text-justify sm:text-center">
                        Tự hào là một trong những đơn vị đào tạo và nghiên cứu hàng đầu. Chúng tôi kiến tạo môi trường học thuật sáng tạo, gắn kết chặt chẽ với doanh nghiệp, trang bị cho sinh viên nền tảng vững chắc để kiến tạo tương lai số.
                    </Paragraph>

                    <Row gutter={[24, 24]} className="mt-12 justify-center">
                        <Col xs={12} md={6}>
                            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <TeamOutlined className="text-4xl text-blue-300 mb-2" />
                                <Title level={3} className="m-0 text-white">50+</Title>
                                <Text className="text-blue-200">Giảng viên/Tiến sĩ</Text>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <ReadOutlined className="text-4xl text-blue-300 mb-2" />
                                <Title level={3} className="m-0 text-white">1000+</Title>
                                <Text className="text-blue-200">Đồ án & Bài báo</Text>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <TrophyOutlined className="text-4xl text-yellow-400 mb-2" />
                                <Title level={3} className="m-0 text-white">Top 1</Title>
                                <Text className="text-blue-200">Thành tích NCKH</Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* KHU VỰC TIN TỨC & THÀNH TÍCH */}
            <div className="max-w-6xl mx-auto px-4 mt-16">
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <div>
                        <Title level={2} className="m-0 text-gray-800">Tin tức & Sự kiện</Title>
                        <Text type="secondary">Cập nhật những hoạt động và thành tựu mới nhất của khoa</Text>
                    </div>
                </div>

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
        </div>
    );
};

export default About;