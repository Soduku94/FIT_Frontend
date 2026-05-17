import React, { useState, useEffect } from 'react';
import { Card, Switch, Typography, Spin, message, Space, Divider, Alert, Badge } from 'antd';
import { SettingOutlined, DatabaseOutlined, CloudServerOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Paragraph, Text } = Typography;

const SystemSettings = () => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [settings, setSettings] = useState({
        STORAGE_PROVIDER: 'local'
    });

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            if (response.data && response.data.settings) {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể tải cấu hình hệ thống!");
        } finally {
            setLoading(false);
        }
    };

    const handleStorageToggle = async (checked) => {
        const newValue = checked ? 'cloud' : 'local';
        setUpdating(true);
        try {
            await api.put('/admin/settings', {
                STORAGE_PROVIDER: newValue
            });
            setSettings(prev => ({ ...prev, STORAGE_PROVIDER: newValue }));
            message.success(`Đã chuyển đổi phương thức lưu trữ sang ${checked ? 'Đám mây (Supabase)' : 'Cục bộ (Local)'}!`);
        } catch (error) {
            console.error(error);
            message.error("Cập nhật cấu hình thất bại!");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Spin size="large" tip="Đang tải cấu hình hệ thống..." />
            </div>
        );
    }

    const isCloud = settings.STORAGE_PROVIDER === 'cloud';

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="mb-6">
                <Title level={3} className="m-0 text-gray-800 flex items-center">
                    <SettingOutlined className="mr-2 text-blue-600" />
                    Cấu hình Hệ thống
                </Title>
                <p className="text-gray-500 mt-1">Quản lý và điều chỉnh các thiết lập vận hành lõi của FIT Research Hub</p>
            </div>

            <Card 
                className="shadow-sm rounded-2xl border border-gray-100 overflow-hidden mb-6"
                title={
                    <Space>
                        <DatabaseOutlined className="text-blue-500 text-lg" />
                        <span className="font-bold text-gray-700">Lưu trữ Tài nguyên (Files & Documents)</span>
                    </Space>
                }
            >
                <Paragraph className="text-gray-500 mb-6 leading-relaxed">
                    Hệ thống FIT Research Hub hỗ trợ cơ chế lưu trữ kép linh hoạt. Bạn có thể cấu hình lưu trữ tài liệu (.pdf, .zip, .rar...) cục bộ ngay trên máy chủ local hoặc đẩy trực tiếp lên dịch vụ lưu trữ đám mây Supabase CDN để tối ưu hóa hiệu năng, bảo mật và tốc độ truy cập.
                </Paragraph>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Text strong className="text-base text-gray-800">Phương thức lưu trữ hoạt động</Text>
                            <Badge 
                                status={isCloud ? "success" : "default"} 
                                text={
                                    <span className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${isCloud ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                        {isCloud ? "SUPABASE CDN" : "LOCAL SERVER"}
                                    </span>
                                } 
                            />
                        </div>
                        <Text className="text-gray-400 text-sm block leading-relaxed">
                            Khi kích hoạt chế độ Cloud, toàn bộ file do giảng viên hoặc sinh viên upload sẽ được đẩy trực tiếp lên Cloud. Khi ở chế độ Local, file sẽ được lưu vào thư mục <code className="bg-red-50 text-red-600 px-1 py-0.5 rounded font-mono text-xs">app/storage/uploads</code> cục bộ.
                        </Text>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className={`text-sm font-semibold ${!isCloud ? 'text-blue-600' : 'text-gray-400'}`}>Cục bộ</span>
                        <Switch 
                            checked={isCloud} 
                            onChange={handleStorageToggle} 
                            loading={updating}
                            checkedChildren="Cloud"
                            unCheckedChildren="Local"
                            size="large"
                            className={isCloud ? "bg-green-600" : "bg-blue-600"}
                        />
                        <span className={`text-sm font-semibold ${isCloud ? 'text-green-600' : 'text-gray-400'}`}>Đám mây</span>
                    </div>
                </div>

                {isCloud ? (
                    <Alert
                        message={<span className="font-bold text-green-800">Đang kích hoạt chế độ CLOUD STORAGE (Đám mây)</span>}
                        description={
                            <div className="text-green-700 text-xs mt-1 leading-relaxed">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Tài nguyên được bảo lưu an toàn tuyệt đối trên hạ tầng phân tán.</li>
                                    <li>Tối ưu hóa băng thông tải về cho sinh viên và độc giả qua hệ thống Cloud CDN.</li>
                                    <li>Backend được giải phóng hoàn toàn khi xử lý tải các bộ Dataset dung lượng lớn (ZIP/RAR).</li>
                                </ul>
                            </div>
                        }
                        type="success"
                        showIcon
                        icon={<CloudServerOutlined />}
                        className="rounded-xl border-green-200 bg-green-50/50"
                    />
                ) : (
                    <Alert
                        message={<span className="font-bold text-blue-800">Đang kích hoạt chế độ LOCAL STORAGE (Cục bộ)</span>}
                        description={
                            <div className="text-blue-700 text-xs mt-1 leading-relaxed">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Lý tưởng cho môi trường phát triển (Development) cục bộ offline.</li>
                                    <li>Không tiêu tốn tài nguyên và hạn ngạch (quota) của dịch vụ đám mây miễn phí.</li>
                                    <li>Lưu ý: Cần chuyển sang chế độ Cloud trước khi triển khai (deploy) sản phẩm thực tế lên Internet.</li>
                                </ul>
                            </div>
                        }
                        type="info"
                        showIcon
                        className="rounded-xl border-blue-200 bg-blue-50/50"
                    />
                )}
            </Card>
        </div>
    );
};

export default SystemSettings;
