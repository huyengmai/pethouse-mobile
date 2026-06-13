import React, { useState, useEffect } from 'react';
import { useAdminBookingApi } from '../api/useAdminBookingApi'; 
import { toast } from 'react-toastify';
import { vetClinicApi } from '../../../vetfinder_huyen/services/vetClinicApi';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const AdminBookings = () => {
  const { 
    getAllBookings, 
    confirmBooking, 
    completeBooking, 
    cancelBooking, 
    getBookingStats 
  } = useAdminBookingApi();
  
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vetClinics, setVetClinics] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    vetClinicId: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null, reason: '' });
  const [completeModal, setCompleteModal] = useState({ show: false, bookingId: null, note: '' });

  // Fetch vet clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await vetClinicApi.getAllClinics();
        const data = response.data?.data || response.data || [];
        setVetClinics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi tải phòng khám:', err);
      }
    };
    fetchClinics();
  }, []);

  // Fetch bookings when component mounts and when page changes
  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filters.page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {
        page: filters.page,
        size: filters.size
      };
      
      if (filters.status) params.status = filters.status;
      if (filters.vetClinicId) params.vetClinicId = filters.vetClinicId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await getAllBookings(params);
      const pageData = response.data?.data || response.data || response;
      
      setBookings(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
      toast.error('Không thể tải danh sách đặt lịch');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await getBookingStats(params);
      setStats(response.data?.data || response.data || response);
    } catch (err) {
console.error('Lỗi tải thống kê:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 0 }));
    fetchBookings();
    fetchStats();
  };

  const handleConfirm = async (id) => {
    if (!window.confirm('Xác nhận đặt lịch này?')) return;
    try {
      await confirmBooking(id);
      toast.success('Đã xác nhận đặt lịch');
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error('Không thể xác nhận');
    }
  };

  const handleComplete = async () => {
    if (!completeModal.bookingId) return;
    try {
      await completeBooking(completeModal.bookingId, completeModal.note);
      toast.success('Đã hoàn thành đặt lịch');
      setCompleteModal({ show: false, bookingId: null, note: '' });
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error('Không thể hoàn thành');
    }
  };

  const handleCancel = async () => {
    if (!cancelModal.bookingId || !cancelModal.reason) {
      toast.warning('Vui lòng nhập lý do hủy');
      return;
    }
    try {
      await cancelBooking(cancelModal.bookingId, cancelModal.reason);
      toast.success('Đã hủy đặt lịch');
      setCancelModal({ show: false, bookingId: null, reason: '' });
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error('Không thể hủy');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      BOOKED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: 'Chờ xác nhận',
      BOOKED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClinicName = (clinicId) => {
    const clinic = vetClinics.find(c => c.id === clinicId);
    return clinic ? clinic.name : `Clinic #${clinicId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đặt lịch</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi các lịch hẹn</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng số</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings || 0}</p>
              </div>
              <TrendingUp className="text-purple-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Chờ xác nhận</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingBookings || 0}</p>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Đã xác nhận</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.confirmedBookings || 0}</p>
              </div>
              <CheckCircle className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Hoàn thành</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedBookings || 0}</p>
              </div>
              <Users className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Đã hủy</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelledBookings || 0}</p>
              </div>
              <XCircle className="text-red-500" size={40} />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
name="status" 
              value={filters.status} 
              onChange={handleFilterChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="BOOKED">Đã xác nhận</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phòng khám</label>
            <select
              name="vetClinicId"
              value={filters.vetClinicId}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tất cả phòng khám</option>
              {vetClinics.map(clinic => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
            <input 
              type="date" 
              name="startDate" 
              value={filters.startDate} 
              onChange={handleFilterChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
            <input 
              type="date" 
              name="endDate" 
              value={filters.endDate} 
              onChange={handleFilterChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-lg">Không có dữ liệu</p>
          </div>
        ) : (
          <>
<div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phòng khám</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dịch vụ</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày hẹn</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        User #{booking.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {getClinicName(booking.vetClinicId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.serviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(booking.bookingDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {booking.status === 'PENDING' && (
                            <button 
                              onClick={() => handleConfirm(booking.id)} 
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            >
                              Xác nhận
                            </button>
                          )}
                          {booking.status === 'BOOKED' && (
<button 
                              onClick={() => setCompleteModal({ show: true, bookingId: booking.id, note: '' })} 
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                              Hoàn thành
                            </button>
                          )}
                          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <button 
                              onClick={() => setCancelModal({ show: true, bookingId: booking.id, reason: '' })} 
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Trang <span className="font-semibold">{filters.page + 1}</span> / <span className="font-semibold">{totalPages || 1}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={filters.page === 0} 
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Trước
                </button>
                <button 
                  disabled={filters.page >= totalPages - 1} 
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Sau
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Complete Modal */}
      {completeModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hoàn thành đặt lịch</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
              <textarea
value={completeModal.note}
                onChange={(e) => setCompleteModal(prev => ({ ...prev, note: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Nhập ghi chú..."
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleComplete} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Xác nhận
              </button>
              <button 
                onClick={() => setCompleteModal({ show: false, bookingId: null, note: '' })} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hủy đặt lịch</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do hủy <span className="text-red-500">*</span></label>
              <textarea
                value={cancelModal.reason}
                onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Nhập lý do hủy..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleCancel} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Xác nhận hủy
              </button>
              <button 
                onClick={() => setCancelModal({ show: false, bookingId: null, reason: '' })} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;