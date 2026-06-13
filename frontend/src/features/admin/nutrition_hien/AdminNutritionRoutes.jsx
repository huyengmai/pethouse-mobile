import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoute } from '../../../components/common/ProtectedRoute';
import {
  AdminNutritionDashboard,
  ManageRulesPage,
  ManageTemplatesPage,
  ManageFormulasPage,
  ManageRecommendationsPage
} from './Index';

export default function AdminNutritionRoutes() {
  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route 
        path="/" 
        element={
          <AdminRoute>
            <AdminNutritionDashboard />
          </AdminRoute>
        } 
      />
      
      {/* Manage Nutrition Rules */}
      <Route 
        path="/rules" 
        element={
          <AdminRoute>
            <ManageRulesPage />
          </AdminRoute>
        } 
      />
      
      {/* Manage Meal Templates */}
      <Route 
        path="/templates" 
        element={
          <AdminRoute>
            <ManageTemplatesPage />
          </AdminRoute>
        } 
      />
      
      {/* Manage Nutrition Formulas */}
      <Route 
        path="/formulas" 
        element={
          <AdminRoute>
            <ManageFormulasPage />
          </AdminRoute>
        } 
      />

      <Route 
        path="/recommendations" 
        element={
          <AdminRoute>
            <ManageRecommendationsPage />
          </AdminRoute>
        } 
      />
      
      {/* 404 - Redirect to Admin Dashboard */}
      <Route path="*" element={<Navigate to="/nutrition/admin" replace />} />
    </Routes>
  );
}

// ============================================
// AVAILABLE ADMIN ROUTES (Requires Admin Role)
// ============================================
/*
Admin Setup:
To make a user admin, set in Clerk Dashboard:
User → Metadata → Public Metadata:
{
  "role": "admin"
}

Routes:
- /nutrition/admin                → Admin Dashboard
- /nutrition/admin/rules          → Manage Nutrition Rules
- /nutrition/admin/templates      → Manage Meal Templates
- /nutrition/admin/formulas       → Manage Nutrition Formulas
*/