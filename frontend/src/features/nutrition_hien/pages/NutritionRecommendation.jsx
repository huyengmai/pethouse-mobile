import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { nutritionApi } from '../services/nutritionApi';

export default function NutritionRecommendation() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);

  // ============================================
  // FETCH PETS FROM API (Using Pet Service)
  // ============================================
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async (forceRefresh = false) => {
    try {
      setPetsLoading(true);
      setPetsError(null);

      // ✅ GỌI API THẬT
      const data = await nutritionApi.getMyPets(forceRefresh);
      
      if (data.length === 0) {
        setPetsError('Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước.');
        setPets([]);
        return;
      }

      setPets(data);
      console.log(`✅ Loaded ${data.length} pets for recommendation`);
      
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
      setPetsError('Không thể tải danh sách thú cưng. Vui lòng thử lại.');
      setPets([]);
    } finally {
      setPetsLoading(false);
    }
  };

  const calculateRecommendation = async (pet) => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy recommendation cho pet - backend sẽ tự lấy thông tin pet và tính toán
      const data = await nutritionApi.getPetRecommendation(pet.id);

      setRecommendation(data);
    } catch (err) {
      console.error('Error calculating recommendation:', err);
      setError('Không thể tính toán khuyến nghị. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
    calculateRecommendation(pet);
  };

  const handleRefreshPets = async () => {
    await fetchPets(true);
  };

  const getActivityLevelText = (level) => {
    const levels = {
      SEDENTARY: 'Ít vận động',
      LIGHT: 'Vận động nhẹ',
      MODERATE: 'Vận động vừa',
      ACTIVE: 'Vận động nhiều',
      VERY_ACTIVE: 'Rất năng động'
    };
    return levels[level] || level;
  };

  const getActivityLevelColor = (level) => {
    const colors = {
      SEDENTARY: 'bg-gray-100 text-gray-700',
      LIGHT: 'bg-blue-100 text-blue-700',
      MODERATE: 'bg-green-100 text-green-700',
      ACTIVE: 'bg-orange-100 text-orange-700',
      VERY_ACTIVE: 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-orange to-white">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Link
              to="/nutrition"
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">💡 Khuyến nghị dinh dưỡng</h1>
              <p className="text-white/80">
                Gợi ý khẩu phần phù hợp dựa trên đặc điểm thú cưng
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Info Banner */}
        <div className="bg-yellow-light border-2 border-yellow rounded-2xl p-6 mb-8 flex gap-4">
          <Info className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-primary mb-2">
              Cách tính khuyến nghị dinh dưỡng
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Khuyến nghị được tính toán dựa trên giống, tuổi, cân nặng và mức độ hoạt động của thú cưng. 
              Đây chỉ là gợi ý tham khảo, bạn nên tham khảo ý kiến bác sĩ thú y để có chế độ dinh dưỡng phù hợp nhất.
            </p>
          </div>
        </div>

        {/* Pet Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span>🐾</span>
              Chọn thú cưng
            </h2>
            <button
              onClick={handleRefreshPets}
              disabled={petsLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
              title="Refresh danh sách pets"
            >
              <RefreshCw className={`w-5 h-5 text-primary ${petsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Pets Loading */}
          {petsLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách thú cưng...</p>
            </div>
          )}

          {/* Pets Error */}
          {petsError && !petsLoading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-700 mb-2">Không thể tải thú cưng</h3>
                <p className="text-red-600 text-sm mb-4">{petsError}</p>
                <a
                  href="/petsprofile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all"
                >
                  Thêm thú cưng
                </a>
              </div>
            </div>
          )}

          {/* Pets Grid */}
          {!petsLoading && !petsError && pets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => handleSelectPet(pet)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                    selectedPet?.id === pet.id
                      ? 'border-primary bg-bg-blue shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-5xl">{pet.avatar}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-primary">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                    {selectedPet?.id === pet.id && (
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuổi:</span>
                      <span className="font-semibold">
                        {Math.floor(pet.ageMonths / 12)} năm {pet.ageMonths % 12} tháng
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cân nặng:</span>
                      <span className="font-semibold">{pet.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hoạt động:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActivityLevelColor(pet.activityLevel)}`}>
                        {getActivityLevelText(pet.activityLevel)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tính toán khuyến nghị...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Có lỗi xảy ra</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Recommendation Result */}
        {!loading && !error && recommendation && selectedPet && (
          <div className="space-y-8">
            {/* Main Recommendation Card */}
            <div className="bg-gradient-to-br from-bg-green to-bg-blue rounded-3xl p-8 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    Khuyến nghị cho {selectedPet.name}
                  </h2>
                  <p className="text-gray-600">
                    Dựa trên: {selectedPet.breed} • {Math.floor(selectedPet.ageMonths / 12)} tuổi • {selectedPet.weight}kg
                  </p>
                </div>
                <div className="text-5xl">{selectedPet.avatar}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Calories */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-4xl mb-3">🔥</div>
                  <div className="text-sm text-gray-600 mb-2">Calories khuyến nghị</div>
                  <div className="text-4xl font-bold text-primary mb-1">
                    {recommendation.recommendedCalories}
                  </div>
                  <div className="text-xs text-gray-500">cal/ngày</div>
                </div>

                {/* Protein */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-4xl mb-3">💪</div>
                  <div className="text-sm text-gray-600 mb-2">Protein</div>
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    {recommendation.recommendedProtein}
                  </div>
                  <div className="text-xs text-gray-500">gram/ngày</div>
                </div>

                {/* Fat */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-4xl mb-3">🥑</div>
                  <div className="text-sm text-gray-600 mb-2">Chất béo</div>
                  <div className="text-4xl font-bold text-yellow-600 mb-1">
                    {recommendation.recommendedFat}
                  </div>
                  <div className="text-xs text-gray-500">gram/ngày</div>
                </div>

                {/* Carbs */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-4xl mb-3">🌾</div>
                  <div className="text-sm text-gray-600 mb-2">Carbohydrate</div>
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {recommendation.recommendedCarbs}
                  </div>
                  <div className="text-xs text-gray-500">gram/ngày</div>
                </div>
              </div>

              {/* Notes */}
              {recommendation.notes && (
                <div className="mt-6 p-4 bg-white/50 rounded-xl">
                  <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Ghi chú quan trọng
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{recommendation.notes}</p>
                </div>
              )}
            </div>

            {/* Nutrition Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feeding Tips */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span>📋</span>
                  Hướng dẫn cho ăn
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold flex-shrink-0">✓</span>
                    <p className="text-gray-700">Chia nhỏ thành 2-3 bữa trong ngày</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold flex-shrink-0">✓</span>
                    <p className="text-gray-700">Đảm bảo luôn có nước sạch</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold flex-shrink-0">✓</span>
                    <p className="text-gray-700">Cho ăn đúng giờ hàng ngày</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold flex-shrink-0">✓</span>
                    <p className="text-gray-700">Điều chỉnh khẩu phần theo hoạt động</p>
                  </li>
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span>⚠️</span>
                  Thực phẩm cần tránh
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold flex-shrink-0">✗</span>
                    <p className="text-gray-700">Chocolate, cafe, thức ăn chứa đường</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold flex-shrink-0">✗</span>
                    <p className="text-gray-700">Xương nhỏ dễ vỡ, xương gà</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold flex-shrink-0">✗</span>
                    <p className="text-gray-700">Hành, tỏi, nho khô</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold flex-shrink-0">✗</span>
                    <p className="text-gray-700">Thức ăn quá mặn, cay</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-bg-purple to-bg-pink rounded-3xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sẵn sàng bắt đầu?
              </h3>
              <p className="text-gray-600 mb-6">
                Tạo kế hoạch bữa ăn dựa trên khuyến nghị này ngay hôm nay
              </p>
              <Link
                to="/nutrition"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5" />
                Tạo kế hoạch ngay
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !recommendation && !petsLoading && pets.length > 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💡</div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              Chọn thú cưng để xem khuyến nghị
            </h3>
            <p className="text-gray-600">
              Hệ thống sẽ tự động tính toán khẩu phần phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}