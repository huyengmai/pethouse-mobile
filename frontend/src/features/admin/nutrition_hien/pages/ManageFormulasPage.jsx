import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminNutritionApi } from '../services/adminNutritionApi';


export default function ManageFormulasPage() {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);
  const [formData, setFormData] = useState({
    formulaName: '',
    expression: '',
    description: ''
  });

  useEffect(() => {
    fetchFormulas();
  }, []);

  const fetchFormulas = async () => {
    try {
      setLoading(true);
      const data = await adminNutritionApi.getAllFormulas();
      setFormulas(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải danh sách formulas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFormula) {
        await adminNutritionApi.updateFormula(editingFormula.id, formData);
      } else {
        await adminNutritionApi.createFormula(formData);
      }
      setShowModal(false);
      setEditingFormula(null);
      resetForm();
      fetchFormulas();
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa formula này?')) return;
    try {
      await adminNutritionApi.deleteFormula(id);
      fetchFormulas();
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể xóa!');
    }
  };

  const resetForm = () => {
    setFormData({
      formulaName: '',
      expression: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-orange py-12">
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
            <h1 className="text-4xl font-bold text-primary mb-2">🧮 Nutrition Formulas</h1>
            <p className="text-gray-600">Quản lý công thức tính toán dinh dưỡng</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingFormula(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            Tạo Formula
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-primary mb-2">💡 Hướng dẫn Expression</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Sử dụng biến: <code className="bg-white px-2 py-1 rounded">weight</code>, <code className="bg-white px-2 py-1 rounded">age</code>, <code className="bg-white px-2 py-1 rounded">activityFactor</code></li>
            <li>• Ví dụ RER: <code className="bg-white px-2 py-1 rounded">weight * 30 + 70</code></li>
            <li>• Ví dụ MER: <code className="bg-white px-2 py-1 rounded">RER * activityFactor</code></li>
          </ul>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Formulas Grid */}
            {formulas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formulas.map((formula) => (
                  <div key={formula.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="text-3xl mb-3">🧮</div>
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {formula.formulaName}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingFormula(formula);
                            setFormData({
                              formulaName: formula.formulaName,
                              expression: formula.expression,
                              description: formula.description || ''
                            });
                            setShowModal(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(formula.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Expression */}
                    <div className="bg-gray-900 rounded-xl p-4 mb-3">
                      <div className="text-xs text-gray-400 mb-1">Expression:</div>
                      <code className="text-green-400 text-sm font-mono">
                        {formula.expression}
                      </code>
                    </div>

                    {/* Description */}
                    {formula.description && (
                      <div className="bg-bg-orange rounded-xl p-4">
                        <div className="text-xs text-gray-600 mb-1">Mô tả:</div>
                        <p className="text-sm text-gray-700">{formula.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🧮</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Chưa có Formulas</h3>
                <p className="text-gray-600 mb-6">Tạo formula đầu tiên để bắt đầu!</p>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingFormula(null);
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
                {editingFormula ? 'Sửa Formula' : 'Tạo Formula'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Formula *
                  </label>
                  <input
                    type="text"
                    value={formData.formulaName}
                    onChange={(e) => setFormData({ ...formData, formulaName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    placeholder="VD: RER for Dogs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expression *
                  </label>
                  <textarea
                    value={formData.expression}
                    onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono text-sm"
                    rows="3"
                    placeholder="weight * 30 + 70"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Biến có thể dùng: weight, age, activityFactor
                  </p>
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
                    placeholder="Giải thích công thức..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingFormula(null);
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
                    {editingFormula ? 'Cập nhật' : 'Tạo'}
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