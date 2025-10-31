import type { Todo, TodoDBRow } from "@domain/entities/Todo";
export const TodoMapper = {
  toRow(todo: Todo): TodoDBRow {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? null,
      image_uri: todo.imageUri ?? null,
      completed: todo.completed ? 1 : 0,
      latitude: todo.latitude ?? null,
      longitude: todo.longitude ?? null,
      created_at: todo.createdAt,
      updated_at: todo.updatedAt,
    } as const;
  },
  fromRow(row: TodoDBRow): Todo {
    return {
      id: String(row.id),
      title: String(row.title),
      description: row.description ?? undefined,
      imageUri: row.image_uri ?? undefined,
      completed: Number(row.completed) === 1,
      createdAt: Number(row.created_at),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      updatedAt: Number(row.updated_at),
    };
  },
};
