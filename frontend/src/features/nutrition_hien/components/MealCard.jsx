export default function MealPlanCard({ plan, onDelete, onViewDetails }) {
  const completionRate = plan.totalMeals > 0 
    ? Math.round((plan.completedMeals / plan.totalMeals) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-primary/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary mb-1">
            {new Date(plan.planDate).toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-500">
            {plan.totalMeals} bữa ăn
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(plan)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-all"
          >
            Chi tiết
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Calories */}
      <div className="bg-bg-blue rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Tổng Calories</span>
          <span className="text-2xl font-bold text-primary">{plan.totalCalories || 0}</span>
        </div>
        <div className="text-xs text-gray-500">cal</div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Tiến độ</span>
          <span className="font-semibold text-primary">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Notes */}
      {plan.notes && (
        <div className="text-sm text-gray-600 italic bg-yellow-light p-3 rounded-lg">
          📝 {plan.notes}
        </div>
      )}
    </div>
  );
}