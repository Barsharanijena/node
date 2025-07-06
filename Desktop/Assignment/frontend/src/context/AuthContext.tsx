import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginData, RegisterData } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      // 🔥 REAL API CALL TO BACKEND
      const response = await authAPI.login(data);
      console.log('Backend login response:', response);
      
      // Handle the actual backend response
      let userData: User;
      let token: string;
      
      if (response.user && response.token) {
        // Backend returns proper format with user and token
        userData = response.user;
        token = response.token;
      } else {
        // Backend returns mock format, create user object
        userData = {
          id: response.user?.id || '123',
          email: data.email
        };
        token = response.token || 'mock-jwt-token';
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      // 🔥 REAL API CALL TO BACKEND
      const response = await authAPI.register(data);
      console.log('Backend register response:', response);
      
      // Handle the actual backend response
      let userData: User;
      let token: string;
      
      if (response.user && response.token) {
        // Backend returns proper format with user and token
        userData = response.user;
        token = response.token;
      } else {
        // Backend returns mock format, create user object
        userData = {
          id: response.user?.id || '123',
          email: data.email
        };
        token = response.token || 'mock-jwt-token';
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};