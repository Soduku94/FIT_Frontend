import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message, Switch, Tooltip, Row, Col, Upload, Tabs, Badge, Card } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    SafetyCertificateOutlined,
    UploadOutlined,
    InboxOutlined,
    UserOutlined,
    TeamOutlined,
    SecurityScanOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;
const { Dragger } = Upload;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [activeTab, setActiveTab] = useState('student');

    const selectedRole = Form.useWatch('role', form);

    const fetchUsers = async (searchKeyword = '') => {
        setLoading(true);
        try {
            const url = searchKeyword ? `/admin/users?search=${searchKeyword}` : '/admin/users';
            const response = await api.get(url);
            setUsers(response.data.users);
        } catch (error) {
            message.error('Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const response = await api.put(`/admin/users/${userId}/toggle-status`);
            message.success(response.data.message);
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi khi cập nhật trạng thái!');
        }
    };

    const openModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({ ...user, password: '' });
        } else {
            form.resetFields();
            form.setFieldsValue({ role: activeTab === 'management' ? 'admin' : activeTab, is_active: true });
        }
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingUser) {
                const response = await api.put(`/admin/users/${editingUser.id}`, values);
                message.success(response.data.message);
            } else {
                const response = await api.post('/admin/users', values);
                message.success(`Tạo thành công! Mật khẩu mặc định là: ${response.data.default_password}`);
            }

            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.message);
            }
        }
    };

    const handleImportExcel = async () => {
        if (!importFile) {
            message.error("Vui lòng chọn file Excel!");
            return;
        }

        const formData = new FormData();
        formData.append('file', importFile);

        setImporting(true);
        try {
            const response = await api.post('/admin/users/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            message.success(response.data.message);
            if (response.data.errors && response.data.errors.length > 0) {
                Modal.warning({
                    title: 'Chi tiết nhập liệu',
                    content: (
                        <div className="max-h-60 overflow-y-auto">
                            <p>Một số dòng bị bỏ qua:</p>
                            <ul>{response.data.errors.map((err, i) => <li key={i} className="text-red-500">{err}</li>)}</ul>
                        </div>
                    )
                });
            }
            setIsImportModalVisible(false);
            setImportFile(null);
            fetchUsers();
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi khi tải file lên!');
        } finally {
            setImporting(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
            if (!isExcel) {
                message.error('Chỉ hỗ trợ định dạng file .xlsx!');
                return Upload.LIST_IGNORE;
            }
            setImportFile(file);
            return false;
        },
        onRemove: () => setImportFile(null),
        maxCount: 1,
    };

    // Lọc người dùng theo tab đang chọn
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            if (activeTab === 'student') return user.role === 'student';
            if (activeTab === 'lecturer') return user.role === 'lecturer';
            if (activeTab === 'management') return user.role === 'admin' || user.role === 'editor';
            return true;
        });
    }, [users, activeTab]);

    // Tính toán số lượng cho Badge
    const counts = useMemo(() => ({
        student: users.filter(u => u.role === 'student').length,
        lecturer: users.filter(u => u.role === 'lecturer').length,
        management: users.filter(u => u.role === 'admin' || u.role === 'editor').length,
    }), [users]);

    const columns = [
        {
            title: 'Mã số',
            dataIndex: 'user_code',
            key: 'user_code',
            width: '12%',
            render: (code) => <Tag color="default" className="font-mono font-bold">{code}</Tag>
        },
        {
            title: 'Họ và tên',
            key: 'full_name',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                        {record.full_name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">
                            {record.academic_title ? `${record.academic_title}. ` : ''} {record.full_name}
                        </div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: '15%',
            render: (role) => {
                let color = role === 'admin' ? 'red' : role === 'editor' ? 'orange' : role === 'lecturer' ? 'blue' : 'green';
                let text = role === 'admin' ? 'Quản trị viên' : role === 'editor' ? 'Biên tập viên' : role === 'lecturer' ? 'Giảng viên' : 'Sinh viên';
                return <Tag color={color} className="rounded-full px-3">{text}</Tag>;
            },
        },
        {
            title: 'Khoa / Đơn vị',
            dataIndex: 'department',
            key: 'department',
            render: (text) => text || <span className="text-gray-300 italic">Chưa cập nhật</span>
        },
        {
            title: 'Trạng thái',
            key: 'is_active',
            align: 'center',
            width: '10%',
            render: (_, record) => (
                <Tooltip title={record.is_active ? "Đang hoạt động - Nhấn để Khóa" : "Đang bị khóa - Nhấn để Mở"}>
                    <Switch
                        checked={record.is_active}
                        onChange={() => handleToggleStatus(record.id, record.is_active)}
                        size="small"
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            align: 'center',
            width: '10%',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined className="text-blue-500" />}
                    onClick={() => openModal(record)}
                />
            ),
        },
    ];

    const tabItems = [
        {
            key: 'student',
            label: (
                <Space>
                    <TeamOutlined />
                    Sinh viên
                    <Badge count={counts.student} overflowCount={999} style={{ backgroundColor: activeTab === 'student' ? '#3B82F6' : '#94A3B8' }} />
                </Space>
            ),
        },
        {
            key: 'lecturer',
            label: (
                <Space>
                    <UserOutlined />
                    Giảng viên
                    <Badge count={counts.lecturer} overflowCount={999} style={{ backgroundColor: activeTab === 'lecturer' ? '#3B82F6' : '#94A3B8' }} />
                </Space>
            ),
        },
        {
            key: 'management',
            label: (
                <Space>
                    <SecurityScanOutlined />
                    Quản trị & Kiểm duyệt
                    <Badge count={counts.management} overflowCount={999} style={{ backgroundColor: activeTab === 'management' ? '#3B82F6' : '#94A3B8' }} />
                </Space>
            ),
        },
    ];

    return (
        <div className="bg-gray-50 min-h-full p-6 animate-fade-in">
            <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 m-0">Quản lý Tài khoản</h2>
                        <p className="text-gray-500 mt-1">Phân quyền và quản lý người dùng hệ thống</p>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Search
                            placeholder="Tìm theo tên, email, mã số..."
                            allowClear
                            onSearch={(value) => fetchUsers(value)}
                            className="w-full md:w-72"
                        />
                        <Button 
                            icon={<UploadOutlined />} 
                            onClick={() => setIsImportModalVisible(true)}
                            className="flex-1 md:flex-none border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            Nhập Excel
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => openModal()}
                            className="flex-1 md:flex-none bg-blue-600 shadow-blue-100 shadow-lg"
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Tabs & Table Section */}
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    items={tabItems}
                    className="user-management-tabs"
                />

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={{ 
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total} tài khoản`
                    }}
                    className="mt-2"
                />
            </Card>

            {/* MODAL THÊM / SỬA NGƯỜI DÙNG */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <EditOutlined className="text-blue-500" />
                        <span>{editingUser ? "Cập nhật Thông tin" : "Tạo Tài khoản mới"}</span>
                    </div>
                }
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={800}
                okText={editingUser ? "Cập nhật ngay" : "Tạo tài khoản"}
                cancelText="Hủy bỏ"
                okButtonProps={{ className: "bg-blue-600" }}
            >
                <Form form={form} layout="vertical" className="mt-6">
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item name="user_code" label="Mã số (MSSV / Mã GV)"
                                       rules={[{ required: true, message: 'Vui lòng nhập mã số định danh' }]}>
                                <Input placeholder="Ví dụ: B20DCCN123" className="rounded-lg h-10" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="role" label="Vai trò người dùng" rules={[{ required: true }]}>
                                <Select className="h-10">
                                    <Option value="student">Sinh viên</Option>
                                    <Option value="lecturer">Giảng viên</Option>
                                    <Option value="editor">Biên tập viên (Mod)</Option>
                                    <Option value="admin">Quản trị viên (Admin)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item name="full_name" label="Họ và Tên"
                                       rules={[{ required: true, message: 'Vui lòng nhập đầy đủ họ tên' }]}>
                                <Input placeholder="Ví dụ: Nguyễn Văn A" className="rounded-lg h-10" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="email" label="Địa chỉ Email"
                                       rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                                <Input placeholder="nguyenvana@ptit.edu.vn" className="rounded-lg h-10" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        {selectedRole === 'lecturer' && (
                            <Col xs={24} md={12}>
                                <Form.Item name="academic_title" label="Học hàm / Học vị">
                                    <Select placeholder="Chọn học vị" className="h-10">
                                        <Option value="ThS">Thạc sĩ (ThS)</Option>
                                        <Option value="TS">Tiến sĩ (TS)</Option>
                                        <Option value="PGS.TS">Phó Giáo sư (PGS.TS)</Option>
                                        <Option value="GS.TS">Giáo sư (GS.TS)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        {selectedRole === 'student' && (
                            <Col xs={24} md={12}>
                                <Form.Item name="class_name" label="Lớp sinh hoạt">
                                    <Input placeholder="Ví dụ: D20CQCN01-N" className="rounded-lg h-10" />
                                </Form.Item>
                            </Col>
                        )}

                        <Col xs={24} md={12}>
                            <Form.Item name="department" label="Khoa / Bộ môn">
                                <Input placeholder="Ví dụ: Khoa Công nghệ thông tin" className="rounded-lg h-10" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="bio" label="Giới thiệu ngắn">
                        <TextArea rows={3} placeholder="Mô tả về hướng nghiên cứu hoặc chuyên môn..." className="rounded-lg" />
                    </Form.Item>

                    {editingUser && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                            <Form.Item name="password"
                                       label={<span className="text-red-600 font-bold"><SafetyCertificateOutlined className="mr-1" /> Thay đổi Mật khẩu</span>}
                                       className="m-0"
                            >
                                <Input.Password placeholder="Chỉ nhập nếu bạn muốn đặt lại mật khẩu cho tài khoản này" className="h-10" />
                            </Form.Item>
                        </div>
                    )}

                    <Form.Item name="is_active" label="Trạng thái tài khoản" valuePropName="checked">
                        <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Đã khóa" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL IMPORT EXCEL */}
            <Modal
                title="Nhập dữ liệu hàng loạt từ Excel"
                open={isImportModalVisible}
                onCancel={() => {
                    setIsImportModalVisible(false);
                    setImportFile(null);
                }}
                onOk={handleImportExcel}
                okText="Bắt đầu Tải lên & Nhập"
                cancelText="Hủy bỏ"
                confirmLoading={importing}
                width={600}
            >
                <div className="mb-6 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">
                    <p className="font-bold mb-2">Yêu cầu cấu trúc file Excel (.xlsx):</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Cột A: Mã số (MSSV/Mã GV)*</li>
                        <li>Cột B: Họ và Tên</li>
                        <li>Cột C: Email*</li>
                        <li>Cột D: Vai trò (student, lecturer, editor)</li>
                        <li>Cột E: Khoa / Bộ môn</li>
                    </ul>
                </div>
                <Dragger {...uploadProps} className="rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white p-10 transition-all">
                    <p className="ant-upload-drag-icon text-blue-500 text-4xl mb-4"><InboxOutlined /></p>
                    <p className="ant-upload-text font-bold text-gray-700">Kéo thả file Excel vào đây</p>
                    <p className="ant-upload-hint text-gray-400 text-xs mt-2">Hỗ trợ file .xlsx. Kích thước tối đa 5MB.</p>
                </Dragger>
            </Modal>

            <style>{`
                .user-management-tabs .ant-tabs-nav::before { border-bottom: 2px solid #F3F4F6; }
                .user-management-tabs .ant-tabs-tab { padding: 12px 8px; margin-right: 32px !important; }
                .user-management-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #3B82F6; font-weight: 700; }
                .user-management-tabs .ant-tabs-ink-bar { background: #3B82F6; height: 3px !important; border-radius: 3px 3px 0 0; }
            `}</style>
        </div>
    );
};

export default UserManagement;