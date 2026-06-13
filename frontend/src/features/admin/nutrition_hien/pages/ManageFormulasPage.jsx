import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Cpu, Variable } from 'lucide-react';
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
    if (!window.confirm('Xóa công thức này?')) return;
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
            <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Formulas
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Dinh dưỡng Formulas
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Nút thêm mới bám tay trên di động */}
        <button
          onClick={() => {
            resetForm();
            setEditingFormula(null);
            setShowModal(true);
          }}
          className="w-full bg-blue-600 active:bg-blue-700 text-white py-3.5 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mb-6 text-sm"
        >
          <Plus size={20} />
          Tạo công thức mới
        </button>

        {/* Trạng thái Loading dữ liệu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 text-sm font-medium">Đang tải dữ liệu công thức...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formulas.length > 0 ? (
              formulas.map((formula) => (
                <div key={formula.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Variable size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-800 truncate leading-tight">
                          {formula.formulaName}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">ID: #{formula.id}</p>
                      </div>
                    </div>

                    {/* Vùng hiển thị biểu thức toán học */}
                    <div className="bg-slate-900 rounded-xl p-3 mb-3 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {formula.expression}
                    </div>

                    {formula.description && (
                      <p className="text-xs text-gray-500 italic line-clamp-2 mb-4 px-1 leading-relaxed">
                        "{formula.description}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto">
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
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold active:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={14} />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(formula.id)}
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
                <div className="text-6xl mb-4 opacity-30">🧮</div>
                <h3 className="text-lg font-bold text-slate-800">Chưa có công thức</h3>
                <p className="text-sm text-gray-500 mt-2">Hãy khởi tạo công thức tính toán đầu tiên!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- PHẦN KHUNG POPUP MODAL ĐÃ ĐƯỢC TỐI ƯU HÓA CHO MOBILE --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          {/* ĐÃ CHỈNH SỬA TẠI ĐÂY:
            - max-h-[82vh]: Giới hạn độ cao form tránh tràn bít nền dưới mobile app.
            - pb-28: Tạo khoảng trống đệm siêu rộng ở đáy form, đẩy cụm nút lên trên thanh Bottom Navigation Bar.
          */}
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl pt-6 px-6 pb-28 sm:pb-6 shadow-2xl max-h-[82vh] overflow-y-auto transform transition-all">
            {/* Thanh gờ giả lập kéo vuốt đóng bottom-sheet trên mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
               {editingFormula ? <Edit2 className="w-5 h-5 text-blue-500"/> : <Plus className="w-5 h-5 text-blue-500"/>}
               {editingFormula ? 'Cập nhật công thức' : 'Tạo công thức mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Tên công thức *
                </label>
                <input
                  type="text"
                  value={formData.formulaName}
                  onChange={(e) => setFormData({ ...formData, formulaName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="VD: RER_BY_WEIGHT"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Biểu thức công thức (Expression) *
                </label>
                <input
                  type="text"
                  value={formData.expression}
                  onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-mono text-sm text-blue-600"
                  placeholder="VD: 70 * Math.pow(weight, 0.75)"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Mô tả giải thích công thức
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
                  rows="3"
                  placeholder="Giải thích các tham số đầu vào và ý nghĩa của công thức..."
                />
              </div>

              {/* Cụm nút hành động có mb-4 tạo điểm dừng kết thúc form cuộn đẹp mắt */}
              <div className="flex gap-3 pt-4 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFormula(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm active:bg-gray-200 transition-colors"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm active:bg-blue-700 shadow-md transition-colors"
                >
                  {editingFormula ? 'CẬP NHẬT' : 'TẠO MỚI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}