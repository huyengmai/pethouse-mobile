import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import AdminLayout from './components/common/AdminLayout'
import { AdminRoute } from './components/common/ProtectedRoute'
import HomePage from './features/home/pages/HomePage'
import BookingPage from './features/booking_hai/pages/BookingPage'
import MyBookingsPage from './features/booking_hai/pages/MyBookingPage'
import VetFinderPage from './features/vetfinder_huyen/pages/VetFinderPage'
import DiaryRoutes from './features/diary_giang/DiaryRoutes'
import NutritionRoutes from './features/nutrition_hien/NutritionRoutes'
import UserProfilePage from './features/petsprofile_hoa/pages/UserProfilePage'
import PetProfilePage from './features/petsprofile_hoa/pages/PetProfilePage'
import HealthPage from './features/health_chi/pages/HealthPage'
import AdminDashboard from './features/admin/pages/AdminDashboard'
import UserManagement from './features/admin/pages/UserManagement'
import AdminBookings from './features/admin/booking_hai/components/AdminBookings'
import AdminTimeSlots from './features/admin/booking_hai/components/AdminTimeSlots'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import AdminNutritionRoutes from './features/admin/nutrition_hien/AdminNutritionRoutes'
import ReviewPage from './features/review_huyen/pages/ReviewPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages - no layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Homepage with Layout */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/home" element={
          <Layout>
            <HomePage />
          </Layout>
        } />

        {/* Other pages */}
        <Route path="/bookings" element={
          <Layout>
            <BookingPage />
          </Layout>
        } />

        <Route path="/my-bookings" element={
          <Layout>
            <MyBookingsPage />
          </Layout>
        } />

        <Route path="/profile" element={
          <Layout>
            <UserProfilePage />
          </Layout>
        } />

        <Route path="/my-pets" element={
          <Layout>
            <PetProfilePage />
          </Layout>
        } />

        <Route path="/health" element={
          <Layout>
            <HealthPage />
          </Layout>
        } />
        <Route path="/health/:id" element={
          <Layout>
            <HealthPage />
          </Layout>
        } />

        <Route path="/vet-finder" element={
          <Layout>
            <VetFinderPage />
          </Layout>
        } />
        <Route path="/diary/*" element={
          <Layout>
            <DiaryRoutes />
          </Layout>
        } />

        <Route path="/nutrition/*" element={
          <Layout>
            <NutritionRoutes />
          </Layout>
        } />

        <Route path="/review" element={
          <Layout>
            <ReviewPage />
          </Layout>
        } />

        {/* Admin routes - Protected by AdminRoute */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout><div><UserManagement/></div></AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/vaccines" element={
          
            <AdminLayout><div>Trang Cấu hình Vaccine (Ghép vào đây)</div></AdminLayout>
          
        } />
        <Route path="/admin/nutrition/*" element={
          <AdminRoute>
            <AdminLayout><AdminNutritionRoutes/></AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <AdminLayout><AdminBookings /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/time-slots" element={
          <AdminRoute>
            <AdminLayout><AdminTimeSlots /></AdminLayout>
          </AdminRoute>
        } />
      </Routes>


    </BrowserRouter>
  )
}

export default App
