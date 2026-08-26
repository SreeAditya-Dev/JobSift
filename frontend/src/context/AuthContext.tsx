'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USER } from '@/lib/mockData';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  switchPersona: (role: UserRole) => Promise<void>;
  updateUserLocal: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  switchPersona: async () => {},
  updateUserLocal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jobsift_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const me = await authApi.getMe();
          setUser(me);
        } catch {
          // Keep default mock persona if offline
          setUser(INITIAL_USER);
        }
      } else {
        // Set default candidate persona for quick judge evaluation
        setUser(INITIAL_USER);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('jobsift_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.warn('API login failed, falling back to mock login');
      setUser({ ...INITIAL_USER, email });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      localStorage.setItem('jobsift_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.warn('API register failed, falling back to mock user creation');
      setUser({
        ...INITIAL_USER,
        ...userData,
        id: Date.now(),
        karma_points: 100,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jobsift_token');
    setToken(null);
    setUser(null);
  };

  const switchPersona = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await authApi.switchDemoPersona(role);
      localStorage.setItem('jobsift_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch {
      // Offline / immediate fallback persona definitions
      if (role === 'recruiter') {
        setUser({
          id: 2,
          email: 'sarah.chen@stripe.com',
          full_name: 'Sarah Chen',
          role: 'recruiter',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          headline: 'Principal Talent Lead @ Stripe | Infrastructure & Platform',
          bio: 'Connecting visionary engineers with world-class product teams at Stripe.',
          location: 'Seattle, WA',
          company: 'Stripe',
          karma_points: 580,
          is_verified_employee: true,
          created_at: new Date().toISOString(),
        });
      } else if (role === 'employee') {
        setUser({
          id: 3,
          email: 'david.kim@google.com',
          full_name: 'David Kim',
          role: 'employee',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          headline: 'Staff Software Engineer @ Google Cloud | Ex-Meta',
          bio: 'Working on distributed consensus & global Kubernetes scheduling. Mentoring engineers and referring builders.',
          location: 'Sunnyvale, CA',
          company: 'Google',
          years_of_experience: 9.0,
          skills: ['Go', 'Kubernetes', 'Distributed Systems', 'C++', 'Python', 'GCP'],
          karma_points: 720,
          is_verified_employee: true,
          created_at: new Date().toISOString(),
        });
      } else {
        setUser(INITIAL_USER);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserLocal = (updatedFields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedFields });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        token,
        login,
        register,
        logout,
        switchPersona,
        updateUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
