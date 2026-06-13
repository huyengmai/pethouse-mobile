import httpClient from '../../../api/httpClient';
import petService from './petService';

/**
 * ===============================
 * USER NUTRITION API
 * ===============================
 * Sử dụng httpClient chung để đảm bảo token refresh logic hoạt động
 */
const BASE_PATH = "/nutrition";

export const nutritionApi = {
  // ===== PET MANAGEMENT =====
  /**
   * Lấy danh sách pets (từ Profile Service)
   * @param {boolean} forceRefresh - Force refresh cache
   * @returns {Promise<Array>} Pet list
   */
  getMyPets: async (forceRefresh = false) => {
    try {
      return await petService.getMyPets(forceRefresh);
    } catch (error) {
      console.error('Error in nutritionApi.getMyPets:', error);
      // Fallback to empty array thay vì throw error
      return [];
    }
  },

  /**
   * Lấy 1 pet cụ thể
   * @param {number} petId - Pet ID
   * @returns {Promise<Object>} Pet data
   */
  getPetById: async (petId) => {
    try {
      return await petService.getPetById(petId);
    } catch (error) {
      console.error(`Error in nutritionApi.getPetById(${petId}):`, error);
      throw error;
    }
  },

  /**
   * Lấy pets có đủ thông tin cho nutrition
   * @returns {Promise<Array>} Valid pets for nutrition
   */
  getPetsForNutrition: async () => {
    try {
      return await petService.getPetsForNutrition();
    } catch (error) {
      console.error('Error in nutritionApi.getPetsForNutrition:', error);
      return [];
    }
  },

  /**
   * Refresh pet cache
   */
  refreshPetCache: async () => {
    try {
      return await petService.refreshCache();
    } catch (error) {
      console.error('Error refreshing pet cache:', error);
      return [];
    }
  },

  // ===== MEAL PLAN =====
  createMealPlan: async (data) =>
    (await httpClient.post(`${BASE_PATH}/meal-plans`, data)).data,

  getMealPlanById: async (id) =>
    (await httpClient.get(`${BASE_PATH}/meal-plans/${id}`)).data,

  getMealPlansByPet: async (petId) =>
    (await httpClient.get(`${BASE_PATH}/meal-plans/pet/${petId}`)).data,

  getMealPlanByDate: async (petId, date) =>
    (await httpClient.get(`${BASE_PATH}/meal-plans/pet/${petId}/date/${date}`)).data,

  getMealPlansInRange: async (petId, startDate, endDate) =>
    (await httpClient.get(`${BASE_PATH}/meal-plans/pet/${petId}/range`, {
      params: { startDate, endDate }
    })).data,

  updateMealPlan: async (id, data) =>
    (await httpClient.put(`${BASE_PATH}/meal-plans/${id}`, data)).data,

  deleteMealPlan: async (id) =>
    httpClient.delete(`${BASE_PATH}/meal-plans/${id}`),

  // ===== TEMPLATE → MEAL =====
  createMealsFromTemplate: async (mealPlanId) =>
    (await httpClient.post(`${BASE_PATH}/meals/from-template`, { mealPlanId })).data,

  // ===== MEALS =====
  addMeal: async (data) =>
    (await httpClient.post(`${BASE_PATH}/meals`, data)).data,

  getMealById: async (id) =>
    (await httpClient.get(`${BASE_PATH}/meals/${id}`)).data,

  updateMeal: async (id, data) =>
    (await httpClient.put(`${BASE_PATH}/meals/${id}`, data)).data,

  completeMeal: async (id) =>
    (await httpClient.patch(`${BASE_PATH}/meals/${id}/complete`)).data,

  deleteMeal: async (id) =>
    httpClient.delete(`${BASE_PATH}/meals/${id}`),

  // ===== FOOD ITEMS =====
  addFoodItem: async (data) =>
    (await httpClient.post(`${BASE_PATH}/food-items`, data)).data,

  getFoodItemById: async (id) =>
    (await httpClient.get(`${BASE_PATH}/food-items/${id}`)).data,

  deleteFoodItem: async (id) =>
    httpClient.delete(`${BASE_PATH}/food-items/${id}`),

  // ===== SUMMARY =====
  getDailySummary: async (petId, date) =>
    (await httpClient.get(`${BASE_PATH}/summary/daily/pet/${petId}`, {
      params: { date }
    })).data,

  getWeeklySummary: async (petId, weekStart) =>
    (await httpClient.get(`${BASE_PATH}/summary/weekly/pet/${petId}`, {
      params: { weekStart }
    })).data,

  // ===== RECOMMENDATION =====
  calculateRecommendation: async (data) =>
    (await httpClient.post(`${BASE_PATH}/recommendations/calculate`, data)).data,

  getPetRecommendation: async (petId) =>
    (await httpClient.get(`${BASE_PATH}/recommendations/pet/${petId}`)).data,

  // ===== TEMPLATES =====

  /**
   * Lấy danh sách templates có sẵn (User có thể sử dụng)
   * @param {string} species - Optional: Lọc theo species (DOG, CAT, etc.)
   * @returns {Promise<Array>} List of available templates
   */
  getAvailableTemplates: async (species = null) => {
    const params = species ? { species } : {};
    return (await httpClient.get(`${BASE_PATH}/templates`, { params })).data;
  },

  /**
   * Lấy chi tiết một template
   * @param {number} id - Template ID
   * @returns {Promise<Object>} Template details
   */
  getTemplateById: async (id) =>
    (await httpClient.get(`${BASE_PATH}/templates/${id}`)).data,

  /**
   * Tạo meal từ template
   * @param {Object} data - {templateId, mealPlanId, mealTime, customCalories?}
   * @returns {Promise<Object>} Created meal with template data
   */
  createMealFromTemplate: async (data) =>
    (await httpClient.post(`${BASE_PATH}/meals/from-template`, data)).data,

  // ===== HEALTH =====
  healthCheck: async () =>
    (await httpClient.get(`${BASE_PATH}/health`)).data,
};

export default nutritionApi;