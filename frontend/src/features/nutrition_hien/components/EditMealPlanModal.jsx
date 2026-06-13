import { useState, useEffect } from 'react';
import { Calendar, FileText, Save, X } from 'lucide-react';

export default function EditMealPlanModal({ isOpen, onClose, onSubmit, mealPlan }) {
  const [formData, setFormData] = useState({
    planDate: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mealPlan) {
      setFormData({
        planDate: mealPlan.planDate || '',
        notes: mealPlan.notes || ''
      });
    }
  }, [mealPlan]);

  const handleSubmit = async () => {
    if (!formData.planDate) {
      alert('Vui lòng chọn ngày');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(mealPlan.id, formData);
      onClose();
    } catch (err) {
      alert('Không thể cập nhật meal plan');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Chỉnh sửa Meal Plan
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ngày
            </label>
            <input
              type="date"
              value={formData.planDate}
              onChange={(e) => setFormData({ ...formData, planDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Thêm ghi chú cho meal plan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}