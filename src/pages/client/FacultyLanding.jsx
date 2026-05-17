import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Row, Col, Button, Card, Divider, Space, Timeline } from 'antd';
import { 
    TrophyOutlined, TeamOutlined, GlobalOutlined, RocketOutlined, 
    DoubleRightOutlined, CheckCircleFilled, BuildOutlined, ExperimentOutlined,
    EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookOutlined, LinkedinOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const FacultyLanding = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* HERO SECTION - THE FACE OF FIT */}
            <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                        alt="Faculty Background" 
                        className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 mb-6 animate-fade-in">
                        <Text className="text-blue-300 font-bold tracking-widest uppercase text-xs">{t('faculty.hero.welcome')}</Text>
                    </div>
                    <Title className="text-white m-0 text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-fade-in-up">
                        {t('faculty.hero.title_line1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t('faculty.hero.title_line2')}</span>
                    </Title>
                    <Paragraph className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 animate-fade-in-up delay-200">
                        {t('faculty.hero.description')}
                    </Paragraph>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Button type="primary" size="large" className="w-full sm:w-auto h-14 px-10 rounded-full bg-blue-600 border-none text-lg font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                            {t('faculty.hero.explore_btn')}
                        </Button>
                        <Button ghost size="large" className="w-full sm:w-auto h-14 px-10 rounded-full border-2 text-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
                            {t('faculty.hero.contact_btn')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* ACHIEVEMENTS SECTION - NUMBERS DON'T LIE */}
            <section className="py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <Row gutter={[40, 40]} justify="center">
                        {[
                            { icon: <TeamOutlined />, count: "25+", label: t('faculty.stats.experience'), color: "blue" },
                            { icon: <TrophyOutlined />, count: "100+", label: t('faculty.stats.awards'), color: "yellow" },
                            { icon: <GlobalOutlined />, count: "5000+", label: t('faculty.stats.students'), color: "green" },
                            { icon: <RocketOutlined />, count: "98%", label: t('faculty.stats.employment'), color: "indigo" }
                        ].map((stat, i) => (
                            <Col xs={24} sm={12} md={6} key={i}>
                                <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl text-blue-600 group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <Title level={1} className="m-0 font-black text-gray-800 text-3xl md:text-4xl">{stat.count}</Title>
                                    <Text className="text-gray-400 font-medium uppercase tracking-wider text-[10px] md:text-xs">{stat.label}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* IDENTITY & BRANDING - THE CORE VALUES */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <Row gutter={[80, 60]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full z-0 opacity-50"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                alt="Mission" 
                                className="rounded-3xl shadow-2xl relative z-10 w-full"
                            />
                           
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div className="space-y-8">
                            <div>
                                <Text className="text-blue-600 font-black tracking-widest uppercase text-sm">{t('faculty.about.tagline')}</Text>
                                <Title className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-6">
                                    {t('faculty.about.title')}
                                </Title>
                                <Paragraph className="text-gray-600 text-lg leading-relaxed">
                                    {t('faculty.about.description')}
                                </Paragraph>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: t('faculty.about.feature1_title'), desc: t('faculty.about.feature1_desc') },
                                    { title: t('faculty.about.feature2_title'), desc: t('faculty.about.feature2_desc') },
                                    { title: t('faculty.about.feature3_title'), desc: t('faculty.about.feature3_desc') }
                                ].map((item, i) => (
                                    <div className="flex gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-colors" key={i}>
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                            <BuildOutlined />
                                        </div>
                                        <div>
                                            <Title level={5} className="m-0 text-gray-800">{item.title}</Title>
                                            <Text className="text-gray-500">{item.desc}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* LECTURERS SECTION - MEMBERS OF THE FACULTY */}
            <section className="py-24 bg-gray-50 border-t border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                                Đội ngũ giảng viên
                            </span>
                        </div>
                        <Title level={2} className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            Ban Chủ Nhiệm & Giảng Viên Tiêu Biểu
                        </Title>
                        <Paragraph className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Những người thầy, cô tâm huyết, giàu kinh nghiệm, luôn đồng hành cùng sinh viên trên con đường chinh phục tri thức và sáng tạo công nghệ.
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 40]} justify="center">
                        {[
                            {
                                name: "PGS. TS. Trần Xuân Tú",
                                role: "Trưởng khoa Công nghệ Thông tin",
                                email: "tutx@hanu.edu.vn",
                                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
                                desc: "Hơn 20 năm kinh nghiệm nghiên cứu và giảng dạy trong lĩnh vực Hệ thống nhúng và Trí tuệ nhân tạo.",
                                linkedin: "https://linkedin.com",
                                facebook: "https://facebook.com"
                            },
                            {
                                name: "TS. Nguyễn Thị Minh",
                                role: "Phó Trưởng khoa Công nghệ Thông tin",
                                email: "minhnt@hanu.edu.vn",
                                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
                                desc: "Chuyên gia về Học máy, Xử lý ngôn ngữ tự nhiên và Khoa học dữ liệu, tu nghiệp tại CHLB Đức.",
                                linkedin: "https://linkedin.com",
                                facebook: "https://facebook.com"
                            },
                            {
                                name: "TS. Lê Văn Huy",
                                role: "Trưởng bộ môn Khoa học Máy tính",
                                email: "huylv@hanu.edu.vn",
                                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
                                desc: "Nghiên cứu chuyên sâu về Công nghệ Blockchain, Phát triển Phần mềm An toàn và Hệ thống phân tán.",
                                linkedin: "https://linkedin.com",
                                facebook: "https://facebook.com"
                            },
                            {
                                name: "TS. Phạm Ngọc Anh",
                                role: "Trưởng bộ môn Công nghệ Phần mềm",
                                email: "anhpn@hanu.edu.vn",
                                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80",
                                desc: "Chuyên gia Mạng máy tính, An toàn thông tin và Điện toán đám mây với nhiều chứng chỉ quốc tế uy tín.",
                                linkedin: "https://linkedin.com",
                                facebook: "https://facebook.com"
                            }
                        ].map((lecturer, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                                    {/* Image Wrapper */}
                                    <div className="relative pt-[100%] overflow-hidden bg-gray-50">
                                        <img 
                                            src={lecturer.avatar} 
                                            alt={lecturer.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                            <Space size={12}>
                                                <a href={`mailto:${lecturer.email}`} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all animate-fade-in">
                                                    <MailOutlined className="text-lg" />
                                                </a>
                                                <a href={lecturer.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all animate-fade-in">
                                                    <LinkedinOutlined className="text-lg" />
                                                </a>
                                                <a href={lecturer.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all animate-fade-in">
                                                    <FacebookOutlined className="text-lg" />
                                                </a>
                                            </Space>
                                        </div>
                                    </div>
                                    
                                    {/* Info Content */}
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <Title level={4} className="m-0 text-gray-800 font-bold mb-1 group-hover:text-blue-600 transition-colors">
                                                {lecturer.name}
                                            </Title>
                                            <Text className="text-blue-600 font-semibold block text-sm mb-3">
                                                {lecturer.role}
                                            </Text>
                                            <Paragraph className="text-gray-500 text-sm leading-relaxed mb-4">
                                                {lecturer.desc}
                                            </Paragraph>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors">
                                            <MailOutlined className="text-xs" />
                                            <span className="text-xs font-medium">{lecturer.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* MILESTONES - TIMELINE OF SUCCESS */}
            <section className="py-24 bg-blue-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Title className="text-white text-4xl md:text-5xl font-black mb-4" style={{ color: 'white' }}>{t('faculty.milestones.title')}</Title>
                        <Text className="text-blue-300 text-lg">{t('faculty.milestones.subtitle')}</Text>
                    </div>

                    <div className="timeline-wrapper">
                        <Timeline 
                            mode={window.innerWidth < 768 ? "left" : "alternate"}
                            items={[
                                { label: <span className="text-blue-300 font-bold">{t('faculty.milestones.m1_year')}</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">{t('faculty.milestones.m1_title')}</Title><Text className="text-blue-100">{t('faculty.milestones.m1_desc')}</Text></div> },
                                { label: <span className="text-blue-300 font-bold">{t('faculty.milestones.m2_year')}</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">{t('faculty.milestones.m2_title')}</Title><Text className="text-blue-100">{t('faculty.milestones.m2_desc')}</Text></div> },
                                { label: <span className="text-blue-300 font-bold">{t('faculty.milestones.m3_year')}</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">{t('faculty.milestones.m3_title')}</Title><Text className="text-blue-100">{t('faculty.milestones.m3_desc')}</Text></div> },
                                { label: <span className="text-blue-300 font-bold">{t('faculty.milestones.m4_year')}</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">{t('faculty.milestones.m4_title')}</Title><Text className="text-blue-100">{t('faculty.milestones.m4_desc')}</Text></div> },
                            ]}
                        />
                    </div>
                    
                </div>
            </section>

            {/* CONTACT & FOOTER SECTION */}
            <section style={{ background: '#0F172A', padding: '100px 24px 60px', color: '#94A3B8' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Row gutter={[40, 40]}>
                        <Col xs={24} md={10}>
                            <Title level={2} style={{ color: '#fff', fontWeight: 900, marginBottom: 24 }} className="text-3xl md:text-4xl">
                                <span style={{ color: '#3B82F6' }}>Faculty of Information Technology</span>
                            </Title>
                            <Paragraph style={{ color: '#64748B', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                                {t('faculty.footer.description')}
                            </Paragraph>
                            <Space size={20} wrap>
                                <div className="social-pill"><FacebookOutlined /></div>
                                <div className="social-pill"><LinkedinOutlined /></div>
                                <div className="social-pill"><GlobalOutlined /></div>
                            </Space>
                        </Col>
                        
                        <Col xs={24} sm={12} md={7}>
                            <Title level={4} style={{ color: '#fff', marginBottom: 28 }}>{t('faculty.footer.quick_links')}</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }} onClick={() => navigate('/')}>{t('faculty.footer.link_docs')}</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>{t('faculty.footer.link_curriculum')}</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>{t('faculty.footer.link_lecturers')}</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>{t('faculty.footer.link_admission')}</Text>
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={7}>
                            <Title level={4} style={{ color: '#fff', marginBottom: 28 }}>{t('faculty.footer.office')}</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <EnvironmentOutlined style={{ color: '#3B82F6', fontSize: 20, flexShrink: 0 }} />
                                    <Text style={{ color: 'inherit' }}> {t('faculty.footer.address')}</Text>
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <PhoneOutlined style={{ color: '#3B82F6', fontSize: 20, flexShrink: 0 }} />
                                    <Text style={{ color: 'inherit' }}>(024) 3764 3205</Text>
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <MailOutlined style={{ color: '#3B82F6', fontSize: 20, flexShrink: 0 }} />
                                    <Text style={{ color: 'inherit' }}>fit@hanu.edu.vn</Text>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '80px 0 40px' }} />

                    <div style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#475569', fontSize: 14 }}>
                            © 2026 Faculty of Information Technology 
                        </Text>
                    </div>
                </div>

                <style>{`
                    .social-pill {
                        width: 48px;
                        height: 48px;
                        border-radius: 14px;
                        background: rgba(255,255,255,0.03);
                        border: 1px solid rgba(255,255,255,0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        color: #fff;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                    .social-pill:hover {
                        background: #3B82F6;
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(59,130,246,0.2);
                    }
                `}</style>
            </section>
        </div>
    );
};

export default FacultyLanding;
