import * as SQLite from "expo-sqlite";
import { runMigration } from "./migration";
import { DB_NAME } from "@app/config/constants";

export function openDatabase() {
  const db = SQLite.openDatabaseSync(DB_NAME);
  runMigration(db);
  return db;
}

export type DB = ReturnType<typeof openDatabase>;
