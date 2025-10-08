import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

interface User {
  name: string;
  id: string;
  qrData: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  regenerateQR: () => void;
}

const AUTH_STORAGE_KEY = '@auth_user';

export const [AuthProvider, useAuth] = createContextHook<AuthContextValue>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (name: string) => {
    const newUser: User = {
      name,
      id: Date.now().toString(),
      qrData: `user:${name}:${Date.now()}`,
    };
    
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  };

  const regenerateQR = () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        qrData: `user:${user.name}:${Date.now()}`,
      };
      setUser(updatedUser);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    regenerateQR,
  };
});
