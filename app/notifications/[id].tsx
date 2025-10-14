import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user, markNotificationAsRead } = useAuth();
  const router = useRouter();

  const notification = user?.notifications.find(n => n.id === id);

  useEffect(() => {
    if (notification && !notification.read) {
      markNotificationAsRead(notification.id);
    }
  }, [notification]);

  if (!notification) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Notification not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.timestamp}>
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.message}>{notification.message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});