"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Admin",
    email: "admin@larosahotel.com",
    role: "admin",
  });

  const login = () =>
    setUser({
      id: "1",
      name: "Admin",
      email: "admin@larosahotel.com",
      role: "admin",
    });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return mock values if used outside provider for safety during initial dev
    return {
      user: {
        id: "1",
        name: "Admin",
        email: "admin@larosahotel.com",
        role: "admin",
      },
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}
