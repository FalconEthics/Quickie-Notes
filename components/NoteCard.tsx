import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ThemedText';
import { useNotes } from '@/context/NotesContext';
import { Note, Attachment } from '@/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface NoteCardProps {
  note: Note;
  onAnimationComplete?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onAnimationComplete }) => {
  const { deleteNote, updateNote } = useNotes();
  const colorScheme = useColorScheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const [editedContent, setEditedContent] = useState(note.content);
  const [editedAttachments, setEditedAttachments] = useState<Attachment[]>([...note.attachments]);
  const [scaleAnim] = useState(new Animated.Value(0));

  // Animation effect when the component mounts
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      if (onAnimationComplete) onAnimationComplete();
    });
  }, []);

  // Format date string
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ~ ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    // Play haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start delete animation
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      await deleteNote(note.id);
      setDeleteModalVisible(false);
    });
  };

  // Handle edit save
  const handleEditSave = async () => {
    await updateNote(note.id, note.title, editedContent, editedAttachments);
    setEditModalVisible(false);
    // Reset state
    setEditedContent(note.content);
    setEditedAttachments([...note.attachments]);
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setEditModalVisible(false);
    setDiscardModalVisible(false);
    // Reset state
    setEditedContent(note.content);
    setEditedAttachments([...note.attachments]);
  };

  // Check if changes were made
  const hasChanges = () => {
    return editedContent !== note.content ||
           JSON.stringify(editedAttachments) !== JSON.stringify(note.attachments);
  };

  // Handle attachment removal
  const removeAttachment = (index: number) => {
    const newAttachments = [...editedAttachments];
    newAttachments.splice(index, 1);
    setEditedAttachments(newAttachments);
  };

  // Share note
  const shareNote = async () => {
    try {
      // Create a temporary file with note content
      const fileUri = `${FileSystem.cacheDirectory}/${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`;

      const content = `${note.title}\n\n${note.content}\n\nCreated: ${formatDate(note.createdAt)}`;

      await FileSystem.writeAsStringAsync(fileUri, content);

      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Note Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFD700' }
        ]}
      >
        {/* Date */}
        <View style={styles.dateContainer}>
          <ThemedText style={styles.dateText}>
            {formatDate(note.createdAt)}
          </ThemedText>
        </View>

        {/* Title */}
        <ThemedText type="subtitle" numberOfLines={2} style={styles.title}>
          {note.title}
        </ThemedText>

        {/* Content */}
        <ThemedText numberOfLines={5} style={styles.content}>
          {note.content}
        </ThemedText>

        {/* Attachments */}
        {note.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {note.attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentBadge}>
                {attachment.type.startsWith('image/') ? (
                  <ThemedText>🖼️</ThemedText>
                ) : (
                  <ThemedText>📄</ThemedText>
                )}
                <ThemedText numberOfLines={1} style={styles.attachmentName}>
                  {attachment.name}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setEditModalVisible(true);
            }}
          >
            <ThemedText>✏️</ThemedText>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              shareNote();
            }}
          >
            <ThemedText>📤</ThemedText>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setDeleteModalVisible(true);
            }}
          >
            <ThemedText>🗑️</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <BlurView intensity={50} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }
            ]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Delete Note
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Are you sure you want to delete this note? This action cannot be undone.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (hasChanges()) {
            setDiscardModalVisible(true);
          } else {
            setEditModalVisible(false);
          }
        }}
      >
        <BlurView intensity={50} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.modalContainer}>
          <View
            style={[
              styles.editModalContent,
              { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }
            ]}
          >
            <View style={styles.editModalHeader}>
              <ThemedText type="subtitle">{note.title}</ThemedText>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  if (hasChanges()) {
                    setDiscardModalVisible(true);
                  } else {
                    setEditModalVisible(false);
                  }
                }}
              >
                <ThemedText type="defaultBold">✕</ThemedText>
              </Pressable>
            </View>

            <View style={styles.editContentContainer}>
              <ThemedText style={styles.editLabel}>Content:</ThemedText>
              <View
                style={[
                  styles.textInputContainer,
                  { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' }
                ]}
              >
                <ThemedText
                  style={styles.textInput}
                  editable
                  multiline
                  value={editedContent}
                  onChangeText={setEditedContent}
                />
              </View>

              {/* Attachments */}
              {editedAttachments.length > 0 && (
                <View style={styles.editAttachmentsContainer}>
                  <ThemedText style={styles.editLabel}>Attachments:</ThemedText>
                  {editedAttachments.map((attachment, index) => (
                    <View key={index} style={styles.editAttachmentItem}>
                      {attachment.type.startsWith('image/') ? (
                        <Image
                          source={{ uri: attachment.uri }}
                          style={styles.attachmentThumbnail}
                        />
                      ) : (
                        <View style={styles.fileThumbnail}>
                          <ThemedText>📄</ThemedText>
                        </View>
                      )}
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
            </View>

            <View style={styles.editModalButtons}>
              <Pressable
                style={[styles.editModalButton, styles.saveButton]}
                onPress={handleEditSave}
              >
                <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Discard Changes Confirmation Modal */}
      <Modal
        visible={discardModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDiscardModalVisible(false)}
      >
        <BlurView intensity={50} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }
            ]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Discard Changes
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Are you sure you want to discard your changes? This action cannot be undone.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDiscardModalVisible(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDiscardChanges}
              >
                <ThemedText style={styles.deleteButtonText}>Discard</ThemedText>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    margin: '1%',
    minHeight: 150,
    maxHeight: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 10,
    opacity: 0.7,
  },
  title: {
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    flex: 1,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  attachmentName: {
    fontSize: 10,
    marginLeft: 2,
    maxWidth: 60,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  editModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  editContentContainer: {
    flex: 1,
    width: '100%',
  },
  editLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textInputContainer: {
    borderRadius: 8,
    padding: 10,
    minHeight: 120,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 100,
  },
  editAttachmentsContainer: {
    marginBottom: 16,
  },
  editAttachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  fileThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  removeButton: {
    padding: 6,
    marginLeft: 'auto',
  },
  editModalButtons: {
    marginTop: 16,
    width: '100%',
  },
  editModalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#FFD700',
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#000000',
  },
});
