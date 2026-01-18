import { createContext } from 'react';
import type { User } from "@/types/User"

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateBalance: (amount: number) => void;
}

export const UserContext = createContext<AuthContextType | null>(null);

export const ThemeContext = createContext<string>('light');

export const SessionContext = createContext<any>(null);