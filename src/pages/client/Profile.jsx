import React, { useState, useEffect } from 'react';
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
    Form,Input
    ,Modal
} from 'antd';
import { UserOutlined, EditOutlined, FileTextOutlined, BookOutlined, SettingOutlined, MailOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppFooter from '../../components/layout/AppFooter';

const { Title, Text } = Typography;

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [myDocuments, setMyDocuments] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordForm] = Form.useForm();

    // 1. LẤY THÔNG TIN CÁ NHÂN & TÀI LIỆU
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Bước 1: Gọi API xác thực hệt như code cũ của bạn
                const profileResponse = await api.get('/auth/profile');
                const currentUser = profileResponse.data.user;
                setUser(currentUser);

                // Bước 2: Nếu là Giảng viên/Admin/BTV, gọi API lấy danh sách tài liệu
                if (['lecturer', 'admin', 'editor'].includes(currentUser.role)) {
                    const docResponse = await api.get('/teacher/documents');
                    setMyDocuments(docResponse.data.documents);
                }
            } catch (error) {
                message.error('Phiên đăng nhập hết hạn hoặc lỗi tải dữ liệu!');
                navigate('/login'); // Bị lỗi thật mới đá ra ngoài
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);


    const handleChangePassword = async (values) => {
        setPasswordLoading(true);
        try {
            const response = await api.put('/auth/change-password', {
                old_password: values.old_password,
                new_password: values.new_password
            });
            message.success(response.data.message);
            setIsPasswordModalOpen(false);
            passwordForm.resetFields(); // Xóa trắng form sau khi đổi thành công
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
        } finally {
            setPasswordLoading(false);
        }
    };




    // 2. CẤU HÌNH CỘT BẢNG TÀI LIỆU CỦA GIẢNG VIÊN
    const documentColumns = [
        { title: 'Tên tài liệu', dataIndex: 'title', key: 'title', render: text => <span className="font-medium text-blue-600">{text}</span> },
        { title: 'Loại', dataIndex: 'doc_type', key: 'doc_type', width: 150 },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', width: 150 },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 150,
            render: (_, record) => {
                const statusMap = {
                    'draft': { color: 'default', text: 'Bản nháp' },
                    'pending': { color: 'orange', text: 'Đang chờ duyệt' },
                    'approved': { color: 'green', text: 'Đã xuất bản' },
                    'rejected': { color: 'red', text: 'Bị từ chối' }
                };
                const currentStatus = statusMap[record.status] || statusMap['pending'];
                return <Tag color={currentStatus.color}>{currentStatus.text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button type="link" size="small"

                        onClick={() => navigate(`/edit/${record.id}`)}>
                    Chỉnh sửa
                </Button>
            )
        }
    ];

    if (loading || !user) {
        return (
            <div className="flex justify-center pt-20 min-h-screen">
                <Spin size="large" tip="Đang tải thông tin cá nhân..." />
            </div>
        );
    }

    const isLecturer = ['lecturer', 'admin', 'editor'].includes(user.role);

    // 3. CÁC TAB HIỂN THỊ
    const tabItems = [
        // TAB THÔNG TIN CÁ NHÂN (Dùng chung) - Lấy từ code cũ của bạn sang cho đầy đủ
        {
            key: 'account-info',
            label: <span><UserOutlined />Thông tin tài khoản</span>,
            children: (
                <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className="mt-4 animate-fade-in bg-white">
                    <Descriptions.Item label={<span><UserOutlined /> Mã số</span>}>{user.user_code}</Descriptions.Item>
                    <Descriptions.Item label={<span><MailOutlined /> Email</span>}>{user.email}</Descriptions.Item>
                    <Descriptions.Item label={<span><BankOutlined /> Đơn vị/Khoa</span>}>{user.department || 'Chưa cập nhật'}</Descriptions.Item>
                    {user.class_name && <Descriptions.Item label="Lớp">{user.class_name}</Descriptions.Item>}
                    <Descriptions.Item label={<span><SafetyCertificateOutlined /> Quyền hạn</span>}>
                        {user.role === 'admin' ? 'Quản trị viên' : user.role === 'editor' ? 'Quản trị nội dung' : user.role === 'lecturer' ? 'Giảng viên' : 'Sinh viên'}
                    </Descriptions.Item>
                </Descriptions>
            )
        },

        // TAB TÀI LIỆU CỦA TÔI (Chỉ hiện cho GV/Admin)
        ...(isLecturer ? [{
            key: 'my-documents',
            label: <span><FileTextOutlined />Quản lý tài nguyên</span>,
            children: (
                <div className="animate-fade-in mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4} className="m-0">Kho tài nguyên của tôi</Title>
                        <Button type="primary" onClick={() => navigate('/upload')}>+ Tải lên tài liệu mới</Button>
                    </div>

                    <Table
                        columns={documentColumns}
                        dataSource={myDocuments}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: 'Bạn chưa tải lên tài liệu nào.' }}
                        expandable={{
                            expandedRowRender: record => (
                                record.status === 'rejected' && record.reject_reason ? (
                                    <Alert message="Lý do bị Quản trị viên từ chối:" description={record.reject_reason} type="error" showIcon />
                                ) : (
                                    <p className="m-0 text-gray-500">Chuyên ngành: {record.category_name}</p>
                                )
                            ),
                        }}
                    />
                </div>
            )
        }] : []),

        // TAB TÀI LIỆU ĐÃ LƯU (Chỉ hiện cho Sinh viên)
        ...(!isLecturer ? [{
            key: 'saved-documents',
            label: <span><BookOutlined />Tài liệu đã lưu</span>,
            children: (
                <div className="animate-fade-in text-center py-10 mt-4">
                    <BookOutlined className="text-6xl text-gray-300 mb-4" />
                    <Title level={4} className="text-gray-500">Bạn chưa lưu tài liệu nào</Title>
                    <p className="text-gray-400">Hãy lướt trang chủ và bấm Lưu những bài báo bạn quan tâm nhé.</p>
                    <Button type="primary" onClick={() => navigate('/')}>Khám phá ngay</Button>
                </div>
            )
        }] : []),

        // TAB CÀI ĐẶT
        {
            key: 'settings',
            label: <span><SettingOutlined />Cài đặt</span>,
            children: (
                <div className="animate-fade-in max-w-lg mt-4">
                    <Button
                        type="primary"
                        className="mb-4"
                        onClick={() => setIsPasswordModalOpen(true)}
                    >
                        Đổi mật khẩu
                    </Button>
                    <p className="text-gray-500 text-sm">Các tính năng cập nhật hồ sơ sẽ sớm được ra mắt.</p>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <Card className="shadow-sm rounded-xl border-0 mb-6 overflow-hidden" bodyStyle={{ padding: 0 }}>
                    {/* Bìa cover màu xanh giống code cũ của bạn */}
                    <div className="bg-blue-600 h-32 w-full"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-4 flex items-end gap-4">
                            <Avatar size={100} icon={<UserOutlined />} src={user.avatar_url} className="border-4 border-white bg-blue-500 shadow-lg" />
                            <div className="mb-2">
                                <Title level={2} className="m-0 text-gray-800">
                                    {user.academic_title ? `${user.academic_title}. ` : ''}{user.full_name}
                                </Title>
                                <Text className="text-gray-500 text-lg">{user.email}</Text>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="shadow-sm rounded-xl border-0 min-h-[500px]">
                    <Tabs defaultActiveKey="account-info" items={tabItems} size="large" />
                </Card>
            </div>
            <Modal
                title="Đổi Mật Khẩu"
                open={isPasswordModalOpen}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    className="mt-4"
                >
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="old_password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="new_password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirm_password"
                        dependencies={['new_password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right mt-6">
                        <Button onClick={() => setIsPasswordModalOpen(false)} className="mr-2">Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={passwordLoading} className="bg-blue-600">
                            Cập nhật mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <AppFooter />
        </div>

    );
};

export default Profile;