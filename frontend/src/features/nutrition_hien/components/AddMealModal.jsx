import React, { useState } from 'react';

export default function AddMealModal({ isOpen, onClose, onSubmit, mealPlanId }) {
  const [mealData, setMealData] = useState({
    mealPlanId: mealPlanId,
    mealType: 'BREAKFAST',
    mealTime: '08:00',
    isCompleted: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...mealData, mealPlanId });
    onClose();
    setMealData({
      mealPlanId: mealPlanId,
      mealType: 'BREAKFAST',
      mealTime: '08:00',
      isCompleted: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Thêm Bữa Ăn</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại bữa ăn
            </label>
            <select
              value={mealData.mealType}
              onChange={(e) => setMealData({ ...mealData, mealType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            >
              <option value="BREAKFAST">🌅 Sáng</option>
              <option value="LUNCH">☀️ Trưa</option>
              <option value="DINNER">🌙 Tối</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thời gian
            </label>
            <input
              type="time"
              value={mealData.mealTime}
              onChange={(e) => setMealData({ ...mealData, mealTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCompleted"
              checked={mealData.isCompleted}
              onChange={(e) => setMealData({ ...mealData, isCompleted: e.target.checked })}
              className="w-5 h-5 text-primary"
            />
            <label htmlFor="isCompleted" className="text-sm font-semibold text-gray-700">
              Đánh dấu đã hoàn thành
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}