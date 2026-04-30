import React from 'react';
import { Typography, Row, Col, Button, Card, Divider, Space, Timeline } from 'antd';
import { 
    TrophyOutlined, TeamOutlined, GlobalOutlined, RocketOutlined, 
    DoubleRightOutlined, CheckCircleFilled, BuildOutlined, ExperimentOutlined,
    EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookOutlined, LinkedinOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const FacultyLanding = () => {
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
                        <Text className="text-blue-300 font-bold tracking-widest uppercase text-xs">Chào mừng bạn đến với</Text>
                    </div>
                    <Title className="text-white m-0 text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-fade-in-up">
                        KHOA CÔNG NGHỆ <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">THÔNG TIN</span>
                    </Title>
                    <Paragraph className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 animate-fade-in-up delay-200">
                        Nơi khơi nguồn đam mê, kiến tạo tương lai số và khẳng định vị thế dẫn đầu trong đào tạo nghiên cứu công nghệ.
                    </Paragraph>
                    <Space size="large" className="animate-fade-in-up delay-300">
                        <Button type="primary" size="large" className="h-14 px-10 rounded-full bg-blue-600 border-none text-lg font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                            Khám phá ngay
                        </Button>
                        <Button ghost size="large" className="h-14 px-10 rounded-full border-2 text-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
                            Liên hệ tư vấn
                        </Button>
                    </Space>
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
                            { icon: <TeamOutlined />, count: "25+", label: "Năm kinh nghiệm", color: "blue" },
                            { icon: <TrophyOutlined />, count: "100+", label: "Giải thưởng NCKH", color: "yellow" },
                            { icon: <GlobalOutlined />, count: "5000+", label: "Sinh viên thành đạt", color: "green" },
                            { icon: <RocketOutlined />, count: "98%", label: "Tỷ lệ có việc làm", color: "indigo" }
                        ].map((stat, i) => (
                            <Col xs={12} md={6} lg={6} key={i}>
                                <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl text-blue-600 group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <Title level={1} className="m-0 font-black text-gray-800">{stat.count}</Title>
                                    <Text className="text-gray-400 font-medium uppercase tracking-wider text-xs">{stat.label}</Text>
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
                                <Text className="text-blue-600 font-black tracking-widest uppercase text-sm">Về chúng tôi</Text>
                                <Title className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-6">
                                    Xây dựng nền tảng tri thức vững chắc
                                </Title>
                                <Paragraph className="text-gray-600 text-lg leading-relaxed">
                                    Khoa Công nghệ Thông tin cam kết cung cấp một môi trường học tập năng động, sáng tạo, nơi sinh viên không chỉ học lý thuyết mà còn được rèn luyện kỹ năng thực tế thông qua các dự án lớn và sự hỗ trợ từ các doanh nghiệp hàng đầu.
                                </Paragraph>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: "Đội ngũ giảng viên tinh hoa", desc: "Các giáo sư, tiến sĩ giàu kinh nghiệm tu nghiệp tại nước ngoài." },
                                    { title: "Chương trình học thực tiễn", desc: "Cập nhật liên tục theo xu hướng công nghệ mới nhất như AI, Blockchain." },
                                    { title: "Cơ sở vật chất hiện đại", desc: "Hệ thống phòng Lab, máy chủ hiệu năng cao phục vụ nghiên cứu." }
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
                        <Title className="text-white text-4xl md:text-5xl font-black mb-4" style={{ color: 'white' }}>Hành trình phát triển</Title>
                        <Text className="text-blue-300 text-lg">Những cột mốc quan trọng khẳng định vị thế của Khoa</Text>
                    </div>

                    <Timeline 
                        mode="alternate"
                        items={[
                            { label: <span className="text-blue-300 font-bold">2000</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">Thành lập Khoa</Title><Text className="text-blue-100">Khởi đầu hành trình đào tạo nguồn nhân lực CNTT chất lượng cao.</Text></div> },
                            { label: <span className="text-blue-300 font-bold">2010</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">Đạt chuẩn Kiểm định Quốc tế</Title><Text className="text-blue-100">Chương trình đào tạo được công nhận bởi các tổ chức uy tín.</Text></div> },
                            { label: <span className="text-blue-300 font-bold">2018</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">Trung tâm Lab AI hiện đại</Title><Text className="text-blue-100">Khánh thành trung tâm nghiên cứu AI và Big Data quy mô lớn.</Text></div> },
                            { label: <span className="text-blue-300 font-bold">Nay</span>, children: <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20"><Title level={5} className="text-white">Top 1 Đào tạo CNTT</Title><Text className="text-blue-100">Khẳng định vị thế dẫn đầu trong khu vực về NCKH và Đào tạo.</Text></div> },
                        ]}
                    />
                    
                </div>
            </section>

            {/* CONTACT & FOOTER SECTION */}
            <section style={{ background: '#0F172A', padding: '100px 24px 60px', color: '#94A3B8' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Row gutter={[64, 40]}>
                        <Col xs={24} md={10}>
                            <Title level={2} style={{ color: '#fff', fontWeight: 900, marginBottom: 24 }}>
                                <span style={{ color: '#3B82F6' }}>Faculty of Information Technology</span>
                            </Title>
                            <Paragraph style={{ color: '#64748B', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                                Khoa Công nghệ Thông tin - Nơi đào tạo những thế hệ kỹ sư, chuyên gia công nghệ hàng đầu, 
                                sẵn sàng chinh phục những đỉnh cao mới trong kỷ nguyên số.
                            </Paragraph>
                            <Space size={20}>
                                <div className="social-pill"><FacebookOutlined /></div>
                                <div className="social-pill"><LinkedinOutlined /></div>
                                <div className="social-pill"><GlobalOutlined /></div>
                            </Space>
                        </Col>
                        
                        <Col xs={24} sm={12} md={7}>
                            <Title level={4} style={{ color: '#fff', marginBottom: 28 }}>Liên kết nhanh</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }} onClick={() => navigate('/')}>Hệ thống Tài liệu</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>Chương trình Đào tạo</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>Đội ngũ Giảng viên</Text>
                                <Text style={{ color: 'inherit', cursor: 'pointer' }}>Tuyển sinh 2026</Text>
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={7}>
                            <Title level={4} style={{ color: '#fff', marginBottom: 28 }}>Văn phòng Khoa</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <EnvironmentOutlined style={{ color: '#3B82F6', fontSize: 20 }} />
                                    <Text style={{ color: 'inherit' }}> Trường Đại học Hà Nội, Phòng 201C, Phường Đại Mỗ ,Quận Nam Từ Liêm, Thành phố Hà Nội</Text>
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <PhoneOutlined style={{ color: '#3B82F6', fontSize: 20 }} />
                                    <Text style={{ color: 'inherit' }}>(024) 3764 3205</Text>
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <MailOutlined style={{ color: '#3B82F6', fontSize: 20 }} />
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
