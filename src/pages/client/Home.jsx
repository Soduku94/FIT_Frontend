import React, { useState, useEffect } from 'react';
import {
    Layout, Typography, Input, Card, Tag, Spin, message,
    Row, Col, Empty, Button, Select, Space, Pagination, AutoComplete, Segmented, Badge, Divider
} from 'antd';
import {
    SearchOutlined, FilePdfOutlined, DatabaseOutlined, EyeOutlined,
    CalendarOutlined, UserOutlined, ArrowRightOutlined, FileTextOutlined,
    TrophyOutlined, TeamOutlined, ReadOutlined, ThunderboltOutlined,
    AppstoreOutlined, BarsOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

/* ─── tiny helpers ─── */
const StatPill = ({ icon, value, label }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 12, padding: '10px 18px',
    }}>
        <span style={{ fontSize: 20, color: '#93C5FD' }}>{icon}</span>
        <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{label}</div>
        </div>
    </div>
);

const DocCard = ({ doc, onClick, viewMode = 'grid' }) => {
    const isPaper = doc.doc_type === 'paper';
    const isList = viewMode === 'list';

    const formatAuthors = (authorsData) => {
        if (!authorsData) return 'Tác giả';
        try {
            if (typeof authorsData === 'string' && authorsData.startsWith('[')) {
                const parsed = JSON.parse(authorsData);
                return Array.isArray(parsed) ? parsed.join(', ') : authorsData;
            }
            if (Array.isArray(authorsData)) return authorsData.join(', ');
        } catch (e) {}
        return authorsData;
    };

    if (isList) {
        return (
            <Card
                hoverable
                onClick={onClick}
                style={{
                    borderRadius: 16, border: '1.5px solid #F1F5F9',
                    marginBottom: 16, cursor: 'pointer',
                    transition: 'all 0.25s ease',
                }}
                bodyStyle={{ padding: '20px 24px' }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.08)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#F1F5F9';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={18}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
                            <Tag
                                color={isPaper ? 'blue' : 'purple'}
                                style={{ borderRadius: 6, fontWeight: 700, fontSize: 10, border: 'none' }}
                            >
                                {doc.category_name || (isPaper ? 'BÀI BÁO' : 'DATASET')}
                            </Tag>
                            <Text style={{ fontSize: 12, color: '#94A3B8' }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {doc.publication_year || doc.created_at}
                            </Text>
                        </div>
                        <Title level={5} style={{ margin: '0 0 8px', color: '#1E293B', fontWeight: 700 }} ellipsis={{ rows: 1 }}>
                            {doc.title}
                        </Title>
                        <Paragraph style={{ color: '#64748B', fontSize: 13, margin: '0 0 12px' }} ellipsis={{ rows: 1 }}>
                            {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                        </Paragraph>
                        <Space split={<Divider type="vertical" />} style={{ fontSize: 12 }}>
                            <span style={{ color: '#3B82F6', fontWeight: 600 }}>
                                <UserOutlined style={{ marginRight: 6 }} />
                                {formatAuthors(doc.authors)}
                            </span>
                            <span style={{ color: '#94A3B8' }}>
                                <EyeOutlined style={{ marginRight: 6 }} />
                                {doc.view_count || 0} lượt xem
                            </span>
                        </Space>
                    </Col>
                    <Col xs={0} sm={6} style={{ textAlign: 'right' }}>
                        <Button type="primary" ghost icon={<ArrowRightOutlined />} style={{ borderRadius: 8 }}>
                            Xem chi tiết
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card
            hoverable
            onClick={onClick}
            style={{
                borderRadius: 20, border: '1.5px solid #F1F5F9',
                height: '100%', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59,130,246,0.15)';
                e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F1F5F9';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ padding: '24px 24px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Badge count={doc.category_name} style={{ backgroundColor: isPaper ? '#3B82F6' : '#8B5CF6', fontSize: 10, fontWeight: 700 }} />
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                        {doc.publication_year || doc.created_at}
                    </Text>
                </div>
                
                <Title level={5} style={{ 
                    margin: '0 0 12px', fontSize: 16, lineHeight: 1.5, fontWeight: 700, 
                    color: '#1E293B'
                }} ellipsis={{ rows: 2 }}>
                    {doc.title}
                </Title>

                <Paragraph style={{ 
                    color: '#64748B', fontSize: 13, marginBottom: 16, flex: 1
                }} ellipsis={{ rows: 2 }}>
                    {doc.description || "Tài liệu này hiện chưa có đoạn tóm tắt."}
                </Paragraph>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                        <UserOutlined style={{ color: '#3B82F6', fontSize: 12 }} />
                    </div>
                    <Text style={{ fontSize: 13, color: '#475569', fontWeight: 600, maxWidth: '80%' }} ellipsis>
                        {formatAuthors(doc.authors)}
                    </Text>
                </div>
            </div>

            <div style={{ 
                padding: '12px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Space size={12}>
                    <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <EyeOutlined style={{ color: '#94A3B8' }} /> {doc.view_count || 0}
                    </span>
                </Space>
                <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: 700 }}>
                    Chi tiết <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Text>
            </div>
        </Card>
    );
};

/* ─── main component ─── */
const Home = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 12;

    const [activeTab, setActiveTab] = useState('paper');
    const [viewMode, setViewMode] = useState('grid');
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    const fetchDocuments = async (type, search = '', categoryId = null, year = null, sort = 'newest', page = 1) => {
        setLoading(true);
        try {
            let url = `/public/documents?type=${type}&search=${search}&page=${page}&limit=${pageSize}`;
            if (categoryId) url += `&category_id=${categoryId}`;
            if (year) url += `&publication_year=${year}`;
            if (sort) url += `&sort_by=${sort}`;
            const response = await api.get(url);
            setDocuments(response.data.documents);
            setTotal(response.data.metadata.total);
            setCurrentPage(response.data.metadata.page);
        } catch {
            message.error('Không thể tải danh sách tài liệu!');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/public/categories');
            setCategories(res.data.categories);
        } catch {}
    };

    const fetchLatestNews = async () => {
        try {
            const res = await api.get('/public/news');
            setLatestNews(res.data.news.slice(0, 3));
        } catch {}
    };

    useEffect(() => { fetchCategories(); fetchLatestNews(); }, []);
    useEffect(() => { fetchDocuments(activeTab, searchText, selectedCategory, selectedYear, sortBy, 1); }, [activeTab, searchText, selectedCategory, selectedYear, sortBy]);

    const handlePageChange = (page) => {
        fetchDocuments(activeTab, searchText, selectedCategory, selectedYear, sortBy, page);
        window.scrollTo({ top: 480, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!inputValue.trim()) { setOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/public/documents?search=${inputValue}&limit=6`);
                setOptions(res.data.documents.map(doc => ({
                    value: doc.title, id: doc.id,
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                            <FileTextOutlined style={{ color: '#3B82F6', flexShrink: 0 }} />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#1E293B' }}>{doc.title}</span>
                        </div>
                    ),
                })));
            } catch {}
        }, 400);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

    const sortOptions = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'oldest', label: 'Cũ nhất' },
        { value: 'view', label: 'Xem nhiều nhất' },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            <style>{`
                * { font-family: 'Plus Jakarta Sans', sans-serif; }
                .search-input .ant-input { font-size: 15px !important; color: #1E293B; }
                .search-input .ant-input-prefix { margin-right: 10px; }
                .ant-select-selector { border-radius: 10px !important; }
                .ant-pagination-item-active { border-color: #3B82F6 !important; }
                .ant-pagination-item-active a { color: #3B82F6 !important; }
                .ant-segmented-item-selected { background: #3B82F6 !important; color: #fff !important; border-radius: 10px !important; }
                .ant-segmented { border-radius: 12px !important; background: #EFF6FF !important; padding: 4px !important; }
                .ant-segmented-item { border-radius: 10px !important; font-weight: 600; font-size: 13px; }
                .filter-select .ant-select-selector {
                    height: 42px !important;
                    display: flex; align-items: center;
                    background: #F8FAFC !important;
                    border: 1.5px solid #E2E8F0 !important;
                }
                .filter-select:hover .ant-select-selector { border-color: #3B82F6 !important; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.5s ease both; }
                .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
                .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
            `}</style>

            {/* ── HERO ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 50%, #1E3A8A 100%)',
                padding: '72px 24px 100px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Subtle circle decorations */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                    <div className="fade-up" style={{
                        display: 'inline-block', background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100,
                        padding: '5px 16px', marginBottom: 24,
                    }}>
                        <Text style={{ color: '#BFDBFE', fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            FIT Research Hub
                        </Text>
                    </div>

                    <Title className="fade-up-1" style={{
                        color: '#fff', margin: '0 0 16px', fontWeight: 800,
                        fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.2, letterSpacing: '-0.5px',
                    }}>
                        Kho tàng Tri thức Số<br />
                        <span style={{ color: '#93C5FD' }}>của Khoa CNTT</span>
                    </Title>

                    <Paragraph className="fade-up-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 36, fontWeight: 400 }}>
                        Tìm kiếm, đọc và tải về hàng nghìn bài báo khoa học và bộ dữ liệu nghiên cứu.
                    </Paragraph>

                    {/* Search box */}
                    <div className="fade-up-2" style={{
                        background: '#fff', borderRadius: 16, padding: 6,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <AutoComplete
                            options={options}
                            onSelect={(value, option) => { setInputValue(value); if (option.id) navigate(`/document/${option.id}`); }}
                            onSearch={setInputValue}
                            style={{ flex: 1 }}
                            dropdownStyle={{ borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                        >
                            <Input
                                className="search-input"
                                size="large"
                                placeholder="Tìm tài liệu, tác giả, từ khóa..."
                                prefix={<SearchOutlined style={{ color: '#3B82F6', fontSize: 18 }} />}
                                bordered={false}
                                style={{ fontSize: 15, height: 48 }}
                                onPressEnter={() => setSearchText(inputValue)}
                            />
                        </AutoComplete>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            style={{
                                height: 48, borderRadius: 12, fontWeight: 700,
                                background: '#3B82F6', border: 'none', paddingInline: 24,
                                boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
                            }}
                            onClick={() => setSearchText(inputValue)}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    {/* Stats pills */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                        <StatPill icon={<ReadOutlined />} value="5,000+" label="Tài liệu" />
                        <StatPill icon={<TeamOutlined />} value="500+" label="Tác giả" />
                        <StatPill icon={<TrophyOutlined />} value="100+" label="Giải thưởng" />
                        <StatPill icon={<ThunderboltOutlined />} value="AI" label="Hỗ trợ tóm tắt" />
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <Content style={{ maxWidth: 1280, margin: '-32px auto 0', padding: '0 24px 64px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    background: '#fff', borderRadius: 20,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                }}>
                    {/* Filter bar */}
                    <div style={{
                        padding: '20px 28px', borderBottom: '1px solid #F1F5F9',
                        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                        background: '#FAFBFC',
                    }}>
                        {/* Type toggle */}
                        <Segmented
                            options={[
                                { label: <Space><FilePdfOutlined />Bài báo khoa học</Space>, value: 'paper' },
                                { label: <Space><DatabaseOutlined />Bộ dữ liệu</Space>, value: 'dataset' },
                            ]}
                            value={activeTab}
                            onChange={setActiveTab}
                        />

                        <div style={{ flex: 1 }} />

                        {/* View Switcher */}
                        <div style={{ background: '#F1F5F9', padding: 4, borderRadius: 10, display: 'flex', gap: 4 }}>
                            <Button
                                type={viewMode === 'grid' ? 'primary' : 'text'}
                                icon={<AppstoreOutlined />}
                                onClick={() => setViewMode('grid')}
                                size="small"
                                style={{ borderRadius: 6, width: 32, height: 32, padding: 0 }}
                            />
                            <Button
                                type={viewMode === 'list' ? 'primary' : 'text'}
                                icon={<BarsOutlined />}
                                onClick={() => setViewMode('list')}
                                size="small"
                                style={{ borderRadius: 6, width: 32, height: 32, padding: 0 }}
                            />
                        </div>

                        {/* Filters */}
                        <Select
                            className="filter-select"
                            placeholder="Chuyên mục"
                            allowClear
                            onChange={setSelectedCategory}
                            style={{ width: 180 }}
                        >
                            {categories.map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                            ))}
                        </Select>

                        <Select
                            className="filter-select"
                            placeholder="Năm xuất bản"
                            allowClear
                            onChange={setSelectedYear}
                            style={{ width: 150 }}
                        >
                            {years.map(y => (
                                <Select.Option key={y} value={y}>{y}</Select.Option>
                            ))}
                        </Select>

                        <Select
                            className="filter-select"
                            defaultValue="newest"
                            onChange={setSortBy}
                            style={{ width: 160 }}
                        >
                            {sortOptions.map(o => (
                                <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
                            ))}
                        </Select>
                    </div>

                    {/* Results header */}
                    <div style={{ padding: '16px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space>
                            <div style={{ width: 3, height: 18, background: '#3B82F6', borderRadius: 2 }} />
                            <Text style={{ fontWeight: 600, color: '#64748B', fontSize: 13 }}>
                                Tìm thấy <span style={{ color: '#3B82F6', fontWeight: 700 }}>{total}</span> tài liệu
                            </Text>
                        </Space>
                    </div>

                    {/* Results grid */}
                    <div style={{ padding: '20px 28px 28px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <Spin size="large" />
                                <div style={{ marginTop: 16, color: '#94A3B8', fontWeight: 500 }}>Đang tải tài liệu...</div>
                            </div>
                        ) : documents.length > 0 ? (
                            <div className="fade-in">
                                {viewMode === 'grid' ? (
                                    <Row gutter={[20, 20]}>
                                        {documents.map(doc => (
                                            <Col xs={24} sm={12} lg={8} key={doc.id}>
                                                <DocCard doc={doc} onClick={() => navigate(`/document/${doc.id}`)} viewMode="grid" />
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {documents.map(doc => (
                                            <DocCard key={doc.id} doc={doc} onClick={() => navigate(`/document/${doc.id}`)} viewMode="list" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ padding: '64px 0', textAlign: 'center' }}>
                                <Empty
                                    description={
                                        <div>
                                            <Text style={{ display: 'block', fontWeight: 600, color: '#94A3B8', fontSize: 15 }}>Không tìm thấy tài liệu nào</Text>
                                            <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
                                        </div>
                                    }
                                />
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && total > pageSize && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                <Pagination
                                    current={currentPage}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Content>

            {/* ── TIN TỨC ── */}
            {latestNews.length > 0 && (
                <div style={{ background: '#fff', borderTop: '1px solid #F1F5F9', padding: '64px 24px' }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <Text style={{ color: '#3B82F6', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                    Tin tức & Sự kiện
                                </Text>
                                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.5px' }}>
                                    Cập nhật mới nhất
                                </Title>
                            </div>
                            <Button
                                type="default"
                                icon={<ArrowRightOutlined />}
                                iconPosition="end"
                                onClick={() => navigate('/about')}
                                style={{ fontWeight: 600, borderRadius: 10, borderColor: '#E2E8F0', color: '#475569' }}
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        <Row gutter={[20, 20]}>
                            {latestNews.map((item, i) => (
                                <Col xs={24} md={8} key={item.id}>
                                    <Card
                                        hoverable
                                        onClick={() => navigate(`/news/${item.id}`)}
                                        style={{ borderRadius: 16, border: '1.5px solid #F1F5F9', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
                                        bodyStyle={{ padding: 0 }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        cover={
                                            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                                                <img
                                                    src={item.thumbnail_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}
                                                    alt={item.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                />
                                                {i === 0 && (
                                                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                                                        <Tag color="blue" style={{ borderRadius: 8, fontWeight: 700, border: 'none', fontSize: 11 }}>Nổi bật</Tag>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div style={{ padding: 20 }}>
                                            <Space style={{ marginBottom: 10 }}>
                                                <CalendarOutlined style={{ color: '#94A3B8', fontSize: 12 }} />
                                                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{item.created_at}</Text>
                                            </Space>
                                            <Title level={5} style={{ margin: '0 0 8px', fontWeight: 700, color: '#1E293B', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.title}
                                            </Title>
                                            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}
                                                dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                                            <Text style={{ fontSize: 13, color: '#3B82F6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                Đọc tiếp <ArrowRightOutlined style={{ fontSize: 11 }} />
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            )}

            {/* ── FOOTER ── */}
            <AppFooter />
        </Layout>
    );
};

export default Home;