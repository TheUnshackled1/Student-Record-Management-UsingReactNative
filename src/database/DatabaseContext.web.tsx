import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { type SQLiteDatabase } from 'expo-sqlite';
import { Student } from '../types/student';

const STORAGE_KEY_PREFIX = 'expo_sqlite_web_';

function createWebSQLiteDatabase(databaseName: string): SQLiteDatabase {
  const storageKey = `${STORAGE_KEY_PREFIX}${databaseName}_students`;

  const readRows = (): Student[] => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          return JSON.parse(raw) as Student[];
        }
      }
    } catch {
      // Fallback to empty array if localStorage is unavailable
    }
    return [];
  };

  const writeRows = (rows: Student[]): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, JSON.stringify(rows));
      }
    } catch {
      // Ignore write errors in restricted web contexts
    }
  };

  const dbMock = {
    async execAsync(_source: string): Promise<void> {
      // Ensure table storage is initialized
      const current = readRows();
      writeRows(current);
    },

    async getAllAsync<T>(_source: string): Promise<T[]> {
      const rows = readRows();
      return [...rows].sort((a, b) => b.id - a.id) as unknown as T[];
    },

    async runAsync(
      source: string,
      ...params: unknown[]
    ): Promise<{ lastInsertRowId: number; changes: number }> {
      const sql = source.trim().toUpperCase();
      const rows = readRows();

      if (sql.startsWith('INSERT INTO STUDENTS')) {
        const name = String(params[0] ?? '');
        const course = String(params[1] ?? '');
        const age = Number(params[2] ?? 0);
        const nextId =
          rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
        const newStudent: Student = { id: nextId, name, course, age };
        writeRows([...rows, newStudent]);
        return { lastInsertRowId: nextId, changes: 1 };
      }

      if (sql.startsWith('UPDATE STUDENTS')) {
        const name = String(params[0] ?? '');
        const course = String(params[1] ?? '');
        const age = Number(params[2] ?? 0);
        const id = Number(params[3] ?? 0);
        let changes = 0;
        const updated = rows.map((row) => {
          if (row.id === id) {
            changes += 1;
            return { ...row, name, course, age };
          }
          return row;
        });
        writeRows(updated);
        return { lastInsertRowId: id, changes };
      }

      if (sql.startsWith('DELETE FROM STUDENTS')) {
        const id = Number(params[0] ?? 0);
        const filtered = rows.filter((row) => row.id !== id);
        const changes = rows.length - filtered.length;
        writeRows(filtered);
        return { lastInsertRowId: id, changes };
      }

      return { lastInsertRowId: 0, changes: 0 };
    },
  };

  return dbMock as unknown as SQLiteDatabase;
}

const WebSQLiteContext = createContext<SQLiteDatabase | null>(null);

interface WebSQLiteProviderProps {
  databaseName: string;
  onInit?: (db: SQLiteDatabase) => Promise<void>;
  children: React.ReactNode;
}

export const SQLiteProvider: React.FC<WebSQLiteProviderProps> = ({
  databaseName,
  onInit,
  children,
}) => {
  const db = useMemo(() => createWebSQLiteDatabase(databaseName), [databaseName]);
  const [ready, setReady] = useState(!onInit);

  useEffect(() => {
    let mounted = true;
    if (onInit) {
      onInit(db).finally(() => {
        if (mounted) {
          setReady(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [db, onInit]);

  if (!ready) {
    return null;
  }

  return (
    <WebSQLiteContext.Provider value={db}>{children}</WebSQLiteContext.Provider>
  );
};

export function useSQLiteContext(): SQLiteDatabase {
  const context = useContext(WebSQLiteContext);
  if (!context) {
    throw new Error('useSQLiteContext must be used within a SQLiteProvider');
  }
  return context;
}
