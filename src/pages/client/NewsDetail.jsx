import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, message, Divider, Avatar, Button, Tag, Space } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, UserOutlined, ShareAltOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/public/news/${id}`);
                setNews(response.data.news || response.data);
                
                // Check if saved
                const token = localStorage.getItem('token');
                if (token) {
                    const savedRes = await api.get(`/client/saved/${id}/check?type=news`);
                    setIsSaved(savedRes.data.is_saved);
                }
            } catch (error) {
                message.error("Không thể tải chi tiết tin tức!");
                navigate('/about');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetail();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id, navigate]);

    const handleToggleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning("Vui lòng đăng nhập để lưu bài viết!");
            return;
        }

        try {
            setSaving(true);
            const res = await api.post('/client/saved/toggle', {
                resource_id: id,
                resource_type: 'news'
            });
            setIsSaved(res.data.saved);
            message.success(res.data.saved ? "Đã lưu vào danh sách đọc sau" : "Đã xóa khỏi danh sách lưu");
        } catch (error) {
            message.error("Không thể thực hiện tác vụ này");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Spin size="large" />
                <Text className="mt-4 text-gray-400 animate-pulse">Đang chuẩn bị nội dung...</Text>
            </div>
        );
    }

    if (!news) return null;

    return (
        <Layout className="min-h-screen bg-white font-sans antialiased">
            {/* Thanh tiến trình đọc */}
            <div 
                className="fixed top-0 left-0 h-1 bg-blue-600 z-[100] transition-all duration-150" 
                style={{ width: `${scrollProgress}%` }}
            />

           
            <Content className="pt-12 pb-24">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto px-6 text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <span className="text-blue-600 font-bold text-xs tracking-widest uppercase py-1 px-3 bg-blue-50 rounded-full">
                            {news.category || 'Bản tin khoa'}
                        </span>
                    </div>
                    
                    <Title level={1} className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                        {news.title}
                    </Title>

                    <div className="flex items-center justify-center gap-4 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Avatar size={32} icon={<UserOutlined />} className="bg-indigo-100 text-indigo-600" />
                            <span className="font-semibold text-gray-700">{news.author_name || 'Admin'}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-1.5">
                            <CalendarOutlined />
                            <span>{news.created_at}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <Button 
                            type={isSaved ? "primary" : "default"}
                            icon={isSaved ? <StarFilled /> : <StarOutlined />}
                            onClick={handleToggleSave}
                            loading={saving}
                            className={`rounded-full border-0 ${isSaved ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {isSaved ? t('notifications.saved_btn') : t('notifications.save_btn')}
                        </Button>
                    </div>
                </div>

                {/* Hero Image */}
                {news.thumbnail_url && (
                    <div className="max-w-5xl mx-auto px-6 mb-16">
                        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/50">
                            <img 
                                src={news.thumbnail_url} 
                                alt={news.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <article className="max-w-3xl mx-auto px-6">
                    <div 
                        className="
                            news-content
                            text-xl text-gray-700 leading-[1.8] font-normal text-left break-words
                            [&>p]:mb-8 [&>p]:last:mb-0
                            [&_img]:rounded-2xl [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_img]:my-10 [&_img]:shadow-xl
                            [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-gray-900 [&_h1]:mt-12 [&_h1]:mb-6
                            [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-6
                            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-10 [&_h3]:mb-4
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul_li]:mb-3
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol_li]:mb-3
                            [&_blockquote]:border-l-8 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50/30 [&_blockquote]:px-8 [&_blockquote]:py-10 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-12 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:text-2xl
                            [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-blue-800 [&_a]:font-medium
                            [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:my-10 [&_table]:border-collapse
                            [&_td]:border [&_td]:border-gray-100 [&_td]:p-4 [&_td]:text-lg
                            [&_th]:border [&_th]:border-gray-100 [&_th]:p-4 [&_th]:bg-gray-50 [&_th]:font-bold [&_th]:text-left
                            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-3xl [&_iframe]:shadow-xl [&_iframe]:my-12
                        "
                        dangerouslySetInnerHTML={{ __html: news.content || news.excerpt }}
                    />

                    <Divider className="my-20" />

                    {/* Footer Info */}
                    <div className="bg-gray-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
                        
                    </div>
                </article>
            </Content>

            <AppFooter />
        </Layout>
    );
};

export default NewsDetail;
