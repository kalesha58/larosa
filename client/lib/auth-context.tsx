import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isAuthenticating: boolean;
  authError: string | null;
  isAccessDenied: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  dismissAccessDenied: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    setIsAccessDenied(false);

    // Simulate network delay
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    setIsAuthenticating(false);

    const emailLower = email.toLowerCase().trim();

    // Mock validation rules
    if (emailLower === 'admin@larosa.in' && password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({ name: 'Kalesha Baig', email: 'admin@larosa.in', role: 'admin' });
      return true;
    }

    if (emailLower.endsWith('@larosa.in') || emailLower.endsWith('@larosa.com')) {
      if (password === 'demo1234') {
        setIsAuthenticated(true);
        setUser({ name: 'Demo Admin', email: emailLower, role: 'admin' });
        return true;
      } else {
        setAuthError('invalid');
        return false;
      }
    }

    // Access denied scenario (guest role/non-admin attempting to access admin portal)
    if (emailLower.includes('guest') || emailLower.includes('user')) {
      setIsAccessDenied(true);
      return false;
    }

    // Fallback normal invalid login error
    setAuthError('invalid');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthError(null);
    setIsAccessDenied(false);
  };

  const dismissAccessDenied = () => {
    setIsAccessDenied(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAuthenticating,
        authError,
        isAccessDenied,
        login,
        logout,
        dismissAccessDenied,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
