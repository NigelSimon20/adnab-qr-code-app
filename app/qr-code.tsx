import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRCodeScreen() {
  const { user, logout, regenerateQR, unreadNotificationsCount } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>ADNAB{'\n'}LOGO</Text>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications" size={24} color="#000" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{user.name}'s QR Code</Text>

        <TouchableOpacity style={styles.qrContainer} onPress={() => router.push('/qr-modal')}>
          <QRCode value={user.qrData} size={240} />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={regenerateQR}>
            <Text style={styles.buttonText}>Request new</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Ionicons name="log-out" size={18} color="#000" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  logoBox: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#000',
    textAlign: 'center',
    lineHeight: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff3b30',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 48,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    paddingBottom: 24,
  },
  button: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#000',
  },
});
