import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'admin' | 'customer' | 'host';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  hostVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  govtId?: {
    type: string;
    number: string;
    documentUrl?: string;
  };
  bankDetails?: {
    accountHolderName: string;
    bankAccountNumber: string;
    ifscCode: string;
    upiId?: string;
  };
  propertyProof?: {
    ownershipProofUrl?: string;
    addressProofUrl?: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticating: boolean;
  authError: string | null;
  isAccessDenied: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsCustomer: (phone: string, otp: string) => Promise<boolean>;
  signupHost: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  dismissAccessDenied: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const role: UserRole | null = user?.role ?? null;

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const signupHost = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticating(false);

    // Create a new unverified host
    setIsAuthenticated(true);
    setUser({
      id: 'host_' + Date.now(),
      name,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      role: 'host',
      isEmailVerified: false,
      isPhoneVerified: false,
      hostVerificationStatus: 'none',
    });
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    setIsAccessDenied(false);

    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setIsAuthenticating(false);

    const emailLower = email.toLowerCase().trim();

    // Admin credentials
    if (emailLower === 'admin@larosa.in' && password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({ id: 'adm_1', name: 'Kalesha Baig', email: 'admin@larosa.in', role: 'admin' });
      return true;
    }

    if (emailLower.endsWith('@larosa.in') || emailLower.endsWith('@larosa.com')) {
      if (password === 'demo1234') {
        setIsAuthenticated(true);
        setUser({ id: 'adm_2', name: 'Demo Admin', email: emailLower, role: 'admin' });
        return true;
      } else {
        setAuthError('invalid');
        return false;
      }
    }

    // Host credentials
    if (emailLower === 'host@larosa.in' && password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({
        id: 'host_demo',
        name: 'Ramesh Kumar',
        email: 'host@larosa.in',
        phone: '+91 98765 67890',
        role: 'host',
        isEmailVerified: true,
        isPhoneVerified: true,
        hostVerificationStatus: 'verified',
        bankDetails: {
          accountHolderName: 'Ramesh Kumar',
          bankAccountNumber: '123456789012',
          ifscCode: 'HDFC0001234',
          upiId: 'ramesh@okhdfc',
        },
      });
      return true;
    }

    // Unverified Host Demo credentials
    if (emailLower === 'newhost@larosa.in' && password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({
        id: 'host_new',
        name: 'Suresh Patel',
        email: 'newhost@larosa.in',
        phone: '9876500000',
        role: 'host',
        isEmailVerified: false,
        isPhoneVerified: false,
        hostVerificationStatus: 'none',
      });
      return true;
    }

    // Customer email login
    if (emailLower === 'guest@larosa.in' && password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({ id: 'cust_1', name: 'Arjun Mehta', email: 'guest@larosa.in', role: 'customer', phone: '+91 98765 12345' });
      return true;
    }

    // Any other customer email
    if (password === 'demo1234') {
      setIsAuthenticated(true);
      setUser({ id: 'cust_demo', name: 'Demo Guest', email: emailLower, role: 'customer' });
      return true;
    }

    setAuthError('invalid');
    return false;
  };

  // Customer phone/OTP login
  const loginAsCustomer = async (phone: string, otp: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);

    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticating(false);

    // Demo OTP: 123456
    if (otp === '123456') {
      setIsAuthenticated(true);
      setUser({ id: 'cust_1', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'customer', phone });
      return true;
    }

    setAuthError('invalid_otp');
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
        role,
        isAuthenticating,
        authError,
        isAccessDenied,
        login,
        loginAsCustomer,
        signupHost,
        updateUser,
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
