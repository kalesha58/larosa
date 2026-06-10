"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "larosa-admin-theme";

type AdminTheme = "light" | "dark";

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleAdminTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(
  undefined
);

function readStoredTheme(): AdminTheme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readStoredTheme());
    setMounted(true);
  }, []);

  const toggleAdminTheme = () => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <AdminThemeContext.Provider
      value={{ theme: mounted ? theme : "light", toggleAdminTheme }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
