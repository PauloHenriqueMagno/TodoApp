import type { Todo } from "@domain/entities/Todo";
export const TodoMapper = {
  toRow(todo: Todo) {
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
  fromRow(row: any): Todo {
    return {
      id: String(row.id),
      title: String(row.title),
      description: row.description ?? null,
      imageUri: row.image_uri ?? null,
      completed: Number(row.completed) === 1,
      createdAt: Number(row.created_at),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      updatedAt: Number(row.updated_at),
    };
  },
};
