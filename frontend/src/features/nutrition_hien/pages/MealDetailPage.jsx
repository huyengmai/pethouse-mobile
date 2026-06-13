import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, Edit } from 'lucide-react';
import { nutritionApi } from '../services/nutritionApi';
import AddFoodItemModal from '../components/AddFoodItemModal';

/**
 * Chi tiết của 1 meal với realtime calories tracking
 * User có thể:
 * - Xem danh sách food items
 * - Thêm/xóa food items
 * - Đánh dấu meal completed
 * - Xem tổng calories realtime
 */
export default function MealDetailPage() {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);

  useEffect(() => {
    if (mealId) {
      fetchMealDetails();
    }
  }, [mealId]);

  const fetchMealDetails = async () => {
    try {
      setLoading(true);
      const data = await nutritionApi.getMealById(mealId);
      setMeal(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching meal:', err);
      setError('Không thể tải thông tin bữa ăn');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (foodData) => {
    try {
      await nutritionApi.addFoodItem(foodData);
      await fetchMealDetails(); // Reload để update totals
    } catch (err) {
      console.error('Error adding food:', err);
      throw err;
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return;

    try {
      await nutritionApi.deleteFoodItem(foodId);
      await fetchMealDetails(); // Reload để update totals
    } catch (err) {
      console.error('Error deleting food:', err);
      alert('Không thể xóa món ăn');
    }
  };

  const handleCompleteMeal = async () => {
    try {
      await nutritionApi.completeMeal(mealId);
      await fetchMealDetails();
    } catch (err) {
      console.error('Error completing meal:', err);
      alert('Không thể cập nhật trạng thái');
    }
  };

  // Get meal type info
  const getMealTypeInfo = (type) => {
    const info = {
      BREAKFAST: { icon: '🌅', name: 'Sáng', color: 'bg-orange-100 text-orange-700' },
      LUNCH: { icon: '☀️', name: 'Trưa', color: 'bg-yellow-100 text-yellow-700' },
      DINNER: { icon: '🌙', name: 'Tối', color: 'bg-blue-100 text-blue-700' }
    };
    return info[type] || { icon: '🍽️', name: type, color: 'bg-gray-100 text-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-bg-blue flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-bg-blue p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Có lỗi xảy ra</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Link
              to="/nutrition"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mealTypeInfo = getMealTypeInfo(meal.mealType);
  const totalCalories = meal.totalCalories || 0;
  const totalProtein = meal.totalProtein || 0;
  const totalFat = meal.totalFat || 0;
  const totalCarbs = meal.totalCarbs || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-blue py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/nutrition/meal-plan/${meal.mealPlanId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-primary" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{mealTypeInfo.icon}</span>
                <h1 className="text-3xl font-bold text-primary">
                  Bữa {mealTypeInfo.name}
                </h1>
              </div>
              <p className="text-gray-600">Thời gian: {meal.mealTime}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
            meal.isCompleted 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {meal.isCompleted ? (
              <>
                <Check className="w-5 h-5" />
                Đã hoàn thành
              </>
            ) : (
              'Chưa hoàn thành'
            )}
          </div>
        </div>

        {/* Nutrition Summary Card */}
        <div className="bg-gradient-to-br from-bg-orange to-bg-yellow rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-primary mb-6">Tổng dinh dưỡng</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Calories */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-primary mb-1">
                {totalCalories}
              </div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>

            {/* Protein */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">💪</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {totalProtein}
              </div>
              <div className="text-sm text-gray-600">Protein (g)</div>
            </div>

            {/* Fat */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🥑</div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {totalFat}
              </div>
              <div className="text-sm text-gray-600">Fat (g)</div>
            </div>

            {/* Carbs */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🌾</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {totalCarbs}
              </div>
              <div className="text-sm text-gray-600">Carbs (g)</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowAddFoodModal(true)}
            className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm món ăn
          </button>
          
          {!meal.isCompleted && (
            <button
              onClick={handleCompleteMeal}
              className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Đánh dấu hoàn thành
            </button>
          )}
        </div>

        {/* Food Items List */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <span>🍽️</span>
            Danh sách món ăn ({meal.foodItems?.length || 0})
          </h2>

          {meal.foodItems && meal.foodItems.length > 0 ? (
            <div className="space-y-4">
              {meal.foodItems.map((food) => (
                <div
                  key={food.id}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {food.foodName}
                      </h3>
                      <p className="text-gray-600">
                        {food.quantity} {food.unit}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {food.calories}
                        </div>
                        <div className="text-sm text-gray-500">cal</div>
                      </div>
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Nutrition Details */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Protein</div>
                      <div className="font-bold text-green-600">
                        {food.protein || 0}g
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Fat</div>
                      <div className="font-bold text-yellow-600">
                        {food.fat || 0}g
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Carbs</div>
                      <div className="font-bold text-blue-600">
                        {food.carbs || 0}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Chưa có món ăn nào
              </h3>
              <p className="text-gray-600 mb-6">
                Thêm món ăn để theo dõi dinh dưỡng
              </p>
              <button
                onClick={() => setShowAddFoodModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
              >
                <Plus className="w-5 h-5" />
                Thêm món ăn đầu tiên
              </button>
            </div>
          )}
        </div>

        {/* Add Food Modal */}
        <AddFoodItemModal
          isOpen={showAddFoodModal}
          onClose={() => setShowAddFoodModal(false)}
          onSubmit={handleAddFood}
          mealId={mealId}
        />
      </div>
    </div>
  );
}