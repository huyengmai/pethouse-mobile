import { useState, useEffect } from 'react'
import { favoriteApi } from '../services/vetClinicApi'

export default function VetClinicDetail({ clinic, onClose, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(clinic?.isFavorite || false)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (clinic?.id) {
      loadFavoriteCount()
    }
  }, [clinic?.id])

  const loadFavoriteCount = async () => {
    try {
      const response = await favoriteApi.getFavoriteCount(clinic.id)
      setFavoriteCount(response.data.count)
    } catch (error) {
      console.error('Error loading favorite count:', error)
    }
  }

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      const response = await favoriteApi.toggleFavorite(clinic.id)
      setIsFavorite(response.data.isFavorite)
      setFavoriteCount(prev => response.data.isFavorite ? prev + 1 : prev - 1)
      if (onFavoriteChange) onFavoriteChange(clinic.id, response.data.isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenMaps = () => {
    // Ưu tiên sử dụng địa chỉ text để tìm kiếm chính xác hơn
    if (clinic.address) {
      const searchQuery = encodeURIComponent(`${clinic.name}, ${clinic.address}`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank')
    } else if (clinic.latitude && clinic.longitude) {
      window.open(`https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`, '_blank')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i < fullStars ? 'text-yellow' : 'text-gray-300'}`}>
          &#9733;
        </span>
      )
    }
    return stars
  }

  if (!clinic) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 bg-gradient-to-br from-bg-green to-bg-blue">
          {clinic.imageUrl ? (
            <img
              src={clinic.imageUrl}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-6xl shadow-lg">
                🏥
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Distance Badge */}
          {clinic.distance && (
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full font-semibold text-primary">
              {clinic.distance.toFixed(1)} km từ vị trí của bạn
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Title & Favorite */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">{clinic.name}</h2>
            <button
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-200 hover:border-red-300 transition"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg
                  className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              <span className="text-sm text-gray-600">{favoriteCount}</span>
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">{renderStars(clinic.averageRating)}</div>
            <span className="text-lg font-medium text-primary">
              {clinic.averageRating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-500">({clinic.totalReviews || 0} đánh giá)</span>
          </div>

          {/* Description */}
          {clinic.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{clinic.description}</p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-bg-light rounded-xl">
              <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium text-primary">{clinic.address}</p>
              </div>
            </div>

            {/* Phone */}
            {clinic.phone && (
              <div className="flex items-start gap-3 p-4 bg-bg-light rounded-xl">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Điện thoại</p>
                  <a href={`tel:${clinic.phone}`} className="font-medium text-primary hover:text-primary-light transition-colors">
                    {clinic.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {clinic.email && (
              <div className="flex items-start gap-3 p-4 bg-bg-light rounded-xl">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${clinic.email}`} className="font-medium text-primary hover:text-primary-light transition-colors">
                    {clinic.email}
                  </a>
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {clinic.openingHours && (
              <div className="flex items-start gap-3 p-4 bg-bg-light rounded-xl">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Giờ mở cửa</p>
                  <p className="font-medium text-primary">{clinic.openingHours}</p>
                </div>
              </div>
            )}
          </div>

          {/* Services */}
          {clinic.services && clinic.services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Dịch vụ</h3>
              <div className="flex flex-wrap gap-2">
                {clinic.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-bg-green text-primary rounded-full font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {clinic.website && (
            <a
              href={clinic.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {clinic.website}
            </a>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleOpenMaps}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-light transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Chỉ đường
            </button>

            {clinic.phone && (
              <a
                href={`tel:${clinic.phone}`}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition font-semibold text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Gọi ngay
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
