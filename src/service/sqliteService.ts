import * as SQLite from 'expo-sqlite';
import { Task, MoodEntry } from '../types';
class SQLiteService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('taskjournal.db');
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        timeSpent INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY,
        date TEXT UNIQUE NOT NULL,
        mood INTEGER NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
    `);
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM tasks ORDER BY createdAt DESC'
      );
      return result.map((row) => ({
        ...row,
        completed: Boolean(row.completed),
      })) as Task[];
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  }

  async createTask(task: Omit<Task, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const taskWithId = { ...task, id };

    await this.db.runAsync(
      'INSERT INTO tasks (id, title, category, timeSpent, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        task.title,
        task.category,
        task.timeSpent,
        task.completed ? 1 : 0,
        task.createdAt,
        task.updatedAt,
      ]
    );

    return id;
  }

  async updateTask(task: Task): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE tasks SET title = ?, category = ?, timeSpent = ?, completed = ?, updatedAt = ? WHERE id = ?',
      [
        task.title,
        task.category,
        task.timeSpent,
        task.completed ? 1 : 0,
        task.updatedAt,
        task.id,
      ]
    );
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  // Mood operations
  async getMoodEntries(): Promise<MoodEntry[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM mood_entries ORDER BY date DESC'
      );
      return result as MoodEntry[];
    } catch (error) {
      console.error('Failed to get mood entries:', error);
      return [];
    }
  }

  async createMoodEntry(entry: Omit<MoodEntry, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();

    await this.db.runAsync(
      'INSERT OR REPLACE INTO mood_entries (id, date, mood, notes, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, entry.date, entry.mood, entry.notes || '', entry.createdAt]
    );

    return id;
  }

  async getMoodEntryByDate(date: string): Promise<MoodEntry | null> {
    if (!this.db) return null;

    try {
      const result = await this.db.getFirstAsync(
        'SELECT * FROM mood_entries WHERE date = ?',
        [date]
      );
      return result as MoodEntry | null;
    } catch (error) {
      console.error('Failed to get mood entry by date:', error);
      return null;
    }
  }
}

export const sqliteService = new SQLiteService();
