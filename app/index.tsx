import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/qr-code" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
