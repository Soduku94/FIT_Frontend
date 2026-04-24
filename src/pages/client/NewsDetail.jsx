import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, message, Divider } from 'antd';
import { CalendarOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Content, Footer } = Layout;
const { Title } = Typography;

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/public/news/${id}`);
                // Phụ thuộc vào dữ liệu trả về từ backend, có thể là response.data.news hoặc response.data
                setNews(response.data.news || response.data);
            } catch (error) {
                message.error("Không thể tải chi tiết tin tức hoặc bài viết không tồn tại!");
                navigate('/about');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (loading) {
        return (
            <Layout className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spin size="large" tip="Đang tải chi tiết bài viết..." />
            </Layout>
        );
    }

    if (!news) return null;

    return (
        <Layout className="min-h-screen bg-white">
            <Content className="pt-8 pb-16 animate-fade-in block max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                <div onClick={() => navigate(-1)} className="cursor-pointer text-blue-600 mb-6 inline-flex items-center hover:text-blue-800 transition-colors font-medium">
                    <ArrowLeftOutlined className="mr-2" /> Quay lại
                </div>

                {news.category && (
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {news.category}
                        </span>
                    </div>
                )}

                <Title className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                    {news.title}
                </Title>

                <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-8 border-b border-gray-100 pb-6">
                    <span className="flex items-center">
                        <CalendarOutlined className="mr-2" /> {news.created_at || 'Đang cập nhật'}
                    </span>
                    {news.view_count !== undefined && (
                        <span className="flex items-center">
                            <EyeOutlined className="mr-2" /> {news.view_count} lượt xem
                        </span>
                    )}
                </div>

                {news.thumbnail_url && (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
                        <img 
                            src={news.thumbnail_url} 
                            alt={news.title} 
                            className="w-full max-h-[500px] object-cover"
                        />
                    </div>
                )}

                <div 
                    className="text-lg text-gray-800 leading-relaxed text-justify prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: news.content || news.excerpt || 'Đang cập nhật nội dung...' }}
                />

                <Divider className="my-12" />

            </Content>
            <Footer className="text-center text-gray-500 bg-gray-50 border-t border-gray-200">
                FIT Research Hub ©2026
            </Footer>
        </Layout>
    );
};

export default NewsDetail;
