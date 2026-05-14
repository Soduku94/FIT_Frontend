import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Typography, List, Card, Tag, Spin, message, Breadcrumb, 
    Input, Tabs, Button, Empty, Space
} from 'antd';
import { 
    SearchOutlined, BellOutlined,
    ClockCircleOutlined, RightOutlined,
    AppstoreOutlined, UnorderedListOutlined,
    StarOutlined, StarFilled
} from '@ant-design/icons';
import { Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';
import Navbar from '../../components/layout/Navbar';

const { Title, Text, Paragraph } = Typography;

const Notifications = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [savedIds, setSavedIds] = useState([]); // List of saved news IDs

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch news
                const newsRes = await api.get('/public/news');
                const newsData = newsRes.data.news || newsRes.data || [];
                setNews(Array.isArray(newsData) ? newsData : []);

                // Fetch saved items if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    const savedRes = await api.get('/client/saved');
                    const ids = savedRes.data
                        .filter(item => item.type === 'news')
                        .map(item => item.id);
                    setSavedIds(ids);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                // Don't show error message if just saved fetch fails (might not be logged in)
                if (error.response?.status !== 401) {
                    message.error(t('profile.fetch_error'));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [t]);

    const handleSave = async (e, resourceId) => {
        e.stopPropagation(); // Don't trigger card click
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning(t('auth.login_required') || 'Vui lòng đăng nhập để lưu bài viết');
            return;
        }

        try {
            const res = await api.post('/client/saved/toggle', {
                resource_id: resourceId,
                resource_type: 'news'
            });
            
            if (res.data.saved) {
                setSavedIds(prev => [...prev, resourceId]);
                message.success('Đã lưu bài viết');
            } else {
                setSavedIds(prev => prev.filter(id => id !== resourceId));
                message.success('Đã bỏ lưu');
            }
        } catch (error) {
            message.error('Không thể thực hiện tác vụ này');
        }
    };

    const filteredNews = news.filter(item => {
        const title = item.title || '';
        const excerpt = item.excerpt || '';
        const matchSearch = title.toLowerCase().includes(searchText.toLowerCase()) || 
                           excerpt.toLowerCase().includes(searchText.toLowerCase());
        
        if (activeTab === 'all') return matchSearch;
        if (activeTab === 'urgent') return matchSearch && item.is_urgent;
        return matchSearch && item.category === activeTab;
    });

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
        
            
            {/* STANDARD HEADER */}
            <div className="bg-white border-b border-[#E2E8F0] py-10 md:py-14">
                <div className="max-w-6xl mx-auto px-6">
                    <Breadcrumb className="mb-4" items={[
                        { title: <a href="/">{t('document_detail.breadcrumb_home')}</a> },
                        { title: t('notifications.title') }
                    ]} />
                    <Title level={2} className="m-0 text-3xl font-bold text-[#1E293B] flex items-center gap-3">
                        <BellOutlined className="text-[#3B82F6]" />
                        {t('notifications.title')}
                    </Title>
                    <Text className="text-[#64748B] mt-2 block text-base font-medium">
                        {t('notifications.subtitle')}
                    </Text>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* FILTERS SECTION */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        className="notification-tabs-final"
                        items={[
                            { key: 'all', label: t('notifications.filter_all') },
                            { key: 'urgent', label: t('notifications.filter_urgent') },
                            { key: 'news', label: t('notifications.filter_news') },
                        ]}
                    />
                    <Input
                        placeholder={t('notifications.search_placeholder')}
                        prefix={<SearchOutlined className="text-[#94A3B8]" />}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full md:w-72 h-10 rounded-xl bg-[#F8FAFC] border-[#E2E8F0]"
                        allowClear
                    />

                    <div className="hidden sm:block border-l border-gray-100 pl-4">
                        <Radio.Group 
                            value={viewMode} 
                            onChange={e => setViewMode(e.target.value)} 
                            optionType="button"
                            buttonStyle="solid"
                        >
                            <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
                            <Radio.Button value="list"><UnorderedListOutlined /></Radio.Button>
                        </Radio.Group>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center"><Spin size="large" tip="Đang tải..." /></div>
                ) : filteredNews.length > 0 ? (
                    <List
                        dataSource={filteredNews}
                        grid={viewMode === 'grid' ? { gutter: [24, 24], xs: 1, sm: 1, md: 2, lg: 2, xl: 2 } : null}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: false,
                            className: "pt-10",
                            position: 'bottom',
                            align: 'center'
                        }}
                        renderItem={(item) => (
                            <List.Item className="p-0" style={{ height: '100%', display: 'flex' }}>
                                <Card 
                                    hoverable
                                    className="rounded-[20px] border-[#E2E8F0] transition-all duration-300 hover:border-[#3B82F6] hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col w-full"
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    bodyStyle={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}
                                    onClick={() => navigate(`/news/${item.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <Space size={8}>
                                            {item.is_urgent ? (
                                                <Tag color="red" className="m-0 rounded-md border-0 px-2 font-bold text-[10px] uppercase tracking-wider">
                                                    {t('notifications.filter_urgent')}
                                                </Tag>
                                            ) : (
                                                <Tag color="blue" className="m-0 rounded-md border-0 px-2 font-bold text-[10px] uppercase tracking-wider">
                                                    {t('notifications.filter_news')}
                                                </Tag>
                                            )}
                                        </Space>
                                        <Text className="text-[11px] text-[#94A3B8] font-semibold flex items-center gap-1">
                                            <ClockCircleOutlined /> {item.created_at?.split(' ')[0]}
                                        </Text>
                                        <Button 
                                            type="text" 
                                            icon={savedIds.includes(item.id) ? <StarFilled className="text-[#3B82F6]" /> : <StarOutlined />} 
                                            onClick={(e) => handleSave(e, item.id)}
                                            className="flex items-center justify-center hover:bg-blue-50 rounded-full"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <Title level={4} className="m-0 mb-3 text-[#1E293B] transition-colors line-clamp-2 leading-snug min-h-[48px]">
                                            {item.title}
                                        </Title>
                                        
                                        <Paragraph className="text-[#64748B] text-sm leading-relaxed mb-6 line-clamp-2">
                                            {stripHtml(item.excerpt) || "Bấm xem chi tiết để nắm bắt các thông tin quan trọng từ Văn phòng Khoa..."}
                                        </Paragraph>
                                    </div>

                                    <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-center mt-auto">
                                        <Text className="text-[#3B82F6] font-bold text-xs uppercase tracking-widest">
                                            {t('notifications.read_more')}
                                        </Text>
                                        <RightOutlined className="text-[#3B82F6] text-[10px]" />
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border border-[#E2E8F0]">
                        <Empty description={t('notifications.no_results')} />
                    </div>
                )}
            </div>

            <AppFooter />
            
            <style>{`
                .notification-tabs-final .ant-tabs-nav::before { border-bottom: none; }
                .notification-tabs-final .ant-tabs-tab { padding: 8px 0; margin-right: 24px; }
                .notification-tabs-final .ant-tabs-tab-btn { font-weight: 600; color: #64748B; }
                .notification-tabs-final .ant-tabs-tab-active .ant-tabs-tab-btn { color: #3B82F6; }
                .notification-tabs-final .ant-tabs-ink-bar { background: #3B82F6; }
            `}</style>
        </div>
    );
};

export default Notifications;
