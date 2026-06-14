import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Sparkles } from 'lucide-react';
import { adminNutritionApi } from '../services/adminNutritionApi';

export default function ManageRecommendationsPage() {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const [formData, setFormData] = useState({
    recommendedCalories: '',
    recommendedProtein: '',
    recommendedFat: '',
    recommendedCarbs: '',
    notes: ''
  });

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (selectedRule) {
      const ruleRecs = selectedRule.recommendations || [];
      setRecommendations(ruleRecs);
    }
  }, [selectedRule]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await adminNutritionApi.getAllRules();
      setRules(data);
      if (data.length > 0) {
        setSelectedRule(data[0]);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      alert('Không thể tải danh sách quy tắc');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRule) return;

    try {
      if (editingRecommendation) {
        await adminNutritionApi.updateRecommendation(editingRecommendation.id, formData);
      } else {
        await adminNutritionApi.createRecommendation(selectedRule.id, formData);
      }
      setShowModal(false);
      setEditingRecommendation(null);
      resetForm();

      const updatedRules = await adminNutritionApi.getAllRules();
      setRules(updatedRules);
      const currentRule = updatedRules.find(r => r.id === selectedRule.id);
      if (currentRule) setSelectedRule(currentRule);

    } catch (error) {
      console.error('Error saving recommendation:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khuyến nghị này?')) return;
    try {
      await adminNutritionApi.deleteRecommendation(id);

      const updatedRules = await adminNutritionApi.getAllRules();
      setRules(updatedRules);
      const currentRule = updatedRules.find(r => r.id === selectedRule.id);
      if (currentRule) setSelectedRule(currentRule);
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      alert('Không thể xóa dữ liệu!');
    }
  };

  const resetForm = () => {
    setFormData({
      recommendedCalories: '',
      recommendedProtein: '',
      recommendedFat: '',
      recommendedCarbs: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Header Sticky */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link to="/admin/nutrition" className="text-gray-600 active:text-gray-900 flex items-center gap-1.5 text-xs font-medium">
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Diet Menu
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Khuyến nghị khẩu phần</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Bộ chọn Quy tắc */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
            Chọn nhóm quy tắc áp dụng:
          </label>
          <select
            value={selectedRule?.id || ''}
            onChange={(e) => {
              const rule = rules.find(r => r.id === parseInt(e.target.value));
              if (rule) setSelectedRule(rule);
            }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl font-medium text-xs focus:outline-none"
          >
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.species} - {rule.breed || 'Mọi giống'} ({rule.minAgeMonth}-{rule.maxAgeMonth} thg)
              </option>
            ))}
          </select>
        </div>

        {/* Nút thêm mới */}
        <button
          onClick={() => {
            resetForm();
            setEditingRecommendation(null);
            setShowModal(true);
          }}
          disabled={!selectedRule}
          className="w-full bg-purple-600 active:bg-purple-700 disabled:bg-gray-200 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] text-sm"
        >
          <Plus size={18} />
          Thêm giá trị khuyến nghị
        </button>

        {/* Danh sách thẻ */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Giá trị hiện tại</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs">Quy tắc này chưa thiết lập chỉ số dinh dưỡng</p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/40 flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Năng lượng</div>
                      <div className="text-sm font-black text-slate-800">{rec.recommendedCalories} <span className="text-[10px] font-normal text-gray-500">kcal</span></div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/40 flex items-center gap-2">
                    <span className="text-xl">🥩</span>
                    <div>
                      <div className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Đạm (Protein)</div>
                      <div className="text-sm font-black text-slate-800">{rec.recommendedProtein} <span className="text-[10px] font-normal text-gray-500">g</span></div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/40 flex items-center gap-2">
                    <span className="text-xl">🥑</span>
                    <div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Béo (Fat)</div>
                      <div className="text-sm font-black text-slate-800">{rec.recommendedFat} <span className="text-[10px] font-normal text-gray-500">g</span></div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/40 flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Tinh bột (Carbs)</div>
                      <div className="text-sm font-black text-slate-800">{rec.recommendedCarbs} <span className="text-[10px] font-normal text-gray-500">g</span></div>
                    </div>
                  </div>
                </div>

                {rec.notes && (
                  <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-gray-500 italic">
                    * {rec.notes}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => {
                      setEditingRecommendation(rec);
                      setFormData({
                        recommendedCalories: rec.recommendedCalories,
                        recommendedProtein: rec.recommendedProtein,
                        recommendedFat: rec.recommendedFat,
                        recommendedCarbs: rec.recommendedCarbs,
                        notes: rec.notes || ''
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 active:bg-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <Edit2 size={12} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 active:bg-red-100 rounded-xl text-xs font-semibold"
                  >
                    <Trash2 size={12} />
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form di động Bottom-Sheet */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
            {/* max-h-[82vh] và pb-28 tạo không gian trống đẩy nút bấm trồi hẳn lên trên Bottom Nav di động */}
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl pt-5 px-5 pb-28 sm:pb-5 shadow-2xl max-h-[82vh] overflow-y-auto transform transition-all">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>

              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <Sparkles size={18} className="text-purple-600" />
                {editingRecommendation ? 'Cập nhật khuyến nghị' : 'Tạo mức khuyến nghị mới'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Mức Calo (kcal) *</label>
                    <input
                      type="number"
                      required
                      value={formData.recommendedCalories}
                      onChange={(e) => setFormData({ ...formData, recommendedCalories: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Đạm / Protein (g) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.recommendedProtein}
                      onChange={(e) => setFormData({ ...formData, recommendedProtein: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none text-sm"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Chất béo / Fat (g) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.recommendedFat}
                      onChange={(e) => setFormData({ ...formData, recommendedFat: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Tinh bột / Carbs (g) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.recommendedCarbs}
                      onChange={(e) => setFormData({ ...formData, recommendedCarbs: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none text-sm"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Ghi chú bổ sung</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none text-sm"
                    rows="2"
                    placeholder="Lưu ý đặc biệt (nếu có)..."
                  />
                </div>

                <div className="flex gap-3 pt-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRecommendation(null);
                      resetForm();
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs transition-colors"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-purple-600 text-white rounded-2xl font-bold text-xs transition-colors shadow-md"
                  >
                    {editingRecommendation ? 'CẬP NHẬT' : 'THÊM MỚI'}
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