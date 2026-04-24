import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full transform transition-all hover:scale-105 duration-300">
                <Result
                    status="404"
                    title={<span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">404</span>}
                    subTitle={<span className="text-gray-600 font-medium mt-2 block text-lg">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</span>}
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:shadow-lg hover:opacity-90 flex items-center h-12 px-8 mx-auto font-medium text-lg rounded-full"
                        >
                            Về trang chủ
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default NotFound;
