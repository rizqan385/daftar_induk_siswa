export interface LoginRequest {
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
}

export interface LoginResponse {
    token: string;
    expires_in: number;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
