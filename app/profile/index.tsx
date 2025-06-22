import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, updateUserPhoto } = useAuth();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  // Format date to display user's account creation date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Handle changing profile photo
  const handleChangePhoto = async () => {
    if (!user) return;

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is needed to select photos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      setLoading(true);

      // Compress image to ensure it's not too large
      let processedImage = { uri: asset.uri, width: asset.width, height: asset.height };
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.size && fileInfo.size > 200 * 1024) {
        processedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 300 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
      }

      // Update user photo
      await updateUserPhoto(processedImage.uri);
      setLoading(false);
    } catch (error) {
      console.error('Error changing profile photo:', error);
      Alert.alert('Error', 'Failed to change profile photo.');
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <ThemedText type="subtitle">Not Logged In</ThemedText>
          <ThemedText style={styles.description}>
            You need to log in to view your profile.
          </ThemedText>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.replace('/auth')}
          >
            <ThemedText style={styles.loginButtonText}>
              Go to Login
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>←</ThemedText>
        </Pressable>
        <ThemedText type="title">Profile</ThemedText>
        <View style={styles.spacer} />
      </View>

      <BlurView
        intensity={20}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.profileContainer}
      >
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profilePhoto}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.profilePhoto,
                styles.photoPlaceholder,
                { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#E1E1E1' }
              ]}
            >
              <ThemedText style={styles.placeholderText}>
                {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </ThemedText>
            </View>
          )}
          <Pressable
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
            disabled={loading}
          >
            <ThemedText>Change Photo</ThemedText>
          </Pressable>
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Name:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {user.displayName || 'Not set'}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Email:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Account Created:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(user.createdAt)}
            </ThemedText>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </Pressable>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 24,
    padding: 8,
  },
  spacer: {
    width: 40,
  },
  profileContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  infoSection: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginVertical: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
