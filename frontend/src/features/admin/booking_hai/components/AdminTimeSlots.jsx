import React, { useState, useEffect } from 'react';
import { useAdminTimeSlotApi } from '../api/useAdminTimeSlotApi';
import { vetClinicApi } from '../../../vetfinder_huyen/services/vetClinicApi';
import { toast } from 'react-toastify';
import {
  Clock,
  Calendar,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  AlertCircle
} from 'lucide-react';

const AdminTimeSlots = () => {
  const {
    getTimeSlotsByClinicAndDate,
    getTimeSlotsByClinicAndDateRange,
    createTimeSlot,
    createBulkTimeSlots,
    updateTimeSlot,
    toggleSlotAvailability,
    deleteTimeSlot
  } = useAdminTimeSlotApi();
  const [slots, setSlots] = useState([]);
  const [vetClinics, setVetClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
 
  const [formData, setFormData] = useState({
    vetClinicId: '',
    date: '',
    startTime: '',
    endTime: '',
    serviceType: 'VACCINE',
    maxCapacity: 1,
    available: true,
    note: '',
  });
  const [bulkFormData, setBulkFormData] = useState({
    vetClinicId: '',
    dates: [{ date: '' }],  // Thay đổi: array objects thay vì string
    timeRanges: [{ startTime: '08:00', endTime: '09:00' }],
    serviceType: 'VACCINE',
    maxCapacity: 1,
  });
  const [filters, setFilters] = useState({
    vetClinicId: '',
    date: '',
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const serviceTypes = [
    { value: 'VACCINE', label: 'Tiêm phòng' },
    { value: 'GROOMING', label: 'Tắm & chăm sóc' },
  ];
  // Fetch vet clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await vetClinicApi.getAllClinics();
        const data = response.data?.data || response.data || [];
        setVetClinics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi tải phòng khám:', err);
        toast.error('Không thể tải danh sách phòng khám');
      }
    };
    fetchClinics();
  }, []);
  const fetchSlots = async () => {
    if (!filters.vetClinicId) {
      toast.warning('Vui lòng chọn phòng khám');
      return;
    }
    if (!filters.date && !(filters.startDate && filters.endDate)) {
      toast.warning('Vui lòng chọn ngày hoặc khoảng thời gian');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (filters.startDate && filters.endDate) {
        response = await getTimeSlotsByClinicAndDateRange(
          filters.vetClinicId,
          filters.startDate,
          filters.endDate
        );
      } else {
        response = await getTimeSlotsByClinicAndDate(filters.vetClinicId, filters.date);
      }
      // Handle ApiResponse wrapper
      const data = response.data?.data || response.data || response;
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải slots:', err);
      toast.error('Không thể tải danh sách khung giờ');
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      vetClinicId: '',
      date: '',
      startTime: '',
      endTime: '',
      serviceType: 'VACCINE',
      maxCapacity: 1,
      available: true,
      note: '',
    });
    setBulkFormData({
      vetClinicId: '',
      dates: [{ date: '' }],
      timeRanges: [{ startTime: '08:00', endTime: '09:00' }],
      serviceType: 'VACCINE',
      maxCapacity: 1,
    });
    setEditingId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'bulk') {
        // Parse dates array (lấy từ array objects)
        const datesArray = bulkFormData.dates.map(d => d.date).filter(Boolean);
        // Validate dates (đảm bảo unique và valid)
        const uniqueDates = [...new Set(datesArray)];
        if (uniqueDates.length === 0) {
          toast.error('Vui lòng thêm ít nhất một ngày hợp lệ');
          return;
        }
        const payload = {
          ...bulkFormData,
          dates: uniqueDates
        };
        console.log('Bulk create payload:', payload);
        const response = await createBulkTimeSlots(payload);
        console.log('Bulk create response:', response);
        toast.success(`Đã tạo ${uniqueDates.length * bulkFormData.timeRanges.length} khung giờ`);
      } else if (editingId) {
        await updateTimeSlot(editingId, formData);
        toast.success('Cập nhật khung giờ thành công');
      } else {
        await createTimeSlot(formData);
        toast.success('Tạo khung giờ thành công');
      }
      setShowModal(false);
      resetForm();
      fetchSlots();
    } catch (err) {
      console.error('Lỗi thao tác:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Thao tác thất bại';
      toast.error(errorMsg);
    }
  };
  const handleToggle = async (id, available) => {
    try {
      await toggleSlotAvailability(id, !available);
      toast.success('Đã thay đổi trạng thái');
      fetchSlots();
    } catch (err) {
      toast.error('Không thể thay đổi trạng thái');
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khung giờ này?')) return;
    try {
      await deleteTimeSlot(id);
      toast.success('Đã xóa khung giờ');
      fetchSlots();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể xóa khung giờ';
      toast.error(errorMsg);
    }
  };
  const handleEdit = (slot) => {
    setFormData({
      vetClinicId: slot.vetClinicId || '',
      date: slot.date || '',
      startTime: slot.startTime || '',
      endTime: slot.endTime || '',
      serviceType: slot.serviceType || 'VACCINE',
      maxCapacity: slot.maxCapacity || 1,
      available: slot.available ?? true,
      note: slot.note || ''
    });
    setEditingId(slot.id);
    setModalMode('edit');
    setShowModal(true);
  };
  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };
  const openBulkModal = () => {
    resetForm();
    setModalMode('bulk');
    setShowModal(true);
  };
  const addBulkRange = () => {
    setBulkFormData(prev => ({
      ...prev,
      timeRanges: [...prev.timeRanges, { startTime: '', endTime: '' }]
    }));
  };
  const removeBulkRange = (index) => {
    setBulkFormData(prev => ({
      ...prev,
      timeRanges: prev.timeRanges.filter((_, i) => i !== index)
    }));
  };
  const updateBulkRange = (index, field, value) => {
    const newRanges = [...bulkFormData.timeRanges];
    newRanges[index][field] = value;
    setBulkFormData(prev => ({ ...prev, timeRanges: newRanges }));
  };
  // Thêm functions cho dates (tương tự timeRanges)
  const addBulkDate = () => {
    setBulkFormData(prev => ({
      ...prev,
      dates: [...prev.dates, { date: '' }]
    }));
  };
  const removeBulkDate = (index) => {
    setBulkFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };
  const updateBulkDate = (index, value) => {
    const newDates = [...bulkFormData.dates];
    newDates[index].date = value;
    setBulkFormData(prev => ({ ...prev, dates: newDates }));
  };
  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khung giờ</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các khung giờ đặt lịch</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            <Plus size={20} />
            Tạo khung giờ
          </button>
          <button
            onClick={openBulkModal}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            <Calendar size={20} />
            Tạo hàng loạt
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Tìm kiếm khung giờ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phòng khám <span className="text-red-500">*</span>
            </label>
            <select
              value={filters.vetClinicId}
              onChange={(e) => setFilters(prev => ({ ...prev, vetClinicId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn phòng khám --</option>
              {vetClinics.map(clinic => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cụ thể</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={fetchSlots}
          className="mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Tìm kiếm
        </button>
      </div>
      {/* Slots Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-lg">Không có khung giờ nào</p>
            <p className="text-sm text-gray-400 mt-2">Hãy tạo khung giờ mới hoặc thử tìm kiếm khác</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phòng khám</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Ngày</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Thời gian</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Dịch vụ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Sức chứa</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{slot.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getClinicName(slot.vetClinicId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {slot.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {serviceTypes.find(t => t.value === slot.serviceType)?.label || slot.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`px-2 py-1 rounded-lg font-medium inline-block ${
                        slot.currentBookings >= slot.maxCapacity
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {slot.currentBookings}/{slot.maxCapacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slot.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {slot.available ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggle(slot.id, slot.available)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Bật/Tắt"
                        >
                          {slot.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'edit' ? 'Chỉnh sửa khung giờ' :
                 modalMode === 'bulk' ? 'Tạo hàng loạt khung giờ' :
                 'Tạo khung giờ mới'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {modalMode === 'bulk' ? (
                /* Bulk Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phòng khám <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bulkFormData.vetClinicId}
                        onChange={(e) => setBulkFormData(prev => ({ ...prev, vetClinicId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">-- Chọn phòng khám --</option>
                        {vetClinics.map(clinic => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bulkFormData.serviceType}
                        onChange={(e) => setBulkFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        {serviceTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Các ngày <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addBulkDate}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + Thêm ngày
                      </button>
                    </div>
                    {bulkFormData.dates.map((d, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="date"
                          value={d.date}
                          onChange={(e) => updateBulkDate(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg"
                          required
                        />
                        {bulkFormData.dates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBulkDate(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sức chứa tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={bulkFormData.maxCapacity}
                      onChange={(e) => setBulkFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Các khung giờ <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addBulkRange}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + Thêm khung giờ
                      </button>
                    </div>
                    {bulkFormData.timeRanges.map((range, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="time"
                          value={range.startTime}
                          onChange={(e) => updateBulkRange(index, 'startTime', e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg"
                          required
                        />
                        <span className="flex items-center text-gray-500">đến</span>
                        <input
                          type="time"
                          value={range.endTime}
                          onChange={(e) => updateBulkRange(index, 'endTime', e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg"
                          required
                        />
                        {bulkFormData.timeRanges.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBulkRange(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Form - Giữ nguyên */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phòng khám <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.vetClinicId}
                        onChange={(e) => setFormData(prev => ({ ...prev, vetClinicId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Chọn phòng khám --</option>
                        {vetClinics.map(clinic => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {serviceTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sức chứa tối đa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="available" className="text-sm font-medium text-gray-700">
                      Khung giờ khả dụng
                    </label>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 ${
                    modalMode === 'bulk' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white rounded-lg font-semibold transition-colors`}
                >
                  {modalMode === 'edit' ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimeSlots;