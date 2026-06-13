import { useState, useEffect } from 'react'
  import { Link } from 'react-router-dom'
  import Calendar from 'react-calendar'
  import 'react-calendar/dist/Calendar.css'
  import BookingForm from '../components/BookingForm'
  import { authHelpers } from '../../../api/authApi'
  import { vetClinicApi } from '../../vetfinder_huyen/services/vetClinicApi'
  import { Calendar as CalendarIcon, MapPin, Syringe, Scissors, Building2 } from 'lucide-react'


  export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [serviceType, setServiceType] = useState('VACCINE')
    const [vetClinics, setVetClinics] = useState([])
    const [selectedClinicId, setSelectedClinicId] = useState(null)
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [loadingClinics, setLoadingClinics] = useState(true)
    const isAuthenticated = authHelpers.isAuthenticated()

    // Fetch danh sách phòng khám
    useEffect(() => {
      const fetchClinics = async () => {
        try {
          const response = await vetClinicApi.getAllClinics()
          const data = response.data?.data || response.data || []
          setVetClinics(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error('Lỗi khi tải danh sách phòng khám:', err)
          setVetClinics([])
        } finally {
          setLoadingClinics(false)
        }
      }
      fetchClinics()
    }, [])

    // Update selected clinic info
    useEffect(() => {
      if (selectedClinicId) {
        const clinic = vetClinics.find(c => c.id === Number(selectedClinicId))
        setSelectedClinic(clinic)
      } else {
        setSelectedClinic(null)
      }
    }, [selectedClinicId, vetClinics])

    const formatDate = (date) => {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const serviceOptions = [
      {
        type: 'VACCINE',
        icon: <Syringe size={20} />,
        label: 'Tiêm phòng',
        description: 'Tiêm phòng dại, viêm gan và các loại vaccine cần thiết',
        bgColor: 'bg-bg-blue',
        activeColor: 'bg-blue-500'
      },
      {
        type: 'GROOMING',
        icon: <Scissors size={20} />,
        label: 'Tắm & Chăm sóc',
        description: 'Tắm, cắt tỉa lông, vệ sinh tai, cắt móng',
        bgColor: 'bg-bg-pink',
        activeColor: 'bg-pink-500'
      }
    ]

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-bg-green to-bg-blue py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <CalendarIcon size={20} className="text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Đặt Lịch Chăm Sóc
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              Vaccine & Grooming - Chuyên nghiệp, an toàn, yêu thương
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Service Selection */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Chọn dịch vụ
            </h2>
            <div className="grid md:grid-cols-2 gap-3 max-w-3xl">
              {serviceOptions.map((service) => (
                <button
                  key={service.type}
                  onClick={() => setServiceType(service.type)}
                  className={`relative p-4 rounded-2xl text-left transition-all border-2 ${
                    serviceType === service.type
                      ? `${service.bgColor} border-primary shadow-md`
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      serviceType === service.type ? service.activeColor + ' text-white' : 'bg-gray-100 text-gray-500'     
                    }`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-primary">{service.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                    </div>
                  </div>
                  {serviceType === service.type && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Clinic Selection */}
          <div className="mb-6 max-w-3xl">
            <h2 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Chọn phòng khám
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              {loadingClinics ? (
                <p className="text-center text-gray-500 text-sm py-2">Đang tải danh sách phòng khám...</p>
              ) : (
                <>
                  <select
                    value={selectedClinicId || ''}
                    onChange={(e) => setSelectedClinicId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-bg-green outline-none bg-white transition-all"
                  >
                    <option value="">-- Chọn phòng khám gần bạn --</option>
                    {vetClinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name} - {clinic.address}
                      </option>
                    ))}
                  </select>

                  {selectedClinic && (
                    <div className="mt-3 p-3 bg-bg-green rounded-xl">
                      <h4 className="font-semibold text-sm text-primary">{selectedClinic.name}</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-primary" />
                        {selectedClinic.address}
                      </p>
                      {selectedClinic.phone && (
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">ĐT:</span> {selectedClinic.phone}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Main Booking Section */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">  
              <h2 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                Chọn ngày đặt lịch
              </h2>
              <div className="calendar-wrapper">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  className="mx-auto border-0 rounded-xl text-sm"
                  locale="vi-VN"
                />
              </div>
              <div className="mt-4 p-3 bg-bg-blue rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Ngày đã chọn</p>
                <p className="text-sm font-semibold text-primary">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">  
              <h2 className="text-base font-semibold text-primary mb-3">
                Khung giờ trống
              </h2>
              <div className="mb-3 text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-white font-medium text-xs ${
                  serviceType === 'VACCINE'
                    ? 'bg-blue-500'
                    : 'bg-pink-500'
                }`}>
                  {serviceType === 'VACCINE' ? '💉 Tiêm phòng' : '✂️ Grooming'}
                </span>
              </div>

              {isAuthenticated ? (
                <BookingForm
                  selectedDate={selectedDate}
                  serviceType={serviceType}
                  vetClinicId={selectedClinicId}
                  petId={1}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-light border-l-4 border-yellow rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-800 font-semibold mb-0.5">
                      Bạn cần đăng nhập để đặt lịch
                    </p>
                    <p className="text-xs text-gray-600">
                      Đăng nhập để quản lý lịch hẹn và nhận thông báo
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-xl hover:bg-primary-light transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .calendar-wrapper :global(.react-calendar) {
            width: 100%;
            border: none;
            font-family: inherit;
            font-size: 0.875rem;
          }
          .calendar-wrapper :global(.react-calendar__tile) {
            padding: 0.5em;
          }
          .calendar-wrapper :global(.react-calendar__tile--active) {
            background: #1B3A4B;
            color: white;
            border-radius: 8px;
          }
          .calendar-wrapper :global(.react-calendar__tile--now) {
            background: #fef3c7;
            border-radius: 8px;
          }
          .calendar-wrapper :global(.react-calendar__tile:enabled:hover) {
            background: #e8f5e9;
            border-radius: 8px;
          }
          .calendar-wrapper :global(.react-calendar__navigation button) {
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    )
  }