import VetClinicCard from './VetClinicCard'

export default function VetClinicList({ clinics, loading, onSelectClinic, onFavoriteChange }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gradient-to-br from-bg-green to-bg-blue" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex gap-2">
                <div className="h-6 bg-bg-green rounded-full w-16" />
                <div className="h-6 bg-bg-green rounded-full w-16" />
              </div>
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!clinics || clinics.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl">
        <div className="w-24 h-24 mx-auto bg-bg-light rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Không tìm thấy phòng khám</h3>
        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {clinics.map((clinic) => (
        <VetClinicCard
          key={clinic.id}
          clinic={clinic}
          onSelect={onSelectClinic}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  )
}
