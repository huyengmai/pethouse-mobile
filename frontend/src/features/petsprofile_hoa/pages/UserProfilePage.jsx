import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UserProfilePage = () => {
  // State quản lý dữ liệu người dùng
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Lấy dữ liệu từ Database khi load trang
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await profileService.getMyProfile();
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        setMessage({ type: 'error', text: 'Không thể tải thông tin cá nhân.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 2. Xử lý cập nhật thông tin (Update)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await profileService.updateMyProfile(user);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[--yellow]" size={48} />
        <p className="mt-4 text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
        
        {/* Header Profile - Đồng nhất với giao diện PetHouse */}
        <div className="bg-[--primary] p-8 md:p-12 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-[--yellow] rounded-3xl flex items-center justify-center text-[--primary] text-4xl font-black shadow-lg">
              {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tight">{user.fullName || 'Người dùng PetHouse'}</h1>
              <p className="text-blue-200 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Shield size={16} /> {user.role}
              </p>
            </div>
          </div>
          {/* Decor background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
        </div>

        <div className="p-8 md:p-12">
          {/* Thông báo trạng thái */}
          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${
              message.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Username (Disabled - Không cho sửa) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-2xl border-2 border-gray-50 text-gray-400 cursor-not-allowed">
                  <User size={20} />
                  <span className="font-bold">{user.username}</span>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[--primary] uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[--yellow] transition-colors" size={20} />
                  <input
                    type="text"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-bold text-[--primary]"
                    value={user.fullName || ''}
                    onChange={(e) => setUser({...user, fullName: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[--primary] uppercase tracking-widest ml-1">Email liên hệ</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[--yellow] transition-colors" size={20} />
                  <input
                    type="email"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-bold text-[--primary]"
                    value={user.email || ''}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[--primary] uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[--yellow] transition-colors" size={20} />
                  <input
                    type="text"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-bold text-[--primary]"
                    value={user.phone || ''}
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                  />
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-gray-400 font-medium italic">
                Lưu ý: Bạn không thể tự thay đổi tên đăng nhập và quyền hạn.
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto px-10 py-4 bg-[--yellow] text-[--primary] rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-yellow-100 hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} />
                    Cập nhật hồ sơ
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;