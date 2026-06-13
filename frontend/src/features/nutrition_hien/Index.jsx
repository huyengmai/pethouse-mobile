// ============================================
// NUTRITION MODULE - MAIN EXPORTS
// ============================================

// ============================================
// USER PAGES
// ============================================
export { default as NutritionDashboard } from './pages/NutritionDashboard';
export { default as MealPlanDetail } from './pages/MealPlanDetail';
export { default as DailySummaryPage } from './pages/DailySummaryPage';
export { default as NutritionRecommendation } from './pages/NutritionRecommendation';


// ============================================
// COMPONENTS
// ============================================
export { default as MealPlanCard } from './components/MealCard';
export { default as FoodItemCard } from './components/FoodItemCard';
export { default as NutritionChart } from './components/NutritionChart';
export { NutritionCard } from './components/NutritionCard';
export { NutritionSummary } from './components/NutritionSummary';
export { default as AddMealModal } from './components/AddMealModal';
export { default as TemplateSelectionModal } from './components/TemplateSelectionModal';

// ============================================
// SERVICES / API
// ============================================
export { nutritionApi } from './services/nutritionApi';

// ============================================
// Default export for convenience
// ============================================
export { default } from './NutritionRoutes';