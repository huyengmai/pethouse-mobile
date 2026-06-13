import { useState, useEffect } from 'react';
import { nutritionApi } from '../services/nutritionApi';

/**
 * Modal cho User chọn template để tạo meal nhanh
 * User KHÔNG tạo template, chỉ SỬ DỤNG template mà Admin đã tạo
 */
export default function TemplateSelectionModal({ isOpen, onClose, onSelectTemplate, mealType, petSpecies }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen, petSpecies]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      // Lấy templates từ API - lọc theo species nếu có
      const data = await nutritionApi.getAvailableTemplates(petSpecies);
      
      // Lọc thêm theo mealType nếu được chỉ định
      const filtered = mealType 
        ? data.filter(t => t.mealType === mealType)
        : data;
      
      setTemplates(filtered);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Không thể tải templates. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      BREAKFAST: '🌅',
      LUNCH: '☀️',
      DINNER: '🌙'
    };
    return icons[type] || '🍽️';
  };

  const getMealTypeText = (type) => {
    const texts = {
      BREAKFAST: 'Sáng',
      LUNCH: 'Trưa',
      DINNER: 'Tối'
    };
    return texts[type] || type;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Chọn Template Bữa Ăn
            </h2>
            <p className="text-gray-600 text-sm">
              Sử dụng template có sẵn để tạo bữa ăn nhanh chóng
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>💡 Gợi ý:</strong> Các template này được tạo bởi admin dựa trên khoa học dinh dưỡng. 
            Bạn có thể chỉnh sửa sau khi áp dụng.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải templates...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Templates Grid */}
        {!loading && !error && (
          <>
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-gray-200 hover:border-primary"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">
                        {getMealTypeIcon(template.mealType)}
                      </div>
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {getMealTypeText(template.mealType)}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-primary mb-2">
                      {template.name}
                    </h3>

                    {template.species && (
                      <div className="text-xs text-gray-500 mb-3">
                        Dành cho: {template.species}
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-3 mb-3">
                      <div className="text-2xl font-bold text-primary">
                        {template.defaultCalories}
                      </div>
                      <div className="text-xs text-gray-600">Calories mặc định</div>
                    </div>

                    {template.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm font-semibold text-primary">
                        Chọn template này →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Chưa có templates
                </h3>
                <p className="text-gray-600 mb-4">
                  Không tìm thấy template phù hợp. Bạn có thể tạo meal thủ công.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Đóng
                </button>
              </div>
            )}
          </>
        )}

        {/* Manual Creation Option */}
        {!loading && !error && templates.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Hoặc bạn có thể tạo meal thủ công
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Tạo thủ công
            </button>
          </div>
        )}
      </div>
    </div>
  );
}