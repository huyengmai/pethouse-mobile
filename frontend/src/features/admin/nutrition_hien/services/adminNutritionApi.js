import axios from "axios";
import { authHelpers } from '../../../../api/authApi';

/**
 * ===============================
 * ADMIN NUTRITION API
 * ===============================
 */
import { API_BASE_URL } from '../../../../config/api';

const ADMIN_BASE_URL = `${API_BASE_URL}/admin/nutrition`;

const adminClient = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests
adminClient.interceptors.request.use((config) => {
  const token = authHelpers.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

// Handle errors
adminClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      console.error("Admin authentication error");
    }
    console.error("Admin API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const adminNutritionApi = {
  // ===== RULES =====
  createRule: async (data) =>
    (await adminClient.post("/rules", data)).data,

  getAllRules: async () =>
    (await adminClient.get("/rules")).data,

  getRuleById: async (id) =>
    (await adminClient.get(`/rules/${id}`)).data,

  getRulesBySpecies: async (species) =>
    (await adminClient.get(`/rules/species/${species}`)).data,

  updateRule: async (id, data) =>
    (await adminClient.put(`/rules/${id}`, data)).data,

  deleteRule: async (id) =>
    adminClient.delete(`/rules/${id}`),

  // ===== RECOMMENDATIONS =====
  createRecommendationForRule: async (ruleId, data) =>
    (await adminClient.post(`/rules/${ruleId}/recommendations`, data)).data,

  updateRecommendation: async (id, data) =>
    (await adminClient.put(`/recommendations/${id}`, data)).data,

  deleteRecommendation: async (id) =>
    adminClient.delete(`/recommendations/${id}`),

  // ===== TEMPLATES =====
  createTemplate: async (data) =>
    (await adminClient.post("/templates", data)).data,

  getAllTemplates: async () =>
    (await adminClient.get("/templates")).data,

  getTemplateById: async (id) =>
    (await adminClient.get(`/templates/${id}`)).data,

  getTemplatesBySpecies: async (species) =>
    (await adminClient.get(`/templates/species/${species}`)).data,

  updateTemplate: async (id, data) =>
    (await adminClient.put(`/templates/${id}`, data)).data,

  deleteTemplate: async (id) =>
    adminClient.delete(`/templates/${id}`),

  // ===== FORMULAS =====
  createFormula: async (data) =>
    (await adminClient.post("/formulas", data)).data,

  getAllFormulas: async () =>
    (await adminClient.get("/formulas")).data,

  getFormulaById: async (id) =>
    (await adminClient.get(`/formulas/${id}`)).data,

  updateFormula: async (id, data) =>
    (await adminClient.put(`/formulas/${id}`, data)).data,

  deleteFormula: async (id) =>
    adminClient.delete(`/formulas/${id}`),

  // ===== HEALTH =====
  adminHealthCheck: async () =>
(await adminClient.get("/health")).data,
};

export default adminNutritionApi;