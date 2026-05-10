import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { LoginDTO, RegisterDTO, AuthResponse, ApiResponse } from "@/types";

export const AuthService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, data);
    return res.data.data;
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REGISTER, data);
    return res.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  async getMe(): Promise<AuthResponse["user"]> {
    const res = await apiClient.get<ApiResponse<AuthResponse["user"]>>(ENDPOINTS.AUTH.ME);
    return res.data.data;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return res.data.data;
  },
};
