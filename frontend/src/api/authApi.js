import httpClient from "./httpClient";


export const authApi = {
  // Đăng ký tài khoản mới
  register: (data) => httpClient.post("/auth/register", data),

  // Đăng nhập
  login: (data) => httpClient.post("/auth/login", data),

  // Refresh token
  refreshToken: (refreshToken) =>
    httpClient.post("/auth/refresh", { refreshToken }),

  // Đăng xuất
  logout: () => httpClient.post("/auth/logout"),

  // Lấy thông tin user hiện tại
  me: () => httpClient.get("/auth/me"),

  // Đổi mật khẩu
  changePassword: (data) => httpClient.put("/auth/change-password", data),

  // Quên mật khẩu - gửi mã xác thực về email
  forgotPassword: (email) => httpClient.post("/auth/forgot-password", { email }),

  // Xác thực mã code
  verifyCode: (email, code) => httpClient.post("/auth/verify-code", { email, code }),

  // Đặt lại mật khẩu
  resetPassword: (email, code, newPassword) =>
    httpClient.post("/auth/reset-password", { email, code, newPassword }),
};

// Helper functions để quản lý auth state
export const authHelpers = {
  // Lưu tokens và user info sau khi login/register
  saveAuthData: (authResponse) => {
    sessionStorage.setItem("accessToken", authResponse.accessToken);
    sessionStorage.setItem("refreshToken", authResponse.refreshToken);
    sessionStorage.setItem("user", JSON.stringify(authResponse.user));
  },

  // Xóa auth data khi logout
  clearAuthData: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!sessionStorage.getItem("accessToken");
  },

  // Lấy thông tin user từ sessionStorage
  getUser: () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Lấy access token
  getAccessToken: () => {
    return sessionStorage.getItem("accessToken");
  },
};
