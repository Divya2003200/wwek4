

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';  


interface DecodedToken {
  sub: number;
  email: string;
  roles: string[]; 
  iat: number;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(null);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);

    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      console.log("Decoded Token:", decoded);
      

      if (decoded.roles.includes('client')) {
        setRole('client');
      } else if (decoded.roles.includes('freelancer')) {
        setRole('freelancer');
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      setRole(null);
    }
  };

  const clearToken = () => {
    setTokenState(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.roles.includes('client')) {
          setRole('client');
        } else if (decoded.roles.includes('freelancer')) {
          setRole('freelancer');
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Failed to decode token on mount:', error);
        clearToken();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};


