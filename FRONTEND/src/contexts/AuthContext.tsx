import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authAPI, getToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  user: {
    username: string;
    email: string;
  };
  user_uuid: string;
  iat: number;
  exp: number;
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const USER_DATA_KEY = 'user_data';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired, try to refresh
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                const newToken = await authAPI.refresh(refreshToken);
                const newDecoded = jwtDecode<JwtPayload>(newToken);

                const userData: User = {
                  id: newDecoded.user_uuid,
                  username: newDecoded.user.username,
                  email: newDecoded.user.email,
                  createdAt: new Date().toISOString(), // Placeholder
                  updatedAt: new Date().toISOString(), // Placeholder
                };
                setUser(userData);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                authAPI.logout();
                localStorage.removeItem(USER_DATA_KEY);
              }
            } else {
              authAPI.logout();
              localStorage.removeItem(USER_DATA_KEY);
            }
          } else {
            // Token valid
            // Check if we have fresher data in localStorage
            const cachedUserStr = localStorage.getItem(USER_DATA_KEY);
            let usedCachedData = false;

            if (cachedUserStr) {
              try {
                const cachedUser = JSON.parse(cachedUserStr) as User;
                // Verify the cached user matches the token user (security check)
                if (cachedUser.id === decoded.user_uuid) {
                  setUser(cachedUser);
                  usedCachedData = true;
                }
              } catch (e) {
                console.warn('Failed to parse cached user data', e);
                localStorage.removeItem(USER_DATA_KEY);
              }
            }

            if (!usedCachedData) {
              const userData: User = {
                id: decoded.user_uuid,
                username: decoded.user.username,
                email: decoded.user.email,
                createdAt: new Date().toISOString(), // Placeholder
                updatedAt: new Date().toISOString(), // Placeholder
              };
              setUser(userData);
              // Save to cache for next time
              localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          authAPI.logout();
          localStorage.removeItem(USER_DATA_KEY);
        }
      } else {
        localStorage.removeItem(USER_DATA_KEY);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    authAPI.logout();
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};