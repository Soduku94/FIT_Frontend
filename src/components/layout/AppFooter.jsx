import React from 'react';
import { Layout, Typography, Row, Col, Space, Divider } from 'antd';
import { 
    FacebookOutlined, 
    GithubOutlined, 
    LinkedinOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
    return (
        <Footer style={{ 
            background: '#1E293B', 
            padding: '80px 24px 40px',
            color: 'rgba(255, 255, 255, 0.65)' 
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[48, 40]}>
                    {/* Brand Section */}
                    <Col xs={24} md={8}>
                        <div style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
                                FIT <span style={{ color: '#3B82F6' }}>Research Hub</span>
                            </Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 13, display: 'block', marginTop: 8 }}>
                                Kho lưu trữ và chia sẻ tài nguyên nghiên cứu khoa học trực thuộc Khoa Công nghệ Thông tin.
                            </Text>
                        </div>
                        <Space size={16}>
                            <a href="#" style={{ color: 'inherit', fontSize: 20 }} className="footer-social-icon"><FacebookOutlined /></a>
                            <a href="#" style={{ color: 'inherit', fontSize: 20 }} className="footer-social-icon"><LinkedinOutlined /></a>
                            <a href="#" style={{ color: 'inherit', fontSize: 20 }} className="footer-social-icon"><GithubOutlined /></a>
                        </Space>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={12} md={4}>
                        <Title level={5} style={{ color: '#fff', marginBottom: 24, fontSize: 16 }}>Khám phá</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: 12 }}><Link to="/" style={{ color: 'inherit' }}>Trang chủ</Link></li>
                            <li style={{ marginBottom: 12 }}><Link to="/documents" style={{ color: 'inherit' }}>Tài liệu</Link></li>
                            <li style={{ marginBottom: 12 }}><Link to="/news" style={{ color: 'inherit' }}>Tin tức</Link></li>
                            <li style={{ marginBottom: 12 }}><Link to="/about" style={{ color: 'inherit' }}>Về chúng tôi</Link></li>
                        </ul>
                    </Col>

                    {/* Resources */}
                    <Col xs={12} md={4}>
                        <Title level={5} style={{ color: '#fff', marginBottom: 24, fontSize: 16 }}>Tài nguyên</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: 12 }}><a href="#" style={{ color: 'inherit' }}>Hướng dẫn sử dụng</a></li>
                            <li style={{ marginBottom: 12 }}><a href="#" style={{ color: 'inherit' }}>Chính sách bảo mật</a></li>
                            <li style={{ marginBottom: 12 }}><a href="#" style={{ color: 'inherit' }}>Điều khoản dịch vụ</a></li>
                            <li style={{ marginBottom: 12 }}><a href="#" style={{ color: 'inherit' }}>Hỗ trợ kỹ thuật</a></li>
                        </ul>
                    </Col>

                    {/* Contact Info */}
                    <Col xs={24} md={8}>
                        <Title level={5} style={{ color: '#fff', marginBottom: 24, fontSize: 16 }}>Liên hệ</Title>
                        <Space direction="vertical" size={16}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <EnvironmentOutlined style={{ color: '#3B82F6', marginTop: 4 }} />
                                <Text style={{ color: 'inherit' }}>Số 123, Đường ABC, Quận XYZ, TP. Hồ Chí Minh</Text>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <PhoneOutlined style={{ color: '#3B82F6' }} />
                                <Text style={{ color: 'inherit' }}>(+84) 123 456 789</Text>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <MailOutlined style={{ color: '#3B82F6' }} />
                                <Text style={{ color: 'inherit' }}>contact@fit.edu.vn</Text>
                            </div>
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '40px 0 24px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 12 }}>
                        © 2026 Khoa Công nghệ Thông tin · FIT Research Hub. All rights reserved.
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 12 }}>
                        Phát triển bởi <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Đội ngũ Kỹ thuật FIT</span>
                    </Text>
                </div>
            </div>

            <style>{`
                .footer-social-icon:hover {
                    color: #3B82F6 !important;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                footer a:hover {
                    color: #fff !important;
                }
            `}</style>
        </Footer>
    );
};

export default AppFooter;
