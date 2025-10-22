import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { TodoId } from "@domain/entities/Todo";

export class ToggleTodo {
  constructor(private repo: TodoRepository) {}
  async exec(id: TodoId) {
    return this.repo.toggle(id);
  }
}
