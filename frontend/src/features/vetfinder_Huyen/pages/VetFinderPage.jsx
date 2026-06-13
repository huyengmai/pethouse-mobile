import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '../components/SearchBar'
import VetClinicList from '../components/VetClinicList'
import VetClinicDetail from '../components/VetClinicDetail'
import { vetClinicApi, favoriteApi } from '../services/vetClinicApi'

export default function VetFinderPage() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'nearby', 'favorites', 'top-rated'
  const [searchInfo, setSearchInfo] = useState('')

  useEffect(() => {
    loadAllClinics()
  }, [])

  const loadAllClinics = async () => {
    setLoading(true)
    setSearchInfo('')
    try {
      const response = await vetClinicApi.getAllClinics()
      setClinics(response.data)
      setActiveTab('all')
    } catch (error) {
      console.error('Error loading clinics:', error)
      toast.error('Khong the tai danh sach phong kham')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (keyword) => {
    setLoading(true)
    setSearchInfo(`Ket qua tim kiem: "${keyword}"`)
    try {
      const response = await vetClinicApi.searchByKeyword(keyword)
      setClinics(response.data)
      setActiveTab('all')
      if (response.data.length === 0) {
        toast.info('Khong tim thay phong kham nao')
      }
    } catch (error) {
      console.error('Error searching:', error)
      toast.error('Loi tim kiem')
    } finally {
      setLoading(false)
    }
  }

  const handleNearbySearch = async (lat, lng, radius, service) => {
    setLoading(true)
    setSearchInfo(`Phong kham trong ban kinh ${radius}km`)
    try {
      const response = await vetClinicApi.findNearby(lat, lng, radius, service)
      setClinics(response.data)
      setActiveTab('nearby')
      if (response.data.length === 0) {
        toast.info('Khong tim thay phong kham nao gan ban')
      } else {
        toast.success(`Tim thay ${response.data.length} phong kham gan ban`)
      }
    } catch (error) {
      console.error('Error finding nearby:', error)
      toast.error('Loi tim kiem phong kham gan day')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterService = async (service) => {
    setLoading(true)
    setSearchInfo(`Loc theo dich vu: ${service}`)
    try {
      const response = await vetClinicApi.filterByService(service)
      setClinics(response.data)
      setActiveTab('all')
    } catch (error) {
      console.error('Error filtering:', error)
      toast.error('Loi loc dich vu')
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    setLoading(true)
    setSearchInfo('Phong kham yeu thich')
    try {
      const response = await favoriteApi.getFavorites()
      setClinics(response.data)
      setActiveTab('favorites')
    } catch (error) {
      console.error('Error loading favorites:', error)
      toast.error('Loi tai danh sach yeu thich')
    } finally {
      setLoading(false)
    }
  }

  const loadTopRated = async () => {
    setLoading(true)
    setSearchInfo('Phong kham duoc danh gia cao')
    try {
      const response = await vetClinicApi.getTopRated()
      setClinics(response.data)
      setActiveTab('top-rated')
    } catch (error) {
      console.error('Error loading top rated:', error)
      toast.error('Loi tai danh sach')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = (clinicId, isFavorite) => {
    // Update clinic in list
    setClinics(prev => prev.map(c =>
      c.id === clinicId ? { ...c, isFavorite } : c
    ))

    // If in favorites tab and removed, remove from list
    if (activeTab === 'favorites' && !isFavorite) {
      setClinics(prev => prev.filter(c => c.id !== clinicId))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-green to-bg-blue">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bg-purple to-bg-pink py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
            <span>🏥</span>
            <span className="text-sm font-semibold text-primary">Tìm phòng khám thú y</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-primary mb-4">
            Tìm{' '}
            <span className="relative inline-block">
              phòng khám
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-yellow rounded -z-10" />
            </span>{' '}
            gần bạn
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các phòng khám thú y uy tín, được đánh giá cao trong khu vực của bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onNearbySearch={handleNearbySearch}
          onFilterService={handleFilterService}
          loading={loading}
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={loadAllClinics}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-primary hover:bg-primary/5 border border-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={loadTopRated}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'top-rated'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-primary hover:bg-primary/5 border border-gray-200'
            }`}
          >
            Đánh giá cao
          </button>
          <button
            onClick={loadFavorites}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-primary hover:bg-primary/5 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Yêu thích
          </button>
        </div>

        {/* Search Info */}
        {searchInfo && (
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 shadow-sm">
            <p className="text-gray-600">
              {searchInfo} ({clinics.length} kết quả)
            </p>
            {searchInfo && (
              <button
                onClick={loadAllClinics}
                className="text-primary hover:text-primary-light font-medium text-sm transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Clinic List */}
        <VetClinicList
          clinics={clinics}
          loading={loading}
          onSelectClinic={setSelectedClinic}
          onFavoriteChange={handleFavoriteChange}
        />
      </main>

      {/* Detail Modal */}
      {selectedClinic && (
        <VetClinicDetail
          clinic={selectedClinic}
          onClose={() => setSelectedClinic(null)}
          onFavoriteChange={handleFavoriteChange}
        />
      )}
    </div>
  )
}
