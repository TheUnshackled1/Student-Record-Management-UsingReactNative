import { type SQLiteDatabase } from 'expo-sqlite';
import { Student, StudentInput } from '../types/student';

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
}

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
