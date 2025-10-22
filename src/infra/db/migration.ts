import type { SQLiteDatabase } from "expo-sqlite";

export function runMigration(db: SQLiteDatabase) {
  db.execSync(`PRAGMA journal_mode = WAL`);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_uri TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      latitude REAL,
      longitude REAL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
}
