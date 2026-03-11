import { useContext } from 'react';
import { AuthContext } from '../store/auth.store';
import type { AuthContextType } from '../store/auth.store';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
