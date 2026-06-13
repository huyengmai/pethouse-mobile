import axios from 'axios';
import { authHelpers } from '../../../api/authApi';

/**
 * ===============================
 * PET SERVICE FOR NUTRITION MODULE
 * ===============================
 * Centralized service để quản lý Pet data cho Nutrition
 * Kế thừa từ profileService nhưng được tối ưu cho Nutrition
 */

import { API_BASE_URL } from '../../../config/api'

const PROFILE_API_URL = import.meta.env.VITE_PROFILE_API_URL || `${API_BASE_URL}/profile`;

// ============================================
// AXIOS CLIENT CONFIGURATION
// ============================================
const petApiClient = axios.create({
  baseURL: PROFILE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Attach token
petApiClient.interceptors.request.use(
  (config) => {
    const token = authHelpers.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
petApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      console.error('Authentication error - Token might be expired');
      // Có thể dispatch logout action hoặc redirect to login
    }
    
    console.error('API Error:', {
      status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Map species sang emoji avatar
 */
const getAvatarBySpecies = (species) => {
  const avatarMap = {
    DOG: '🐕',
    CAT: '🐈',
    BIRD: '🦜',
    RABBIT: '🐰',
    HAMSTER: '🐹',
    FISH: '🐠',
    TURTLE: '🐢',
    OTHER: '🐾'
  };
  return avatarMap[species?.toUpperCase()] || '🐾';
};

/**
 * Validate và normalize pet data
 */
const normalizePetData = (pet) => {
  if (!pet || typeof pet !== 'object') {
    throw new Error('Invalid pet data');
  }

  // ✅ FIX: Xử lý nhiều format dữ liệu từ API
  return {
    id: pet.id,
    name: pet.name || 'Unknown',
    species: pet.species || 'OTHER',
    breed: pet.breed || 'Mixed',
    avatar: pet.avatar || getAvatarBySpecies(pet.species),
    
    // ✅ Hỗ trợ nhiều field names khác nhau
    ageMonths: pet.ageMonths || pet.ageInMonths || pet.age || 12, // Default 1 year
    weight: pet.weight || pet.weightKg || 5, // Default 5kg
    activityLevel: pet.activityLevel || pet.activity || 'MODERATE',
    
    // Thêm các fields cần thiết cho Nutrition
    allergies: pet.allergies || [],
    healthConditions: pet.healthConditions || [],
    specialDiet: pet.specialDiet || null,
    
    // ✅ DEBUG: Log data để check
    _raw: process.env.NODE_ENV === 'development' ? pet : undefined
  };
};

/**
 * Validate danh sách pets
 */
const validatePetsList = (pets) => {
  if (!Array.isArray(pets)) {
    console.warn('Pets data is not an array, returning empty array');
    return [];
  }

  return pets
    .filter(pet => pet && pet.id) // Chỉ giữ pets hợp lệ
    .map(normalizePetData);
};

// ============================================
// CACHE MANAGEMENT (Optional but recommended)
// ============================================
let petsCache = {
  data: null,
  timestamp: null,
  expiresIn: 5 * 60 * 1000, // 5 minutes
};

const isCacheValid = () => {
  if (!petsCache.data || !petsCache.timestamp) {
    return false;
  }
  return Date.now() - petsCache.timestamp < petsCache.expiresIn;
};

const setCacheData = (data) => {
  petsCache.data = data;
  petsCache.timestamp = Date.now();
};

const clearCache = () => {
  petsCache.data = null;
  petsCache.timestamp = null;
};

// ============================================
// PUBLIC API
// ============================================
export const petService = {
  /**
   * Lấy danh sách tất cả pets của user
   * @param {boolean} forceRefresh - Bỏ qua cache và fetch mới
   * @returns {Promise<Array>} Normalized pet list
   */
  getMyPets: async (forceRefresh = false) => {
    try {
      // Check cache nếu không force refresh
      if (!forceRefresh && isCacheValid()) {
        console.log('✅ Using cached pet data');
        return petsCache.data;
      }

      console.log('🔄 Fetching pets from API...');
      const response = await petApiClient.get('/pets');
      
      // ✅ DEBUG: Log raw data
      console.log('📦 Raw API Response:', response.data);
      
      // Validate và normalize data
      const normalizedPets = validatePetsList(response.data);
      
      // ✅ DEBUG: Log normalized data
      console.log('✨ Normalized Pets:', normalizedPets);
      
      // Update cache
      setCacheData(normalizedPets);
      
      console.log(`✅ Fetched ${normalizedPets.length} pets successfully`);
      return normalizedPets;
      
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
      
      // Fallback: Trả về cache cũ nếu có
      if (petsCache.data) {
        console.warn('⚠️ API failed, using stale cache data');
        return petsCache.data;
      }
      
      // Nếu không có cache, trả về empty array
      console.warn('⚠️ No cache available, returning empty array');
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết 1 pet
   * @param {number} petId - Pet ID
   * @returns {Promise<Object>} Normalized pet data
   */
  getPetById: async (petId) => {
    try {
      // Try cache first
      if (isCacheValid() && petsCache.data) {
        const cachedPet = petsCache.data.find(p => p.id === petId);
        if (cachedPet) {
          console.log(`✅ Using cached data for pet ${petId}`);
          return cachedPet;
        }
      }

      // Fetch from API
      console.log(`🔄 Fetching pet ${petId} from API...`);
      const response = await petApiClient.get(`/pets/${petId}`);
      
      const normalizedPet = normalizePetData(response.data);
      console.log(`✅ Fetched pet ${petId} successfully`);
      
      return normalizedPet;
      
    } catch (error) {
      console.error(`❌ Error fetching pet ${petId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy pets phù hợp cho nutrition (có đủ thông tin)
   * @returns {Promise<Array>} Pets with complete nutrition data
   */
  getPetsForNutrition: async () => {
    try {
      const pets = await petService.getMyPets();
      
      // Lọc pets có đủ thông tin cần thiết cho nutrition
      const validPets = pets.filter(pet => {
        const hasBasicInfo = pet.id && pet.name && pet.species;
        // ✅ FIX: Cho phép weight = 0 và ageMonths = 0 (sẽ dùng giá trị mặc định)
        // Chỉ check có field, không check giá trị > 0
        const hasNutritionInfo = pet.weight !== undefined && pet.ageMonths !== undefined;
        return hasBasicInfo && hasNutritionInfo;
      });

      if (validPets.length === 0 && pets.length > 0) {
        console.warn('⚠️ No pets with complete nutrition data found. Returning all pets anyway.');
        // ✅ FALLBACK: Nếu không có pet nào hợp lệ, trả về tất cả
        return pets;
      }

      if (validPets.length < pets.length) {
        console.log(`ℹ️ ${validPets.length}/${pets.length} pets have complete nutrition data`);
      }

      return validPets.length > 0 ? validPets : pets;
      
    } catch (error) {
      console.error('❌ Error getting pets for nutrition:', error);
      return [];
    }
  },

  /**
   * Thêm pet mới
   * @param {Object} petData - Pet data
   * @returns {Promise<Object>} Created pet
   */
  addPet: async (petData) => {
    try {
      console.log('🔄 Creating new pet...');
      const response = await petApiClient.post('/pets', petData);
      
      const normalizedPet = normalizePetData(response.data);
      
      // Clear cache để force refresh lần sau
      clearCache();
      
      console.log('✅ Pet created successfully');
      return normalizedPet;
      
    } catch (error) {
      console.error('❌ Error creating pet:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin pet
   * @param {number} petId - Pet ID
   * @param {Object} petData - Updated data
   * @returns {Promise<Object>} Updated pet
   */
  updatePet: async (petId, petData) => {
    try {
      console.log(`🔄 Updating pet ${petId}...`);
      const response = await petApiClient.put(`/pets/${petId}`, petData);
      
      const normalizedPet = normalizePetData(response.data);
      
      // Clear cache
      clearCache();
      
      console.log(`✅ Pet ${petId} updated successfully`);
      return normalizedPet;
      
    } catch (error) {
      console.error(`❌ Error updating pet ${petId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa pet
   * @param {number} petId - Pet ID
   * @returns {Promise<void>}
   */
  deletePet: async (petId) => {
    try {
      console.log(`🔄 Deleting pet ${petId}...`);
      await petApiClient.delete(`/pets/${petId}`);
      
      // Clear cache
      clearCache();
      
      console.log(`✅ Pet ${petId} deleted successfully`);
      
    } catch (error) {
      console.error(`❌ Error deleting pet ${petId}:`, error);
      throw error;
    }
  },

  /**
   * Refresh cache manually
   */
  refreshCache: async () => {
    clearCache();
    return await petService.getMyPets(true);
  },

  /**
   * Clear cache manually
   */
  clearCache: () => {
    clearCache();
    console.log('🗑️ Pet cache cleared');
  },
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default petService;