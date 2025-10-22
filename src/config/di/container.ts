import { TodoSQLiteDataSource } from "@data/datasources/sqlite/TodoSQLiteDataSource";
import { AddTodo } from "@domain/usecases/AddTodo";
import { ToggleTodo } from "@domain/usecases/ToggleTodo";
import { ListTodos } from "@domain/usecases/ListTodos";
import { DeleteTodo } from "@domain/usecases/DeleteTodo";
import { UpdateTodo } from "@domain/usecases/UpdateTodo";
import { openDatabase } from "@infra/db/sqlite";

export const buildContainer = () => {
  const db = openDatabase();
  const todoDS = new TodoSQLiteDataSource(db);

  return {
    usecases: {
      addTodo: new AddTodo(todoDS),
      toggleTodo: new ToggleTodo(todoDS),
      listTodos: new ListTodos(todoDS),
      deleteTodo: new DeleteTodo(todoDS),
      updateTodo: new UpdateTodo(todoDS),
    },
  } as const;
};

export type AppContainer = ReturnType<typeof buildContainer>;
