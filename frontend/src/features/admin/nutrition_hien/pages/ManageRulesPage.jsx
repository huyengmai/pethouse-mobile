import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Sliders, Dog } from 'lucide-react';
import { adminNutritionApi } from '../services/adminNutritionApi';

export default function ManageRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    species: '',
    breed: '',
    minAgeMonth: '',
    maxAgeMonth: '',
    minWeight: '',
    maxWeight: '',
    activityLevel: ''
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await adminNutritionApi.getAllRules();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
      alert('Không thể tải danh sách rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await adminNutritionApi.updateRule(editingRule.id, formData);
      } else {
        await adminNutritionApi.createRule(formData);
      }
      setShowModal(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa rule này?')) return;
    try {
      await adminNutritionApi.deleteRule(id);
      fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Không thể xóa dữ liệu');
    }
  };

  const resetForm = () => {
    setFormData({
      species: '',
      breed: '',
      minAgeMonth: '',
      maxAgeMonth: '',
      minWeight: '',
      maxWeight: '',
      activityLevel: ''
    });
  };

  // Hàm helper chuyển đổi label mức độ vận động ngắn gọn trên mobile
  const getActivityLabel = (level) => {
    const labels = {
      'SEDENTARY': 'Ít vận động',
      'LIGHT': 'Vận động nhẹ',
      'MODERATE': 'Trung bình',
      'ACTIVE': 'Năng động',
      'VERY_ACTIVE': 'Rất năng động'
    };
    return labels[level] || level || 'Tất cả';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Top sticky bar */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-xs">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link to="/admin/nutrition" className="text-gray-600 active:text-gray-900 flex items-center gap-1 text-xs font-medium">
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Nutrition Rules
            </span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Quy tắc dinh dưỡng</h1>
            <p className="text-xs text-gray-500 mt-0.5">Phân loại theo giống, độ tuổi và cân nặng</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Nút Tạo mới thiết kế Full-width bám tay bấm mobile */}
        <button
          onClick={() => {
            resetForm();
            setEditingRule(null);
            setShowModal(true);
          }}
          className="w-full bg-blue-600 active:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] mb-4 text-sm"
        >
          <Plus size={18} />
          Tạo quy tắc mới
        </button>

        {/* Cấu trúc Danh sách Thẻ (Card List) thay thế hoàn toàn Table cũ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh sách hiện có ({rules.length})</h2>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-28 bg-white animate-pulse rounded-xl border border-gray-100"></div>
              <div className="h-28 bg-white animate-pulse rounded-xl border border-gray-100"></div>
            </div>
          ) : rules.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Chưa có dữ liệu quy tắc nào được tạo</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 relative">

                {/* Header Thẻ: Loài & Giống */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">
                      {rule.species?.toUpperCase() === 'DOG' ? '🐶' : '🐱'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {rule.breed || 'Tất cả các giống'}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                    rule.species?.toUpperCase() === 'DOG' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-teal-50 text-teal-700 border border-teal-100'
                  }`}>
                    {rule.species || 'ALL'}
                  </span>
                </div>

                {/* Body Thẻ: Grid hiển thị thông số chi tiết */}
                <div className="grid grid-cols-3 gap-2 mb-3.5">
                  <div className="bg-slate-50/70 rounded-lg p-2 text-center border border-slate-100/50">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">🎂 Độ tuổi</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">
                      {rule.minAgeMonth}-{rule.maxAgeMonth} <span className="text-[10px] font-normal text-gray-500">thg</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 rounded-lg p-2 text-center border border-slate-100/50">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">⚖️ Cân nặng</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">
                      {rule.minWeight}-{rule.maxWeight} <span className="text-[10px] font-normal text-gray-500">kg</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 rounded-lg p-2 text-center border border-slate-100/50 flex flex-col justify-center min-w-0">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase truncate">🏃 Vận động</div>
                    <div className="text-[11px] font-bold text-slate-800 mt-0.5 truncate">
                      {getActivityLabel(rule.activityLevel)}
                    </div>
                  </div>
                </div>

                {/* Footer Thẻ: Cụm nút sửa/xóa tương tác */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setFormData({
                        species: rule.species,
                        breed: rule.breed || '',
                        minAgeMonth: rule.minAgeMonth,
                        maxAgeMonth: rule.maxAgeMonth,
                        minWeight: rule.minWeight,
                        maxWeight: rule.maxWeight,
                        activityLevel: rule.activityLevel || ''
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 active:bg-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <Edit2 size={12} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 active:bg-red-100 rounded-lg text-xs font-semibold"
                  >
                    <Trash2 size={12} />
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form di động thích ứng bàn phím di động (Bottom-Sheet phong cách) */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
            {/* CHỈNH SỬA TẠI ĐÂY:
              - Thay đổi max-h-[90vh] thành max-h-[82vh] để modal không đè xuống sát đáy màn hình.
              - Tăng padding bottom từ p-5 thành pt-5 px-5 pb-28 để đẩy cụm button lên trên thanh Bottom Nav.
            */}
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl pt-5 px-5 pb-28 sm:pb-5 shadow-xl max-h-[82vh] overflow-y-auto transform transition-all">
              {/* Handle Bar cho mobile */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>

              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <Sliders size={18} className="text-blue-600" />
                {editingRule ? 'Cập nhật quy tắc' : 'Tạo quy tắc mới'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Loài *</label>
                    <select
                      required
                      value={formData.species}
                      onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none text-sm"
                    >
                      <option value="">Chọn loài</option>
                      <option value="DOG">Chó (DOG)</option>
                      <option value="CAT">Mèo (CAT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Giống loài (Breed)</label>
                    <input
                      type="text"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none text-sm"
                      placeholder="VD: Poodle, Husky..."
                    />
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Giới hạn độ tuổi (Tháng)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-0.5">Thấp nhất *</label>
                      <input
                        type="number"
                        required
                        value={formData.minAgeMonth}
                        onChange={(e) => setFormData({ ...formData, minAgeMonth: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-0.5">Cao nhất *</label>
                      <input
                        type="number"
                        required
                        value={formData.maxAgeMonth}
                        onChange={(e) => setFormData({ ...formData, maxAgeMonth: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                        placeholder="24"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Giới hạn cân nặng (kg)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-0.5">Thị điểm đầu *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.minWeight}
                        onChange={(e) => setFormData({ ...formData, minWeight: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                        placeholder="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-0.5">Kịch trần *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.maxWeight}
                        onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                        placeholder="15.0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Mức độ vận động</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none text-sm"
                  >
                    <option value="">Tất cả mức độ</option>
                    <option value="SEDENTARY">Ít vận động (Sedentary)</option>
                    <option value="LIGHT">Vận động nhẹ (Light)</option>
                    <option value="MODERATE">Trung bình (Moderate)</option>
                    <option value="ACTIVE">Năng động (Active)</option>
                    <option value="VERY_ACTIVE">Rất năng động (Very Active)</option>
                  </select>
                </div>

                {/* CHỈNH SỬA TẠI ĐÂY:
                  - Thêm lớp mb-4 để tạo khoảng cách an toàn với phần rìa nội dung cuộn.
                */}
                <div className="flex gap-3 pt-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRule(null);
                      resetForm();
                    }}
                    className="flex-1 py-3 bg-gray-100 active:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    {editingRule ? 'CẬP NHẬT' : 'TẠO MỚI'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}