import React from 'react';

export default function NutritionChart({ dailySummaries }) {
  if (!dailySummaries || dailySummaries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  const maxCalories = Math.max(...dailySummaries.map(d => d.actualCalories || 0));

  return (
    <div className="space-y-4">
      {dailySummaries.map((day, index) => {
        const percentage = maxCalories > 0 ? (day.actualCalories / maxCalories) * 100 : 0;
        const date = new Date(day.date);
        
        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-20 text-sm text-gray-600 font-medium">
              {date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 20 && (
                      <span className="text-white text-xs font-bold">
                        {day.actualCalories || 0} cal
                      </span>
                    )}
                  </div>
                </div>
                {percentage <= 20 && (
                  <span className="text-sm font-semibold text-primary ml-2">
                    {day.actualCalories || 0} cal
                  </span>
                )}
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${
              day.status === 'GOOD' ? 'bg-green-100 text-green-700 border-green-300' :
              day.status === 'LOW' ? 'bg-orange-100 text-orange-700 border-orange-300' :
              day.status === 'HIGH' ? 'bg-red-100 text-red-700 border-red-300' :
              'bg-gray-100 text-gray-700 border-gray-300'
            }`}>
              {day.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}