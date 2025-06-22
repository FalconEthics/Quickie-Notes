import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, RefreshControl, Platform, KeyboardAvoidingView } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NoteInput } from '@/components/NoteInput';
import { NoteCard } from '@/components/NoteCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { state, setSearchQuery } = useNotes();
  const [refreshing, setRefreshing] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle search query with debounce
  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  // Pull to refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // In a real app, this would fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' }
      ]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
            <ThemedText type="title">Quickie-Notes</ThemedText>
          </View>

          <View style={styles.headerButtons}>
            {isSearchVisible ? (
              <SearchBar
                onSearch={handleSearch}
                onClose={() => setIsSearchVisible(false)}
              />
            ) : (
              <>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => setIsSearchVisible(true)}
                >
                  <ThemedText type="defaultBold">🔍</ThemedText>
                </Pressable>

                {isAuthenticated ? (
                  <>
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => router.push('/profile')}
                    >
                      {user?.photoURL ? (
                        <Image
                          source={{ uri: user.photoURL }}
                          style={styles.profilePhoto}
                        />
                      ) : (
                        <ThemedText type="defaultBold">👤</ThemedText>
                      )}
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={styles.loginButton}
                    onPress={() => router.push('/auth')}
                  >
                    <ThemedText type="defaultBold">Login/Sign Up</ThemedText>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>

        {/* Note Input */}
        <Pressable onPress={() => setIsInputExpanded(true)}>
          <NoteInput
            isExpanded={isInputExpanded}
            onClose={() => setIsInputExpanded(false)}
          />
        </Pressable>

        {/* Notes List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.notesGrid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {state.filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onAnimationComplete={() => {}}
            />
          ))}
          {state.filteredNotes.length === 0 && !state.isLoading && (
            <ThemedView style={styles.emptyState}>
              <ThemedText>No notes found.</ThemedText>
              {state.searchQuery ? (
                <ThemedText>Try a different search term.</ThemedText>
              ) : (
                <ThemedText>Tap the input above to create a new note.</ThemedText>
              )}
            </ThemedView>
          )}
        </ScrollView>

        {/* Footer */}
        <Pressable
          style={styles.footer}
          onPress={() => {
            Platform.OS === 'web'
              ? window.open('https://mrsoumikdas.com/', '_blank')
              : router.push({ pathname: 'https://mrsoumikdas.com/' });
          }}
        >
          <ThemedText style={styles.footerText}>
            Copyright © 2025 ~ Soumik Das
          </ThemedText>
        </Pressable>

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  profilePhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  notesGrid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32,
  },
  footer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});
