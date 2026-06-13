/** Backend host — đổi VITE_API_HOST trong .env khi chạy trên Android (IP máy tính) */
export const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:9090";

export const API_BASE_URL = `${API_HOST}/api`;

/** Ghép URL ảnh/static từ backend */
export function resolveBackendUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `${API_HOST}${path}` : `${API_HOST}/${path}`;
}
