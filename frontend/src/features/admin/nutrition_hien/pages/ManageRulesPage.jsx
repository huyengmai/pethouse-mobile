import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      console.error('Error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      species: rule.species || '',
      breed: rule.breed || '',
      minAgeMonth: rule.minAgeMonth || '',
      maxAgeMonth: rule.maxAgeMonth || '',
      minWeight: rule.minWeight || '',
      maxWeight: rule.maxWeight || '',
      activityLevel: rule.activityLevel || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa rule này?')) return;
    try {
      await adminNutritionApi.deleteRule(id);
      fetchRules();
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể xóa rule!');
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

  const getActivityLevelText = (level) => {
    const levels = {
      LOW: 'Thấp',
      MODERATE: 'Trung bình',
      HIGH: 'Cao',
      SEDENTARY: 'Ít vận động',
      LIGHT: 'Vận động nhẹ',
      ACTIVE: 'Vận động nhiều',
      VERY_ACTIVE: 'Rất năng động'
    };
    return levels[level] || level;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-blue py-12">
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
            <h1 className="text-4xl font-bold text-primary mb-2">📜 Nutrition Rules</h1>
            <p className="text-gray-600">Quản lý quy tắc dinh dưỡng theo giống, tuổi, cân nặng</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingRule(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            Tạo Rule
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Rules Grid */}
            {rules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-primary mb-1">
                          {rule.species || 'All Species'}
                        </h3>
                        {rule.breed && (
                          <p className="text-sm text-gray-600">{rule.breed}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tuổi:</span>
                        <span className="font-semibold">
                          {rule.minAgeMonth || 0} - {rule.maxAgeMonth || '∞'} tháng
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cân nặng:</span>
                        <span className="font-semibold">
                          {rule.minWeight || 0} - {rule.maxWeight || '∞'} kg
                        </span>
                      </div>
                      {rule.activityLevel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hoạt động:</span>
                          <span className="font-semibold">{getActivityLevelText(rule.activityLevel)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Chưa có Rules</h3>
                <p className="text-gray-600 mb-6">Tạo rule đầu tiên để bắt đầu!</p>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingRule(null);
                    setShowModal(true);
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
                >
                  Tạo ngay
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                {editingRule ? 'Chỉnh Sửa Rule' : 'Tạo Rule Mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giống loài
                    </label>
                    <input
                      type="text"
                      value={formData.species}
                      onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      placeholder="VD: DOG, CAT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giống
                    </label>
                    <input
                      type="text"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      placeholder="VD: Golden Retriever"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tuổi tối thiểu (tháng)
                    </label>
                    <input
                      type="number"
                      value={formData.minAgeMonth}
                      onChange={(e) => setFormData({ ...formData, minAgeMonth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tuổi tối đa (tháng)
                    </label>
                    <input
                      type="number"
                      value={formData.maxAgeMonth}
                      onChange={(e) => setFormData({ ...formData, maxAgeMonth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cân nặng tối thiểu (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.minWeight}
                      onChange={(e) => setFormData({ ...formData, minWeight: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cân nặng tối đa (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.maxWeight}
                      onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mức độ hoạt động
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="SEDENTARY">Ít vận động</option>
                    <option value="LIGHT">Vận động nhẹ</option>
                    <option value="MODERATE">Trung bình</option>
                    <option value="ACTIVE">Vận động nhiều</option>
                    <option value="VERY_ACTIVE">Rất năng động</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRule(null);
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
                    {editingRule ? 'Cập nhật' : 'Tạo'}
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