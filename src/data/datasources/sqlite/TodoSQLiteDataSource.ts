import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo, TodoId } from "@domain/entities/Todo";
import { TodoMapper } from "@data/mappers/TodoMapper";
import type { SQLiteDatabase } from "expo-sqlite";
import { FilterType } from "@app/types/filter";

export class TodoSQLiteDataSource implements TodoRepository {
  constructor(private db: SQLiteDatabase) {}

  async add(todo: Todo): Promise<Todo> {
    const row = TodoMapper.toRow(todo);

    await this.db.runAsync(
      `
        INSERT INTO todos (id, title, description, image_uri, completed, latitude, longitude, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        row.id,
        row.title,
        row.description,
        row.image_uri,
        row.completed,
        row.latitude,
        row.longitude,
        row.created_at,
        row.updated_at,
      ],
    );

    return todo;
  }
  async update(todo: Todo): Promise<Todo> {
    const row = TodoMapper.toRow(todo);

    await this.db.runAsync(
      `
        UPDATE todos
        SET title = ?, description = ?, image_uri = ?, completed = ?, latitude = ?, longitude = ?, updated_at = ?
        WHERE id = ?
      `,
      [
        row.title,
        row.description,
        row.image_uri,
        row.completed,
        row.latitude,
        row.longitude,
        row.updated_at,
        row.id,
      ],
    );

    return this.get(todo.id);
  }

  async delete(id: TodoId): Promise<void> {
    await this.db.runAsync(`DELETE FROM todos WHERE id = ?`, [id]);
  }

  async toggle(id: TodoId): Promise<Todo> {
    const current = await this.get(id);
    const toggled = { ...current, completed: !current.completed, updatedAt: Date.now() };

    await this.update(toggled);

    return toggled;
  }

  async all(filters: FilterType): Promise<Todo[]> {
    try {
      const {
        query = "",
        status = "all",
        sortBy = "created_at",
        sortOrder = "desc",
        hasImage = false,
        hasLocation = false,
      } = filters || {};

      const where: string[] = [];
      const params: string[] = [];

      // search query
      if (query.trim().length) {
        where.push("(title LIKE ? OR COALESCE(description,'') LIKE ?)");
        const q = `%${query.trim()}%`;
        params.push(q, q);
      }

      // status
      if (status === "completed") {
        where.push("completed = 1");
      }
      if (status === "pending") {
        where.push("completed = 0");
      }

      // only with image
      if (hasImage) {
        where.push("(image_uri IS NOT NULL AND TRIM(image_uri) <> '')");
      }

      // only with location
      if (hasLocation) {
        where.push("(latitude IS NOT NULL AND longitude IS NOT NULL)");
      }

      // base query
      let sql = "SELECT * FROM todos";

      if (where.length) {
        sql += " WHERE " + where.join(" AND ");
      }

      // ORDER BY
      const orderCol = sortBy === "title" ? "title" : "created_at";
      const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
      sql += ` ORDER BY ${orderCol} ${orderDir}`;

      // execute
      const rows = this.db.getAllSync(sql, params);
      return rows.map(TodoMapper.fromRow);
    } catch (error) {
      console.error("Error in all():", error);
      throw error;
    }
  }

  async get(id: TodoId): Promise<Todo> {
    const row = this.db.getFirstSync(`SELECT * FROM todos WHERE id = ?`, [id]);

    if (!row) throw new Error("Todo not found");

    return TodoMapper.fromRow(row);
  }
}
