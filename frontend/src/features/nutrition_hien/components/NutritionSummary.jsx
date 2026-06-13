import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function NutritionSummary({ summary, type = 'daily', recommendation }) {
  if (!summary) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'GOOD': return 'bg-green-100 text-green-700 border-green-300';
      case 'LOW': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'GOOD': return <Minus className="w-5 h-5" />;
      case 'LOW': return <TrendingDown className="w-5 h-5" />;
      case 'HIGH': return <TrendingUp className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'GOOD': return 'Đạt chuẩn';
      case 'LOW': return 'Thấp';
      case 'HIGH': return 'Cao';
      default: return 'Chưa rõ';
    }
  };

  if (type === 'daily') {
    // ✅ FIX: Lấy giá trị khuyến nghị từ summary hoặc từ prop recommendation
    const recommendedCalories = summary.recommendedCalories || recommendation?.recommendedCalories || 0;
    const recommendedProtein = summary.recommendedProtein || recommendation?.recommendedProtein || 0;
    const recommendedFat = summary.recommendedFat || recommendation?.recommendedFat || 0;
    const recommendedCarbs = summary.recommendedCarbs || recommendation?.recommendedCarbs || 0;

    // ✅ FIX: Tính lại phần trăm nếu cần
    const caloriesPercentage = recommendedCalories > 0 
      ? Math.round((summary.actualCalories / recommendedCalories) * 100) 
      : (summary.caloriesPercentage || 0);
    
    const proteinPercentage = recommendedProtein > 0 
      ? Math.round((summary.actualProtein / recommendedProtein) * 100) 
      : (summary.proteinPercentage || 0);
    
    const fatPercentage = recommendedFat > 0 
      ? Math.round((summary.actualFat / recommendedFat) * 100) 
      : (summary.fatPercentage || 0);
    
    const carbsPercentage = recommendedCarbs > 0 
      ? Math.round((summary.actualCarbs / recommendedCarbs) * 100) 
      : (summary.carbsPercentage || 0);

    return (
      <div className="bg-gradient-to-br from-bg-blue to-bg-green rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1">
              Tổng kết dinh dưỡng hôm nay
            </h2>
            <p className="text-gray-600">
              {new Date(summary.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(summary.status)}`}>
            {getStatusIcon(summary.status)}
            <span className="font-semibold">{getStatusText(summary.status)}</span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Calories */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Calories</h3>
              <div className="text-2xl">🔥</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">
                {summary.actualCalories || 0}
              </span>
              <span className="text-xl text-gray-400 mb-1">
                / {recommendedCalories}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all ${
                  caloriesPercentage >= 90 && caloriesPercentage <= 110
                    ? 'bg-green-500'
                    : caloriesPercentage < 90
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(caloriesPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {caloriesPercentage}% mục tiêu
            </div>
          </div>

          {/* Protein */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Protein</h3>
              <div className="text-2xl">💪</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-green-600">
                {summary.actualProtein || 0}g
              </span>
              <span className="text-xl text-gray-400 mb-1">
                / {recommendedProtein}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {proteinPercentage}% mục tiêu
            </div>
          </div>

          {/* Fat */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Fat</h3>
              <div className="text-2xl">🥑</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-yellow-600">
                {summary.actualFat || 0}g
              </span>
              <span className="text-xl text-gray-400 mb-1">
                / {recommendedFat}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full bg-yellow-500 transition-all"
                style={{ width: `${Math.min(fatPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {fatPercentage}% mục tiêu
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Carbs</h3>
              <div className="text-2xl">🌾</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-blue-600">
                {summary.actualCarbs || 0}g
              </span>
              <span className="text-xl text-gray-400 mb-1">
                / {recommendedCarbs}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {carbsPercentage}% mục tiêu
            </div>
          </div>
        </div>

        {/* Message */}
        {summary.message && (
          <div className={`p-4 rounded-xl border-2 ${getStatusColor(summary.status)}`}>
            <p className="font-medium">{summary.message}</p>
          </div>
        )}
      </div>
    );
  }

  // Weekly Summary (giữ nguyên)
  if (type === 'weekly') {
    return (
      <div className="bg-gradient-to-br from-bg-purple to-bg-pink rounded-3xl p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-1">
            Tổng kết tuần
          </h2>
          <p className="text-gray-600">
            {new Date(summary.weekStartDate).toLocaleDateString('vi-VN')} - {' '}
            {new Date(summary.weekEndDate).toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Weekly Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-primary">{summary.totalDays}</div>
            <div className="text-sm text-gray-600">Ngày theo dõi</div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🍽️</div>
            <div className="text-2xl font-bold text-primary">{summary.totalMeals}</div>
            <div className="text-sm text-gray-600">Bữa ăn</div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{summary.completedMeals}</div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(summary.averageCalories)}
            </div>
            <div className="text-sm text-gray-600">Cal TB/ngày</div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Tổng dinh dưỡng tuần</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Calories</div>
              <div className="text-xl font-bold text-primary">
                {Math.round(summary.totalCalories)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Protein</div>
              <div className="text-xl font-bold text-green-600">
                {Math.round(summary.totalProtein)}g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Fat</div>
              <div className="text-xl font-bold text-yellow-600">
                {Math.round(summary.totalFat)}g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Carbs</div>
              <div className="text-xl font-bold text-blue-600">
                {Math.round(summary.totalCarbs)}g
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}