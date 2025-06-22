import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Focus the input and animate the width when component mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    Animated.spring(animatedWidth, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    return () => {
      // Reset search text when unmounting
      onSearch('');
    };
  }, []);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleClose = () => {
    // Animate out before calling onClose
    Animated.timing(animatedWidth, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: animatedWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    >
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }
        ]}
      >
        <ThemedText style={styles.searchIcon}>🔍</ThemedText>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
          ]}
          placeholder="Search by title..."
          placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
          value={searchText}
          onChangeText={handleTextChange}
          returnKeyType="search"
          autoCapitalize="none"
          clearButtonMode="always"
        />
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    height: 40,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
  closeButtonText: {
    fontSize: 16,
  },
});
