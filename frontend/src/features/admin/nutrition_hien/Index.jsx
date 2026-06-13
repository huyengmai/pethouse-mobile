// ============================================
// ADMIN NUTRITION MODULE - EXPORTS
// ============================================

// ============================================
// PAGES
// ============================================
export { default as AdminNutritionDashboard } from './pages/AdminNutritionDashboard';
export { default as ManageRulesPage } from './pages/ManageRulesPage';
export { default as ManageRecommendationsPage } from './pages/ManageRecommendationsPage'; // ✅ THÊM MỚI
export { default as ManageTemplatesPage } from './pages/ManageTemplatesPage';
export { default as ManageFormulasPage } from './pages/ManageFormulasPage';

// ============================================
// SERVICES
// ============================================
export { adminNutritionApi } from './services/adminNutritionApi';

// ============================================
// ROUTES
// ============================================
export { default } from './AdminNutritionRoutes';