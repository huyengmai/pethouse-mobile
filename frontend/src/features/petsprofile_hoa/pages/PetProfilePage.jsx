import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Loader2, AlertTriangle, X, LogIn } from 'lucide-react';
import { profileService } from '../services/profileService';
import { authHelpers } from '../../../api/authApi';
import PetCard from '../components/PetCard';
import AddPetForm from '../components/AddPetForm';

const PetProfilePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // States cho Edit và Delete
  const [editingPet, setEditingPet] = useState(null);
  const [deletingPet, setDeletingPet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = authHelpers.isAuthenticated();

  // Kiểm tra đăng nhập - hiển thị UI yêu cầu đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-[--primary]" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">
            Bạn cần đăng nhập để quản lý hồ sơ thú cưng của mình.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-[--primary] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg w-full"
          >
            <LogIn size={20} /> ĐĂNG NHẬP NGAY
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            Chưa có tài khoản? <Link to="/register" className="text-[--primary] font-semibold hover:underline">Đăng ký</Link>
          </p>
        </div>
      </div>
    );
  }

  const fetchPets = async () => {
    setLoading(true);
    try {
      const data = await profileService.getMyPets();
      setPets(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thú cưng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Xử lý cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Đảm bảo dữ liệu đúng kiểu trước khi gửi
    const dataToSend = {
        ...editingPet,
        weight: parseFloat(editingPet.weight), // Chuyển String thành số thực
    };

    try {
        await profileService.updatePet(editingPet.id, dataToSend);
        setEditingPet(null);
        fetchPets();
    } catch (error) {
        // Nếu Server trả về 500, lỗi sẽ rơi vào đây
        console.error("Chi tiết lỗi phản hồi:", error.response?.data);
        alert("Cập nhật thất bại. Vui lòng kiểm tra log Server.");
    } finally {
        setIsProcessing(false);
    }
  };

  // Xử lý xóa (Custom Modal)
  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      await profileService.deletePet(deletingPet.id);
      setPets(pets.filter(p => p.id !== deletingPet.id));
      setDeletingPet(null);
    } catch (error) {
      alert("Xóa không thành công.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showAddForm) {
    return (
      <div className="py-10 bg-gray-50 min-h-screen">
        <AddPetForm 
          onFetchPets={fetchPets} 
          onCancel={() => setShowAddForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[--primary] flex items-center gap-3">
            <LayoutGrid className="text-[--yellow]" /> HỒ SƠ THÚ CƯNG
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Bạn đang quản lý {pets.length} người bạn nhỏ</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 bg-[--primary] text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> TẠO PROFILE MỚI
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[--yellow] mb-4" size={48} />
          <p className="text-gray-400 font-medium">Đang tìm các bé...</p>
        </div>
      ) : pets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map(pet => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onDelete={() => setDeletingPet(pet)} // Mở modal xóa
              onEdit={(p) => setEditingPet(p)}    // Mở modal sửa
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-400">Chưa có thú cưng nào</h3>
          <p className="text-gray-400 mt-2">Bắt đầu chăm sóc bằng cách tạo hồ sơ đầu tiên!</p>
        </div>
      )}

      {/* --- MODAL CHỈNH SỬA --- */}
      {editingPet && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setEditingPet(null)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-[--primary] mb-6 uppercase">Chỉnh sửa hồ sơ</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Tên thú cưng</label>
                <input 
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
                  value={editingPet.name || ''} 
                  onChange={e => setEditingPet({...editingPet, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Giống (Breed)</label>
                <input 
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
                  value={editingPet.breed || ''} 
                  onChange={e => setEditingPet({...editingPet, breed: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Ngày sinh</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
                    value={editingPet.birthDate || ''} 
                    onChange={e => setEditingPet({...editingPet, birthDate: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Cân nặng (kg)</label>
                  <input 
                    type="number" step="0.1"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
                    value={editingPet.weight || ''} 
                    onChange={e => setEditingPet({...editingPet, weight: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setEditingPet(null)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                    HỦY
                </button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-4 rounded-2xl font-bold bg-[--primary] text-white hover:bg-blue-900 transition-all flex items-center justify-center">
                    {isProcessing ? <Loader2 className="animate-spin" /> : "LƯU THAY ĐỔI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL XÓA (CUSTOM) --- */}
      {deletingPet && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Xác nhận xóa?</h3>
            <p className="text-gray-500 font-medium mb-8">
                Bạn có chắc chắn muốn xóa hồ sơ của bé <span className="text-red-500 font-bold">{deletingPet.name}</span>? 
                Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingPet(null)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                HỦY
              </button>
              <button onClick={confirmDelete} disabled={isProcessing} className="flex-1 py-4 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center">
                {isProcessing ? <Loader2 className="animate-spin" /> : "XÁC NHẬN XÓA"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfilePage;