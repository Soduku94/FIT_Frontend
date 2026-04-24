import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, message, Typography, Card, Row, Col, Alert } from 'antd';
import {
    InboxOutlined,
    ArrowLeftOutlined,
    UploadOutlined,
    GithubOutlined,
    FilePdfOutlined,
    DatabaseOutlined
} from '@ant-design/icons';

import api from '../../services/api'; // Đường dẫn api của bạn

import { useNavigate, useBlocker } from 'react-router-dom';
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const UploadDocument = () => {
    const [isDirty, setIsDirty] = useState(false); // Biến theo dõi xem form đã bị chỉnh sửa chưa
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();



    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        // Kích hoạt chặn nếu form đã bị sửa VÀ URL chuẩn bị chuyển đến khác với URL hiện tại
        return isDirty && currentLocation.pathname !== nextLocation.pathname;
    });

    useEffect(() => {
        if (blocker.state === "blocked") {
            const confirmLeave = window.confirm("Bạn có dữ liệu chưa lưu. Bạn có chắc chắn muốn rời đi?");
            if (confirmLeave) {
                blocker.proceed(); // Bấm OK -> Cho phép quay lại trang trước
            } else {
                blocker.reset();   // Bấm Hủy -> Kéo người dùng ở lại trang hiện tại
            }
        }
    }, [blocker]);
    // Theo dõi giá trị của ô doc_type để ẩn/hiện form tương ứng
    const selectedDocType = Form.useWatch('doc_type', form);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Sửa lại đường dẫn API lấy danh mục cho chuẩn
                const response = await api.get('/public/categories');
                setCategories(response.data.categories);
            } catch (error) {
                message.error("Không tải được danh sách chuyên ngành!");
            }
        };
        fetchCategories();

        // Gán giá trị mặc định cho form
        form.setFieldsValue({ doc_type: 'paper' });
    }, [form]);


    // Xóa file đính kèm nếu đổi loại tài liệu (tránh up nhầm file PDF vào Dataset)
    useEffect(() => {
        setFileList([]);
    }, [selectedDocType]);
    // Bẫy chống F5, Đóng tab hoặc Back trình duyệt khi đang nhập dở
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Bắt buộc phải có dòng này để Chrome/Edge hiện cảnh báo
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);
    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            // Validation động dựa trên loại tài liệu
            if (selectedDocType === 'paper') {
                if (file.type !== 'application/pdf') {
                    message.error('Bài báo khoa học chỉ hỗ trợ định dạng PDF!');
                    return Upload.LIST_IGNORE;
                }
            } else {
                const allowedDatasetTypes = ['.zip', '.rar', '.7z', '.csv', '.json', '.xml'];
                const isAllowed = allowedDatasetTypes.some(ext => file.name.toLowerCase().endsWith(ext));
                if (!isAllowed) {
                    message.error('Dataset chỉ hỗ trợ file nén (ZIP, RAR) hoặc file dữ liệu (CSV, JSON)!');
                    return Upload.LIST_IGNORE;
                }
            }
            setFileList([file]);
            return false; // Ngăn chặn tự động upload
        },
        fileList,
        maxCount: 1,
    };

    const onFinish = async (values) => {
        // Kiểm tra ràng buộc File
        if (selectedDocType === 'paper' && fileList.length === 0) {
            message.error('Vui lòng đính kèm file PDF của bài báo!');
            return;
        }
        if (selectedDocType === 'dataset' && fileList.length === 0 && !values.external_link) {
            message.error('Vui lòng đính kèm file ZIP dữ liệu HOẶC nhập Link Github!');
            return;
        }

        const formData = new FormData();

        // 1. Gắn các trường dùng chung
        formData.append('title', values.title);
        formData.append('description', values.description || '');
        formData.append('category_id', values.category_id);

        // Biến mảng authors và tags thành chuỗi JSON để Backend đọc được
        formData.append('authors', JSON.stringify(values.authors || []));
        formData.append('tags', JSON.stringify(values.tags || []));

        // 2. Gắn các trường đặc thù
        if (selectedDocType === 'paper') {
            if (values.doi) formData.append('doi', values.doi);
            if (values.journal_name) formData.append('journal_name', values.journal_name);
            if (values.publication_year) formData.append('publication_year', values.publication_year);
        } else {
            if (values.file_size) formData.append('file_size', values.file_size);
            if (values.data_format) formData.append('data_format', values.data_format);
            if (values.license_type) formData.append('license_type', values.license_type);
            if (values.external_link) formData.append('external_link', values.external_link);
        }

        // 3. Gắn File đính kèm (LƯU Ý: Backend yêu cầu tên trường là 'main_file')
        if (fileList.length > 0) {
            formData.append('main_file', fileList[0]);
        }

        setLoading(true);
        try {
            // Rẽ nhánh API tự động
            const endpoint = selectedDocType === 'paper'
                ? '/teacher/documents/paper'
                : '/teacher/documents/dataset';

            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            message.success(response.data.message);
            setIsDirty(false);
            setTimeout(() => {
                navigate('/profile');
            }, 5000); // Chuyển về trang cá nhân sau khi up xong
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi khi tải lên!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}
                    className="mb-4 pl-0 text-gray-500 hover:text-blue-600">
                    Trở về
                </Button>

                <Card className="shadow-lg rounded-xl border-0">
                    <div className="text-center mb-8 border-b pb-6">
                        <Title level={2} className="m-0 text-gray-800">Tải lên Tài nguyên</Title>
                        <Text className="text-gray-500">Đóng góp tài liệu học thuật vào kho lưu trữ chung của
                            khoa</Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark="optional"
                        onValuesChange={() => setIsDirty(true)}>

                        {/* ================= PHẦN DÙNG CHUNG ================= */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <Form.Item name="doc_type"
                                label={<span className="font-semibold text-blue-800">Bạn muốn tải lên loại tài nguyên nào?</span>}
                                rules={[{ required: true }]}>
                                <Select size="large">
                                    <Option value="paper"><FilePdfOutlined className="mr-2" /> Bài báo khoa học
                                        (PDF)</Option>
                                    <Option value="dataset"><DatabaseOutlined className="mr-2" /> Bộ dữ liệu
                                        (Dataset/Source Code)</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item name="title" label={<span className="font-medium">Tiêu đề tài liệu</span>}
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                                    <Input size="large"
                                        placeholder={selectedDocType === 'paper' ? "Tên bài báo..." : "Tên bộ dữ liệu..."} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="category_id" label={<span className="font-medium">Chuyên ngành</span>}
                                    rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}>
                                    <Select size="large" placeholder="-- Chọn chuyên ngành --"
                                        loading={categories.length === 0}>
                                        {categories.map(cat => (
                                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                {/* Sửa thành ô nhập nhiều Tác giả (Gõ xong ấn Enter) */}
                                <Form.Item name="authors" label={<span className="font-medium">Nhóm tác giả (Nhập tên & Nhấn Enter)</span>}
                                    rules={[{ required: true, message: 'Nhập ít nhất 1 tác giả!' }]}>
                                    <Select mode="tags" size="large" placeholder="VD: Nguyễn Văn A [Enter]"
                                        tokenSeparators={[',']} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="tags" label={<span className="font-medium">Từ khóa (Tags)</span>}>
                                    <Select mode="tags" size="large" placeholder="VD: AI, Machine Learning [Enter]"
                                        tokenSeparators={[',']} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* ================= PHẦN ĐẶC THÙ: BÀI BÁO ================= */}
                        {selectedDocType === 'paper' && (
                            <div className="border border-gray-200 p-4 rounded-lg mb-6 bg-gray-50">
                                <h4 className="font-semibold text-gray-700 mb-4">Thông tin xuất bản (Tùy chọn)</h4>
                                <Row gutter={24}>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="publication_year" label="Năm xuất bản">
                                            <Input type="number" size="large" placeholder="2023" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="journal_name" label="Tên Tạp chí / Hội nghị">
                                            <Input size="large" placeholder="IEEE, Springer..." />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="doi" label="Mã DOI">
                                            <Input size="large" placeholder="10.1000/xyz123" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* ================= PHẦN ĐẶC THÙ: DATASET ================= */}
                        {selectedDocType === 'dataset' && (
                            <div className="border border-purple-200 p-4 rounded-lg mb-6 bg-purple-50">
                                <h4 className="font-semibold text-purple-700 mb-4">Thông tin Bộ dữ liệu</h4>
                                <Row gutter={24}>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="data_format" label="Định dạng dữ liệu">
                                            <Input size="large" placeholder="VD: CSV, Images, JSON" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="file_size" label="Dung lượng ước tính">
                                            <Input size="large" placeholder="VD: 1.5 GB" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="license_type" label="Bản quyền (License)">
                                            <Select size="large" placeholder="Chọn bản quyền">
                                                <Option value="MIT">MIT License</Option>
                                                <Option value="GPL">GNU GPL</Option>
                                                <Option value="CC-BY">CC-BY (Nêu tên tác giả)</Option>
                                                <Option value="Internal">Lưu hành nội bộ</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Alert
                                    message="Link mã nguồn (Tùy chọn)"
                                    description={
                                        <Form.Item name="external_link" className="mb-0 mt-2">
                                            <Input prefix={<GithubOutlined />} size="large"
                                                placeholder="https://github.com/..." />
                                        </Form.Item>
                                    }
                                    type="info"
                                />
                            </div>
                        )}

                        {/* ================= MÔ TẢ & UPLOAD FILE ================= */}
                        <Form.Item name="description"
                            label={<span className="font-medium">Mô tả chi tiết / Tóm tắt (Abstract)</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                            <TextArea rows={5} placeholder="Nhập tóm tắt nội dung tài liệu..." />
                        </Form.Item>

                        <Form.Item label={<span className="font-medium text-lg">Đính kèm File</span>} className="mt-8">
                            <Dragger {...uploadProps} className="bg-white hover:border-blue-500 transition-colors">
                                <p className="ant-upload-drag-icon text-blue-500">
                                    <InboxOutlined style={{ fontSize: '48px' }} />
                                </p>
                                <p className="ant-upload-text text-lg font-medium text-gray-700">
                                    {selectedDocType === 'paper' ? 'Kéo thả file PDF bài báo vào đây' : 'Kéo thả file ZIP/RAR dữ liệu vào đây'}
                                </p>
                                <p className="ant-upload-hint text-gray-500">
                                    {selectedDocType === 'paper'
                                        ? 'Chỉ hỗ trợ file định dạng .pdf. Dung lượng tối đa 50MB.'
                                        : 'Hỗ trợ .zip, .rar, .csv, .json. Nếu file quá lớn, vui lòng dẫn link Github ở trên.'}
                                </p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item className="mb-0 mt-10 border-t pt-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                {/* Nút Trở lại */}
                                <Button
                                    size="large"
                                    onClick={() => {
                                        if (isDirty) {
                                            if (window.confirm('Bạn có dữ liệu chưa lưu. Bạn có chắc chắn muốn rời đi?')) {
                                                navigate(-1);
                                            }
                                        } else {
                                            navigate(-1);
                                        }
                                    }}
                                >
                                    Hủy bỏ & Trở lại
                                </Button>

                                {/* Cụm nút Hành động chính */}
                                <div className="flex gap-4">
                                    {/* Nút Lưu nháp (Tính năng sẽ làm sau) */}
                                    <Button
                                        size="large"
                                        type="dashed"
                                        onClick={() => {
                                            message.info('Tính năng Lưu bản nháp sẽ sớm được cập nhật!');
                                            // Gợi ý cho tương lai: Có thể lưu tạm values vào localStorage ở đây
                                        }}
                                    >
                                        Lưu thành Bản nháp
                                    </Button>

                                    {/* Nút Gửi */}
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<UploadOutlined />}
                                        loading={loading}
                                        className="bg-blue-600 px-8 rounded-lg shadow-md hover:shadow-lg"
                                    >
                                        Gửi Xét Duyệt
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default UploadDocument;