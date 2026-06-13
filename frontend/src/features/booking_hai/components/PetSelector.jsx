import { useState, useEffect } from 'react'
  import { profileService } from '../../petsprofile_hoa/services/profileService'
  import { authHelpers } from '../../../api/authApi'
  import { Dog, Cat, Bird, Fish, AlertCircle, CheckCircle, Loader } from 'lucide-react'

  export default function PetSelector({ selectedPetId, onSelectPet }) {
    const isAuthenticated = authHelpers.isAuthenticated()
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchPets = async () => {
        try {
          const petsData = await profileService.getMyPets()
          console.log('Pets data từ API:', petsData)
          setPets(Array.isArray(petsData) ? petsData : [])

          // Auto-select first pet if none selected
          if (petsData.length > 0 && !selectedPetId) {
            console.log('Auto-select pet:', petsData[0])
            onSelectPet(petsData[0])
          }
        } catch (err) {
          console.error('Lỗi tải danh sách pet:', err)
          setPets([])
        } finally {
          setLoading(false)
        }
      }

      if (isAuthenticated) {
        fetchPets()
      }
    }, [isAuthenticated])

    const getPetIcon = (species) => {
      const iconMap = {
        'Chó': <Dog size={18} />,
        'Mèo': <Cat size={18} />,
        'Chim': <Bird size={18} />,
        'Cá': <Fish size={18} />,
        'Thỏ': <Dog size={18} />,
        'Hamster': <Dog size={18} />,
        'Khác': <Dog size={18} />
      }
      return iconMap[species] || <Dog size={18} />
    }

    const getPetTypeLabel = (species) => {
      const labels = {
        'Chó': 'Chó',
        'Mèo': 'Mèo',
        'Chim': 'Chim',
        'Cá': 'Cá',
        'Thỏ': 'Thỏ',
        'Hamster': 'Hamster',
        'Khác': 'Khác'
      }
      return labels[species] || species || 'Thú cưng'
    }

    const calculateAge = (birthDate) => {
      if (!birthDate) return null
      const birth = new Date(birthDate)
      const today = new Date()
      const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth()

      if (months < 12) {
        return `${months} tháng`
      } else {
        const years = Math.floor(months / 12)
        const remainingMonths = months % 12
        return remainingMonths > 0 ? `${years}t ${remainingMonths}th` : `${years} tuổi`
      }
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader size={20} className="text-purple-500 animate-spin" />
        </div>
      )
    }

    if (pets.length === 0) {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <AlertCircle size={20} className="text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-amber-700 mb-1">
            Bạn chưa có thú cưng nào
          </h3>
          <p className="text-xs text-gray-600">
            Vui lòng thêm thú cưng tại trang Profile trước khi đặt lịch
          </p>
        </div>
      )
    }

    return (
      <div>
        <p className="text-xs text-gray-500 mb-2">
          Chọn 1 trong {pets.length} thú cưng của bạn
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet)}
              className={`relative p-3 rounded-xl border transition-all text-left ${
                selectedPetId === pet.id
                  ? 'bg-purple-500 text-white border-purple-600 shadow-md'
                  : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Pet Avatar/Icon */}
                <div className={`p-2 rounded-full ${
                  selectedPetId === pet.id
                    ? 'bg-white/20'
                    : 'bg-purple-100'
                }`}>
                  <div className={selectedPetId === pet.id ? 'text-white' : 'text-purple-600'}>
                    {getPetIcon(pet.species)}
                  </div>
                </div>

                {/* Pet Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">
                    {pet.name}
                  </h4>
                  <p className={`text-xs ${
                    selectedPetId === pet.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {getPetTypeLabel(pet.species)}
                    {pet.breed && ` • ${pet.breed}`}
                  </p>
                  <div className={`flex items-center gap-2 text-[10px] mt-0.5 ${
                    selectedPetId === pet.id ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {pet.birthDate && (
                      <span>{calculateAge(pet.birthDate)}</span>
                    )}
                    {pet.gender && (
                      <span>{pet.gender === 'MALE' ? '♂' : '♀'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedPetId === pet.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <CheckCircle size={10} />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-gray-400">
          Cần thêm thú cưng? 
          Vào trang Profile để thêm.
        </p>
      </div>
    )
  }