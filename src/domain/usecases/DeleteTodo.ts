import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { TodoId } from "@domain/entities/Todo";
import * as FileStorage from "@app/infra/FileStorage";

export class DeleteTodo {
  constructor(private repo: TodoRepository) {}
  async exec(id: TodoId) {
    const todo = await this.repo.get(id);

    if (todo.imageUri) FileStorage.deleteFile(todo.imageUri);

    return this.repo.delete(id);
  }
}
