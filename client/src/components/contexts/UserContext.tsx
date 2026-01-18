import { createContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types/User";
import api from "@/api/axios"; // Your axios instance with withCredentials: true
import { Loader2 } from "lucide-react"; // Import a spinner icon

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticationState: boolean) => void;
  logout: () => void;
}
const defaultUserContext = {
  user: null,
  isAuthenticated: false,
  setUser: (user) => {console.log("Default");},
  setIsAuthenticated: (authentication) => {console.log("Default");},
  logout: () => {console.log("Default");}
};
export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const logout = async () => {
      try {
        await api.post("/auth/logout"); // Clears the HttpOnly cookie
        setUser(null);
        setIsAuthenticated(false);
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // This request sends the cookie automatically because withCredentials: true
        const res = await api.get("/auth/me"); 
        console.log(res);
        if (res.data.user) {
          const user = res.data.user;
          setUser({
            id: user.uuid,
            username: user.username,
            fname: user.firstName,
            lname: user.lastName,
            email: user.email,
            created_at: user.accountCreatedAt,
            balance: user.balance,
            times_banned: user.timesBanned,
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("No active session found");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          Entering the Arena...
        </p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};