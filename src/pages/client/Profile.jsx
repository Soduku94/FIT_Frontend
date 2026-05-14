import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    Avatar,
    Typography,
    Tabs,
    Table,
    Tag,
    Button,
    Alert,
    Row,
    Col,
    Spin,
    message,
    Descriptions,
    Form, Input
    , Modal, Space, Divider
} from 'antd';
import { UserOutlined, EditOutlined, FileTextOutlined, BookOutlined, SettingOutlined, MailOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Title, Text } = Typography;

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [myDocuments, setMyDocuments] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const [savedLoading, setSavedLoading] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordForm] = Form.useForm();

    // 1. LẤY THÔNG TIN CÁ NHÂN & TÀI LIỆU
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Bước 1: Gọi API xác thực
                const profileResponse = await api.get('/auth/profile');
                const currentUser = profileResponse.data.user;
                setUser(currentUser);

                // Bước 2: Nếu là Giảng viên/Admin/BTV, gọi API lấy danh sách tài liệu
                if (['lecturer', 'admin', 'editor'].includes(currentUser.role)) {
                    const docResponse = await api.get('/teacher/documents');
                    setMyDocuments(docResponse.data.documents);
                }

                // Bước 3: Lấy tài liệu đã lưu (dành cho tất cả User)
                fetchSavedItems();
                
            } catch (error) {
                message.error(t('profile.fetch_error'));
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const fetchSavedItems = async () => {
        setSavedLoading(true);
        try {
            const savedResponse = await api.get('/client/saved');
            setSavedResources(savedResponse.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách đã lưu:", error);
        } finally {
            setSavedLoading(false);
        }
    };

    const handleUnsave = async (id, type) => {
        try {
            await api.post('/client/saved/toggle', {
                resource_id: id,
                resource_type: type
            });
            message.success('Đã xóa khỏi danh sách lưu');
            fetchSavedItems(); // Refresh list
        } catch (error) {
            message.error('Không thể thực hiện tác vụ này');
        }
    };


    const handleChangePassword = async (values) => {
        setPasswordLoading(true);
        try {
            const response = await api.put('/auth/change-password', {
                old_password: values.old_password,
                new_password: values.new_password
            });
            message.success(t('profile.password_modal.success'));
            setIsPasswordModalOpen(false);
            passwordForm.resetFields(); // Xóa trắng form sau khi đổi thành công
        } catch (error) {
            message.error(error.response?.data?.message || t('profile.password_modal.error'));
        } finally {
            setPasswordLoading(false);
        }
    };




    // 2. CẤU HÌNH CỘT BẢNG TÀI LIỆU CỦA GIẢNG VIÊN
    const documentColumns = [
        { title: t('profile.resources.table.name'), dataIndex: 'title', key: 'title', render: text => <span className="font-medium text-blue-600">{text}</span> },
        { title: t('profile.resources.table.type'), dataIndex: 'doc_type', key: 'doc_type', width: 150 },
        { title: t('profile.resources.table.date'), dataIndex: 'created_at', key: 'created_at', width: 150 },
        {
            title: t('profile.resources.table.status'),
            key: 'status',
            width: 150,
            render: (_, record) => {
                const statusMap = {
                    'draft': { color: 'default', text: t('profile.resources.status.draft') },
                    'pending': { color: 'orange', text: t('profile.resources.status.pending') },
                    'approved': { color: 'green', text: t('profile.resources.status.approved') },
                    'rejected': { color: 'red', text: t('profile.resources.status.rejected') }
                };
                const currentStatus = statusMap[record.status] || statusMap['pending'];
                return <Tag color={currentStatus.color}>{currentStatus.text}</Tag>;
            }
        },
        {
            title: t('profile.resources.table.action'),
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button type="link" size="small"

                        onClick={() => navigate(`/edit/${record.id}`)}>
                    {t('profile.resources.table.edit')}
                </Button>
            )
        }
    ];

    if (loading || !user) {
        return (
            <div className="flex justify-center pt-20 min-h-screen">
                <Spin size="large" tip={t('profile.loading')} />
            </div>
        );
    }

    const isLecturer = ['lecturer', 'admin', 'editor'].includes(user.role);

    // 3. CÁC TAB HIỂN THỊ
    const tabItems = [
        // TAB THÔNG TIN CÁ NHÂN (Dùng chung) - Lấy từ code cũ của bạn sang cho đầy đủ
        {
            key: 'account-info',
            label: <span><UserOutlined /> {t('profile.tabs.account')}</span>,
            children: (
                <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className="mt-4 animate-fade-in bg-white">
                    <Descriptions.Item label={<span><UserOutlined /> {t('profile.account.user_code')}</span>}>{user.user_code}</Descriptions.Item>
                    <Descriptions.Item label={<span><MailOutlined /> {t('profile.account.email')}</span>}>{user.email}</Descriptions.Item>
                    <Descriptions.Item label={<span><BankOutlined /> {t('profile.account.department')}</span>}>{user.department || t('profile.account.not_updated')}</Descriptions.Item>
                    {user.class_name && <Descriptions.Item label={t('profile.account.class')}>{user.class_name}</Descriptions.Item>}
                    <Descriptions.Item label={<span><SafetyCertificateOutlined /> {t('profile.account.role')}</span>}>
                        {user.role === 'admin' ? t('roles.admin') : user.role === 'editor' ? t('roles.editor') : user.role === 'lecturer' ? t('roles.lecturer') : t('roles.student')}
                    </Descriptions.Item>
                </Descriptions>
            )
        },

        // TAB TÀI LIỆU CỦA TÔI (Chỉ hiện cho GV/Admin)
        ...(isLecturer ? [{
            key: 'my-documents',
            label: <span><FileTextOutlined />{t('profile.tabs.resources')}</span>,
            children: (
                <div className="animate-fade-in mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4} className="m-0">{t('profile.resources.title')}</Title>
                        <Button type="primary" onClick={() => navigate('/upload')}>{t('profile.resources.upload_btn')}</Button>
                    </div>

                    <Table
                        columns={documentColumns}
                        dataSource={myDocuments}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: t('profile.resources.empty') }}
                        expandable={{
                            expandedRowRender: record => (
                                record.status === 'rejected' && record.reject_reason ? (
                                    <Alert message={t('profile.resources.reject_reason')} description={record.reject_reason} type="error" showIcon />
                                ) : (
                                    <p className="m-0 text-gray-500">{t('profile.resources.category')}: {record.category_name}</p>
                                )
                            ),
                        }}
                    />
                </div>
            )
        }] : []),

        // TAB TÀI LIỆU ĐÃ LƯU
        {
            key: 'saved-documents',
            label: <span><BookOutlined /> {t('profile.tabs.saved')}</span>,
            children: (
                <div className="animate-fade-in mt-4">
                    <Title level={4} className="mb-6">{t('profile.tabs.saved')}</Title>
                    {savedLoading ? (
                        <div className="text-center py-10"><Spin /></div>
                    ) : savedResources.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {savedResources.map((item) => (
                                <Card 
                                    key={`${item.type}-${item.id}`} 
                                    size="small" 
                                    className="hover:border-blue-300 transition-all shadow-sm"
                                    bodyStyle={{ padding: '16px 24px' }}
                                >
                                    <Row gutter={16} align="middle">
                                        <Col flex="auto">
                                            <Space direction="vertical" size={2}>
                                                <Space>
                                                    <Tag color={item.type === 'news' ? 'orange' : item.type === 'paper' ? 'blue' : 'purple'} className="m-0 uppercase text-[10px] font-bold">
                                                        {item.type === 'news' ? 'Bản tin' : item.type === 'paper' ? 'Bài báo' : 'Dataset'}
                                                    </Tag>
                                                    <Text type="secondary" className="text-xs">{item.saved_at}</Text>
                                                </Space>
                                                <Text 
                                                    strong 
                                                    className="text-base cursor-pointer hover:text-blue-600 block transition-colors"
                                                    onClick={() => navigate(item.type === 'news' ? `/news/${item.id}` : `/document/${item.id}`)}
                                                >
                                                    {item.title}
                                                </Text>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Button 
                                                type="text" 
                                                danger 
                                                className="text-xs font-medium"
                                                onClick={() => handleUnsave(item.id, item.type)}
                                            >
                                                Bỏ lưu
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <BookOutlined className="text-6xl text-gray-200 mb-4" />
                            <Title level={4} className="text-gray-400">{t('profile.saved.empty_title')}</Title>
                            <p className="text-gray-400 mb-6">{t('profile.saved.empty_desc')}</p>
                            <Button type="primary" onClick={() => navigate('/')} className="bg-blue-600 px-8">
                                {t('profile.saved.explore_btn')}
                            </Button>
                        </div>
                    )}
                </div>
            )
        },

        // TAB CÀI ĐẶT & BẢO MẬT
        {
            key: 'settings',
            label: <span><SettingOutlined /> {t('profile.tabs.settings')}</span>,
            children: (
                <div className="max-w-2xl mt-4">
                    <div className="mb-8">
                        <Title level={5} className="mb-4 text-slate-700">{t('profile.settings.security_title')}</Title>
                        <Card size="small" className="bg-white border-slate-200 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center p-2">
                                <Space align="start" size="middle">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <SafetyCertificateOutlined className="text-blue-600 text-lg" />
                                    </div>
                                    <div>
                                        <Text strong className="block text-slate-800">{t('profile.settings.password_title')}</Text>
                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            {t('profile.settings.password_desc')}
                                        </Text>
                                    </div>
                                </Space>
                                <Button 
                                    icon={<EditOutlined />} 
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="rounded-lg font-medium border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                                >
                                    {t('profile.settings.change_password_btn')}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <Divider className="border-slate-100" />

                    <div>
                        <Title level={5} className="mb-4 text-slate-700">{t('profile.settings.personalization_title')}</Title>
                        <Alert 
                            message={t('profile.settings.dev_feature')} 
                            description={t('profile.settings.dev_desc')}
                            type="info"
                            showIcon
                            className="rounded-xl border-blue-50 bg-blue-50"
                        />
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <style>{`
                .profile-header-card {
                    border-radius: 16px !important;
                    border: none !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
                }
                .profile-tabs .ant-tabs-tab {
                    font-weight: 500 !important;
                }
            `}</style>

            {/* HEADER COVER */}
            <div className="bg-blue-600 h-40 w-full"></div>
            
            <div className="max-w-4xl mx-auto px-4 -mt-20">
                {/* USER INFO CARD */}
                <Card className="profile-header-card mb-6" bodyStyle={{ padding: '32px' }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        <Avatar 
                            size={120} 
                            icon={<UserOutlined />} 
                            src={user.avatar_url} 
                            className="border-4 border-white shadow-md bg-blue-500" 
                        />
                        <div className="text-center sm:text-left flex-grow pb-2">
                            <Title level={2} className="m-0 mb-1" style={{ fontWeight: 700 }}>
                                {user.academic_title ? `${user.academic_title}. ` : ''}{user.full_name}
                            </Title>
                            <Space split={<Divider type="vertical" />}>
                                <Text type="secondary" className="font-medium">{user.email}</Text>
                                <Tag color="blue" className="rounded-md font-semibold border-0 bg-blue-50 text-blue-600 uppercase text-[11px]">
                                    {user.role === 'admin' ? t('roles.admin') : user.role === 'editor' ? t('roles.editor') : user.role === 'lecturer' ? t('roles.lecturer') : t('roles.student')}
                                </Tag>
                            </Space>
                        </div>
                    </div>
                </Card>

                {/* CONTENT CARD */}
                <Card className="profile-header-card min-h-[400px]">
                    <Tabs 
                        defaultActiveKey="account-info" 
                        items={tabItems} 
                        className="profile-tabs"
                        size="large"
                    />
                </Card>
            </div>

            {/* PASSWORD MODAL (Simple & Clean) */}
            <Modal
                title={t('profile.password_modal.title')}
                open={isPasswordModalOpen}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                footer={null}
                destroyOnClose
                centered
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    className="mt-4"
                >
                    <Form.Item
                        label={t('profile.password_modal.current')}
                        name="old_password"
                        rules={[{ required: true, message: t('profile.password_modal.current_req') }]}
                    >
                        <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>

                    <Form.Item
                        label={t('profile.password_modal.new')}
                        name="new_password"
                        rules={[
                            { required: true, message: t('profile.password_modal.new_req') },
                            { min: 6, message: t('profile.password_modal.new_min') }
                        ]}
                    >
                        <Input.Password placeholder="Tối thiểu 6 ký tự" size="large" />
                    </Form.Item>

                    <Form.Item
                        label={t('profile.password_modal.confirm')}
                        name="confirm_password"
                        dependencies={['new_password']}
                        rules={[
                            { required: true, message: t('profile.password_modal.confirm_req') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                                    return Promise.reject(new Error(t('profile.password_modal.confirm_mismatch')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-8">
                        <Button onClick={() => setIsPasswordModalOpen(false)}>{t('profile.password_modal.cancel_btn')}</Button>
                        <Button type="primary" htmlType="submit" loading={passwordLoading} className="bg-blue-600">
                            {t('profile.password_modal.update_btn')}
                        </Button>
                    </div>
                </Form>
            </Modal>
            <AppFooter />
        </div>

    );
};

export default Profile;