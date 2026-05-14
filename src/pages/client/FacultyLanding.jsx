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

                {/* Scroll Down Indicator */}
                {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-transparent"></div>
                </div> */}
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
