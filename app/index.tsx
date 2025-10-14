import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { StatusBar } from 'expo-status-bar';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateBiometric = async () => {
      if (user && !isLoading) {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access the app',
            fallbackLabel: 'Use password',
          });

          if (result.success) {
            setIsAuthenticated(true);
            return;
          }
        }
        // If biometric not available or failed, show password input
        setShowPasswordInput(true);
      }
    };

    authenticateBiometric();
  }, [user, isLoading]);

  const handleAuthenticate = () => {
    if (!user || !password.trim()) return;

    if (password.trim() === user.password) {
      // Redirect will happen in the render
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (user) {
    if (isAuthenticated || password.trim() === user.password) {
      return <Redirect href="/qr-code" />;
    }
    if (showPasswordInput) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <Text style={styles.title}>Enter your name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="words"
            autoCorrect={false}
            onSubmitEditing={handleAuthenticate}
          />
          <TouchableOpacity style={styles.button} onPress={handleAuthenticate}>
            <Text style={styles.buttonText}>Authenticate</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    // Show loading while biometric is being attempted
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.title}>Authenticating...</Text>
      </SafeAreaView>
    );
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
