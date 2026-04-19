import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { LoginInput, RegisterInput } from "../types/api";

export const useAuthSession = () =>
  useQuery({
    queryKey: ["auth-session"],
    queryFn: apiClient.getAuthSession,
    staleTime: 0,
    refetchOnMount: true,
    gcTime: 0
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (input: RegisterInput) => apiClient.register(input)
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (input: LoginInput) => apiClient.login(input)
  });

export const useLogout = () =>
  useMutation({
    mutationFn: apiClient.logout
  });
