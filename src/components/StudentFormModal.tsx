import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Student,
  StudentInput,
  validateStudentInput,
} from '../types/student';
import { CARD_THEMES } from '../theme/palettes';
import { LayersIcon, ShieldCheckIcon } from './BoldIcons';

interface StudentFormModalProps {
  visible: boolean;
  initialStudent: Student | null;
  onClose: () => void;
  onSubmit: (input: StudentInput) => Promise<void>;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  visible,
  initialStudent,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = initialStudent !== null;
  const activeTheme = isEditing ? CARD_THEMES.emerald : CARD_THEMES.blue;

  useEffect(() => {
    if (visible) {
      if (initialStudent) {
        setName(initialStudent.name);
        setCourse(initialStudent.course);
        setAge(String(initialStudent.age));
      } else {
        setName('');
        setCourse('');
        setAge('');
      }
      setErrorMessage(null);
      setSubmitting(false);
    }
  }, [visible, initialStudent]);

  const handleSave = async () => {
    const validation = validateStudentInput(name, course, age);
    if (!validation.valid || !validation.data) {
      setErrorMessage(validation.error ?? 'Invalid input.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      await onSubmit(validation.data);
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to save student record.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const webIconBlockStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${activeTheme.iconBgStart} 0%, ${activeTheme.iconBgEnd} 100%)`,
          boxShadow: `0 8px 18px -3px ${activeTheme.iconShadow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
        } as unknown as object)
      : {};

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.borderHover,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconBlock,
                {
                  backgroundColor: activeTheme.iconBgStart,
                  borderColor: activeTheme.iconBorder,
                },
                webIconBlockStyle,
              ]}
            >
              {isEditing ? (
                <ShieldCheckIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <LayersIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
              )}
            </View>
            <View style={styles.headerTextCol}>
              <Text
                style={[styles.modalTitle, { color: activeTheme.valueText }]}
              >
                {isEditing ? 'Update Student Record' : 'Add New Student'}
              </Text>
              <Text
                style={[styles.modalSubtitle, { color: activeTheme.labelText }]}
              >
                {isEditing
                  ? 'Modify the student details below and save to SQLite.'
                  : "Enter the student's name, course, and age."}
              </Text>
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: activeTheme.titleText }]}>
              STUDENT FULL NAME
            </Text>
            <TextInput
              style={[styles.input, { borderColor: activeTheme.border }]}
              placeholder="e.g. Juan Dela Cruz"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: activeTheme.titleText }]}>
              COURSE / PROGRAM
            </Text>
            <TextInput
              style={[styles.input, { borderColor: activeTheme.border }]}
              placeholder="e.g. BS Computer Science"
              placeholderTextColor="#94A3B8"
              value={course}
              onChangeText={setCourse}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: activeTheme.titleText }]}>
              AGE
            </Text>
            <TextInput
              style={[styles.input, { borderColor: activeTheme.border }]}
              placeholder="e.g. 20"
              placeholderTextColor="#94A3B8"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: activeTheme.iconBgStart,
                  borderColor: activeTheme.iconBorder,
                },
                webIconBlockStyle,
              ]}
              onPress={handleSave}
              disabled={submitting}
            >
              <Text style={styles.saveButtonText}>
                {submitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Record'
                  : 'Save Student'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  modalCard: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  iconBlock: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
