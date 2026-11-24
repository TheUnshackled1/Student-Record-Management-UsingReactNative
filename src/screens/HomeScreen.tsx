import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSQLiteContext } from '../database/DatabaseContext';
import { Student, StudentInput } from '../types/student';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  seedSampleStudents,
} from '../database/db';
import { CARD_THEMES } from '../theme/palettes';
import { KpiSummaryRow } from '../components/KpiSummaryRow';
import { StudentCard } from '../components/StudentCard';
import { StudentFormModal } from '../components/StudentFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { LayersIcon, PlusBoldIcon } from '../components/BoldIcons';

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

  const handleLoadSampleData = async () => {
    try {
      setLoading(true);
      await seedSampleStudents(db);
      await loadStudents();
    } catch (error) {
      Alert.alert(
        'Seed Error',
        error instanceof Error
          ? error.message
          : 'Could not seed sample student records.'
      );
    } finally {
      setLoading(false);
    }
  };

  const blueTheme = CARD_THEMES.blue;
  const purpleTheme = CARD_THEMES.purple;

  const webBrandIconStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${blueTheme.iconBgStart} 0%, ${purpleTheme.iconBgEnd} 100%)`,
          boxShadow: `0 8px 18px -3px ${blueTheme.iconShadow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
        } as unknown as object)
      : {};

  const webAddBtnStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${CARD_THEMES.emerald.iconBgStart} 0%, ${CARD_THEMES.emerald.iconBgEnd} 100%)`,
          boxShadow: `0 8px 18px -3px ${CARD_THEMES.emerald.iconShadow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
        } as unknown as object)
      : {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.brandRow}>
            <View style={[styles.brandIconBlock, webBrandIconStyle]}>
              <LayersIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Student Record Hub</Text>
              <View style={styles.subtitleBadgeRow}>
                <View style={styles.themeDotBlue} />
                <View style={styles.themeDotAmber} />
                <View style={styles.themeDotPurple} />
                <View style={styles.themeDotEmerald} />
                <Text style={styles.headerSubtitle}>
                  SQLite Multi-Theme Dashboard
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addButton, webAddBtnStyle]}
            onPress={handleOpenAddModal}
            activeOpacity={0.85}
          >
            <PlusBoldIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.emptySubtitle}>Loading student records...</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          onRefresh={loadStudents}
          refreshing={loading}
          ListHeaderComponent={
            <View>
              <KpiSummaryRow students={students} />
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Registered Student Directory
                </Text>
                <View style={styles.sectionCountBadge}>
                  <Text style={styles.sectionCountText}>
                    {students.length}{' '}
                    {students.length === 1 ? 'Record' : 'Records'}
                  </Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onEdit={handleOpenEditModal}
              onDelete={handlePromptDelete}
            />
          )}
          ListEmptyComponent={
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: purpleTheme.cardBg,
                  borderColor: purpleTheme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIconBlock,
                  {
                    backgroundColor: purpleTheme.iconBgStart,
                    borderColor: purpleTheme.iconBorder,
                  },
                ]}
              >
                <LayersIcon size={26} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text
                style={[styles.emptyTitle, { color: purpleTheme.valueText }]}
              >
                No Student Records Registered Yet
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: purpleTheme.labelText }]}
              >
                Click "Add Student" in the top right corner or load the default
                sample student dataset below.
              </Text>
              <TouchableOpacity
                style={[
                  styles.seedButton,
                  {
                    backgroundColor: purpleTheme.iconBgStart,
                    borderColor: purpleTheme.iconBorder,
                  },
                ]}
                onPress={handleLoadSampleData}
                activeOpacity={0.85}
              >
                <Text style={styles.seedButtonText}>Load Sample Data</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerInner: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandIconBlock: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  themeDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  themeDotAmber: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  themeDotPurple: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A855F7',
  },
  themeDotEmerald: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderColor: '#34D399',
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 13,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  listContent: {
    padding: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCountBadge: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  emptyIconBlock: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 440,
  },
  seedButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  seedButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
