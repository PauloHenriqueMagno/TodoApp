import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo } from "@domain/entities/Todo";

export class UpdateTodo {
  constructor(private repo: TodoRepository) {}
  async exec(todo: Todo): Promise<Todo> {
    return this.repo.update({ ...todo, updatedAt: Date.now() });
  }
}
