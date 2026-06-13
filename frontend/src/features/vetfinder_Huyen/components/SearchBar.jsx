import { useState } from 'react'

const SERVICE_OPTIONS = [
  { value: '', label: 'Tất cả dịch vụ' },
  { value: 'Khám bệnh', label: 'Khám bệnh' },
  { value: 'Tiêm phòng', label: 'Tiêm phòng' },
  { value: 'Phẫu thuật', label: 'Phẫu thuật' },
  { value: 'Grooming', label: 'Grooming' },
  { value: 'Cấp cứu', label: 'Cấp cứu 24/7' },
  { value: 'Nội trú', label: 'Nội trú' },
]

const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 15, label: '15 km' },
]

export default function SearchBar({ onSearch, onNearbySearch, onFilterService, loading }) {
  const [keyword, setKeyword] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [radius, setRadius] = useState(10)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleKeywordSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      onSearch(keyword.trim())
    }
  }

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onNearbySearch(latitude, longitude, radius, selectedService || null)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.')
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleServiceChange = (service) => {
    setSelectedService(service)
    if (service) {
      onFilterService(service)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* Keyword Search */}
      <form onSubmit={handleKeywordSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm phòng khám, địa chỉ..."
            className="w-full px-6 py-4 pl-12 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition disabled:opacity-50"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Service Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition bg-white"
          >
            {SERVICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Select */}
        <div className="w-32">
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition bg-white"
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nearby Search Button */}
        <button
          onClick={handleNearbySearch}
          disabled={loading || isGettingLocation}
          className="flex items-center gap-2 px-6 py-3 bg-yellow text-primary rounded-xl hover:bg-yellow-light transition disabled:opacity-50 font-semibold shadow-md hover:shadow-lg"
        >
          {isGettingLocation ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Đang định vị...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tìm gần tôi
            </>
          )}
        </button>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-500 py-1">Lọc nhanh:</span>
        {['Khám bệnh', 'Tiêm phòng', 'Grooming', 'Cấp cứu'].map((service) => (
          <button
            key={service}
            onClick={() => handleServiceChange(service)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedService === service
                ? 'bg-primary text-white shadow-sm'
                : 'bg-bg-light text-primary hover:bg-bg-green'
            }`}
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  )
}
