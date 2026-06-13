import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nutritionApi } from '../services/nutritionApi';
import { NutritionCard } from '../components/NutritionCard';
import NutritionChart from '../components/NutritionChart';

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    GOOD: 'bg-green-100 text-green-700 border-green-300',
    LOW: 'bg-orange-100 text-orange-700 border-orange-300',
    HIGH: 'bg-red-100 text-red-700 border-red-300',
    NO_DATA: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const icons = {
    GOOD: '✓',
    LOW: '⚠',
    HIGH: '⚠',
    NO_DATA: 'ℹ'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border-2 ${styles[status] || styles.NO_DATA}`}>
      <span>{icons[status]}</span>
      {status}
    </span>
  );
}

export default function DailySummaryPage() {
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const petId = 1; // TODO: Get from user context

  useEffect(() => {
    if (viewMode === 'daily') {
      fetchDailySummary();
    } else {
      fetchWeeklySummary();
    }
  }, [selectedDate, viewMode]);

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      const data = await nutritionApi.getDailySummary(petId, selectedDate);
      setDailySummary(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true);
      const date = new Date(selectedDate);
      date.setDate(date.getDate() - date.getDay()); // Start of week
      const weekStart = date.toISOString().split('T')[0];
      
      const data = await nutritionApi.getWeeklySummary(petId, weekStart);
      setWeeklySummary(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu tuần. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-blue py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/nutrition"
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary mb-2">Tổng Kết Dinh Dưỡng</h1>
            <p className="text-gray-600">Theo dõi chế độ ăn uống hàng ngày và tuần</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'daily' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            📅 Hàng Ngày
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'weekly' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            📊 Hàng Tuần
          </button>
        </div>

        {/* Date Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
            >
              ← Trước
            </button>
            
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-semibold"
              />
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-yellow text-primary rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Hôm nay
              </button>
            </div>

            <button
              onClick={handleNextDay}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
            >
              Sau →
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Daily Summary */}
        {!loading && !error && viewMode === 'daily' && dailySummary && (
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <StatusBadge status={dailySummary.status} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">{dailySummary.message}</h2>
              <p className="text-gray-600">
                {dailySummary.completedMeals} / {dailySummary.totalMeals} bữa ăn đã hoàn thành
              </p>
            </div>

            {/* Nutrition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NutritionCard
                title="Calories"
                value={dailySummary.actualCalories}
                recommendedValue={dailySummary.recommendedCalories}
                unit="cal"
                icon="🔥"
                bgColor="bg-bg-orange"
              />

              <NutritionCard
                title="Protein"
                value={dailySummary.actualProtein}
                recommendedValue={dailySummary.recommendedProtein}
                unit="g"
                icon="🥩"
                bgColor="bg-bg-pink"
              />

              <NutritionCard
                title="Fat"
                value={dailySummary.actualFat}
                recommendedValue={dailySummary.recommendedFat}
                unit="g"
                icon="🧈"
                bgColor="bg-bg-blue"
              />

              <NutritionCard
                title="Carbs"
                value={dailySummary.actualCarbs}
                recommendedValue={dailySummary.recommendedCarbs}
                unit="g"
                icon="🍞"
                bgColor="bg-bg-green"
              />
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        {!loading && !error && viewMode === 'weekly' && weeklySummary && (
          <div className="space-y-8">
            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(weeklySummary.avgDailyCalories || 0)}
                </div>
                <div className="text-sm text-gray-600">Trung bình/ngày (cal)</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  {weeklySummary.totalMealsInWeek || 0}
                </div>
                <div className="text-sm text-gray-600">Tổng bữa ăn</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  {weeklySummary.completedMealsInWeek || 0}
                </div>
                <div className="text-sm text-gray-600">Đã hoàn thành</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  {weeklySummary.daysWithData || 0}/7
                </div>
                <div className="text-sm text-gray-600">Ngày có dữ liệu</div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6">Biểu Đồ Calories Theo Ngày</h3>
              <NutritionChart dailySummaries={weeklySummary.dailySummaries} />
            </div>

            {/* Weekly Message */}
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 shadow-lg text-center text-white">
              <h2 className="text-2xl font-bold mb-2">{weeklySummary.weeklyMessage}</h2>
              <p className="text-white/80">
                Tuần từ {new Date(weeklySummary.weekStart).toLocaleDateString('vi-VN')} 
                đến {new Date(weeklySummary.weekEnd).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && dailySummary?.status === 'NO_DATA' && viewMode === 'daily' && (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Chưa có dữ liệu</h3>
            <p className="text-gray-600 mb-6">Tạo meal plan để bắt đầu theo dõi dinh dưỡng!</p>
            <Link
              to="/nutrition"
              className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
            >
              Tạo ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}