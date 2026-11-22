import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Student } from '../types/student';
import { CARD_THEMES } from '../theme/palettes';
import { TrashBinIcon } from './BoldIcons';

interface DeleteConfirmModalProps {
  visible: boolean;
  student: Student | null;
  onCancel: () => void;
  onConfirm: (student: Student) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  student,
  onCancel,
  onConfirm,
}) => {
  if (!student) {
    return null;
  }

  const amberTheme = CARD_THEMES.amber;

  const webIconBlockStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
          boxShadow:
            '0 8px 18px -3px rgba(220, 38, 38, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        } as unknown as object)
      : {};

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialogCard,
            {
              backgroundColor: amberTheme.cardBg,
              borderColor: amberTheme.borderHover,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.iconBlock, webIconBlockStyle]}>
              <TrashBinIcon size={22} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, { color: amberTheme.valueText }]}>
                Delete Student Record
              </Text>
              <Text style={[styles.subtitle, { color: amberTheme.labelText }]}>
                Permanent SQLite Database Action
              </Text>
            </View>
          </View>

          <Text style={[styles.message, { color: amberTheme.titleText }]}>
            Are you sure you want to remove{' '}
            <Text style={styles.boldName}>"{student.name}"</Text> (
            {student.course}) from the database?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Keep Record</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, webIconBlockStyle]}
              onPress={() => onConfirm(student)}
            >
              <Text style={styles.deleteButtonText}>Confirm Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconBlock: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#F87171',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 22,
  },
  boldName: {
    fontWeight: '800',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE68A',
  },
  cancelButtonText: {
    color: '#78350F',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    borderColor: '#F87171',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
