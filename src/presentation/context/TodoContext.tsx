import * as Crypto from "expo-crypto";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { buildContainer, type AppContainer } from "@app/config/di/container";
import type { Todo } from "@domain/entities/Todo";
import type { FilterType } from "@app/types/filter";

interface TodoState {
  items: Todo[];
  loading: boolean;
  refresh: (filters?: FilterType) => Promise<void>;
  add: (todo: Todo) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (todo: Todo) => Promise<void>;
}
const Ctx = createContext<TodoState | null>(null);

export const TodoProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const container = useMemo<AppContainer>(() => buildContainer(), []);
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async (filters?: FilterType) => {
    setLoading(true);
    const list = await container.usecases.listTodos.exec(filters);
    setItems(list);
    setLoading(false);
  };

  const add = async ({ title, description, imageUri, latitude, longitude }: Todo) => {
    const now = Date.now();

    await container.usecases.addTodo.exec({
      id: Crypto.randomUUID(),
      title,
      description,
      imageUri,
      latitude,
      longitude,
      completed: false,
      createdAt: now,
    });
    await refresh();
  };

  const toggle = async (id: string) => {
    await container.usecases.toggleTodo.exec(id);
    await refresh();
  };

  const remove = async (id: string) => {
    await container.usecases.deleteTodo.exec(id);
    await refresh();
  };

  const update = async (todo: Todo) => {
    await container.usecases.updateTodo.exec(todo);
    await refresh();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: TodoState = { items, loading, refresh, add, toggle, remove, update };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTodos = () => {
  const ctx = useContext(Ctx);

  if (!ctx) throw new Error("useTodos must be used within TodoProvider");

  return ctx;
};
