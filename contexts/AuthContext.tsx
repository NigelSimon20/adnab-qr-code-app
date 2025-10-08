import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface User {
  name: string;
  password: string;
  id: string;
  qrData: string;
  notifications: Notification[];
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  regenerateQR: () => void;
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
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
        const parsedUser = JSON.parse(stored);
        // Ensure notifications exist for existing users
        if (!parsedUser.notifications) {
          parsedUser.notifications = [
            {
              id: '1',
              title: 'Welcome!',
              message: 'Welcome back, ' + parsedUser.name,
              timestamp: Date.now(),
              read: false,
            },
          ];
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (name: string, password: string) => {
    const newUser: User = {
      name,
      password,
      id: Date.now().toString(),
      qrData: `user:${name}:${Date.now()}`,
      notifications: [
        {
          id: '1',
          title: 'Welcome!',
          message: `Welcome to the app, ${name}!`,
          timestamp: Date.now(),
          read: false,
        },
        {
          id: '2',
          title: 'QR Code Generated',
          message: 'Your QR code has been generated successfully.',
          timestamp: Date.now() - 1000 * 60 * 5,
          read: false,
        },
      ],
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

  const markNotificationAsRead = (id: string) => {
    if (user) {
      const updatedNotifications = user.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      const updatedUser = { ...user, notifications: updatedNotifications };
      setUser(updatedUser);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const unreadNotificationsCount = user ? user.notifications.filter(n => !n.read).length : 0;

  return {
    user,
    isLoading,
    login,
    logout,
    regenerateQR,
    unreadNotificationsCount,
    markNotificationAsRead,
  };
});
