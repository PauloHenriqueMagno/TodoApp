import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo } from "@domain/entities/Todo";
import type { FilterType } from "@app/types/filter";

export class ListTodos {
  constructor(private repo: TodoRepository) {}
  async exec(filters?: FilterType): Promise<Todo[]> {
    return this.repo.all(filters);
  }
}
