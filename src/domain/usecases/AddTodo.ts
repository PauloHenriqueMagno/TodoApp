import type { TodoRepository } from "@domain/repositories/TodoRepository";
import type { Todo } from "@domain/entities/Todo";
import Toast from "react-native-toast-message";
import { TOAST_TIMEOUT } from "@app/config/constants";

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
    const newTodo = await this.repo.add(todo);

    Toast.show({
      type: "success",
      text1: "Tarefa adicionada com sucesso!",
      text2: `${newTodo.title} foi adicionado(a) à sua lista de tarefas.`,
      position: "bottom",
      visibilityTime: TOAST_TIMEOUT,
      swipeable: true,
    });

    return newTodo;
  }
}
