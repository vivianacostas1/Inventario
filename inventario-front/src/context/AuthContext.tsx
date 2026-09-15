import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import type { ReactNode } from 'react';

import type { User } from '../types';

import { authService } from '../api/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  // ==========================================================
  // COMPROBAR SESIÓN
  // ==========================================================

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem('token');

        if (!token) {
          setUser(null);
          return;
        }

        const data =
          await authService.getProfile();

        setUser(data.user);
      } catch (error) {
        console.error(
          'Error comprobando autenticación:',
          error
        );

        localStorage.removeItem('token');

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email: string,
    password: string
  ) => {
    const data =
      await authService.login({
        email,
        password,
      });

    setUser(data.user);
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// HOOK useAuth
// ============================================================

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider'
    );
  }

  return context;
};