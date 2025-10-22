import type { FilterType } from "@app/types/filter";
import type { Todo, TodoId } from "@domain/entities/Todo";

export interface TodoRepository {
  add(input: Omit<Todo, "updatedAt">): Promise<Todo>;
  update(todo: Todo): Promise<Todo>;
  delete(id: TodoId): Promise<void>;
  toggle(id: TodoId): Promise<Todo>;
  get(id: TodoId): Promise<Todo>;
  all(filters?: FilterType): Promise<Todo[]>;
}
