import api from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth.types';
import { setToken, setUser, clearAuth } from '../utils/storage';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<{ success: boolean; message: string; data: LoginResponse }>(
        '/auth/login',
        credentials
    );
    const data = response.data.data;

    // Store token and user
    setToken(data.token);
    setUser(data.user);

    return data;
};

export const getProfile = async (): Promise<User> => {
    const response = await api.get<{ success: boolean; message: string; data: User }>(
        '/auth/profile'
    );
    return response.data.data;
};

export const logout = (): void => {
    clearAuth();
    window.location.href = '/login';
};
