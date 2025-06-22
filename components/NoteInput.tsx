import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { ThemedText } from '@/components/ThemedText';
import { Attachment } from '@/types';
import { useColorScheme } from '@/hooks/useColorScheme';

interface NoteInputProps {
  isExpanded: boolean;
  onClose: () => void;
}

export const NoteInput: React.FC<NoteInputProps> = ({ isExpanded, onClose }) => {
  const { addNote, checkAttachmentLimits } = useNotes();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const colorScheme = useColorScheme();

  // Reset form state
  const resetForm = () => {
    setTitle('');
    setContent('');
    setAttachments([]);
    onClose();
  };

  // Handle adding a note
  const handleAddNote = async () => {
    if (!title.trim() && !content.trim() && attachments.length === 0) {
      Alert.alert('Empty Note', 'Please add some content to your note.');
      return;
    }

    await addNote(title.trim(), content.trim(), attachments);
    resetForm();
  };

  // Handle attachment selection
  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets) return;

      // Process selected documents
      const selectedFiles = await Promise.all(
        result.assets.map(async (asset) => {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);

          return {
            uri: asset.uri,
            type: asset.mimeType || 'unknown',
            name: asset.name || 'file',
            size: fileInfo.size || 0,
          };
        })
      );

      // Check attachment limits
      const { withinSizeLimit, withinCountLimit } = checkAttachmentLimits(
        attachments,
        selectedFiles
      );

      if (!withinCountLimit) {
        Alert.alert(
          'Attachment Limit Reached',
          'You can only add up to 2 attachments per note.'
        );
        return;
      }

      if (!withinSizeLimit) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Each attachment must be under 150KB.'
        );
        return;
      }

      setAttachments([...attachments, ...selectedFiles]);
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select file.');
    }
  };

  // Handle taking photos
  const handleTakePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];

      // Check if adding one more attachment exceeds the limit
      if (attachments.length >= 2) {
        Alert.alert(
          'Attachment Limit Reached',
          'You can only add up to 2 attachments per note.'
        );
        return;
      }

      // Compress image if needed
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      let processedImage = { uri: asset.uri, width: asset.width, height: asset.height };

      // If image is larger than 150KB, compress it
      if (fileInfo.size && fileInfo.size > 150 * 1024) {
        processedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const compressedInfo = await FileSystem.getInfoAsync(processedImage.uri);

        // If still too large, compress more aggressively
        if (compressedInfo.size && compressedInfo.size > 150 * 1024) {
          processedImage = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 600 } }],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
          );
        }
      }

      // Get file name from URI
      const fileName = asset.uri.split('/').pop() || 'photo.jpg';

      // Add to attachments
      setAttachments([
        ...attachments,
        {
          uri: processedImage.uri,
          type: 'image/jpeg',
          name: fileName,
          size: (await FileSystem.getInfoAsync(processedImage.uri)).size || 0,
        },
      ]);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  if (!isExpanded) {
    return (
      <Pressable
        style={[
          styles.collapsedInput,
          { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }
        ]}
        onPress={() => onClose()}
      >
        <ThemedText style={styles.collapsedText}>
          Tap to create a note...
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 50 : 100}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colorScheme === 'dark' ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)' }
          ]}
        >
          {/* Title Input */}
          <TextInput
            style={[
              styles.titleInput,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
            ]}
            placeholder="Title"
            placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
            value={title}
            onChangeText={setTitle}
          />

          {/* Content Input */}
          <TextInput
            style={[
              styles.contentInput,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
            ]}
            placeholder="Write your note here..."
            placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
            multiline
            value={content}
            onChangeText={setContent}
          />

          {/* Attachments */}
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <ThemedText numberOfLines={1} style={styles.attachmentName}>
                    {attachment.name}
                  </ThemedText>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeAttachment(index)}
                  >
                    <ThemedText>✕</ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <View style={styles.attachmentButtons}>
              <Pressable
                style={styles.actionButton}
                onPress={handleAttachment}
                disabled={attachments.length >= 2}
              >
                <ThemedText>📎</ThemedText>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={handleTakePhoto}
                disabled={attachments.length >= 2}
              >
                <ThemedText>📷</ThemedText>
              </Pressable>
            </View>

            <View style={styles.noteButtons}>
              <Pressable style={styles.cancelButton} onPress={resetForm}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.addButton,
                  (!title.trim() && !content.trim() && attachments.length === 0)
                    ? styles.disabledButton
                    : null
                ]}
                onPress={handleAddNote}
                disabled={!title.trim() && !content.trim() && attachments.length === 0}
              >
                <ThemedText style={styles.addButtonText}>
                  Add Note
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blurContainer: {
    borderRadius: 8,
  },
  inputContainer: {
    padding: 16,
    borderRadius: 8,
  },
  collapsedInput: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  collapsedText: {
    color: '#888888',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 16,
    paddingVertical: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  attachmentButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  noteButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#000000',
  },
});
