import { type SQLiteDatabase } from 'expo-sqlite';
import { Student, StudentInput } from '../types/student';

export const INITIAL_STUDENTS: StudentInput[] = [
  { name: 'Juan Dela Cruz', course: 'BS Computer Science', age: 20 },
  { name: 'Maria Clara Santos', course: 'BS Information Technology', age: 21 },
  { name: 'Gabriel Mendoza', course: 'BS Information Systems', age: 19 },
  { name: 'Angela Mae Reyes', course: 'BS Computer Engineering', age: 22 },
  { name: 'Joshua Villanueva', course: 'BS Data Science', age: 20 },
];

export async function getAllStudents(db: SQLiteDatabase): Promise<Student[]> {
  return await db.getAllAsync<Student>(
    'SELECT id, name, course, age FROM students ORDER BY id DESC;'
  );
}

export async function addStudent(
  db: SQLiteDatabase,
  input: StudentInput
): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO students (name, course, age) VALUES (?, ?, ?);',
    input.name.trim(),
    input.course.trim(),
    input.age
  );
  return result.lastInsertRowId;
}

export async function updateStudent(
  db: SQLiteDatabase,
  id: number,
  input: StudentInput
): Promise<void> {
  await db.runAsync(
    'UPDATE students SET name = ?, course = ?, age = ? WHERE id = ?;',
    input.name.trim(),
    input.course.trim(),
    input.age,
    id
  );
}

export async function deleteStudent(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM students WHERE id = ?;', id);
}

export async function seedSampleStudents(db: SQLiteDatabase): Promise<void> {
  for (const student of INITIAL_STUDENTS) {
    await addStudent(db, student);
  }
}

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      age INTEGER NOT NULL
    );
  `);

  const existing = await getAllStudents(db);
  if (existing.length === 0) {
    await seedSampleStudents(db);
  }
}
