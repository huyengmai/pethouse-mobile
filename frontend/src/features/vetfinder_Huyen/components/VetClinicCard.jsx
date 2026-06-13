import { useState } from 'react'
import { favoriteApi } from '../services/vetClinicApi'

export default function VetClinicCard({ clinic, onSelect, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(clinic.isFavorite || false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      const response = await favoriteApi.toggleFavorite(clinic.id)
      setIsFavorite(response.data.isFavorite)
      if (onFavoriteChange) onFavoriteChange(clinic.id, response.data.isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenMaps = (e) => {
    e.stopPropagation()
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
    const hasHalfStar = (rating || 0) % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow">&#9733;</span>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow">&#9734;</span>)
      } else {
        stars.push(<span key={i} className="text-gray-300">&#9734;</span>)
      }
    }
    return stars
  }

  return (
    <div
      onClick={() => onSelect && onSelect(clinic)}
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/10 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-bg-green to-bg-blue">
        {clinic.imageUrl ? (
          <img
            src={clinic.imageUrl}
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md">
              🏥
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
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
        </button>

        {/* Distance Badge */}
        {clinic.distance && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-primary">
            {clinic.distance.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{clinic.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">{renderStars(clinic.averageRating)}</div>
          <span className="text-sm text-gray-600">
            {clinic.averageRating?.toFixed(1) || '0.0'} ({clinic.totalReviews || 0})
          </span>
        </div>

        {/* Address */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {clinic.address}
        </p>

        {/* Services */}
        {clinic.services && clinic.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {clinic.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-bg-green text-primary text-xs rounded-full font-medium"
              >
                {service}
              </span>
            ))}
            {clinic.services.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{clinic.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleOpenMaps}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-light transition font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Chỉ đường
          </button>

          {clinic.phone && (
            <a
              href={`tel:${clinic.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-4 py-2.5 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
