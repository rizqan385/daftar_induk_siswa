import { createContext } from 'react';
import type { User } from '../types/auth.types';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: () => {},
    clearAuth: () => {},
});