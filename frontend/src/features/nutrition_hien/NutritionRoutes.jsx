import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import {
  NutritionDashboard,
  MealPlanDetail,
  DailySummaryPage,
  NutritionRecommendation,
} from './Index';

export default function NutritionRoutes() {
  return (
    <Routes>
      {/* Dashboard - Home */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <NutritionDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Meal Plan Detail */}
      <Route 
        path="/meal-plan" 
        element={
          <ProtectedRoute>
            <MealPlanDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meal-plan/:id" 
        element={
          <ProtectedRoute>
            <MealPlanDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Daily/Weekly Summary */}
      <Route 
        path="/summary" 
        element={
          <ProtectedRoute>
            <DailySummaryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Nutrition Recommendation */}
      <Route 
        path="/recommendation" 
        element={
          <ProtectedRoute>
            <NutritionRecommendation />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 - Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/nutrition" replace />} />
    </Routes>
  );
}

// ============================================
// AVAILABLE USER ROUTES (Requires Login)
// ============================================
/*
- /nutrition                      → Dashboard
- /nutrition/meal-plan            → Meal Plan List
- /nutrition/meal-plan/:id        → Meal Plan Detail
- /nutrition/summary              → Daily/Weekly Summary
- /nutrition/recommendation       → Nutrition Recommendations
*/