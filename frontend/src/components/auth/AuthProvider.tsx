import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../../store/auth.store';
import type { User } from '../../types/auth.types';
import { getToken, getUser, setToken, setUser, clearAuth as clearStorage } from '../../utils/storage';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUserState] = useState<User | null>(() => getUser());
    const [token, setTokenState] = useState<string | null>(() => getToken());

    const isAuthenticated = !!token && !!user;

    const setAuth = useCallback((newUser: User, newToken: string) => {
        setToken(newToken);
        setUser(newUser);
        setTokenState(newToken);
        setUserState(newUser);
    }, []);

    const clearAuth = useCallback(() => {
        clearStorage();
        setTokenState(null);
        setUserState(null);
    }, []);

    // Sync with storage on mount
    useEffect(() => {
        const storedToken = getToken();
        const storedUser = getUser();
        if (storedToken && storedUser) {
            setTokenState(storedToken);
            setUserState(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, setAuth, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
