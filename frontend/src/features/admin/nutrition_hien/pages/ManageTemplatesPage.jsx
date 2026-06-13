import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-green py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/nutrition/"
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary mb-2">🍽️ Meal Templates</h1>
            <p className="text-gray-600">Quản lý template bữa ăn mẫu</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingTemplate(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            Tạo Template
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Templates Grid */}
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="text-3xl mb-2">
                          {template.mealType === 'BREAKFAST' ? '🌅' : 
                           template.mealType === 'LUNCH' ? '☀️' : '🌙'}
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600">{template.species || 'All'}</p>
                      </div>
                      <div className="flex gap-2">
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
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    <div className="bg-bg-green rounded-xl p-4 mb-3">
                      <div className="text-2xl font-bold text-primary">{template.defaultCalories}</div>
                      <div className="text-xs text-gray-600">Calories mặc định</div>
                    </div>

                    {template.description && (
                      <p className="text-sm text-gray-600 italic">{template.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Chưa có Templates</h3>
                <p className="text-gray-600 mb-6">Tạo template đầu tiên để bắt đầu!</p>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingTemplate(null);
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-primary mb-6">
                {editingTemplate ? 'Sửa Template' : 'Tạo Template'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Template *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giống loài
                  </label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    placeholder="DOG, CAT (hoặc để trống)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại bữa ăn
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                  >
                    <option value="BREAKFAST">Sáng</option>
                    <option value="LUNCH">Trưa</option>
                    <option value="DINNER">Tối</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Calories mặc định *
                  </label>
                  <input
                    type="number"
                    value={formData.defaultCalories}
                    onChange={(e) => setFormData({ ...formData, defaultCalories: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTemplate(null);
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
                    {editingTemplate ? 'Cập nhật' : 'Tạo'}
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