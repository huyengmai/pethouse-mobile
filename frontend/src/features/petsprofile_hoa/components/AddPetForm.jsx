import { useState } from 'react';
import { profileService } from '../services/profileService';
import { 
  Calendar, 
  Weight, 
  ChevronLeft, 
  Save, 
  AlertCircle,
} from 'lucide-react';

const AddPetForm = ({ onFetchPets, onCancel }) => {
  const [petData, setPetData] = useState({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    weight: '',
    gender: 'Male'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...petData,
        weight: petData.weight ? parseFloat(petData.weight) : 0,
      };
      await profileService.addPet(payload);
      alert("Đã lưu hồ sơ thú cưng thành công! ✨");
      onFetchPets();
      onCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ChevronLeft size={28} className="text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[--primary]">THÊM THÚ CƯNG</h2>
          <p className="text-sm text-gray-500">Nhập thông tin chi tiết cho bạn nhỏ</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 flex items-center gap-3 rounded-2xl border border-red-100">
          <AlertCircle size={20} />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên thú cưng */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Tên thú cưng *</label>
            <input
              required
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-medium"
              placeholder="Ví dụ: Bắp, LuLu..."
              value={petData.name}
              onChange={(e) => setPetData({...petData, name: e.target.value})}
            />
          </div>

          {/* LOÀI */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
               Loài thú cưng *
            </label>
            <input
              required
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-medium"
              placeholder="Ví dụ: Chó, Mèo, Hamster..."
              value={petData.species}
              onChange={(e) => setPetData({...petData, species: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Giống loài */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Giống (Breed)</label>
            <input
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
              placeholder="Ví dụ: Corgi, Ba Tư..."
              value={petData.breed}
              onChange={(e) => setPetData({...petData, breed: e.target.value})}
            />
          </div>
          {/* Ngày sinh */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <Calendar size={16} /> Ngày sinh
            </label>
            <input
              type="date"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all font-medium"
              value={petData.birthDate}
              onChange={(e) => setPetData({...petData, birthDate: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cân nặng */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <Weight size={16} /> Cân nặng (kg)
            </label>
            <input
              type="number" step="0.1"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[--yellow] outline-none transition-all"
              placeholder="0.0"
              value={petData.weight}
              onChange={(e) => setPetData({...petData, weight: e.target.value})}
            />
          </div>
          {/* Giới tính */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Giới tính</label>
            <div className="flex gap-3">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g} type="button"
                  onClick={() => setPetData({...petData, gender: g})}
                  className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${
                    petData.gender === g 
                    ? 'border-[--yellow] bg-yellow-50 text-[--primary]' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {g === 'Male' ? 'Đực' : 'Cái'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-10">
          <button
            type="button" onClick={onCancel}
            className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 rounded-2xl font-black bg-[--yellow] text-[--primary] uppercase tracking-widest shadow-lg shadow-yellow-100 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Đang lưu..." : <><Save size={20} /> Lưu hồ sơ ngay</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPetForm;