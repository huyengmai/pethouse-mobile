import httpClient from "./httpClient";

export const userApi = {
  getMyProfile: () => httpClient.get("/api/user/me"),

  updateMyProfile: (data) =>
    httpClient.put("/api/user/me", data),
};
