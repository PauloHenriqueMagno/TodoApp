import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo } from "@domain/entities/Todo";
import Toast from "react-native-toast-message";
import { TOAST_TIMEOUT } from "@app/config/constants";

export class UpdateTodo {
  constructor(private repo: TodoRepository) {}
  async exec(todo: Todo): Promise<Todo> {
    const updatedTodo = await this.repo.update({ ...todo, updatedAt: Date.now() });

    Toast.show({
      type: "success",
      text1: "Tarefa atualizada com sucesso!",
      text2: `${updatedTodo.title} foi atualizado(a) na sua lista de tarefas.`,
      position: "bottom",
      visibilityTime: TOAST_TIMEOUT,
      swipeable: true,
    });

    return updatedTodo;
  }
}
