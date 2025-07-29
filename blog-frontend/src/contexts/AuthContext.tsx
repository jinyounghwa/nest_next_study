'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/api';
import { apiClient, tokenManager } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        tokenManager.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password });
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiClient.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 