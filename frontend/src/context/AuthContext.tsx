import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useLazyQuery } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import { ROUTES } from '../constants';
import { validateAndCleanToken, clearAuthData } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [getUser] = useLazyQuery(ME);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuthData();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    // Use centralized token validation
    if (validateAndCleanToken() && storedUser) {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    if (!newToken || !newUser) {
      console.error('Invalid token or user provided to login function');
      return;
    }

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) {
      try {
        const result = await getUser();
        const data = result.data as { me?: User } | null | undefined;
        if (data?.me) {
          setUser(data.me);
          localStorage.setItem(USER_KEY, JSON.stringify(data.me));
        }
      } catch (error) {
        logout();
      }
    }
  }, [token, getUser, logout]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAdmin, isAuthenticated, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
