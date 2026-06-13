/**
 * Backend host cho các môi trường
 * - Development trên máy: localhost
 * - Trên Android Emulator: 10.0.2.2
 */
const getApiHost = () => {
  // Ưu tiên biến môi trường (nếu có)
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST;
  }

  // Kiểm tra đang chạy trên Android (Capacitor)
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    return "http://10.0.2.2:9090";   // ← IP đặc biệt của Emulator
  }

  // Mặc định cho web (dev mode)
  return "http://localhost:9090";
};

export const API_HOST = getApiHost();
export const API_BASE_URL = `${API_HOST}/api`;

/** Ghép URL ảnh/static từ backend */
export function resolveBackendUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `\( {API_HOST} \){path}` : `\( {API_HOST}/ \){path}`;
}