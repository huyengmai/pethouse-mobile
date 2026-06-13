import axios from "axios";
import { authHelpers } from "../../../api/authApi";
import { API_BASE_URL as API_ROOT } from "../../../config/api";

const API_BASE_URL = `${API_ROOT}/user/health`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authHelpers.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

export const healthService = {
  getWeights: (petId) => apiClient.get(`/pets/${petId}/weights`),
  addWeight: (petId, data) => apiClient.post(`/pets/${petId}/weights`, data),
  deleteWeight: (id) => apiClient.delete(`/weights/${id}`),

  getRecords: (petId) => apiClient.get(`/pets/${petId}/records`),
  addRecord: (petId, data) => apiClient.post(`/pets/${petId}/records`, data),
  updateRecord: (id, data) => apiClient.put(`/records/${id}`, data),
  deleteRecord: (id) => apiClient.delete(`/records/${id}`),

  getAttachments: (recordId) => apiClient.get(`/records/${recordId}/attachments`),
  addAttachment: (recordId, data) => apiClient.post(`/records/${recordId}/attachments`, data),
  deleteAttachment: (id) => apiClient.delete(`/attachments/${id}`),
};
