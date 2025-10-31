import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { TodoId } from "@domain/entities/Todo";
import * as FileStorage from "@app/infra/FileStorage";
import Toast from "react-native-toast-message";
import { TOAST_TIMEOUT } from "@app/config/constants";

export class DeleteTodo {
  constructor(private repo: TodoRepository) {}
  async exec(id: TodoId) {
    const todo = await this.repo.get(id);

    if (todo.imageUri) FileStorage.deleteFile(todo.imageUri);

    await this.repo.delete(id);

    Toast.show({
      type: "success",
      text1: "Tarefa removida com sucesso!",
      text2: `${todo.title} foi removido(a) da sua lista de tarefas.`,
      position: "bottom",
      visibilityTime: TOAST_TIMEOUT,
      swipeable: true,
    });

    return;
  }
}
