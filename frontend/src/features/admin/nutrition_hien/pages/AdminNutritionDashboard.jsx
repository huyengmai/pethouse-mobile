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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Admin Header - Tối ưu padding gọn trên Mobile */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 sm:p-6 mb-4 shadow-md sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3.5">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold tracking-tight truncate">Admin Control Panel</h1>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex-shrink-0">
                ADMIN
              </span>
            </div>
            <p className="text-white/80 text-xs truncate">
              Quản lý hệ thống dinh dưỡng thú cưng
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button - Căn đều và tinh chỉnh size text nhỏ gọn */}
        <div className="mb-4">
          <Link
            to="/nutrition"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white active:bg-gray-50 rounded-xl font-medium transition-all shadow-sm border border-gray-200 text-xs text-gray-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại chế độ User
          </Link>
        </div>

        {/* Quick Stats - Giảm padding (p-3.5), chỉnh size chữ để không bị vỡ bố cục */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                📋
              </div>
              <div className="text-xs text-gray-500 font-semibold truncate">Rules</div>
            </div>
            <div className="text-2xl font-bold text-blue-600 pl-1">
              {loading ? '...' : stats.rules}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                💡
              </div>
              <div className="text-xs text-gray-500 font-semibold truncate">Recs</div>
            </div>
            <div className="text-2xl font-bold text-purple-600 pl-1">
              {loading ? '...' : stats.recommendations}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                🍽️
              </div>
              <div className="text-xs text-gray-500 font-semibold truncate">Templates</div>
            </div>
            <div className="text-2xl font-bold text-green-600 pl-1">
              {loading ? '...' : stats.templates}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                🧮
              </div>
              <div className="text-xs text-gray-500 font-semibold truncate">Formulas</div>
            </div>
            <div className="text-2xl font-bold text-orange-600 pl-1">
              {loading ? '...' : stats.formulas}
            </div>
          </div>
        </div>

        {/* Info Guide - Gom gọn font size hợp lý */}
        <div className="bg-blue-50 border border-blue-150 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-bold text-blue-900 mb-1.5 text-xs">📘 Hướng dẫn sử dụng</h3>
              <ul className="space-y-1 text-xs text-blue-800">
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 select-none">•</span>
                  <span><strong>Rules:</strong> Định nghĩa quy tắc theo giống, tuổi, cân nặng.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 select-none">•</span>
                  <span><strong>Recommendations:</strong> Gán calories, dinh dưỡng cho từng rule.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 select-none">•</span>
                  <span><strong>Templates:</strong> Tạo mẫu bữa ăn sẵn cho người dùng.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 select-none">•</span>
                  <span><strong>Formulas:</strong> Thiết lập công thức tính toán RER, MER.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Role Comparison - Stack theo dạng dọc 1 cột trên mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-base">
                👨‍💼
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-800">ADMIN - Quản trị viên</h3>
                <p className="text-[11px] text-red-600">Định nghĩa và kiểm soát hệ thống</p>
              </div>
            </div>
            <ul className="space-y-1 text-xs text-red-900 opacity-90 pl-1">
              <li>• Tạo và quản lý Nutrition Rules</li>
              <li>• Định nghĩa Nutrition Recommendations</li>
              <li>• Định nghĩa Nutrition Formulas</li>
              <li>• Tạo Meal Templates chuẩn hệ thống</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-base">
                👤
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-800">USER - Người dùng</h3>
                <p className="text-[11px] text-blue-600">Sử dụng và theo dõi</p>
              </div>
            </div>
            <ul className="space-y-1 text-xs text-blue-900 opacity-90 pl-1">
              <li>• Tạo và quản lý Meal Plans cho thú cưng</li>
              <li>• Áp dụng mẫu bữa ăn có sẵn hoặc tự tạo</li>
              <li>• Xem bảng tóm tắt dinh dưỡng hàng ngày</li>
              <li>• Nhận khuyến nghị tự động chuẩn khoa học</li>
            </ul>
          </div>
        </div>

        {/* Admin Features Grid - Responsive từ 1 cột lên đa cột */}
        <h2 className="text-base font-bold text-slate-800 mb-3 pl-0.5">Chức năng quản trị</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className={`${feature.bgColor} rounded-xl p-4 transition-all duration-200 active:scale-95 hover:shadow-md border border-slate-200 flex flex-col justify-between`}
            >
              <div>
                <div className={`w-10 h-10 ${feature.iconBg} rounded-xl flex items-center justify-center text-xl shadow-sm mb-2.5`}>
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{feature.title}</h3>
                <p className="text-slate-600 mb-3 text-[11px] leading-relaxed line-clamp-2">
                  {feature.description}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-lg p-2.5 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium truncate max-w-[70%]">
                  {feature.features.slice(0, 2).join(' • ')}
                </div>
                <div className="text-lg font-extrabold text-slate-800 flex-shrink-0">
                  {loading ? '...' : feature.stats}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}