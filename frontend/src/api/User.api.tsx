import axiosInstance from "../utils/axiosInstance";

// 1. Define standard response structures
export interface ApiResponse<T = any> {
    isSuccess: boolean;
    message: string;
    data: T;
}

export interface User {
    _id: string;
    name: string;
    email: string;
}

/**
 * Authentication Services
 */
export const LoginUser = async (email: string, password: string): Promise<ApiResponse<{ user: User; token?: string }>> => {
    const { data } = await axiosInstance.post<ApiResponse>("/api/auth/login", { email, password });
    return data;
};

export const RegisterUser = async (name: string, email: string, password: string): Promise<ApiResponse<{ user: User }>> => {
    const { data } = await axiosInstance.post<ApiResponse>("/api/auth/signup", { name, email, password });
    return data;
};

export const LogoutUser = async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse>("/api/auth/logout");
    return data;
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
    const { data } = await axiosInstance.get<ApiResponse>("/api/auth/me");
    return data;
};

/**
 * User URL Management Services
 */
export const updateUrl = async (id: string, updateData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await axiosInstance.put<ApiResponse>(`/api/user/urls/${id}`, updateData);
    return data;
};

export const deleteUrl = async (id: string): Promise<ApiResponse> => {
    const { data } = await axiosInstance.delete<ApiResponse>(`/api/user/urls/${id}`);
    return data;
};