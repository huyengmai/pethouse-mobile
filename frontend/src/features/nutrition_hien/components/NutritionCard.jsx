import React from 'react';

export function NutritionCard({ title, value, unit, icon, bgColor, recommendedValue }) {
  // Tính phần trăm đạt được so với khuyến nghị
  const percentage = recommendedValue && recommendedValue > 0 
    ? Math.round((value / recommendedValue) * 100) 
    : 0;

  // Xác định màu sắc dựa trên % đạt được
  const getStatusColor = () => {
    if (percentage === 0) return 'text-gray-400';
    if (percentage < 80) return 'text-orange-600';
    if (percentage <= 120) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusMessage = () => {
    if (percentage === 0) return 'Chưa có dữ liệu';
    if (percentage < 80) return 'Dưới mục tiêu';
    if (percentage <= 120) return 'Đạt mục tiêu';
    return 'Vượt mục tiêu';
  };

  // Tính chiều rộng thanh progress
  const progressWidth = Math.min(percentage, 100);

  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Value Display */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">
            {value || 0}
          </span>
          <span className="text-xl text-gray-500 font-medium">
            / {recommendedValue || 0}{unit}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              percentage === 0 ? 'bg-gray-400' :
              percentage < 80 ? 'bg-orange-500' :
              percentage <= 120 ? 'bg-green-500' :
              'bg-red-500'
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${getStatusColor()}`}>
          {percentage}% mục tiêu
        </span>
        <span className={`${getStatusColor()}`}>
          {getStatusMessage()}
        </span>
      </div>
    </div>
  );
}