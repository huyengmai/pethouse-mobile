import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, BookOpen } from 'lucide-react';
import { adminNutritionApi } from '../services/adminNutritionApi';

export default function AdminNutritionDashboard() {
  const [stats, setStats] = useState({
    rules: 0,
    recommendations: 0,
    templates: 0,
    formulas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [rules, templates, formulas] = await Promise.all([
        adminNutritionApi.getAllRules(),
        adminNutritionApi.getAllTemplates(),
        adminNutritionApi.getAllFormulas()
      ]);

      // Count recommendations from rules
      const totalRecs = rules.reduce((sum, rule) => 
        sum + (rule.recommendations?.length || 0), 0
      );

      setStats({
        rules: rules.length,
        recommendations: totalRecs,
        templates: templates.length,
        formulas: formulas.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      id: 'rules',
      icon: '📋',
      title: 'Nutrition Rules',
      description: 'Định nghĩa quy tắc dinh dưỡng theo giống, tuổi, cân nặng và hoạt động',
      link: '/admin/nutrition/rules',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      stats: stats.rules,
      features: ['Theo species/breed', 'Theo độ tuổi', 'Theo cân nặng', 'Theo hoạt động']
    },
    {
      id: 'recommendations',
      icon: '💡',
      title: 'Nutrition Recommendations',
      description: 'Định nghĩa khuyến nghị dinh dưỡng (calories, protein, fat, carbs) cho từng rule',
      link: '/admin/nutrition/recommendations',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      stats: stats.recommendations,
      features: ['Calories', 'Protein', 'Fat', 'Carbohydrates']
    },
    {
      id: 'templates',
      icon: '🍽️',
      title: 'Meal Templates',
      description: 'Tạo template bữa ăn mẫu để user có thể sử dụng nhanh chóng',
      link: '/admin/nutrition/templates',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      stats: stats.templates,
      features: ['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Theo species']
    },
    {
      id: 'formulas',
      icon: '🧮',
      title: 'Nutrition Formulas',
      description: 'Định nghĩa công thức tính toán RER, MER và các chỉ số dinh dưỡng',
      link: '/admin/nutrition/formulas',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500',
      stats: stats.formulas,
features: ['RER (Rest Energy)', 'MER (Maintenance)', 'Protein/Fat/Carbs', 'Custom formulas']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Admin Control Panel</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  ADMIN
                </span>
              </div>
              <p className="text-white/90 text-sm">
                Quản lý hệ thống dinh dưỡng: Rules, Recommendations, Templates và Formulas
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/nutrition"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg font-semibold transition-all shadow-sm border border-gray-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại chế độ User
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Rules</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {loading ? '...' : stats.rules}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Recommendations</div>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {loading ? '...' : stats.recommendations}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
<div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Templates</div>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {loading ? '...' : stats.templates}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🧮</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Formulas</div>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {loading ? '...' : stats.formulas}
            </div>
          </div>
        </div>

        {/* Info Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2 text-sm">📘 Hướng dẫn sử dụng</h3>
              <ul className="space-y-1.5 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Rules:</strong> Định nghĩa quy tắc dinh dưỡng theo species, breed, age, weight, activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Recommendations:</strong> Gán khuyến nghị cụ thể (calories, protein, fat, carbs) cho từng rule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Templates:</strong> Tạo mẫu bữa ăn để user áp dụng nhanh</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Formulas:</strong> Định nghĩa công thức tính toán (RER, MER, v.v.)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Role Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
            <div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-xl">
                👨‍💼
              </div>
              <div>
                <h3 className="text-base font-bold text-red-700">ADMIN - Quản trị viên</h3>
                <p className="text-xs text-red-600">Định nghĩa và kiểm soát hệ thống</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-red-800">
              <li>✓ Tạo và quản lý Nutrition Rules</li>
              <li>✓ Định nghĩa Nutrition Recommendations</li>
              <li>✓ Định nghĩa Nutrition Formulas</li>
              <li>✓ Tạo Meal Templates chuẩn</li>
              <li>✓ Điều chỉnh khoa học dinh dưỡng toàn hệ thống</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                👤
              </div>
              <div>
                <h3 className="text-base font-bold text-blue-700">USER - Người dùng</h3>
                <p className="text-xs text-blue-600">Sử dụng và theo dõi</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-blue-800">
              <li>✓ Tạo và quản lý Meal Plans cho thú cưng</li>
              <li>✓ Áp dụng Templates hoặc tạo meals thủ công</li>
              <li>✓ Thêm Meals & Food Items vào meal plans</li>
              <li>✓ Xem Daily/Weekly Summary</li>
              <li>✓ Nhận Recommendations tự động</li>
            </ul>
          </div>
        </div>

        {/* Admin Features Grid */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chức năng quản trị</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className={`${feature.bgColor} rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200`}
            >
              <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-md mb-3`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-xs line-clamp-2">
                {feature.description}
              </p>
              
              <div className="bg-white/70 rounded-lg p-3 mb-3">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {loading ? '...' : feature.stats}
                </div>
<div className="text-xs text-gray-600">
                  {feature.features.slice(0, 2).join(' • ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700"></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}