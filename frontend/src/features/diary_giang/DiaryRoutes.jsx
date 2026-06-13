import { Routes, Route, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authHelpers } from '../../api/authApi';
import AlbumList from './pages/AlbumList';
import AlbumDetail from './pages/AlbumDetail';
import DiaryDetail from './pages/DiaryDetail';
import DiaryForm from './components/DiaryForm';
import DiaryGallery from './pages/DiaryGallery';

const DiaryRoutes = () => {
    const isAuthenticated = authHelpers.isAuthenticated();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn size={40} className="text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Vui lòng đăng nhập</h2>
                    <p className="text-gray-500 mb-6">
                        Bạn cần đăng nhập để xem và quản lý nhật ký thú cưng của mình.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-600 transition-all shadow-lg w-full"
                    >
                        <LogIn size={20} /> ĐĂNG NHẬP NGAY
                    </Link>
                    <p className="text-gray-400 text-sm mt-4">
                        Chưa có tài khoản? <Link to="/register" className="text-purple-500 font-semibold hover:underline">Đăng ký</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Trang chủ diary - danh sách albums */}
            <Route path="/" element={<AlbumList />} />
            
            {/* [MỚI] Trang xem tất cả nhật ký & Quản lý hàng loạt */}
            <Route path="/gallery" element={<DiaryGallery />} />
            
            {/* Chi tiết album */}
            <Route path="/album/:id" element={<AlbumDetail />} />
            
            {/* Tạo mới nhật ký */}
            <Route path="/new" element={<DiaryForm />} />
            
            {/* Chi tiết nhật ký */}
            <Route path="/:id" element={<DiaryDetail />} />
            
            {/* Sửa nhật ký */}
            <Route path="/edit/:id" element={<DiaryForm />} />
        </Routes>
    );
};

export default DiaryRoutes;