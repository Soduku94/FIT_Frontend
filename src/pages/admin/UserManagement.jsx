import React, {useState, useEffect} from 'react';
// ĐÃ SỬA: Thêm Upload vào danh sách import từ antd
import {Table, Button, Modal, Form, Input, Select, Tag, Space, message, Switch, Tooltip, Row, Col, Upload} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    SafetyCertificateOutlined,
    UploadOutlined,
    InboxOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const {Option} = Select;
const {Search} = Input;
const {TextArea} = Input;
const {Dragger} = Upload; // Bây giờ Upload đã được import nên dòng này sẽ không báo lỗi nữa

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importFile, setImportFile] = useState(null);

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
            setUsers(users.map(u => u.id === userId ? {...u, is_active: !currentStatus} : u));
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi khi cập nhật trạng thái!');
        }
    };

    const openModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({...user, password: ''});
        } else {
            form.resetFields();
            form.setFieldsValue({role: 'student', is_active: true});
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
                headers: {'Content-Type': 'multipart/form-data'}
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

    const columns = [
        {
            title: 'Mã số',
            dataIndex: 'user_code',
            key: 'user_code',
            width: '10%',
        },
        {
            title: 'Họ và tên',
            key: 'full_name',
            render: (_, record) => (
                <div>
                    <div className="font-medium">
                        {record.academic_title ? `${record.academic_title}. ` : ''} {record.full_name}
                    </div>
                    <div className="text-xs text-gray-500">{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = role === 'admin' ? 'red' : role === 'lecturer' ? 'blue' : 'green';
                let text = role === 'admin' ? 'Quản trị viên' : role === 'lecturer' ? 'Giảng viên' : 'Sinh viên';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            key: 'is_active',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.is_active ? "Nhấn để Khóa" : "Nhấn để Mở khóa"}>
                    <Switch
                        checked={record.is_active}
                        onChange={() => handleToggleStatus(record.id, record.is_active)}
                        checkedChildren="Mở"
                        unCheckedChildren="Khóa"
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Đăng nhập lần cuối',
            dataIndex: 'last_login_at',
            key: 'last_login_at',
            render: (time) => <span className="text-gray-500 text-sm">{time}</span>,
        },
        {
            title: 'Hành động',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="primary"
                    ghost
                    icon={<EditOutlined/>}
                    onClick={() => openModal(record)}
                >
                    Sửa
                </Button>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold m-0">Quản lý Tài khoản</h2>

                {/* ĐÃ SỬA: Dọn dẹp lại đoạn code bị lặp */}
                <div className="flex gap-4">
                    <Search
                        placeholder="Tìm theo tên, email, mã số..."
                        allowClear
                        onSearch={(value) => fetchUsers(value)}
                        style={{width: 300}}
                    />
                    <Button icon={<UploadOutlined/>} onClick={() => setIsImportModalVisible(true)}>
                        Nhập từ Excel
                    </Button>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => openModal()}>
                        Thêm Người dùng
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{pageSize: 8}}
            />

            {/* MODAL THÊM / SỬA NGƯỜI DÙNG */}
            <Modal
                title={editingUser ? "Cập nhật Người dùng" : "Thêm Người dùng mới"}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={700}
                okText={editingUser ? "Cập nhật" : "Tạo tài khoản"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="user_code" label="Mã số (MSSV/Mã GV)"
                                       rules={[{required: true, message: 'Vui lòng nhập mã số'}]}>
                                <Input placeholder="VD: B19DCCN001"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="role" label="Vai trò" rules={[{required: true}]}>
                                <Select>
                                    <Option value="student">Sinh viên</Option>
                                    <Option value="lecturer">Giảng viên</Option>
                                    <Option value="admin">Quản trị viên</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="full_name" label="Họ và Tên"
                                       rules={[{required: true, message: 'Vui lòng nhập tên'}]}>
                                <Input placeholder="Nhập họ và tên..."/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email"
                                       rules={[{required: true, type: 'email', message: 'Email không hợp lệ'}]}>
                                <Input placeholder="VD: nguyenvanA@ptit.edu.vn"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        {selectedRole === 'lecturer' && (
                            <Col span={12}>
                                <Form.Item name="academic_title" label="Học hàm / Học vị">
                                    <Select placeholder="Chọn học vị">
                                        <Option value="ThS">Thạc sĩ (ThS)</Option>
                                        <Option value="TS">Tiến sĩ (TS)</Option>
                                        <Option value="PGS.TS">Phó Giáo sư (PGS.TS)</Option>
                                        <Option value="GS.TS">Giáo sư (GS.TS)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        {selectedRole === 'student' && (
                            <Col span={12}>
                                <Form.Item name="class_name" label="Lớp sinh hoạt">
                                    <Input placeholder="VD: D19CQCN01-N"/>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={12}>
                            <Form.Item name="department" label="Khoa / Bộ môn">
                                <Input placeholder="VD: Khoa Công nghệ thông tin"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="bio" label="Giới thiệu / Hướng nghiên cứu">
                        <TextArea rows={3} placeholder="Nhập vài dòng giới thiệu..."/>
                    </Form.Item>

                    {editingUser && (
                        <Form.Item name="password"
                                   label={<span className="text-red-500 font-medium"><SafetyCertificateOutlined
                                       className="mr-1"/>Đặt lại Mật khẩu (Không bắt buộc)</span>}>
                            <Input.Password placeholder="Chỉ nhập nếu muốn đổi mật khẩu mới cho user này"/>
                        </Form.Item>
                    )}

                    <Form.Item name="is_active" label="Trạng thái hoạt động" valuePropName="checked">
                        <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Đã khóa"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL IMPORT EXCEL */}
            <Modal
                title="Nhập danh sách người dùng từ Excel"
                open={isImportModalVisible}
                onCancel={() => {
                    setIsImportModalVisible(false);
                    setImportFile(null);
                }}
                onOk={handleImportExcel}
                okText="Bắt đầu Nhập dữ liệu từ Excel"
                cancelText="Hủy"
                confirmLoading={importing}
            >
                <div className="mb-4 text-gray-600">
                    Vui lòng chuẩn bị file Excel (.xlsx) với các cột theo đúng thứ tự sau (Bắt đầu từ cột A, dòng 1 là tiêu đề):
                    <ul className="list-disc pl-5 mt-2 font-medium">
                        <li>Cột A: Mã số (MSSV/Mã GV)*</li>
                        <li>Cột B: Họ và Tên</li>
                        <li>Cột C: Email*</li>
                        <li>Cột D: Vai trò (student hoặc lecturer)*</li>
                        <li>Cột E: Khoa / Bộ môn</li>
                        <li>Cột F: Lớp sinh hoạt (dành cho SV)</li>
                        <li>Cột G: Học hàm (dành cho GV)</li>
                    </ul>
                </div>
                <Dragger {...uploadProps} className="bg-blue-50">
                    <p className="ant-upload-drag-icon text-blue-500"><InboxOutlined/></p>
                    <p className="ant-upload-text">Kéo thả file .xlsx vào đây hoặc nhấp để chọn</p>
                </Dragger>
            </Modal>

        </div>
    );
};

export default UserManagement;