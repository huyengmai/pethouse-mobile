import { useState } from 'react';
import { Apple, Plus, Calculator, X } from 'lucide-react';

export default function AddFoodItemModal({ isOpen, onClose, onSubmit, mealId }) {
  const [foodData, setFoodData] = useState({
    mealId: mealId,
    foodName: '',
    quantity: '',
    unit: 'g',
    calories: '',
    protein: '',
    fat: '',
    carbs: ''
  });

  const units = ['g', 'ml', 'cup', 'piece', 'bowl', 'spoon'];

  // Auto-calculate calories from macros
  const calculateCalories = () => {
    const protein = parseFloat(foodData.protein) || 0;
    const fat = parseFloat(foodData.fat) || 0;
    const carbs = parseFloat(foodData.carbs) || 0;
    
    // Protein: 4 cal/g, Fat: 9 cal/g, Carbs: 4 cal/g
    const estimated = (protein * 4) + (fat * 9) + (carbs * 4);
    setFoodData({ ...foodData, calories: estimated.toFixed(1) });
  };

  const handleSubmit = async () => {
    if (!foodData.foodName || !foodData.quantity || !foodData.calories) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const submitData = {
      ...foodData,
      mealId: mealId,
      quantity: parseFloat(foodData.quantity),
      calories: parseFloat(foodData.calories),
      protein: parseFloat(foodData.protein) || 0,
      fat: parseFloat(foodData.fat) || 0,
      carbs: parseFloat(foodData.carbs) || 0
    };

    try {
      await onSubmit(submitData);
      
      // Reset form
      setFoodData({
        mealId: mealId,
        foodName: '',
        quantity: '',
        unit: 'g',
        calories: '',
        protein: '',
        fat: '',
        carbs: ''
      });
      
      onClose();
    } catch (err) {
      console.error('Error submitting food:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <Apple className="w-7 h-7" />
            Thêm Món Ăn
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Food Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tên món ăn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={foodData.foodName}
              onChange={(e) => setFoodData({ ...foodData, foodName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Ví dụ: Cơm gạo, Thịt gà..."
            />
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Khối lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={foodData.quantity}
                onChange={(e) => setFoodData({ ...foodData, quantity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Đơn vị
              </label>
              <select
                value={foodData.unit}
                onChange={(e) => setFoodData({ ...foodData, unit: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-white"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Calories <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={foodData.calories}
              onChange={(e) => setFoodData({ ...foodData, calories: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="250"
            />
          </div>

          {/* Macros Section */}
          <div className="border-t-2 border-gray-200 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-orange-600 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Thông tin dinh dưỡng
              </h3>
              <button
                onClick={calculateCalories}
                className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Tính Calories
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  💪 Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={foodData.protein}
                  onChange={(e) => setFoodData({ ...foodData, protein: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  🥑 Fat (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={foodData.fat}
                  onChange={(e) => setFoodData({ ...foodData, fat: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  🌾 Carbs (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={foodData.carbs}
                  onChange={(e) => setFoodData({ ...foodData, carbs: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <strong>💡 Mẹo:</strong> Nhập thông tin Protein, Fat, Carbs rồi nhấn "Tính Calories" để tự động tính toán
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm món ăn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}