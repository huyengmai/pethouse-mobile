import { Navigate } from 'react-router-dom';
import { authHelpers } from '../../api/authApi';

/**
 * Protected Route Component
 * Requires user to be signed in to access the route
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = authHelpers.isAuthenticated();
  const user = authHelpers.getUser();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check admin permission if required
  if (requireAdmin) {
    const isAdmin = user?.role === 'ADMIN' ;

    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p className="text-gray-600 mb-6">
              Bạn cần quyền Admin để truy cập trang này
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  // Render children if authenticated
  return children;
}

/**
 * Admin Route Component
 * Requires user to be admin
 */
export function AdminRoute({ children }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}

export default ProtectedRoute;
