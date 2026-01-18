import { createContext } from "react";
import type { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
};

export const UserContext = createContext<AuthContextType>(defaultAuthContext);

export const ThemeContext = createContext<string>("light");

export const SessionContext = createContext<any>(null);
