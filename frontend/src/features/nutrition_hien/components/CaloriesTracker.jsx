import { Flame, TrendingUp, TrendingDown, Check } from 'lucide-react';

export default function CaloriesTracker({ 
  actualCalories = 0, 
  recommendedCalories = 2000,
  showProgress = true,
  compact = false
}) {
  const percentage = recommendedCalories > 0 
    ? Math.round((actualCalories / recommendedCalories) * 100) 
    : 0;

  const getStatusInfo = () => {
    if (percentage >= 90 && percentage <= 110) {
      return {
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'from-green-100 to-emerald-100',
        icon: <Check className="w-6 h-6" />,
        status: 'Đạt mục tiêu',
        message: 'Tuyệt vời! Bạn đang đi đúng hướng'
      };
    }
    if (percentage < 90) {
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-700',
        bgColor: 'from-orange-100 to-yellow-100',
        icon: <TrendingUp className="w-6 h-6" />,
        status: 'Cần thêm',
        message: 'Cần thêm calories để đạt mục tiêu'
      };
    }
    return {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'from-red-100 to-pink-100',
      icon: <TrendingDown className="w-6 h-6" />,
      status: 'Vượt mục tiêu',
      message: 'Cẩn thận! Đã vượt quá mục tiêu'
    };
  };

  const statusInfo = getStatusInfo();
  const remaining = recommendedCalories - actualCalories;

  if (compact) {
    return (
      <div className={`bg-gradient-to-r ${statusInfo.bgColor} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-white rounded-lg ${statusInfo.textColor}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {actualCalories}
                <span className="text-sm font-normal text-gray-600"> / {recommendedCalories}</span>
              </div>
              <div className="text-xs text-gray-600">calories</div>
            </div>
          </div>
          <div className={`px-3 py-1 ${statusInfo.color} text-white rounded-full font-semibold text-sm`}>
            {percentage}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${statusInfo.bgColor} rounded-2xl p-6 shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 bg-white rounded-xl ${statusInfo.textColor}`}>
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Calories Tracker</h3>
            <p className="text-xs text-gray-600">{statusInfo.status}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 ${statusInfo.color} text-white rounded-xl font-bold`}>
          {statusInfo.icon}
          {percentage}%
        </div>
      </div>

      {/* Main Display */}
      <div className="bg-white rounded-xl p-6 mb-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {actualCalories}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            / {recommendedCalories} cal mục tiêu
          </div>

          {/* Remaining/Excess */}
          <div className={`inline-block px-4 py-2 rounded-lg ${
            remaining > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
          }`}>
            {remaining > 0 ? (
              <span>Còn thiếu: <strong>{remaining} cal</strong></span>
            ) : (
              <span>Vượt: <strong>{Math.abs(remaining)} cal</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Tiến độ</span>
            <span className="text-xs font-semibold text-gray-700">{percentage}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-4 shadow-inner overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${statusInfo.color} relative`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          {statusInfo.message}
        </p>
      </div>
    </div>
  );
}