import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from '../database/DatabaseContext';
import { Student, StudentInput } from '../types/student';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../database/db';
import { StudentCard } from '../components/StudentCard';
import { StudentFormModal } from '../components/StudentFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const HomeScreen: React.FC = () => {
  const db = useSQLiteContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getAllStudents(db);
      setStudents(rows);
    } catch (error) {
      Alert.alert(
        'Database Error',
        error instanceof Error
          ? error.message
          : 'Failed to load student records.'
      );
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleOpenAddModal = () => {
    setSelectedStudent(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const handleSubmitForm = async (input: StudentInput) => {
    if (selectedStudent) {
      await updateStudent(db, selectedStudent.id, input);
    } else {
      await addStudent(db, input);
    }
    await loadStudents();
  };

  const handlePromptDelete = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = async (student: Student) => {
    try {
      setStudentToDelete(null);
      await deleteStudent(db, student.id);
      await loadStudents();
    } catch (error) {
      Alert.alert(
        'Delete Failed',
        error instanceof Error
          ? error.message
          : 'Could not delete student record.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Student Records</Text>
          <Text style={styles.headerSubtitle}>
            SQLite Local Database • {students.length}{' '}
            {students.length === 1 ? 'Student' : 'Students'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.emptySubtitle}>Loading student records...</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            students.length === 0 ? styles.emptyListContent : styles.listContent
          }
          onRefresh={loadStudents}
          refreshing={loading}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onEdit={handleOpenEditModal}
              onDelete={handlePromptDelete}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>No Students Registered Yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap "+ Add Student" above to add your first student record to
                the SQLite database.
              </Text>
            </View>
          }
        />
      )}

      <StudentFormModal
        visible={modalVisible}
        initialStudent={selectedStudent}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitForm}
      />

      <DeleteConfirmModal
        visible={studentToDelete !== null}
        student={studentToDelete}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
