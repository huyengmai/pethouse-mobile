import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Utensils } from 'lucide-react';
import { adminNutritionApi } from '../services/adminNutritionApi';

export default function ManageTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    mealType: 'BREAKFAST',
    defaultCalories: '',
    description: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await adminNutritionApi.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải danh sách templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await adminNutritionApi.updateTemplate(editingTemplate.id, formData);
      } else {
        await adminNutritionApi.createTemplate(formData);
      }
      setShowModal(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa template này?')) return;
    try {
      await adminNutritionApi.deleteTemplate(id);
      fetchTemplates();
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể xóa!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      mealType: 'BREAKFAST',
      defaultCalories: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/nutrition"
              className="flex items-center gap-1.5 text-gray-600 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Templates
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-600" />
            Meal Templates
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Nút tạo mới thiết kế bám tay */}
        <button
          onClick={() => {
            resetForm();
            setEditingTemplate(null);
            setShowModal(true);
          }}
          className="w-full bg-green-600 active:bg-green-700 text-white py-3.5 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mb-6"
        >
          <Plus size={20} />
          Tạo Template mới
        </button>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.length > 0 ? (
              templates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                        {template.mealType === 'BREAKFAST' ? '🌅' :
                         template.mealType === 'LUNCH' ? '☀️' : '🌙'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-800 truncate leading-tight">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                             {template.species || 'Tất cả loài'}
                           </span>
                           <span className="text-[11px] text-gray-400">
                             {template.mealType}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                       <div className="text-lg font-black text-green-600">{template.defaultCalories}</div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Kcal mặc định</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-center">
                       <span className="text-[10px] text-gray-400 text-center font-medium">Auto Recommendation</span>
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-xs text-gray-500 italic line-clamp-2 mb-4 px-1">
                      "{template.description}"
                    </p>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setFormData({
                          name: template.name,
                          species: template.species || '',
                          mealType: template.mealType,
                          defaultCalories: template.defaultCalories,
                          description: template.description || ''
                        });
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold active:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={14} />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold active:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-100">
                <div className="text-6xl mb-4 opacity-30">🍽️</div>
                <h3 className="text-lg font-bold text-slate-800">Chưa có Templates</h3>
                <p className="text-sm text-gray-500 mt-2">Hãy tạo mẫu bữa ăn chuẩn đầu tiên!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal - Đã tối ưu hóa chống đè nút bởi Bottom Nav trên Mobile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          {/* SỬA TẠI ĐÂY:
            - Giảm max-h-[92vh] xuống max-h-[82vh] để giữ khung hở cố định phía dưới.
            - Tăng padding-bottom từ p-6 thành pt-6 px-6 pb-28 để trồi nút lên hẳn tầm bấm.
          */}
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl pt-6 px-6 pb-28 sm:pb-6 shadow-2xl max-h-[82vh] overflow-y-auto transform transition-all">
            {/* Handle Bar cho mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
               {editingTemplate ? <Edit2 className="w-5 h-5 text-blue-500"/> : <Plus className="w-5 h-5 text-green-500"/>}
               {editingTemplate ? 'Cập nhật Template' : 'Tạo Template mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Tên Template *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Giống loài
                  </label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="VD: DOG"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Loại bữa
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="BREAKFAST">🌅 Sáng</option>
                    <option value="LUNCH">☀️ Trưa</option>
                    <option value="DINNER">🌙 Tối</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Calories mặc định *
                </label>
                <input
                  type="number"
                  value={formData.defaultCalories}
                  onChange={(e) => setFormData({ ...formData, defaultCalories: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Mô tả mẫu
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  rows="3"
                  placeholder="Ghi chú về thành phần hoặc cách chế biến..."
                />
              </div>

              {/* Thêm khoảng cách an toàn nhỏ mb-4 trước khi kết thúc vùng nội dung form cuộn */}
              <div className="flex gap-3 pt-4 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm active:bg-gray-200 transition-colors"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm active:bg-green-700 shadow-md transition-colors"
                >
                  {editingTemplate ? 'LƯU LẠI' : 'TẠO MẪU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}