import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, TrendingUp, ChevronLeft, ChevronRight, RefreshCw, LogIn } from 'lucide-react';
import { nutritionApi } from '../services/nutritionApi';
import { authHelpers } from '../../../api/authApi';
import { NutritionCard } from '../components/NutritionCard';
import { NutritionSummary } from '../components/NutritionSummary';
import CaloriesTracker from '../components/CaloriesTracker';

export default function NutritionDashboard() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealPlan, setMealPlan] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);

  const isAuthenticated = authHelpers.isAuthenticated();

  // Kiểm tra đăng nhập - hiển thị UI yêu cầu đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">
            Bạn cần đăng nhập để quản lý dinh dưỡng thú cưng của mình.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg w-full"
          >
            <LogIn size={20} /> ĐĂNG NHẬP NGAY
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            Chưa có tài khoản? <Link to="/register" className="text-green-600 font-semibold hover:underline">Đăng ký</Link>
          </p>
        </div>
      </div>
    );
  }

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

      // ✅ GỌI API THẬT TỪ PET SERVICE
      const data = await nutritionApi.getPetsForNutrition(forceRefresh);
      
      if (data.length === 0) {
        setPetsError('Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước.');
        setPets([]);
        setSelectedPet(null);
        return;
      }

      setPets(data);
      
      // Auto-select first pet
      if (data.length > 0 && !selectedPet) {
        setSelectedPet(data[0]);
      }

      console.log(`✅ Loaded ${data.length} pets for nutrition`);
      
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
      setPetsError('Không thể tải danh sách thú cưng. Vui lòng thử lại.');
      setPets([]);
      setSelectedPet(null);
    } finally {
      setPetsLoading(false);
    }
  };

  // ============================================
  // LOAD DATA WHEN PET OR DATE CHANGES
  // ============================================
  useEffect(() => {
    if (selectedPet) {
      loadMealPlan();
      loadDailySummary();
      loadRecommendation();
    }
  }, [selectedPet, selectedDate]);

  const loadMealPlan = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const data = await nutritionApi.getMealPlanByDate(selectedPet.id, selectedDate);
      setMealPlan(data);
    } catch (error) {
      console.error('Error loading meal plan:', error);
      setMealPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDailySummary = async () => {
    if (!selectedPet) return;

    try {
      const data = await nutritionApi.getDailySummary(selectedPet.id, selectedDate);
      setDailySummary(data);
    } catch (error) {
      console.error('Error loading summary:', error);
      setDailySummary(null);
    }
  };

  const loadRecommendation = async () => {
    if (!selectedPet) return;

    try {
      const data = await nutritionApi.getPetRecommendation(selectedPet.id);
      setRecommendation(data);
    } catch (error) {
      console.error('Error loading recommendation:', error);
      setRecommendation(null);
    }
  };

  // ============================================
  // CREATE MEAL PLAN
  // ============================================
  const createMealPlan = async () => {
    if (!selectedPet) {
      alert('Vui lòng chọn thú cưng');
      return;
    }

    try {
      setCreatingPlan(true);
      
      const newPlan = await nutritionApi.createMealPlan({
        petId: selectedPet.id,
        planDate: selectedDate,
        notes: 'Kế hoạch dinh dưỡng hàng ngày'
      });

      setMealPlan(newPlan);
      await loadDailySummary();
      
      alert('✅ Đã tạo meal plan thành công!');
    } catch (error) {
      console.error('Error creating meal plan:', error);
      alert('❌ Không thể tạo meal plan. Vui lòng thử lại.');
    } finally {
      setCreatingPlan(false);
    }
  };

  // ============================================
  // DATE NAVIGATION
  // ============================================
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // ============================================
  // REFRESH DATA
  // ============================================
  const handleRefreshPets = async () => {
    await fetchPets(true); // Force refresh
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-green to-white">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🍖 Dinh Dưỡng Thú Cưng</h1>
              <p className="text-white/80">Quản lý chế độ ăn uống khoa học cho thú cưng</p>
            </div>
            <Link
              to="/nutrition/recommendation"
              className="px-6 py-3 bg-yellow text-primary rounded-xl font-semibold hover:-translate-y-1 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Khuyến nghị
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Pet Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <h2 className="text-xl font-bold text-primary">Chọn thú cưng</h2>
            </div>
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
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600 text-sm">Đang tải danh sách thú cưng...</p>
            </div>
          )}

          {/* Pets Error */}
          {petsError && !petsLoading && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 mb-3">{petsError}</p>
              <Link
                to="/my-pets"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all"
              >
                <Plus className="w-4 h-4" />
                Thêm thú cưng
              </Link>
            </div>
          )}

          {/* Pets List */}
          {!petsLoading && !petsError && pets.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all whitespace-nowrap ${
                    selectedPet?.id === pet.id
                      ? 'border-primary bg-bg-blue text-primary shadow-md'
                      : 'border-gray-200 hover:border-primary/50 hover:shadow'
                  }`}
                >
                  <span className="text-3xl">{pet.avatar}</span>
                  <div className="text-left">
                    <div className="font-semibold">{pet.name}</div>
                    <div className="text-xs text-gray-500">{pet.breed}</div>
                    <div className="text-xs text-gray-400">
                      {pet.weight}kg • {Math.floor(pet.ageMonths / 12)}y{pet.ageMonths % 12}m
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedPet && (
          <>
            {/* Date Navigation */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-lg font-semibold text-primary border-0 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {isToday && (
                    <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Hôm nay
                    </div>
                  )}
                </div>

                <button
                  onClick={() => changeDate(1)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {recommendation && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <NutritionCard
                  title="Calories Khuyến Nghị"
                  value={dailySummary?.actualCalories || 0}  
                  recommendedValue={recommendation.recommendedCalories}
                  unit="cal"
                  icon="🔥"
                  bgColor="bg-bg-orange"
                />
                <NutritionCard
                  title="Protein"
                  value={dailySummary?.actualProtein || 0}  
                  recommendedValue={recommendation.recommendedProtein}
                  unit="g"
                  icon="💪"
                  bgColor="bg-bg-green"
                />
                <NutritionCard
                  title="Fat"
                  value={dailySummary?.actualFat || 0}  
                  recommendedValue={recommendation.recommendedFat}
                  unit="g"
                  icon="🥑"
                  bgColor="bg-bg-yellow"
                />
                <NutritionCard
                  title="Carbs"
                  value={dailySummary?.actualCarbs || 0}  
                  recommendedValue={recommendation.recommendedCarbs}
                  unit="g"
                  icon="🌾"
                  bgColor="bg-bg-blue"
                />
              </div>
            )}

            {/* ✅ THÊM CALORIES TRACKER */}
            {recommendation && dailySummary && dailySummary.status !== 'NO_DATA' && (
              <div className="mb-8">
                <CaloriesTracker
                  actualCalories={dailySummary.actualCalories || 0}
                  recommendedCalories={recommendation.recommendedCalories || 2000}
                  showProgress={true}
                  compact={false}
                />
              </div>
            )}

            {/* Daily Summary */}
            {dailySummary && dailySummary.status !== 'NO_DATA' && (
              <div className="mb-8">
                <NutritionSummary 
                  summary={dailySummary} 
                  type="daily"
                  recommendation={recommendation}  // ✅ Truyền thêm recommendation
                />
              </div>
            )}

            {/* Meal Plan Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <span>🍽️</span>
                  Kế hoạch bữa ăn
                </h2>
                {mealPlan ? (
                  <Link
                    to={`/nutrition/meal-plan/${mealPlan.id}`}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
                  >
                    Xem chi tiết
                  </Link>
                ) : (
                  <button
                    onClick={createMealPlan}
                    disabled={creatingPlan}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingPlan ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Tạo kế hoạch
                      </>
                    )}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-gray-500">Đang tải...</p>
                </div>
              ) : mealPlan ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-bg-blue to-bg-green rounded-2xl">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Tổng Calories</div>
                      <div className="text-3xl font-bold text-primary">
                        {mealPlan.totalCalories || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Số bữa ăn</div>
                      <div className="text-3xl font-bold text-primary">
                        {mealPlan.totalMeals || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Hoàn thành</div>
                      <div className="text-3xl font-bold text-green-600">
                        {mealPlan.completedMeals || 0}
                      </div>
                    </div>
                  </div>

                  {mealPlan.notes && (
                    <div className="p-4 bg-yellow-light rounded-xl">
                      <p className="text-gray-700">
                        <span className="font-semibold">Ghi chú:</span> {mealPlan.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-gray-500 mb-4">
                    Chưa có kế hoạch bữa ăn cho ngày này
                  </p>
                  <button
                    onClick={createMealPlan}
                    disabled={creatingPlan}
                    className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {creatingPlan ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Tạo kế hoạch ngay
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Link
                to="/nutrition/summary"
                className="bg-gradient-to-br from-bg-purple to-bg-pink rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-primary mb-2">Báo cáo tuần</h3>
                <p className="text-gray-600">Xem thống kê dinh dưỡng 7 ngày</p>
              </Link>

              <Link
                to="/nutrition/recommendation"
                className="bg-gradient-to-br from-bg-orange to-bg-yellow rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-xl font-bold text-primary mb-2">Khuyến nghị</h3>
                <p className="text-gray-600">Gợi ý khẩu phần phù hợp</p>
              </Link>

              <Link
                to="/nutrition/meal-plan"
                className="bg-gradient-to-br from-bg-teal to-bg-blue rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-xl font-bold text-primary mb-2">Lịch sử</h3>
                <p className="text-gray-600">Xem lại các ngày trước</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}