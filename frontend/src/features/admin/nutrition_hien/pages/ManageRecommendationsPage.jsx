import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      // ✅ FIX: Backend trả về recommendations array trong rule
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
      console.error('Error:', error);
      alert('Không thể tải danh sách rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string to number before sending to API
      const payload = {
        recommendedCalories: parseFloat(formData.recommendedCalories) || 0,
        recommendedProtein: parseFloat(formData.recommendedProtein) || 0,
        recommendedFat: parseFloat(formData.recommendedFat) || 0,
        recommendedCarbs: parseFloat(formData.recommendedCarbs) || 0,
        notes: formData.notes || ''
      };

      console.log('Sending payload:', payload);

      if (editingRecommendation) {
        await adminNutritionApi.updateRecommendation(editingRecommendation.id, payload);
        alert('✅ Cập nhật recommendation thành công!');
      } else {
        await adminNutritionApi.createRecommendationForRule(selectedRule.id, payload);
        alert('✅ Tạo recommendation thành công!');
      }
      setShowModal(false);
      setEditingRecommendation(null);
      resetForm();
      fetchRules(); // Refresh để lấy recommendations mới
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      alert('❌ Lỗi: ' + errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa recommendation này?')) return;
    try {
      await adminNutritionApi.deleteRecommendation(id);
      fetchRules();
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể xóa!');
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

  const getRuleDisplayName = (rule) => {
    const parts = [];
    if (rule.species) parts.push(rule.species);
    if (rule.breed) parts.push(rule.breed);
    if (rule.minAgeMonth || rule.maxAgeMonth) {
      parts.push(`${rule.minAgeMonth || 0}-${rule.maxAgeMonth || '∞'} tháng`);
    }
    if (rule.minWeight || rule.maxWeight) {
      parts.push(`${rule.minWeight || 0}-${rule.maxWeight || '∞'} kg`);
    }
    if (rule.activityLevel) parts.push(rule.activityLevel);
    return parts.join(' • ') || 'General Rule';
  };

  // ✅ NEW: Check if rule already has recommendation
  const ruleHasRecommendation = (rule) => {
    return rule.recommendations && rule.recommendations.length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-purple py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/nutrition"
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary mb-2">💡 Nutrition Recommendations</h1>
            <p className="text-gray-600">Định nghĩa khuyến nghị dinh dưỡng cho từng rule</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-primary mb-2">📌 Cách hoạt động</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Mỗi <strong>Nutrition Rule</strong> chỉ có <strong>1 Recommendation</strong></li>
            <li>• Recommendation định nghĩa calories, protein, fat, carbs khuyến nghị</li>
            <li>• User sẽ nhận được recommendation phù hợp với thú cưng của họ</li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Rules List */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-primary mb-4">Chọn Rule</h3>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedRule?.id === rule.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">
                      {getRuleDisplayName(rule)}
                    </div>
                    <div className={`text-xs ${
                      selectedRule?.id === rule.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {/* ✅ FIX: Show status */}
                      {ruleHasRecommendation(rule) ? (
                        <span className="text-green-500">✓ Đã có recommendation</span>
                      ) : (
                        <span className="text-orange-500">⚠ Chưa có recommendation</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Recommendations */}
            <div className="lg:col-span-2">
              {selectedRule ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">
                        Recommendations cho Rule
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getRuleDisplayName(selectedRule)}
                      </p>
                    </div>
                    {/* ✅ FIX: Disable button if already has recommendation */}
                    <button
                      onClick={() => {
                        resetForm();
                        setEditingRecommendation(null);
                        setShowModal(true);
                      }}
                      disabled={ruleHasRecommendation(selectedRule)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${
                        ruleHasRecommendation(selectedRule)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-light'
                      }`}
                    >
                      <span>➕</span>
                      {ruleHasRecommendation(selectedRule) ? 'Đã có Recommendation' : 'Tạo Recommendation'}
                    </button>
                  </div>

                  {recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="bg-white rounded-2xl p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="grid grid-cols-4 gap-4 flex-1">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                  {rec.recommendedCalories}
                                </div>
                                <div className="text-xs text-gray-600">Calories</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {rec.recommendedProtein}g
                                </div>
                                <div className="text-xs text-gray-600">Protein</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                  {rec.recommendedFat}g
                                </div>
                                <div className="text-xs text-gray-600">Fat</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {rec.recommendedCarbs}g
                                </div>
                                <div className="text-xs text-gray-600">Carbs</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
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
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(rec.id)}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                          {rec.notes && (
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-sm text-gray-700">{rec.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl">
                      <div className="text-6xl mb-4">💡</div>
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        Chưa có Recommendations
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Tạo recommendation đầu tiên cho rule này!
                      </p>
                      <button
                        onClick={() => {
                          resetForm();
                          setEditingRecommendation(null);
                          setShowModal(true);
                        }}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
                      >
                        Tạo ngay
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    Chọn một Rule
                  </h3>
                  <p className="text-gray-600">
                    Chọn rule từ danh sách bên trái để xem recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-primary mb-6">
                {editingRecommendation ? 'Sửa Recommendation' : 'Tạo Recommendation'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calories *
                    </label>
                    <input
                      type="number"
                      value={formData.recommendedCalories}
                      onChange={(e) => setFormData({ ...formData, recommendedCalories: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Protein (g) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.recommendedProtein}
                      onChange={(e) => setFormData({ ...formData, recommendedProtein: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fat (g) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.recommendedFat}
                      onChange={(e) => setFormData({ ...formData, recommendedFat: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Carbs (g) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.recommendedCarbs}
                      onChange={(e) => setFormData({ ...formData, recommendedCarbs: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    rows="3"
                    placeholder="Lưu ý đặc biệt cho recommendation này..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRecommendation(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
                  >
                    {editingRecommendation ? 'Cập nhật' : 'Tạo'}
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