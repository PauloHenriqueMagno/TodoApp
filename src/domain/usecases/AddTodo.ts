import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo } from "@domain/entities/Todo";

export class AddTodo {
  constructor(private repo: TodoRepository) {}
  async exec(
    input: Pick<
      Todo,
      | "id"
      | "title"
      | "description"
      | "imageUri"
      | "completed"
      | "latitude"
      | "longitude"
      | "createdAt"
    >,
  ): Promise<Todo> {
    const todo: Todo = { ...input, updatedAt: input.createdAt };
    return this.repo.add(todo);
  }
}
