import { type SQLiteDatabase } from 'expo-sqlite';
import {
  migrateDbIfNeeded,
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../src/database/db';
import { validateStudentInput } from '../src/types/student';
import { CARD_THEMES, THEME_KEYS, getStudentTheme } from '../src/theme/palettes';

describe('Student Record SQLite Database Layer', () => {
  let mockDb: jest.Mocked<
    Pick<SQLiteDatabase, 'execAsync' | 'getAllAsync' | 'runAsync'>
  >;

  beforeEach(() => {
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn().mockResolvedValue([]),
      runAsync: jest
        .fn()
        .mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    };
  });

  it('initializes the students table via migrateDbIfNeeded', async () => {
    await migrateDbIfNeeded(mockDb as unknown as SQLiteDatabase);
    expect(mockDb.execAsync).toHaveBeenCalledTimes(1);
    expect(mockDb.execAsync.mock.calls[0][0]).toContain(
      'CREATE TABLE IF NOT EXISTS students'
    );
  });

  it('inserts a student record using addStudent', async () => {
    const id = await addStudent(mockDb as unknown as SQLiteDatabase, {
      name: '  Maria Santos ',
      course: ' BS Computer Science ',
      age: 21,
    });

    expect(id).toBe(1);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      'INSERT INTO students (name, course, age) VALUES (?, ?, ?);',
      'Maria Santos',
      'BS Computer Science',
      21
    );
  });

  it('fetches all students ordered by newest first using getAllStudents', async () => {
    const sampleStudents = [
      { id: 2, name: 'Juan Dela Cruz', course: 'BSIT', age: 20 },
      { id: 1, name: 'Maria Santos', course: 'BSCS', age: 21 },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(sampleStudents);

    const result = await getAllStudents(mockDb as unknown as SQLiteDatabase);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      'SELECT id, name, course, age FROM students ORDER BY id DESC;'
    );
    expect(result).toEqual(sampleStudents);
  });

  it('updates an existing student record using updateStudent', async () => {
    await updateStudent(mockDb as unknown as SQLiteDatabase, 1, {
      name: 'Maria Clara Santos',
      course: 'BS Information Systems',
      age: 22,
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      'UPDATE students SET name = ?, course = ?, age = ? WHERE id = ?;',
      'Maria Clara Santos',
      'BS Information Systems',
      22,
      1
    );
  });

  it('removes a student record using deleteStudent', async () => {
    await deleteStudent(mockDb as unknown as SQLiteDatabase, 1);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      'DELETE FROM students WHERE id = ?;',
      1
    );
  });
});

describe('Student Form Validation & Multi-Theme Palettes', () => {
  it('rejects empty name, course, or age', () => {
    expect(validateStudentInput('', 'BSCS', '20').valid).toBe(false);
    expect(validateStudentInput('Juan', '', '20').valid).toBe(false);
    expect(validateStudentInput('Juan', 'BSCS', '').valid).toBe(false);
  });

  it('rejects non-integer or out-of-range ages', () => {
    expect(validateStudentInput('Juan', 'BSCS', 'abc').valid).toBe(false);
    expect(validateStudentInput('Juan', 'BSCS', '0').valid).toBe(false);
    expect(validateStudentInput('Juan', 'BSCS', '150').valid).toBe(false);
    expect(validateStudentInput('Juan', 'BSCS', '20.5').valid).toBe(false);
  });

  it('returns trimmed student data for valid inputs', () => {
    const result = validateStudentInput('  Juan Dela Cruz ', ' BSIT ', ' 20 ');
    expect(result).toEqual({
      valid: true,
      data: {
        name: 'Juan Dela Cruz',
        course: 'BSIT',
        age: 20,
      },
    });
  });

  it('provides four distinct color palettes (blue, amber, purple, emerald) and deterministic student themes', () => {
    expect(THEME_KEYS).toEqual(['blue', 'amber', 'purple', 'emerald']);
    const theme = getStudentTheme(1, 'BS Computer Science');
    expect(CARD_THEMES[theme.key]).toBeDefined();
    expect(theme.cardBg).not.toBe('#FFFFFF');
  });
});
