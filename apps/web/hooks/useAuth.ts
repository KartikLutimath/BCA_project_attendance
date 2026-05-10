"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/auth.service";
import { LoginDTO, RegisterDTO } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginDTO) => AuthService.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      toast.success(`Welcome back, ${data.user.fullName.split(" ")[0]}!`);

      // Role-based redirect
      switch (data.user.role) {
        case "STUDENT":
          router.push("/dashboard");
          break;
        case "TEACHER":
          router.push("/teacher/dashboard");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDTO) => AuthService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Registration failed.");
    },
  });

  const logout = () => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      AuthService.logout(refreshToken).catch(() => {});
    }
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
